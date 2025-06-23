#!/bin/bash
# /home/$USER/setup-production.sh
# Production setup script

set -e

USER_HOME="/home/$USER"
APP_DIR="/var/www/arkkontrol"

echo "🔧 Setting up production environment..."

# Make scripts executable
chmod +x $USER_HOME/backup.sh
chmod +x $USER_HOME/ssl-renew.sh
chmod +x $USER_HOME/firewall-setup.sh
chmod +x $USER_HOME/monitor.sh
chmod +x $USER_HOME/deploy.sh

# Copy nginx configuration
echo "🌐 Setting up nginx configuration..."
sudo cp nginx-site.conf /etc/nginx/sites-available/arkkontrol
sudo ln -sf /etc/nginx/sites-available/arkkontrol /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Copy systemd service
echo "⚙️ Setting up systemd service..."
sudo cp arkkontrol.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable arkkontrol

# Copy logrotate configuration
echo "📝 Setting up log rotation..."
sudo cp logrotate.conf /etc/logrotate.d/arkkontrol

# Set up cron jobs
echo "⏰ Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * $USER_HOME/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 0 $USER_HOME/ssl-renew.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * $USER_HOME/monitor.sh") | crontab -

# Create log directories
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Set up firewall
echo "🔒 Setting up firewall..."
$USER_HOME/firewall-setup.sh

# Copy environment template
cp .env.production $APP_DIR/.env.local.template

echo "✅ Production setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit $APP_DIR/.env.local with your actual values"
echo "2. Update nginx configuration with your domain name"
echo "3. Run: cd $APP_DIR && pnpm install && pnpm build"
echo "4. Run: pm2 start ecosystem.config.js && pm2 save"
echo "5. Setup SSL: sudo certbot --nginx -d yourdomain.com"
echo "6. Test everything with: $USER_HOME/monitor.sh"
