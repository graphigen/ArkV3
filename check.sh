#!/bin/bash

# Enhanced System Check Script for Ubuntu 22.04 Ark Kontrol Website
# Run with: bash check.sh

echo "🔍 Checking Ubuntu 22.04 Ark Kontrol Website Installation..."
echo "============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration (from Neon Console)
DB_URL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
PGHOST="ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech"
PGUSER="neondb_owner"
PGDATABASE="neondb"
PGPASSWORD="npg_htj6CH2SYioa"

# Counters
PASS=0
FAIL=0
WARNING=0

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAIL++))
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING++))
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please don't run this script as root${NC}"
    exit 1
fi

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        print_status "$1 is installed" 0
        case "$1" in
            "node")
                NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
                echo "   Version: $(node --version)"
                if [ "$NODE_VERSION" -ge 18 ]; then
                    print_info "Node.js version is compatible (v$NODE_VERSION)"
                else
                    print_warning "Node.js version is too old (v$NODE_VERSION). Need v18+"
                fi
                ;;
            "npm") echo "   Version: $(npm --version)" ;;
            "pnpm") echo "   Version: $(pnpm --version 2>/dev/null || echo 'Version not available')" ;;
            "pm2") echo "   Version: $(pm2 --version 2>/dev/null || echo 'Version not available')" ;;
            "psql") echo "   Version: $(psql --version | head -1)" ;;
        esac
    else
        print_status "$1 is NOT installed" 1
        return 1
    fi
}

# Function to check service status
check_service() {
    if systemctl is-active --quiet $1; then
        print_status "$1 service is running" 0
        if systemctl is-enabled --quiet $1; then
            print_info "$1 is enabled for startup"
        else
            print_warning "$1 is not enabled for startup"
        fi
    else
        print_status "$1 service is NOT running" 1
        return 1
    fi
}

# Function to check port
check_port() {
    if ss -tuln | grep -q ":$1 "; then
        print_status "Port $1 is open" 0
    else
        print_status "Port $1 is NOT open" 1
        return 1
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        print_status "$2 exists" 0
    else
        print_status "$2 does NOT exist" 1
        return 1
    fi
}

# Function to check directory exists
check_directory() {
    if [ -d "$1" ]; then
        print_status "$2 exists" 0
    else
        print_status "$2 does NOT exist" 1
        return 1
    fi
}

echo ""
echo -e "${BLUE}🔧 Checking System Packages...${NC}"
echo "------------------------------"
check_command curl
check_command wget
check_command git
check_command unzip
check_command jq

echo ""
echo -e "${BLUE}📦 Checking Node.js Environment...${NC}"
echo "----------------------------------"
check_command node
check_command npm
check_command pnpm
check_command pm2

echo ""
echo -e "${BLUE}🗄️ Checking Database Tools...${NC}"
echo "-----------------------------"
check_command psql

