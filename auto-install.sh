#!/bin/bash

# Ubuntu 22.04 Auto Install Script for Ark Kontrol Website
# Run with: bash auto-install.sh

set -e

echo "🚀 Starting Ubuntu 22.04 Auto Installation for Ark Kontrol Website..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration (from Neon Console)
DB_URL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
DB_URL_UNPOOLED="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech/neondb?sslmode=require"
PGHOST="ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech"
PGHOST_UNPOOLED="ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech"
PGUSER="neondb_owner"
PGDATABASE="neondb"
PGPASSWORD="npg_htj6CH2SYioa"

# Get domain name from user
echo -e "${BLUE}🌐 Please enter your domain name (e.g., arkkontrol.com):${NC}"
read -p "Domain: " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}❌ Domain name is required!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Using domain: $DOMAIN_NAME${NC}"

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo -e "${BLUE}🔧 Installing essential packages...${NC}"
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release unzip jq

# Install Node.js 20.x
echo -e "${BLUE}📦 Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

# Install pnpm
echo -e "${BLUE}📦 Installing pnpm...${NC}"
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
export PATH="$HOME/.local/share/pnpm:$PATH"

# Install PM2 for process management
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Install Nginx
echo -e "${BLUE}🌐 Installing Nginx...${NC}"
sudo apt install -y nginx

# Install PostgreSQL client for database operations
echo -e "${BLUE}🗄️ Installing PostgreSQL client...${NC}"
sudo apt install -y postgresql-client

# Install UFW Firewall
echo -e "${BLUE}🔒 Setting up UFW Firewall...${NC}"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000

# Install SSL certificate tool
echo -e "${BLUE}🔐 Installing Certbot for SSL...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Install additional tools
echo -e "${BLUE}🛠️ Installing additional tools...${NC}"
sudo apt install -y htop neofetch tree logrotate

# Create project directory
echo -e "${BLUE}📁 Creating project directory...${NC}"
sudo mkdir -p /var/www/arkkontrol
sudo chown -R $USER:$USER /var/www/arkkontrol

# Clone or setup project (if git repo exists)
echo -e "${BLUE}📥 Setting up project...${NC}"
cd /var/www/arkkontrol

# Install project dependencies
echo -e "${BLUE}📦 Installing project dependencies...${NC}"
if [ -f "package.json" ]; then
    pnpm install
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  No package.json found. Please upload your project files first.${NC}"
fi

# Create environment file with Neon database configuration
echo -e "${BLUE}📝 Creating environment file with database configuration...${NC}"
cat > .env.local << EOF
# Database Configuration (Neon)
DATABASE_URL="$DB_URL"
DATABASE_URL_UNPOOLED="$DB_URL_UNPOOLED"
POSTGRES_URL="$DB_URL"
POSTGRES_URL_NON_POOLING="$DB_URL_UNPOOLED"
POSTGRES_PRISMA_URL="$DB_URL"
POSTGRES_URL_NO_SSL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb"

# Database Parameters
PGHOST="$PGHOST"
PGHOST_UNPOOLED="$PGHOST_UNPOOLED"
PGUSER="$PGUSER"
PGDATABASE="$PGDATABASE"
PGPASSWORD="$PGPASSWORD"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://$DOMAIN_NAME"
ADMIN_SECRET_KEY="$(openssl rand -hex 32)"

# Stack Auth (from Neon Console)
NEXT_PUBLIC_STACK_PROJECT_ID="14f06dcf-cb13-41d2-ad54-2065ae1a00ce"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="pck_e9hahemepscmxst4dka109nj0t7hegmcgbbxbs1mr6va8"
STACK_SECRET_SERVER_KEY="ssk_vbabvvhdjx490z04m0pqhc6zf5pn415qygvbr2br5hewr"

# Optional: Analytics
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""

# Optional: Email Configuration
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EOF

