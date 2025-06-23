#!/bin/bash
# SSL Certificate Renewal Script for Ark Kontrol Website

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
LOG_FILE="/var/log/arkkontrol/ssl-renewal.log"
DOMAIN_CONFIG="/etc/nginx/sites-available/arkkontrol"

# Create log directory if it doesn't exist
sudo mkdir -p /var/log/arkkontrol
sudo chown $USER:$USER /var/log/arkkontrol

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1" >> $LOG_FILE
}

echo -e "${BLUE}🔐 SSL Certificate Renewal Check${NC}"
echo "=================================="

log "🔍 Starting SSL certificate renewal check..."

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    error "❌ Certbot is not installed"
    exit 1
fi

# Check if nginx is running
if ! systemctl is-active --quiet nginx; then
    error "❌ Nginx is not running"
    exit 1
fi

# Get domain from nginx config
if [ -f "$DOMAIN_CONFIG" ]; then
    DOMAIN=$(grep -E "server_name" $DOMAIN_CONFIG | head -1 | awk '{print $2}' | sed 's/;//g')
    if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "yourdomain.com" ]; then
        log "🌐 Found domain: $DOMAIN"
    else
        warning "⚠️  Domain not configured in nginx config"
        DOMAIN=""
    fi
else
    warning "⚠️  Nginx configuration file not found"
    DOMAIN=""
fi

# Check existing certificates
log "📋 Checking existing certificates..."
if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live 2>/dev/null)" ]; then
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [ -d "$cert_dir" ]; then
            cert_domain=$(basename "$cert_dir")
            if [ -f "${cert_dir}cert.pem" ]; then
                expiry_date=$(sudo openssl x509 -enddate -noout -in "${cert_dir}cert.pem" 2>/dev/null | cut -d= -f2)
                expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null)
                current_timestamp=$(date +%s)
                days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
                
                log "📜 Certificate for $cert_domain expires in $days_until_expiry days ($expiry_date)"
                
                if [ $days_until_expiry -lt 30 ]; then
                    warning "⚠️  Certificate for $cert_domain expires soon!"
                fi
            fi
        fi
    done
else
    warning "⚠️  No SSL certificates found"
fi

# Test nginx configuration before renewal
log "🔧 Testing nginx configuration..."
if sudo nginx -t &>/dev/null; then
    log "✅ Nginx configuration is valid"
else
    error "❌ Nginx configuration has errors"
    sudo nginx -t
    exit 1
fi

# Perform certificate renewal
log "🔄 Attempting certificate renewal..."
RENEWAL_OUTPUT=$(sudo certbot renew --quiet --no-self-upgrade 2>&1)
RENEWAL_EXIT_CODE=$?

if [ $RENEWAL_EXIT_CODE -eq 0 ]; then
    log "✅ Certificate renewal check completed successfully"
    
    # Check if any certificates were actually renewed
    if echo "$RENEWAL_OUTPUT" | grep -q "renewed"; then
        log "🎉 Certificates were renewed!"
        
        # Test nginx configuration after renewal
        if sudo nginx -t &>/dev/null; then
            log "✅ Nginx configuration still valid after renewal"
            
            # Reload nginx to use new certificates
            if sudo systemctl reload nginx; then
                log "✅ Nginx reloaded successfully"
                
                # Restart PM2 application to ensure it picks up any changes
                if pm2 reload arkkontrol-website &>/dev/null; then
                    log "✅ Application reloaded successfully"
                else
                    warning "⚠️  Failed to reload application"
                fi
                
                # Test website response
                if curl -s -o /dev/null -w "%{http_code}" https://localhost | grep -q "200\|301\|302"; then
                    log "✅ Website is responding correctly"
                else
                    warning "⚠️  Website may not be responding correctly"
                fi
                
            else
                error "❌ Failed to reload nginx"
                exit 1
            fi
        else
            error "❌ Nginx configuration became invalid after renewal"
            sudo nginx -t
            exit 1
        fi
        
        # Send notification if configured
        if command -v mail >/dev/null 2>&1 && [ ! -z "$SSL_NOTIFICATION_EMAIL" ]; then
            echo "SSL certificates for Ark Kontrol Website were renewed successfully on $(date)" | \
            mail -s "SSL Certificates Renewed" $SSL_NOTIFICATION_EMAIL
            log "📧 Email notification sent"
        fi
        
    else
        log "ℹ️  No certificates needed renewal at this time"
    fi
    
else
    error "❌ Certificate renewal failed"
    error "Output: $RENEWAL_OUTPUT"
    
    # Send error notification if configured
    if command -v mail >/dev/null 2>&1 && [ ! -z "$SSL_NOTIFICATION_EMAIL" ]; then
        echo "SSL certificate renewal failed for Ark Kontrol Website on $(date). Error: $RENEWAL_OUTPUT" | \
        mail -s "SSL Renewal Failed" $SSL_NOTIFICATION_EMAIL
        log "📧 Error notification sent"
    fi
    
    exit 1
fi

# Display certificate status after renewal
log "📋 Final certificate status:"
if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live 2>/dev/null)" ]; then
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [ -d "$cert_dir" ]; then
            cert_domain=$(basename "$cert_dir")
            if [ -f "${cert_dir}cert.pem" ]; then
                expiry_date=$(sudo openssl x509 -enddate -noout -in "${cert_dir}cert.pem" 2>/dev/null | cut -d= -f2)
                log "📜 $cert_domain: Valid until $expiry_date"
            fi
        fi
    done
fi

# Cleanup old renewal logs (keep last 30 days)
find /var/log/letsencrypt -name "*.log" -mtime +30 -delete 2>/dev/null

log "✅ SSL certificate renewal check completed"
echo ""
echo -e "${GREEN}🎉 SSL renewal process finished successfully!${NC}"
