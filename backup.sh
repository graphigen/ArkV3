#!/bin/bash
# /home/$USER/backup.sh
# Comprehensive backup script for Ark Kontrol Website with Neon Database

set -e

# Configuration
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/arkkontrol"

# Neon Database Configuration
DB_HOST="ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech"
DB_HOST_UNPOOLED="ep-long-sound-a4hecgzc.us-east-1.aws.neon.tech"
DB_USER="neondb_owner"
DB_NAME="neondb"
DB_PASSWORD="npg_htj6CH2SYioa"
DB_URL="postgresql://neondb_owner:npg_htj6CH2SYioa@ep-long-sound-a4hecgzc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create backup directory
mkdir -p $BACKUP_DIR

echo -e "${BLUE}🔄 Starting Ark Kontrol Website Backup: $DATE${NC}"
echo "=================================================="

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# 1. Backup Application Files
log "📁 Backing up application files..."
if [ -d "$APP_DIR" ]; then
    tar -czf $BACKUP_DIR/arkkontrol_files_$DATE.tar.gz \
        -C /var/www arkkontrol \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        --exclude=*.log \
        --exclude=uploads/temp \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        FILE_SIZE=$(du -h $BACKUP_DIR/arkkontrol_files_$DATE.tar.gz | cut -f1)
        log "✅ Application files backed up successfully ($FILE_SIZE)"
    else
        error "❌ Failed to backup application files"
    fi
else
    warning "⚠️  Application directory not found: $APP_DIR"
fi

# 2. Backup Database (Neon PostgreSQL)
log "🗄️ Backing up Neon PostgreSQL database..."
export PGPASSWORD="$DB_PASSWORD"

# Test connection first
if pg_isready -h $DB_HOST -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
    log "✅ Database connection test successful"
    
    # Full database backup
    pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
        --verbose \
        --no-password \
        --format=custom \
        --compress=9 \
        --file=$BACKUP_DIR/arkkontrol_db_$DATE.dump \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        DB_SIZE=$(du -h $BACKUP_DIR/arkkontrol_db_$DATE.dump | cut -f1)
        log "✅ Database backup completed successfully ($DB_SIZE)"
        
        # Also create a SQL text backup for easier inspection
        pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
            --no-password \
            --format=plain \
            --file=$BACKUP_DIR/arkkontrol_db_$DATE.sql \
            2>/dev/null
        
        if [ $? -eq 0 ]; then
            SQL_SIZE=$(du -h $BACKUP_DIR/arkkontrol_db_$DATE.sql | cut -f1)
            log "✅ SQL text backup also created ($SQL_SIZE)"
        fi
    else
        error "❌ Database backup failed"
    fi
    
    # Backup database schema only
    pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
        --schema-only \
        --no-password \
        --file=$BACKUP_DIR/arkkontrol_schema_$DATE.sql \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        log "✅ Database schema backup completed"
    fi
    
else
    error "❌ Cannot connect to database. Backup skipped."
    error "   Host: $DB_HOST"
    error "   Database: $DB_NAME"
    error "   User: $DB_USER"
fi

# 3. Backup Configuration Files
log "⚙️ Backing up configuration files..."
CONFIG_BACKUP_DIR="$BACKUP_DIR/config_$DATE"
mkdir -p $CONFIG_BACKUP_DIR

# Environment file
if [ -f "$APP_DIR/.env.local" ]; then
    cp $APP_DIR/.env.local $CONFIG_BACKUP_DIR/env.backup
    log "✅ Environment file backed up"
fi

# PM2 ecosystem
if [ -f "$APP_DIR/ecosystem.config.js" ]; then
    cp $APP_DIR/ecosystem.config.js $CONFIG_BACKUP_DIR/ecosystem.backup
    log "✅ PM2 configuration backed up"
fi

# Nginx configuration
if [ -f "/etc/nginx/sites-available/arkkontrol" ]; then
    sudo cp /etc/nginx/sites-available/arkkontrol $CONFIG_BACKUP_DIR/nginx.backup
    log "✅ Nginx configuration backed up"
