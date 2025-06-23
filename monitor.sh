#!/bin/bash
# Enhanced System Monitoring Script for Ark Kontrol Website

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Neon Database Configuration
DB_HOST="ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech"
DB_HOST_UNPOOLED="ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech"
DB_USER="neondb_owner"
DB_NAME="neondb"
DB_PASSWORD="npg_htj6CH2SYioa"
DB_URL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Configuration
LOG_FILE="/var/log/arkkontrol/monitor.log"
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=85
ALERT_THRESHOLD_DISK=90

# Create log directory if it doesn't exist
mkdir -p /var/log/arkkontrol

echo -e "${BLUE}🔍 Ark Kontrol Website System Monitor${NC}"
echo "======================================"
echo "Date: $(date)"
echo ""

# Function to log alerts
log_alert() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT: $1" >> $LOG_FILE
}

# Function to check status with color
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        log_alert "$2"
    fi
}

# 1. System Resources
echo -e "${BLUE}💾 System Resources${NC}"
echo "-------------------"

# Memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
echo "Memory Usage: ${MEMORY_USAGE}%"
if [ $MEMORY_USAGE -gt $ALERT_THRESHOLD_MEMORY ]; then
    echo -e "${RED}⚠️  High memory usage detected!${NC}"
    log_alert "High memory usage: ${MEMORY_USAGE}%"
fi

# Disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
echo "Disk Usage: ${DISK_USAGE}%"
if [ $DISK_USAGE -gt $ALERT_THRESHOLD_DISK ]; then
    echo -e "${RED}⚠️  High disk usage detected!${NC}"
    log_alert "High disk usage: ${DISK_USAGE}%"
fi

# CPU load
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
echo "Load Average: $LOAD_AVG"

# CPU usage (5 second average)
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
echo "CPU Usage: ${CPU_USAGE}%"

echo ""

# 2. Service Status
echo -e "${BLUE}🔧 Service Status${NC}"
echo "-----------------"

# Nginx
if systemctl is-active --quiet nginx; then
    check_status 0 "Nginx is running"
    if sudo nginx -t &>/dev/null; then
        echo -e "${GREEN}   ✅ Configuration is valid${NC}"
    else
        echo -e "${RED}   ❌ Configuration has errors${NC}"
        log_alert "Nginx configuration errors detected"
    fi
else
    check_status 1 "Nginx is not running"
fi

# PM2 Application
if pm2 list | grep -q "arkkontrol-website"; then
    APP_STATUS=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.status' 2>/dev/null || echo "unknown")
    if [ "$APP_STATUS" = "online" ]; then
        check_status 0 "Application is running"
        
        # Get detailed app info
        APP_UPTIME=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.pm_uptime' 2>/dev/null)
        APP_MEMORY=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .monit.memory' 2>/dev/null)
        APP_CPU=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .monit.cpu' 2>/dev/null)
        APP_RESTARTS=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.restart_time' 2>/dev/null)
        
        if [ "$APP_MEMORY" != "null" ] && [ "$APP_MEMORY" != "" ]; then
            MEMORY_MB=$((APP_MEMORY/1024/1024))
            echo -e "${GREEN}   📊 Memory: ${MEMORY_MB}MB${NC}"
        fi
        
        if [ "$APP_CPU" != "null" ] && [ "$APP_CPU" != "" ]; then
            echo -e "${GREEN}   📊 CPU: ${APP_CPU}%${NC}"
        fi
        
        if [ "$APP_RESTARTS" != "null" ] && [ "$APP_RESTARTS" != "" ]; then
            echo -e "${GREEN}   🔄 Restarts: ${APP_RESTARTS}${NC}"
        fi
        
    else
        check_status 1 "Application is not running (status: $APP_STATUS)"
    fi
else
    check_status 1 "PM2 application not found"
fi

echo ""

# 3. Database Connection
echo -e "${BLUE}🗄️ Database Status${NC}"
echo "------------------"

export PGPASSWORD="$DB_PASSWORD"

# Test connection to pooled endpoint
if pg_isready -h $DB_HOST -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
    check_status 0 "Database connection (pooled)"
    
    # Test actual query
    if DB_VERSION=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT version();" 2>/dev/null | head -1 | xargs); then
        echo -e "${GREEN}   📊 Version: PostgreSQL $(echo $DB_VERSION | awk '{print $2}')${NC}"
        
        # Get database size
        if DB_SIZE=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | xargs); then
            echo -e "${GREEN}   📊 Size: $DB_SIZE${NC}"
        fi
        
        # Get connection count
        if CONN_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='$DB_NAME';" 2>/dev/null | xargs); then
            echo -e "${GREEN}   📊 Active connections: $CONN_COUNT${NC}"
        fi
        
        # Test a simple application query
        if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM pages;" > /dev/null 2>&1; then
            PAGE_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pages;" 2>/dev/null | xargs)
            echo -e "${GREEN}   📊 Pages in database: $PAGE_COUNT${NC}"
        fi
        
    else
        check_status 1 "Database query test failed"
    fi