# Test database connection
echo ""
echo -e "${BLUE}🔗 Testing Database Connection...${NC}"
echo "--------------------------------"
export PGPASSWORD="$PGPASSWORD"
if pg_isready -h $PGHOST -U $PGUSER -d $PGDATABASE > /dev/null 2>&1; then
    print_status "Database connection test" 0
    
    # Test actual query
    if psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "SELECT version();" > /dev/null 2>&1; then
        print_status "Database query test" 0
        DB_VERSION=$(psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT version();" 2>/dev/null | head -1 | xargs)
        print_info "Database: $DB_VERSION"
    else
        print_status "Database query test" 1
    fi
else
    print_status "Database connection test" 1
fi

echo ""
echo -e "${BLUE}🌐 Checking Web Server...${NC}"
echo "-------------------------"
check_command nginx
check_service nginx
check_port 80
check_port 443

# Check Nginx configuration
if sudo nginx -t &>/dev/null; then
    print_status "Nginx configuration is valid" 0
else
    print_status "Nginx configuration has errors" 1
fi

echo ""
echo -e "${BLUE}🔒 Checking Security...${NC}"
echo "----------------------"
check_command ufw
if sudo ufw status | grep -q "Status: active"; then
    print_status "UFW firewall is active" 0
    print_info "UFW Rules:"
    sudo ufw status numbered | grep -E "(22|80|443|3000)" | sed 's/^/   /'
else
    print_status "UFW firewall is NOT active" 1
fi
check_command certbot

echo ""
echo -e "${BLUE}📁 Checking Project Structure...${NC}"
echo "--------------------------------"
if check_directory "/var/www/arkkontrol" "Project directory"; then
    cd /var/www/arkkontrol
    
    check_file "package.json" "package.json"
    check_file ".env.local" ".env.local"
    check_file "ecosystem.config.js" "PM2 config"
    check_directory "node_modules" "Dependencies"
    check_directory ".next" "Built project"
    
    # Check environment variables in .env.local
    if [ -f ".env.local" ]; then
        if grep -q "DATABASE_URL=" .env.local && ! grep -q "DATABASE_URL=\"postgresql://username" .env.local; then
            print_status "DATABASE_URL is configured" 0
        else
            print_status "DATABASE_URL needs configuration" 1
        fi
        
        if grep -q "NEXT_PUBLIC_SITE_URL=" .env.local; then
            SITE_URL=$(grep "NEXT_PUBLIC_SITE_URL=" .env.local | cut -d'=' -f2 | tr -d '"')
            print_info "Site URL: $SITE_URL"
        fi
        
        if grep -q "ADMIN_SECRET_KEY=" .env.local; then
            print_status "Admin secret key is set" 0
        else
            print_warning "Admin secret key is not set"
        fi
    fi
fi

echo ""
echo -e "${BLUE}🚀 Checking Application Status...${NC}"
echo "---------------------------------"
if pm2 list | grep -q "arkkontrol-website"; then
    print_status "PM2 app is configured" 0
    APP_STATUS=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.status' 2>/dev/null || echo "unknown")
    if [ "$APP_STATUS" = "online" ]; then
        print_status "Application is running" 0
        
        # Get app info
        APP_UPTIME=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.pm_uptime' 2>/dev/null)
        APP_MEMORY=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .monit.memory' 2>/dev/null)
        APP_CPU=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="arkkontrol-website") | .monit.cpu' 2>/dev/null)
        
        if [ "$APP_UPTIME" != "null" ] && [ "$APP_UPTIME" != "" ]; then
            UPTIME_DATE=$(date -d "@$((APP_UPTIME/1000))" 2>/dev/null || echo "Unknown")
            print_info "App started: $UPTIME_DATE"
        fi
        
        if [ "$APP_MEMORY" != "null" ] && [ "$APP_MEMORY" != "" ]; then
            MEMORY_MB=$((APP_MEMORY/1024/1024))
            print_info "Memory usage: ${MEMORY_MB}MB"
        fi
        
        if [ "$APP_CPU" != "null" ] && [ "$APP_CPU" != "" ]; then
            print_info "CPU usage: ${APP_CPU}%"
        fi
    else
        print_status "Application is not running (status: $APP_STATUS)" 1
    fi
else
    print_status "PM2 app is NOT configured" 1
fi

check_port 3000

# Check if website responds
echo ""
echo -e "${BLUE}🌐 Checking Website Response...${NC}"
echo "------------------------------"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    print_status "Website responds (HTTP 200)" 0
else
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    print_status "Website response failed (HTTP $HTTP_CODE)" 1
fi

echo ""
echo -e "${BLUE}🌐 Checking Nginx Configuration...${NC}"
echo "----------------------------------"
check_file "/etc/nginx/sites-available/arkkontrol" "Nginx site config"

if [ -L "/etc/nginx/sites-enabled/arkkontrol" ]; then
    print_status "Nginx site is enabled" 0
else
    print_status "Nginx site is NOT enabled" 1
fi

echo ""
echo -e "${BLUE}🔧 Checking System Services...${NC}"
echo "-----------------------------"
if systemctl list-unit-files | grep -q "arkkontrol.service"; then
    print_status "Systemd service is installed" 0
    if systemctl is-enabled --quiet arkkontrol; then
        print_status "Systemd service is enabled" 0
    else
        print_status "Systemd service is NOT enabled" 1
    fi
else
    print_status "Systemd service is NOT installed" 1
fi

echo ""
echo -e "${BLUE}📊 System Resources...${NC}"
echo "----------------------"
echo "💾 Memory Usage:"
free -h | grep -E "(Mem|Swap)"
echo ""
echo "💽 Disk Usage:"
df -h / | tail -1
echo ""
echo "🔥 CPU Load:"
uptime

