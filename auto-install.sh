#!/bin/bash

# Ubuntu 22.04 Auto Install Script for Next.js Project
# Run with: bash auto-install.sh

set -e

echo "🚀 Starting Ubuntu 22.04 Auto Installation..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release unzip

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install pnpm
echo "📦 Installing pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
export PATH="$HOME/.local/share/pnpm:$PATH"

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install UFW Firewall
echo "🔒 Setting up UFW Firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000

# Install SSL certificate tool
echo "🔐 Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Install additional tools
echo "🛠️ Installing additional tools..."
sudo apt install -y htop neofetch tree

# Create project directory
echo "📁 Creating project directory..."
sudo mkdir -p /var/www/arkkontrol
sudo chown -R $USER:$USER /var/www/arkkontrol

# Clone or setup project (if git repo exists)
echo "📥 Setting up project..."
cd /var/www/arkkontrol

# Install project dependencies
echo "📦 Installing project dependencies..."
if [ -f "package.json" ]; then
    pnpm install
    echo "✅ Dependencies installed successfully"
else
    echo "⚠️  No package.json found. Please upload your project files first."
fi

# Create environment file template
echo "📝 Creating environment file template..."
cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database"
POSTGRES_URL="postgresql://username:password@host:5432/database"
POSTGRES_PRISMA_URL="postgresql://username:password@host:5432/database"

# Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
ADMIN_SECRET_KEY="your-super-secret-admin-key-here"

# Optional: Analytics
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""

# Optional: Email Configuration
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
EOF

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
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
      PORT: 3000
    },
    error_file: '/var/log/pm2/arkkontrol-error.log',
    out_file: '/var/log/pm2/arkkontrol-out.log',
    log_file: '/var/log/pm2/arkkontrol-combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G'
  }]
}
EOF

# Create Nginx configuration
echo "🌐 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/arkkontrol << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin login rate limiting
    location /api/admin/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }

    # Hide server tokens
    server_tokens off;
}
EOF

# Enable Nginx site
echo "🌐 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/arkkontrol /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Create log directories
echo "📝 Creating log directories..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Setup PM2 startup
echo "🚀 Setting up PM2 startup..."
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Create backup script
echo "💾 Creating backup script..."
cat > /home/$USER/backup.sh << 'EOF'
#!/bin/bash
# Backup script for Ark Kontrol Website

BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/arkkontrol_files_$DATE.tar.gz -C /var/www arkkontrol

# Backup database (if using PostgreSQL)
if [ ! -z "$DATABASE_URL" ]; then
    pg_dump $DATABASE_URL > $BACKUP_DIR/arkkontrol_db_$DATE.sql
fi

# Keep only last 7 backups
find $BACKUP_DIR -name "arkkontrol_*" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/$USER/backup.sh

# Setup automatic backups (daily at 2 AM)
echo "⏰ Setting up automatic backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -

echo "✅ Installation completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Upload your project files to /var/www/arkkontrol"
echo "2. Update .env.local with your actual values"
echo "3. Update Nginx config with your domain name: sudo nano /etc/nginx/sites-available/arkkontrol"
echo "4. Run: cd /var/www/arkkontrol && pnpm install"
echo "5. Run: cd /var/www/arkkontrol && pnpm build"
echo "6. Run: pm2 start ecosystem.config.js"
echo "7. Run: pm2 save"
echo "8. Setup SSL: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "🔍 Run ./check.sh to verify installation"
echo "💾 Automatic backups are scheduled daily at 2 AM"
echo "📊 Monitor with: pm2 monit"