else
    check_status 1 "Database connection failed"
fi

# Test unpooled connection
if pg_isready -h $DB_HOST_UNPOOLED -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
    check_status 0 "Database connection (unpooled)"
else
    check_status 1 "Database connection (unpooled) failed"
fi

unset PGPASSWORD

echo ""

# 4. Website Response
echo -e "${BLUE}🌐 Website Status${NC}"
echo "-----------------"

# Test local response
LOCAL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$LOCAL_RESPONSE" = "200" ]; then
    check_status 0 "Local website responds (HTTP $LOCAL_RESPONSE)"
else
    check_status 1 "Local website failed (HTTP $LOCAL_RESPONSE)"
fi

# Test through nginx
NGINX_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
if [ "$NGINX_RESPONSE" = "200" ] || [ "$NGINX_RESPONSE" = "301" ] || [ "$NGINX_RESPONSE" = "302" ]; then
    check_status 0 "Nginx proxy responds (HTTP $NGINX_RESPONSE)"
else
    check_status 1 "Nginx proxy failed (HTTP $NGINX_RESPONSE)"
fi

# Test admin panel
ADMIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin 2>/dev/null || echo "000")
if [ "$ADMIN_RESPONSE" = "200" ] || [ "$ADMIN_RESPONSE" = "302" ]; then
    check_status 0 "Admin panel responds (HTTP $ADMIN_RESPONSE)"
else
    check_status 1 "Admin panel failed (HTTP $ADMIN_RESPONSE)"
fi

echo ""

# 5. SSL Certificate Status
echo -e "${BLUE}🔐 SSL Certificate Status${NC}"
echo "-------------------------"

if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live 2>/dev/null)" ]; then
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [ -d "$cert_dir" ]; then
            cert_domain=$(basename "$cert_dir")
            if [ -f "${cert_dir}cert.pem" ]; then
                expiry_date=$(sudo openssl x509 -enddate -noout -in "${cert_dir}cert.pem" 2>/dev/null | cut -d= -f2)
                expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null)
                current_timestamp=$(date +%s)
                days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
                
                if [ $days_until_expiry -gt 30 ]; then
                    echo -e "${GREEN}✅ $cert_domain: Valid for $days_until_expiry days${NC}"
                elif [ $days_until_expiry -gt 7 ]; then
                    echo -e "${YELLOW}⚠️  $cert_domain: Expires in $days_until_expiry days${NC}"
                    log_alert "SSL certificate for $cert_domain expires in $days_until_expiry days"
                else
                    echo -e "${RED}❌ $cert_domain: Expires in $days_until_expiry days!${NC}"
                    log_alert "SSL certificate for $cert_domain expires soon: $days_until_expiry days"
                fi
            fi
        fi
    done
else
    echo -e "${YELLOW}⚠️  No SSL certificates found${NC}"
fi

echo ""

# 6. Log Analysis
echo -e "${BLUE}📝 Recent Log Analysis${NC}"
echo "----------------------"

# Check for recent errors in PM2 logs
if [ -f "/var/log/pm2/arkkontrol-error.log" ]; then
    ERROR_COUNT=$(tail -100 /var/log/pm2/arkkontrol-error.log 2>/dev/null | wc -l)
    if [ $ERROR_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $ERROR_COUNT recent error log entries${NC}"
        echo "Recent errors:"
        tail -3 /var/log/pm2/arkkontrol-error.log 2>/dev/null | sed 's/^/   /'
    else
        echo -e "${GREEN}✅ No recent errors in application logs${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No error log file found${NC}"
fi

# Check nginx error logs
if [ -f "/var/log/nginx/error.log" ]; then
    NGINX_ERRORS=$(tail -100 /var/log/nginx/error.log 2>/dev/null | grep "$(date '+%Y/%m/%d')" | wc -l)
    if [ $NGINX_ERRORS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $NGINX_ERRORS nginx errors today${NC}"
    else
        echo -e "${GREEN}✅ No nginx errors today${NC}"
    fi
fi

echo ""

# 7. Performance Metrics
echo -e "${BLUE}📊 Performance Summary${NC}"
echo "---------------------"
echo "System Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory: ${MEMORY_USAGE}% used"
echo "Disk: ${DISK_USAGE}% used"
echo "Database: Connected to Neon PostgreSQL"
echo "Application: $(pm2 list | grep -c online) PM2 processes online"

# Final status
echo ""
if [ -f "$LOG_FILE" ] && grep -q "ALERT" "$LOG_FILE" && [ $(grep "ALERT" "$LOG_FILE" | tail -10 | wc -l) -gt 0 ]; then
    echo -e "${YELLOW}⚠️  System has recent alerts - check $LOG_FILE${NC}"
else
    echo -e "${GREEN}🎉 System is running normally${NC}"
fi

echo ""
echo "Monitor completed at $(date)"
