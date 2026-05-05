#!/bin/bash

# Mitralabs.id Database Backup Script
# This script creates a backup of the database

set -e

echo "💾 Mitralabs.id Database Backup"
echo "================================"
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "❌ .env.local not found"
    exit 1
fi

# Create backup directory
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mitralabs_backup_$TIMESTAMP.sql"

echo "📁 Backup directory: $BACKUP_DIR"
echo "📄 Backup file: $BACKUP_FILE"
echo ""

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL=$DATABASE_URL

echo "🔄 Creating database backup..."

# Use pg_dump to create backup
if command -v pg_dump &> /dev/null; then
    pg_dump $DB_URL > $BACKUP_FILE
    echo "✅ Backup created successfully"
else
    echo "❌ pg_dump not found. Please install PostgreSQL client tools."
    exit 1
fi

# Compress backup
echo "🗜️  Compressing backup..."
gzip $BACKUP_FILE
BACKUP_FILE="$BACKUP_FILE.gz"
echo "✅ Backup compressed"
echo ""

# Show backup info
BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
echo "================================"
echo "✅ Backup completed!"
echo ""
echo "📊 Backup info:"
echo "   File: $BACKUP_FILE"
echo "   Size: $BACKUP_SIZE"
echo "   Date: $(date)"
echo ""
echo "💡 To restore this backup, run:"
echo "   gunzip -c $BACKUP_FILE | psql \$DATABASE_URL"
echo "================================"

# Clean old backups (keep last 7 days)
echo ""
echo "🧹 Cleaning old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "✅ Old backups cleaned"
