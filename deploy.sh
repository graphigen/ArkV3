#!/bin/bash
# Deployment Script for Ark Kontrol Website with Neon Database

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_DIR="/var/www/arkkontrol"
BACKUP_DIR="/home/$USER/backups"
LOG_FILE="/var/log/arkkontrol/deploy.log"

# Neon Database Configuration
DB_HOST="ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech"
DB_USER="neondb_owner"
DB_NAME="neondb"
DB_PASSWORD="npg_htj6CH2SYioa"
DB_URL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Create log directory
mkdir -p /var/log/arkkontrol

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

echo -e "${BLUE}🚀 Ark Kontrol Website Deployment${NC}"
echo "=================================="

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then
    error "❌ Don't run this script as root"
    exit 1
fi

# 1. Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    error "❌ Application directory not found: $APP_DIR"
    exit 1
fi

# Check if PM2 is running
if ! command -v pm2 &> /dev/null; then
    error "❌ PM2 is not installed"
    exit 1
fi

# Check database connection
export PGPASSWORD="$DB_PASSWORD"
if ! pg_isready -h $DB_HOST -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
    error "❌ Cannot connect to database"
    exit 1
fi
unset PGPASSWORD

log "✅ Pre-deployment checks passed"

# 2. Create backup before deployment
log "💾 Creating backup before deployment..."
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup current application
if [ -d "$APP_DIR" ]; then
    tar -czf $BACKUP_DIR/pre_deploy_backup_$BACKUP_DATE.tar.gz \
        -C /var/www arkkontrol \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        log "✅ Application backup created"
    else
        error "❌ Failed to create backup"
        exit 1
    fi
fi

# 3. Stop application gracefully
log "⏸️  Stopping application..."
if pm2 list | grep -q "arkkontrol-website"; then
    pm2 stop arkkontrol-website
    if [ $? -eq 0 ]; then
        log "✅ Application stopped"
    else
        warning "⚠️  Failed to stop application gracefully"
    fi
else
    log "ℹ️  Application not running"
fi

# 4. Update application code (if git repo)
cd $APP_DIR

if [ -d ".git" ]; then
    log "📥 Pulling latest code from repository..."
    
    # Stash any local changes
    git stash push -m "Auto-stash before deployment $(date)"
    
    # Pull latest changes
    git pull origin main
    if [ $? -eq 0 ]; then
        log "✅ Code updated successfully"
    else
        error "❌ Failed to pull latest code"
        # Restore from backup if needed
        log "🔄 Attempting to restore from backup..."
        pm2 start arkkontrol-website
        exit 1
    fi
else
    log "ℹ️  Not a git repository, skipping code update"
fi

# 5. Install/update dependencies
log "📦 Installing dependencies..."
if [ -f "package.json" ]; then
    # Clear npm cache
    npm cache clean --force 2>/dev/null || true
    
    # Install dependencies
    pnpm install --frozen-lockfile
    if [ $? -eq 0 ]; then
        log "✅ Dependencies installed successfully"
    else
        error "❌ Failed to install dependencies"
        exit 1
    fi
else
    error "❌ package.json not found"
    exit 1
fi

# 6. Run database migrations (if any)
log "🗄️ Checking for database migrations..."
if [ -d "migrations" ] || [ -f "migrate.js" ] || [ -f "prisma/schema.prisma" ]; then
    log "🔄 Running database migrations..."
    
    # If using Prisma
    if [ -f "prisma/schema.prisma" ]; then
        npx prisma migrate deploy
        if [ $? -eq 0 ]; then
            log "✅ Prisma migrations completed"
        else
            error "❌ Prisma migrations failed"
            exit 1
        fi
    fi
    
    # If using custom migration script
    if [ -f "migrate.js" ]; then
        node migrate.js
        if [ $? -eq 0 ]; then
            log "✅ Custom migrations completed"
        else
            error "❌ Custom migrations failed"
            exit 1
        fi
    fi
else
    log "ℹ️  No migrations found"
fi

# 7. Build application
log "🔨 Building application..."
pnpm build
if [ $? -eq 0 ]; then
    log "✅ Application built successfully"
else
    error "❌ Build failed"
    exit 1
