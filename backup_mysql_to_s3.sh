#!/bin/bash

################################################################################
# MySQL Database Backup to S3 Script
# Description: Backs up MySQL database from Docker container and uploads to S3
# Usage: ./backup_mysql_to_s3.sh
################################################################################

set -e  # Exit on error

# Configuration
CONTAINER_NAME="automex_mysql"
DB_NAME="automex"
DB_USER="root"
DB_PASSWORD="root"
S3_BUCKET="automex-bhubaneswar"
S3_PATH="DB_Backup"
AWS_REGION="ap-south-2"
BACKUP_DIR="/tmp/mysql_backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="automex_db_backup_${DATE}.sql"
COMPRESSED_FILENAME="${BACKUP_FILENAME}.gz"
RETENTION_DAYS=30  # Keep backups for 30 days

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker ps &> /dev/null; then
        error "Docker is not running or not accessible"
        exit 1
    fi
    log "Docker is running"
}

# Check if MySQL container is running
check_mysql_container() {
    if ! docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" | grep -q ${CONTAINER_NAME}; then
        error "MySQL container '${CONTAINER_NAME}' is not running"
        exit 1
    fi
    log "MySQL container is running"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    log "AWS CLI is installed"
}

# Create backup directory
create_backup_dir() {
    mkdir -p ${BACKUP_DIR}
    log "Backup directory created: ${BACKUP_DIR}"
}

# Backup MySQL database
backup_database() {
    log "Starting database backup..."
    
    docker exec ${CONTAINER_NAME} mysqldump \
        -u${DB_USER} \
        -p${DB_PASSWORD} \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        ${DB_NAME} > ${BACKUP_DIR}/${BACKUP_FILENAME}
    
    if [ $? -eq 0 ]; then
        log "Database backup completed: ${BACKUP_FILENAME}"
    else
        error "Database backup failed"
        exit 1
    fi
}

# Compress backup
compress_backup() {
    log "Compressing backup..."
    gzip ${BACKUP_DIR}/${BACKUP_FILENAME}
    
    if [ $? -eq 0 ]; then
        log "Backup compressed: ${COMPRESSED_FILENAME}"
    else
        error "Compression failed"
        exit 1
    fi
}

# Upload to S3
upload_to_s3() {
    log "Uploading backup to S3..."
    
    aws s3 cp ${BACKUP_DIR}/${COMPRESSED_FILENAME} \
        s3://${S3_BUCKET}/${S3_PATH}/${COMPRESSED_FILENAME} \
        --region ${AWS_REGION}
    
    if [ $? -eq 0 ]; then
        log "Backup uploaded successfully to s3://${S3_BUCKET}/${S3_PATH}/${COMPRESSED_FILENAME}"
    else
        error "S3 upload failed"
        exit 1
    fi
}

# Verify upload
verify_upload() {
    log "Verifying S3 upload..."
    
    if aws s3 ls s3://${S3_BUCKET}/${S3_PATH}/${COMPRESSED_FILENAME} --region ${AWS_REGION} &> /dev/null; then
        log "Upload verified successfully"
    else
        error "Upload verification failed"
        exit 1
    fi
}

# Clean up local backup
cleanup_local() {
    log "Cleaning up local backup files..."
    rm -f ${BACKUP_DIR}/${COMPRESSED_FILENAME}
    log "Local cleanup completed"
}

# Clean up old S3 backups (older than RETENTION_DAYS)
cleanup_old_s3_backups() {
    log "Cleaning up old S3 backups (older than ${RETENTION_DAYS} days)..."
    
    # Get current timestamp
    CURRENT_TIME=$(date +%s)
    RETENTION_SECONDS=$((RETENTION_DAYS * 24 * 60 * 60))
    
    # List all backups in S3
    aws s3 ls s3://${S3_BUCKET}/${S3_PATH}/ --region ${AWS_REGION} | while read -r line; do
        # Extract filename and date
        BACKUP_FILE=$(echo $line | awk '{print $4}')
        BACKUP_DATE=$(echo $line | awk '{print $1" "$2}')
        
        if [ ! -z "$BACKUP_FILE" ]; then
            # Convert backup date to timestamp
            BACKUP_TIME=$(date -d "$BACKUP_DATE" +%s 2>/dev/null || echo 0)
            
            # Calculate age
            AGE=$((CURRENT_TIME - BACKUP_TIME))
            
            # Delete if older than retention period
            if [ $AGE -gt $RETENTION_SECONDS ]; then
                warning "Deleting old backup: $BACKUP_FILE (Age: $((AGE / 86400)) days)"
                aws s3 rm s3://${S3_BUCKET}/${S3_PATH}/${BACKUP_FILE} --region ${AWS_REGION}
            fi
        fi
    done
    
    log "Old backups cleanup completed"
}

# Get backup size
get_backup_size() {
    SIZE=$(ls -lh ${BACKUP_DIR}/${COMPRESSED_FILENAME} | awk '{print $5}')
    log "Backup size: ${SIZE}"
}

# Main execution
main() {
    log "==================================================="
    log "MySQL Database Backup Script Started"
    log "==================================================="
    
    check_docker
    check_mysql_container
    check_aws_cli
    create_backup_dir
    backup_database
    compress_backup
    get_backup_size
    upload_to_s3
    verify_upload
    cleanup_local
    cleanup_old_s3_backups
    
    log "==================================================="
    log "Backup completed successfully!"
    log "Backup file: ${COMPRESSED_FILENAME}"
    log "S3 Location: s3://${S3_BUCKET}/${S3_PATH}/${COMPRESSED_FILENAME}"
    log "==================================================="
}

# Run main function
main
