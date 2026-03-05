#!/bin/bash
set -e

# Ensure cron can find commands
export PATH=/usr/local/bin:/usr/bin:/bin:/snap/bin

################################################################################
# MySQL Database Backup to S3 (Overwrite Single File)
################################################################################

# Configuration
CONTAINER_NAME="automex_mysql"
DB_NAME="automex"
DB_USER="root"
DB_PASSWORD="root"

S3_BUCKET="automex-bhubaneswar"
S3_PATH="DB_Backup"
AWS_REGION="ap-south-2"

# Backup parameters
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

BACKUP_DIR="/tmp/mysql_backups"
BACKUP_FILENAME="automex_db_backup_${TIMESTAMP}.sql"
COMPRESSED_FILENAME="${BACKUP_FILENAME}.gz"

LOG_FILE="/home/ubuntu/mysql_backup.log"

# Logging
log() {
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

error() {
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
    exit 1
}

log "================ BACKUP STARTED ================"

# Checks
docker ps >/dev/null 2>&1 || error "Docker not running"
command -v aws >/dev/null 2>&1 || error "AWS CLI not installed"

# Prepare directory
mkdir -p "$BACKUP_DIR"

# Backup DB
log "Taking MySQL backup..."
docker exec "$CONTAINER_NAME" mysqldump \
    -u"$DB_USER" \
    -p"$DB_PASSWORD" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILENAME"

# Compress
gzip -f "$BACKUP_DIR/$BACKUP_FILENAME"

# Upload to date-wise folder
log "Uploading to S3 (date-wise folder: $DATE)..."
aws s3 cp \
    "$BACKUP_DIR/$COMPRESSED_FILENAME" \
    "s3://$S3_BUCKET/$S3_PATH/$DATE/$COMPRESSED_FILENAME" \
    --region "$AWS_REGION"

# Cleanup local
rm -f "$BACKUP_DIR/$COMPRESSED_FILENAME"

log "Backup completed successfully"
log "S3 file: s3://$S3_BUCKET/$S3_PATH/$DATE/$COMPRESSED_FILENAME"
log "================================================"