fi

# 8. Update environment variables if needed
log "⚙️ Checking environment configuration..."
if [ -f ".env.local" ]; then
    # Ensure database URL is correct
    if ! grep -q "DATABASE_URL.*neondb_owner" .env.local; then
        warning "⚠️  Updating database URL in environment file"
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|g" .env.local
    fi
    log "✅ Environment configuration checked"
else
    warning "⚠️  .env.local not found, creating from template"
    cp .env.production .env.local
    sed -i "s|yourdomain.com|$(hostname)|g" .env.local
    sed -i "s|your-super-secret-admin-key-here|$(openssl rand -hex 32)|g" .env.local
fi

# 9. Test configuration
log "🧪 Testing application configuration..."

# Test database connection with app config
export PGPASSWORD="$DB_PASSWORD"
if psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    log "✅ Database connection test passed"
else
    error "❌ Database connection test failed"
    exit 1
fi
unset PGPASSWORD

# Test Next.js configuration
if node -e "require('./next.config.mjs')" 2>/dev/null; then
    log "✅ Next.js configuration is valid"
else
    error "❌ Next.js configuration is invalid"
    exit 1
fi

# 10. Start application
log "🚀 Starting application..."
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    log "✅ Application started successfully"
else
    error "❌ Failed to start application"
    exit 1
fi

# Wait for application to be ready
log "⏳ Waiting for application to be ready..."
sleep 10

# 11. Health check
log "🏥 Performing health check..."
HEALTH_CHECK_ATTEMPTS=0
MAX_ATTEMPTS=6

while [ $HEALTH_CHECK_ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        log "✅ Health check passed (HTTP $HTTP_CODE)"
        break
    else
        HEALTH_CHECK_ATTEMPTS=$((HEALTH_CHECK_ATTEMPTS + 1))
        log "⏳ Health check attempt $HEALTH_CHECK_ATTEMPTS/$MAX_ATTEMPTS (HTTP $HTTP_CODE)"
        sleep 5
    fi
done

if [ $HEALTH_CHECK_ATTEMPTS -eq $MAX_ATTEMPTS ]; then
    error "❌ Health check failed after $MAX_ATTEMPTS attempts"
    log "🔄 Rolling back to previous version..."
    pm2 stop arkkontrol-website
    # Restore from backup would go here
    exit 1
fi

# 12. Test admin panel
log "🔐 Testing admin panel..."
ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin 2>/dev/null || echo "000")
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "302" ]; then
    log "✅ Admin panel is accessible (HTTP $ADMIN_CODE)"
else
    warning "⚠️  Admin panel test returned HTTP $ADMIN_CODE"
fi

# 13. Save PM2 configuration
log "💾 Saving PM2 configuration..."
pm2 save
if [ $? -eq 0 ]; then
    log "✅ PM2 configuration saved"
else
    warning "⚠️  Failed to save PM2 configuration"
fi

# 14. Reload nginx (if configuration changed)
if sudo nginx -t &>/dev/null; then
    sudo systemctl reload nginx
    log "✅ Nginx reloaded"
else
    warning "⚠️  Nginx configuration test failed"
fi

# 15. Cleanup old backups
log "🧹 Cleaning up old deployment backups..."
find $BACKUP_DIR -name "pre_deploy_backup_*" -mtime +7 -delete 2>/dev/null
log "✅ Cleanup completed"

# 16. Final status
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "======================================"
echo "📅 Deployment time: $(date)"
echo "📁 Application directory: $APP_DIR"
echo "🗄️ Database: Neon PostgreSQL"
echo "🌐 Application URL: http://localhost:3000"
echo "🔐 Admin panel: http://localhost:3000/admin"
echo "📋 Logs: pm2 logs arkkontrol-website"
echo "📊 Monitor: pm2 monit"

# Send notification if configured
if command -v mail >/dev/null 2>&1 && [ ! -z "$DEPLOY_EMAIL" ]; then
    echo "Ark Kontrol Website deployed successfully on $(date)" | \
    mail -s "Deployment Successful" $DEPLOY_EMAIL
    log "📧 Email notification sent"
fi

log "✅ Deployment process completed successfully"
