#!/bin/bash

# System Check Script for Ubuntu 22.04 Next.js Installation
# Run with: bash check.sh

echo "🔍 Checking Ubuntu 22.04 Next.js Installation..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

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
        if [ "$1" = "node" ]; then
            echo "   Version: $(node --version)"
        elif [ "$1" = "npm" ]; then
            echo "   Version: $(npm --version)"
        elif [ "$1" = "pnpm" ]; then
            echo "   Version: $(pnpm --version 2>/dev/null || echo 'Version not available')"
        elif [ "$1" = "pm2" ]; then
            echo "   Version: $(pm2 --version 2>/dev/null || echo 'Version not available')"
        fi
    else
        print_status "$1 is NOT installed" 1
        return 1
    fi
}

# Function to check service status
check_service() {
    if systemctl is-active --quiet $1; then
        print_status "$1 service is running" 0
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

echo ""
echo "🔧 Checking System Packages..."
echo "------------------------------"
check_command curl
check_command wget
check_command git
check_command unzip

echo ""
echo "📦 Checking Node.js Environment..."
echo "----------------------------------"
check_command node
check_command npm
check_command pnpm
check_command pm2

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_status "Node.js version is compatible (v$NODE_VERSION)" 0
    else
        print_status "Node.js version is too old (v$NODE_VERSION). Need v18+" 1
    fi
fi

echo ""
echo "🌐 Checking Web Server..."
echo "-------------------------"
check_command nginx
check_service nginx
check_port 80
check_port 443

echo ""
echo "🔒 Checking Security..."
echo "----------------------"
check_command ufw
if sudo ufw status | grep -q "Status: active"; then
    print_status "UFW firewall is active" 0
else
    print_status "UFW firewall is NOT active" 1
fi
check_command certbot

echo ""
echo "📁 Checking Project Structure..."
echo "--------------------------------"
if [ -d "/var/www/arkkontrol" ]; then
    print_status "Project directory exists" 0
    cd /var/www/arkkontrol
    
    if [ -f "package.json" ]; then
        print_status "package.json found" 0
    else
        print_status "package.json NOT found" 1
    fi
    
    if [ -f ".env.local" ]; then
        print_status ".env.local found" 0
        # Check if DATABASE_URL is set
        if grep -q "DATABASE_URL=" .env.local && ! grep -q "DATABASE_URL=\"postgresql://username" .env.local; then
            print_status "DATABASE_URL is configured" 0
        else
            print_status "DATABASE_URL needs configuration" 1
        fi
    else
        print_status ".env.local NOT found" 1
    fi
    
    if [ -f "ecosystem.config.js" ]; then
        print_status "PM2 config found" 0
    else
        print_status "PM2 config NOT found" 1
    fi
    
    if [ -d "node_modules" ]; then
        print_status "Dependencies installed" 0
    else
        print_status "Dependencies NOT installed" 1
    fi
    
    if [ -d ".next" ]; then
        print_status "Project built" 0
    else
        print_status "Project NOT built" 1
    fi
else
    print_status "Project directory does NOT exist" 1
fi

echo ""
echo "🚀 Checking Application Status..."
echo "---------------------------------"
if pm2 list | grep -q "arkkontrol-website"; then
    print_status "PM2 app is configured" 0
    APP_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="arkkontrol-website") | .pm2_env.status' 2>/dev/null || echo "unknown")
    if [ "$APP_STATUS" = "online" ]; then
        print_status "Application is running" 0
    else
        print_status "Application is not running (status: $APP_STATUS)" 1
    fi
else
    print_status "PM2 app is NOT configured" 1
fi

check_port 3000

echo ""
echo "🌐 Checking Nginx Configuration..."
echo "----------------------------------"
if [ -f "/etc/nginx/sites-available/arkkontrol" ]; then
    print_status "Nginx site config exists" 0
else
    print_status "Nginx site config does NOT exist" 1
fi

if [ -L "/etc/nginx/sites-enabled/arkkontrol" ]; then
    print_status "Nginx site is enabled" 0
else
    print_status "Nginx site is NOT enabled" 1
fi

# Test Nginx configuration
if sudo nginx -t &>/dev/null; then
    print_status "Nginx configuration is valid" 0
else
    print_status "Nginx configuration has errors" 1
fi

echo ""
echo "📊 System Resources..."
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
echo "🔍 SSL Certificate Status..."
echo "----------------------------"
if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live 2>/dev/null)" ]; then
    print_status "SSL certificates found" 0
    for cert in /etc/letsencrypt/live/*/; do
        if [ -d "$cert" ]; then
            domain=$(basename "$cert")
            expiry=$(sudo openssl x509 -enddate -noout -in "${cert}cert.pem" 2>/dev/null | cut -d= -f2)
            echo "   Domain: $domain - Expires: $expiry"
        fi
    done
else
    print_status "No SSL certificates found" 1
fi

echo ""
echo "📋 Check Summary..."
echo "==================="
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your installation is ready.${NC}"
else
    echo -e "${YELLOW}⚠️  Some issues found. See quick fixes below.${NC}"
fi

echo ""
echo "📋 Quick Fix Commands:"
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

echo ""
echo "📊 Monitoring Commands:"
echo "----------------------"
echo "PM2 status: pm2 status"
echo "PM2 monitor: pm2 monit"
echo "System resources: htop"
echo "Nginx status: sudo systemctl status nginx"
echo "Check ports: ss -tuln"
