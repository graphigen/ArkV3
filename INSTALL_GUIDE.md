# Ubuntu 22.04 Installation Guide
# Ark Kontrol Website Deployment

## Prerequisites
- Ubuntu 22.04 LTS Server
- Root or sudo access
- Domain name (optional but recommended)
- Neon Database URL

## Quick Installation

### 1. Download Scripts
\`\`\`bash
wget https://raw.githubusercontent.com/your-repo/arkkontrol-website/main/auto-install.sh
wget https://raw.githubusercontent.com/your-repo/arkkontrol-website/main/check.sh
chmod +x auto-install.sh check.sh
\`\`\`

### 2. Run Auto Installation
\`\`\`bash
./auto-install.sh
\`\`\`

### 3. Upload Project Files
\`\`\`bash
# Option 1: Using Git
cd /var/www/arkkontrol
git clone https://github.com/your-repo/arkkontrol-website.git .

# Option 2: Using SCP
scp -r ./project-files/* user@server:/var/www/arkkontrol/

# Option 3: Using rsync
rsync -avz ./project-files/ user@server:/var/www/arkkontrol/
\`\`\`

### 4. Configure Environment
\`\`\`bash
cd /var/www/arkkontrol
nano .env.local
\`\`\`

Update with your actual values:
\`\`\`env
DATABASE_URL="postgresql://username:password@host:5432/database"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
ADMIN_SECRET_KEY="your-super-secret-admin-key-here"
\`\`\`

### 5. Install Dependencies & Build
\`\`\`bash
pnpm install
pnpm build
\`\`\`

### 6. Start Application
\`\`\`bash
pm2 start ecosystem.config.js
pm2 save
\`\`\`

### 7. Configure Domain
\`\`\`bash
sudo nano /etc/nginx/sites-available/arkkontrol
# Replace yourdomain.com with your actual domain
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### 8. Setup SSL Certificate
\`\`\`bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
\`\`\`

### 9. Verify Installation
\`\`\`bash
./check.sh
\`\`\`

## Manual Installation Steps

### 1. System Update
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

### 2. Install Node.js 20.x
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
\`\`\`

### 3. Install pnpm
\`\`\`bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
\`\`\`

### 4. Install PM2
\`\`\`bash
sudo npm install -g pm2
\`\`\`

### 5. Install Nginx
\`\`\`bash
sudo apt install -y nginx
\`\`\`

### 6. Setup Firewall
\`\`\`bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000
\`\`\`

### 7. Install SSL Tools
\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
\`\`\`

## Database Setup

### 1. Neon Database
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `.env.local` with DATABASE_URL

### 2. Run Database Scripts
\`\`\`bash
# Connect to your database and run these scripts in order:
# 1. scripts/init-database.sql
# 2. scripts/analytics-tables.sql
# 3. scripts/menu-management.sql
# 4. scripts/media-manager.sql
# 5. scripts/forms-system.sql
# 6. scripts/blog-system.sql
# 7. scripts/seo-system.sql
# 8. scripts/i18n-system.sql
# 9. scripts/users-auth-system.sql
# 10. scripts/complete-setup.sql
# 11. scripts/complete-site-data-fixed.sql
\`\`\`

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use
\`\`\`bash
sudo lsof -i :3000
sudo kill -9 <PID>
\`\`\`

#### 2. PM2 Not Starting
\`\`\`bash
pm2 logs arkkontrol-website
pm2 restart arkkontrol-website
pm2 delete arkkontrol-website
pm2 start ecosystem.config.js
\`\`\`

#### 3. Nginx Configuration Error
\`\`\`bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx
\`\`\`

#### 4. Database Connection Error
- Check DATABASE_URL in .env.local
- Verify Neon database is accessible
- Check firewall settings
- Test connection: `psql $DATABASE_URL`

#### 5. Build Errors
\`\`\`bash
cd /var/www/arkkontrol
rm -rf .next node_modules
pnpm install
pnpm build
\`\`\`

#### 6. Permission Issues
\`\`\`bash
sudo chown -R $USER:$USER /var/www/arkkontrol
chmod -R 755 /var/www/arkkontrol
\`\`\`

### Log Files
- PM2 Logs: `/var/log/pm2/`
- Nginx Logs: `/var/log/nginx/`
- System Logs: `journalctl -u nginx`
- Application Logs: `pm2 logs arkkontrol-website`

### Useful Commands
\`\`\`bash
# Check application status
pm2 status
pm2 logs arkkontrol-website
pm2 monit

# Restart services
sudo systemctl restart nginx
pm2 restart arkkontrol-website

# Check system resources
htop
df -h
free -h

# Update application
cd /var/www/arkkontrol
git pull
pnpm install
pnpm build
pm2 restart arkkontrol-website

# Database operations
psql $DATABASE_URL
pg_dump $DATABASE_URL > backup.sql
\`\`\`

## Security Recommendations

### 1. Regular Updates
\`\`\`bash
sudo apt update && sudo apt upgrade -y
npm update -g pm2
\`\`\`

### 2. Firewall Configuration
\`\`\`bash
sudo ufw status
sudo ufw allow from trusted.ip.address
sudo ufw deny from malicious.ip.address
\`\`\`

### 3. SSL Certificate Renewal
\`\`\`bash
sudo certbot renew --dry-run
# Add to crontab for automatic renewal:
# 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

### 4. Backup Strategy
\`\`\`bash
# Automatic backups are set up during installation
# Manual backup:
/home/$USER/backup.sh

# Restore from backup:
tar -xzf backup.tar.gz -C /var/www/
psql $DATABASE_URL < backup.sql
\`\`\`

### 5. Monitoring
\`\`\`bash
# Set up monitoring alerts
pm2 install pm2-server-monit
pm2 set pm2-server-monit:refresh 2000
\`\`\`

## Performance Optimization

### 1. Enable Gzip Compression
Already configured in Nginx config

### 2. PM2 Cluster Mode
Already configured in ecosystem.config.js

### 3. Database Connection Pooling
Configure in your application

### 4. CDN Setup (Optional)
- Use Cloudflare or similar
- Configure static asset caching

### 5. Caching
\`\`\`bash
# Redis for session storage (optional)
sudo apt install redis-server
sudo systemctl enable redis-server
\`\`\`

## Maintenance

### Daily Tasks
- Check PM2 status: `pm2 status`
- Check disk space: `df -h`
- Check logs: `pm2 logs arkkontrol-website --lines 50`

### Weekly Tasks
- Update system: `sudo apt update && sudo apt upgrade`
- Check SSL certificates: `sudo certbot certificates`
- Review backup files: `ls -la ~/backups/`

### Monthly Tasks
- Update Node.js dependencies: `pnpm update`
- Review security logs: `sudo journalctl -u ssh`
- Clean old logs: `pm2 flush`

## Support

For issues:
1. Run `./check.sh` to diagnose problems
2. Check log files for errors
3. Verify environment variables
4. Ensure all services are running
5. Check database connectivity

## Updates

To update the application:
\`\`\`bash
cd /var/www/arkkontrol
git pull
pnpm install
pnpm build
pm2 restart arkkontrol-website
\`\`\`

## Backup and Recovery

### Automatic Backups
- Files: Daily at 2 AM
- Database: Daily at 2 AM
- Retention: 7 days

### Manual Backup
\`\`\`bash
/home/$USER/backup.sh
\`\`\`

### Recovery
\`\`\`bash
# Restore files
tar -xzf /home/$USER/backups/arkkontrol_files_YYYYMMDD_HHMMSS.tar.gz -C /var/www/

# Restore database
psql $DATABASE_URL < /home/$USER/backups/arkkontrol_db_YYYYMMDD_HHMMSS.sql

# Restart application
pm2 restart arkkontrol-website
