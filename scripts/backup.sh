#!/usr/bin/env bash
# ==============================================================================
# Production Backup Script for Homelab Infrastructure
# Author: DevOps Automated Assistant
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PARENT_DIR="/home/maruf/MyHDDStorage/backups"
BACKUP_DIR="${BACKUP_PARENT_DIR}/backup_${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}"

echo "[+] Starting Homelab Backup at $(date)"
echo "[+] Destination: ${BACKUP_DIR}"

# 1. Database Dumps
if docker ps --format '{{.Names}}' | grep -Eq '^leantime-db$'; then
    echo "[+] Exporting MariaDB dump for Leantime..."
    docker exec leantime-db mariadb-dump -u root -prootpassword --all-databases > "${BACKUP_DIR}/leantime_db_dump.sql" || echo "[!] Database dump warning."
fi

# 2. Archive SSD Configurations & Volumes
echo "[+] Archiving SSD configurations, .env, and volumes..."
tar -czf "${BACKUP_DIR}/ssd_homelab_configs.tar.gz" -C "${ROOT_DIR}" .env configs volumes apps docker-compose.yml || true

# 3. Archive HDD Volumes (Nginx Proxy Manager, Portainer, Uptime Kuma, Homarr)
HDD_VOLUMES="/home/maruf/MyHDDStorage/docker/volumes"
if [ -d "${HDD_VOLUMES}" ]; then
    echo "[+] Archiving HDD persistent service volumes..."
    tar -czf "${BACKUP_DIR}/hdd_service_volumes.tar.gz" -C "${HDD_VOLUMES}" . || true
fi

# 4. Create Master Consolidated Tarball
echo "[+] Creating master backup archive..."
MASTER_TAR="${BACKUP_PARENT_DIR}/homelab_backup_${TIMESTAMP}.tar.gz"
tar -czf "${MASTER_TAR}" -C "${BACKUP_PARENT_DIR}" "backup_${TIMESTAMP}"
rm -rf "${BACKUP_DIR}"

echo "[✓] Backup completed successfully: ${MASTER_TAR}"

# 5. Retention Policy: Prune backups older than 7 days
echo "[+] Pruning backups older than 7 days..."
find "${BACKUP_PARENT_DIR}" -name "homelab_backup_*.tar.gz" -mtime +7 -delete || true

echo "[✓] All backup tasks finished at $(date)"