# Create PM2 ecosystem file with database configuration
echo -e "${BLUE}⚙️ Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'arkkontrol-website',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/arkkontrol',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: '$DB_URL',
      POSTGRES_URL: '$DB_URL',
      NEXT_PUBLIC_SITE_URL: 'https://$DOMAIN_NAME'
    },
    error_file: '/var/log/pm2/arkkontrol-error.log',
    out_file: '/var/log/pm2/arkkontrol-out.log',
    log_file: '/var/log/pm2/arkkontrol-combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', '.next', 'logs']
  }]
}
EOF

# Create Nginx configuration with domain
echo -e "${BLUE}🌐 Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/arkkontrol << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone \$binary_remote_addr zone=admin:10m rate=20r/m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: https: blob:; font-src 'self' data: https:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Hide server tokens
    server_tokens off;

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }

    # Admin panel rate limiting
    location /admin/ {
        limit_req zone=admin burst=50 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Admin login extra protection
    location /api/admin/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/json
        application/javascript
        application/xml
        application/rss+xml
        application/atom+xml
        image/svg+xml;

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ /(\.env|\.git|node_modules|package\.json) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Enable Nginx site
echo -e "${BLUE}🌐 Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/arkkontrol /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Create systemd service
echo -e "${BLUE}🔧 Creating systemd service...${NC}"
sudo tee /etc/systemd/system/arkkontrol.service << EOF
[Unit]
Description=Ark Kontrol Website
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=/var/www/arkkontrol
Environment=NODE_ENV=production
Environment=DATABASE_URL=$DB_URL
Environment=POSTGRES_URL=$DB_URL
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable arkkontrol

# Create log directories
echo -e "${BLUE}📝 Creating log directories...${NC}"
sudo mkdir -p /var/log/pm2
sudo mkdir -p /var/log/arkkontrol
sudo chown -R $USER:$USER /var/log/pm2
sudo chown -R $USER:$USER /var/log/arkkontrol

# Setup PM2 startup
echo -e "${BLUE}🚀 Setting up PM2 startup...${NC}"
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Create backup script with database backup
echo -e "${BLUE}💾 Creating backup script...${NC}"
cat > /home/$USER/backup.sh << EOF
#!/bin/bash
# Backup script for Ark Kontrol Website

BACKUP_DIR="/home/$USER/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

echo "Starting backup: \$DATE"

# Backup application files
echo "Backing up application files..."
tar -czf \$BACKUP_DIR/arkkontrol_files_\$DATE.tar.gz -C /var/www arkkontrol --exclude=node_modules --exclude=.next

# Backup database
echo "Backing up database..."
export PGPASSWORD="$PGPASSWORD"
pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE > \$BACKUP_DIR/arkkontrol_db_\$DATE.sql

# Backup environment and config files
echo "Backing up configuration..."
cp /var/www/arkkontrol/.env.local \$BACKUP_DIR/env_\$DATE.backup
cp /var/www/arkkontrol/ecosystem.config.js \$BACKUP_DIR/ecosystem_\$DATE.backup
sudo cp /etc/nginx/sites-available/arkkontrol \$BACKUP_DIR/nginx_\$DATE.backup

# Keep only last 7 backups
find \$BACKUP_DIR -name "arkkontrol_*" -mtime +7 -delete

echo "Backup completed: \$DATE"
echo "Files backed up to: \$BACKUP_DIR"
EOF

chmod +x /home/$USER/backup.sh

# Create SSL renewal script
echo -e "${BLUE}🔐 Creating SSL renewal script...${NC}"
cat > /home/$USER/ssl-renew.sh << EOF
#!/bin/bash
# SSL Certificate Renewal Script

echo "Checking SSL certificates for renewal..."

# Renew certificates
certbot renew --quiet

# Reload nginx if certificates were renewed
if [ \$? -eq 0 ]; then
    echo "SSL certificates checked/renewed successfully"
    sudo systemctl reload nginx
    echo "Nginx reloaded"
else
    echo "SSL certificate renewal failed"
    exit 1
fi
EOF

chmod +x /home/$USER/ssl-renew.sh

# Create monitoring script
echo -e "${BLUE}📊 Creating monitoring script...${NC}"
cat > /home/$USER/monitor.sh << EOF
#!/bin/bash
# System Monitoring Script for Ark Kontrol Website

echo "🔍 Ark Kontrol Website System Status"
echo "====================================="
echo "Date: \$(date)"
echo ""

# Check system resources
echo "💾 Memory Usage:"
free -h | grep -E "(Mem|Swap)"
echo ""

echo "💽 Disk Usage:"
df -h / | tail -1
echo ""

echo "🔥 CPU Load:"
uptime
echo ""

# Check services
echo "🔧 Service Status:"
echo "Nginx: \$(systemctl is-active nginx)"
echo "PM2: \$(pm2 list | grep -c online) processes online"
echo ""

# Check database connection
echo "🗄️ Database Connection:"
export PGPASSWORD="$PGPASSWORD"
if pg_isready -h $PGHOST -U $PGUSER -d $PGDATABASE > /dev/null 2>&1; then
    echo "✅ Database connection: OK"
else
    echo "❌ Database connection: FAILED"
fi
echo ""

# Check website response
echo "🌐 Website Status:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Website: OK (HTTP 200)"
else
    echo "❌ Website: FAILED"
fi
echo ""

# Check SSL certificate (if domain is configured)
if [ ! -z "$DOMAIN_NAME" ]; then
    echo "🔐 SSL Certificate:"
    if [ -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then
        EXPIRY=\$(sudo openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN_NAME/cert.pem" 2>/dev/null | cut -d= -f2)
        echo "✅ SSL Certificate expires: \$EXPIRY"
    else
        echo "⚠️  SSL Certificate not found"
    fi
fi
echo ""

# Check logs for errors
echo "📝 Recent Errors (last 10):"
sudo tail -10 /var/log/pm2/arkkontrol-error.log 2>/dev/null || echo "No error logs found"
EOF

chmod +x /home/$USER/monitor.sh

# Setup logrotate
echo -e "${BLUE}📝 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/arkkontrol << EOF
/var/log/pm2/arkkontrol-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/arkkontrol/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

# Setup automatic backups and SSL renewal
echo -e "${BLUE}⏰ Setting up automatic tasks...${NC}"
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 0 /home/$USER/ssl-renew.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/30 * * * * /home/$USER/monitor.sh >> /var/log/arkkontrol/monitor.log 2>&1") | crontab -

# Test database connection
echo -e "${BLUE}🗄️ Testing database connection...${NC}"
export PGPASSWORD="$PGPASSWORD"
if pg_isready -h $PGHOST -U $PGUSER -d $PGDATABASE; then
    echo -e "${GREEN}✅ Database connection successful!${NC}"
else
    echo -e "${RED}❌ Database connection failed!${NC}"
    echo -e "${YELLOW}Please check your database configuration.${NC}"
fi

echo -e "${GREEN}✅ Installation completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Upload your project files to /var/www/arkkontrol"
echo "2. Run: cd /var/www/arkkontrol && pnpm install"
echo "3. Run: cd /var/www/arkkontrol && pnpm build"
echo "4. Run: pm2 start ecosystem.config.js"
echo "5. Run: pm2 save"
echo "6. Setup SSL: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo -e "${BLUE}🔍 Useful Commands:${NC}"
echo "Check status: ./monitor.sh"
echo "View logs: pm2 logs arkkontrol-website"
echo "Restart app: pm2 restart arkkontrol-website"
echo "Backup now: ./backup.sh"
echo ""
echo -e "${BLUE}📊 System configured with:${NC}"
echo "- Domain: $DOMAIN_NAME"
echo "- Database: Neon PostgreSQL (configured)"
echo "- SSL: Ready for setup"
echo "- Backups: Daily at 2 AM"
echo "- SSL Renewal: Weekly on Sunday 3 AM"
echo "- Monitoring: Every 30 minutes"
