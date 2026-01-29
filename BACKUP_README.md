# MySQL Database Backup Automation

This directory contains scripts for automated MySQL database backups to AWS S3.

## Files

- `backup_mysql_to_s3.sh` - Main backup script

## Setup Instructions

### 1. On Your EC2 Ubuntu Machine

```bash
# Copy the script to your EC2 instance
scp backup_mysql_to_s3.sh ubuntu@your-ec2-ip:/home/ubuntu/

# SSH into your EC2 instance
ssh ubuntu@your-ec2-ip

# Make the script executable
chmod +x backup_mysql_to_s3.sh

# Install AWS CLI if not already installed
sudo apt update
sudo apt install awscli -y

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: ap-south-2
# Enter output format: json
```

### 2. Test the Backup Script

```bash
# Run the backup script manually first to test
./backup_mysql_to_s3.sh
```

### 3. Schedule Automatic Backups with Cron

```bash
# Edit crontab
crontab -e

# Add one of these lines (uncomment the one you want):

# Daily backup at 2:00 AM
0 2 * * * /home/ubuntu/backup_mysql_to_s3.sh >> /var/log/mysql_backup.log 2>&1

# Backup every 6 hours
0 */6 * * * /home/ubuntu/backup_mysql_to_s3.sh >> /var/log/mysql_backup.log 2>&1

# Backup every 12 hours
0 */12 * * * /home/ubuntu/backup_mysql_to_s3.sh >> /var/log/mysql_backup.log 2>&1

# Weekly backup (every Sunday at 3:00 AM)
0 3 * * 0 /home/ubuntu/backup_mysql_to_s3.sh >> /var/log/mysql_backup.log 2>&1
```

### 4. Create Log Directory (Optional)

```bash
# Create log file
sudo touch /var/log/mysql_backup.log
sudo chown ubuntu:ubuntu /var/log/mysql_backup.log
```

### 5. View Backup Logs

```bash
# View all logs
cat /var/log/mysql_backup.log

# View last 50 lines
tail -50 /var/log/mysql_backup.log

# Follow logs in real-time
tail -f /var/log/mysql_backup.log
```

## Script Features

✅ **Automatic Backup**: Dumps MySQL database from Docker container  
✅ **Compression**: Gzips the SQL dump to save space  
✅ **S3 Upload**: Uploads to `s3://automex-bhubaneswar/DB_Backup/`  
✅ **Verification**: Verifies the upload succeeded  
✅ **Retention**: Automatically deletes backups older than 30 days  
✅ **Error Handling**: Exits on errors with clear messages  
✅ **Logging**: Color-coded output for easy monitoring  

## Configuration

Edit the script to customize these values:

```bash
CONTAINER_NAME="automex_mysql"     # Docker container name
DB_NAME="automex"                  # Database name
DB_USER="root"                     # Database user
DB_PASSWORD="root"                 # Database password
S3_BUCKET="automex-bhubaneswar"   # S3 bucket name
S3_PATH="DB_Backup"               # S3 folder path
AWS_REGION="ap-south-2"           # AWS region
RETENTION_DAYS=30                 # Keep backups for 30 days
```

## Manual Backup

To run a backup manually:

```bash
./backup_mysql_to_s3.sh
```

## Restore from Backup

To restore a backup:

```bash
# Download from S3
aws s3 cp s3://automex-bhubaneswar/DB_Backup/automex_db_backup_YYYYMMDD_HHMMSS.sql.gz . --region ap-south-2

# Decompress
gunzip automex_db_backup_YYYYMMDD_HHMMSS.sql.gz

# Restore to Docker MySQL container
docker exec -i automex_mysql mysql -uroot -proot automex < automex_db_backup_YYYYMMDD_HHMMSS.sql
```

## Troubleshooting

### AWS Credentials Error
```bash
# Verify AWS credentials are configured
aws configure list

# Test S3 access
aws s3 ls s3://automex-bhubaneswar/DB_Backup/ --region ap-south-2
```

### Docker Container Not Running
```bash
# Check if container is running
docker ps | grep automex_mysql

# Start the container if needed
docker-compose up -d mysql
```

### Permission Errors
```bash
# Make script executable
chmod +x backup_mysql_to_s3.sh

# Ensure user has Docker permissions
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

## Security Notes

⚠️ **Important**: The database password is stored in plain text in the script. Consider these alternatives:

1. **Environment Variables**:
   ```bash
   export DB_PASSWORD="your_password"
   # Reference in script: ${DB_PASSWORD}
   ```

2. **AWS Secrets Manager**:
   ```bash
   DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id mysql-password --query SecretString --output text)
   ```

3. **Encrypted File**:
   Store credentials in an encrypted file and decrypt at runtime.