fi

# Systemd service
if [ -f "/etc/systemd/system/arkkontrol.service" ]; then
    sudo cp /etc/systemd/system/arkkontrol.service $CONFIG_BACKUP_DIR/systemd.backup
    log "✅ Systemd service backed up"
fi

# SSL certificates (if exist)
if [ -d "/etc/letsencrypt/live" ]; then
    sudo tar -czf $CONFIG_BACKUP_DIR/ssl_certificates.tar.gz -C /etc/letsencrypt live archive renewal 2>/dev/null
    if [ $? -eq 0 ]; then
        log "✅ SSL certificates backed up"
    fi
fi

# Compress configuration backup
tar -czf $BACKUP_DIR/arkkontrol_config_$DATE.tar.gz -C $BACKUP_DIR config_$DATE 2>/dev/null
rm -rf $CONFIG_BACKUP_DIR
log "✅ Configuration files compressed"

# 4. Create backup manifest
log "📋 Creating backup manifest..."
cat > $BACKUP_DIR/backup_manifest_$DATE.txt << EOF
Ark Kontrol Website Backup Manifest
===================================
Backup Date: $DATE
Backup Time: $(date)
Server: $(hostname)
User: $(whoami)

Database Information:
- Host: $DB_HOST
- Database: $DB_NAME
- User: $DB_USER
- Connection: Neon PostgreSQL

Files Included:
EOF

# List backup files with sizes
ls -lh $BACKUP_DIR/*_$DATE.* >> $BACKUP_DIR/backup_manifest_$DATE.txt 2>/dev/null

# Add system information
echo "" >> $BACKUP_DIR/backup_manifest_$DATE.txt
echo "System Information:" >> $BACKUP_DIR/backup_manifest_$DATE.txt
echo "- OS: $(lsb_release -d | cut -f2)" >> $BACKUP_DIR/backup_manifest_$DATE.txt
echo "- Kernel: $(uname -r)" >> $BACKUP_DIR/backup_manifest_$DATE.txt
echo "- Memory: $(free -h | grep Mem | awk '{print $2}')" >> $BACKUP_DIR/backup_manifest_$DATE.txt
echo "- Disk Usage: $(df -h / | tail -1 | awk '{print $5}')" >> $BACKUP_DIR/backup_manifest_$DATE.txt

# 5. Cleanup old backups (keep last 7 days)
log "🧹 Cleaning up old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "arkkontrol_*" -mtime +7 -delete 2>/dev/null
find $BACKUP_DIR -name "backup_manifest_*" -mtime +7 -delete 2>/dev/null

REMAINING_BACKUPS=$(ls -1 $BACKUP_DIR/arkkontrol_files_*.tar.gz 2>/dev/null | wc -l)
log "✅ Cleanup completed. $REMAINING_BACKUPS backup sets remaining"

# 6. Calculate total backup size
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)

echo ""
echo -e "${GREEN}🎉 Backup completed successfully!${NC}"
echo "=================================================="
echo "📅 Date: $DATE"
echo "📁 Location: $BACKUP_DIR"
echo "💾 Total Size: $TOTAL_SIZE"
echo "📋 Manifest: backup_manifest_$DATE.txt"
echo ""
echo -e "${BLUE}📋 Backup Contents:${NC}"
ls -lh $BACKUP_DIR/*_$DATE.* 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'

# 7. Optional: Send notification (if configured)
if command -v mail >/dev/null 2>&1 && [ ! -z "$BACKUP_EMAIL" ]; then
    echo "Ark Kontrol Website backup completed successfully on $(date)" | \
    mail -s "Backup Completed - $DATE" $BACKUP_EMAIL
    log "📧 Email notification sent to $BACKUP_EMAIL"
fi

echo ""
log "✅ All backup operations completed"

# Unset password variable for security
unset PGPASSWORD