echo ""
echo -e "${BLUE}🔍 SSL Certificate Status...${NC}"
echo "----------------------------"
if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live 2>/dev/null)" ]; then
    print_status "SSL certificates found" 0
    for cert in /etc/letsencrypt/live/*/; do
        if [ -d "$cert" ]; then
            domain=$(basename "$cert")
            if [ -f "${cert}cert.pem" ]; then
                expiry=$(sudo openssl x509 -enddate -noout -in "${cert}cert.pem" 2>/dev/null | cut -d= -f2)
                print_info "Domain: $domain - Expires: $expiry"
            fi
        fi
    done
else
    print_status "No SSL certificates found" 1
fi

echo ""
echo -e "${BLUE}📝 Checking Backup and Monitoring...${NC}"
echo "-----------------------------------"
check_file "/home/$USER/backup.sh" "Backup script"
check_file "/home/$USER/ssl-renew.sh" "SSL renewal script"
check_file "/home/$USER/monitor.sh" "Monitoring script"

# Check cron jobs
if crontab -l 2>/dev/null | grep -q "backup.sh"; then
    print_status "Backup cron job is configured" 0
else
    print_status "Backup cron job is NOT configured" 1
fi

if crontab -l 2>/dev/null | grep -q "ssl-renew.sh"; then
    print_status "SSL renewal cron job is configured" 0
else
    print_status "SSL renewal cron job is NOT configured" 1
fi

if crontab -l 2>/dev/null | grep -q "monitor.sh"; then
    print_status "Monitoring cron job is configured" 0
else
    print_status "Monitoring cron job is NOT configured" 1
fi

echo ""
echo -e "${BLUE}📝 Checking Log Files...${NC}"
echo "------------------------"
check_directory "/var/log/pm2" "PM2 log directory"
check_directory "/var/log/arkkontrol" "Application log directory"

if [ -f "/var/log/pm2/arkkontrol-error.log" ]; then
    ERROR_COUNT=$(wc -l < /var/log/pm2/arkkontrol-error.log 2>/dev/null || echo "0")
    if [ "$ERROR_COUNT" -gt 0 ]; then
        print_warning "Found $ERROR_COUNT lines in error log"
        echo "   Recent errors:"
        tail -3 /var/log/pm2/arkkontrol-error.log 2>/dev/null | sed 's/^/   /'
    else
        print_status "No errors in application log" 0
    fi
fi

echo ""
echo -e "${BLUE}📋 Check Summary...${NC}"
echo "==================="
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNING${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical checks passed! Your installation looks good.${NC}"
    if [ $WARNING -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Some warnings found. Review them above.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Some issues found. See quick fixes below.${NC}"
fi

echo ""
echo -e "${BLUE}📋 Quick Fix Commands:${NC}"
echo "----------------------"
echo "Install missing packages: sudo apt update && sudo apt install -y <package-name>"
echo "Start services: sudo systemctl start <service-name>"
echo "Install dependencies: cd /var/www/arkkontrol && pnpm install"
echo "Build project: cd /var/www/arkkontrol && pnpm build"
echo "Start PM2 app: pm2 start ecosystem.config.js"
echo "Save PM2 config: pm2 save"
echo "Restart Nginx: sudo systemctl restart nginx"
echo "Check logs: pm2 logs arkkontrol-website"
echo "Setup SSL: sudo certbot --nginx -d yourdomain.com"
echo "Enable firewall: sudo ufw enable"
echo "Test database: psql '$DB_URL' -c 'SELECT version();'"

echo ""
echo -e "${BLUE}📊 Monitoring Commands:${NC}"
echo "----------------------"
echo "Full system status: ./monitor.sh"
echo "PM2 status: pm2 status"
echo "PM2 monitor: pm2 monit"
echo "System resources: htop"
echo "Nginx status: sudo systemctl status nginx"
echo "Check ports: ss -tuln"
echo "View error logs: tail -f /var/log/pm2/arkkontrol-error.log"
echo "Manual backup: ./backup.sh"

echo ""
echo -e "${BLUE}🔗 Database Information:${NC}"
echo "------------------------"
echo "Host: $PGHOST"
echo "Database: $PGDATABASE"
echo "User: $PGUSER"
echo "Connection: $DB_URL"
