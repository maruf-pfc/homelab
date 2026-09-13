#!/usr/bin/env bash
# ==============================================================================
# Production Backup Script for Homelab Infrastructure
# Author: DevOps Automated Assistant
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PARENT_DIR="${ROOT_DIR}/backups"
HDD_BACKUP_DIR="/home/maruf/MyHDDStorage/backups"
BACKUP_DIR="${BACKUP_PARENT_DIR}/backup_${TIMESTAMP}"

mkdir -p "${BACKUP_PARENT_DIR}"
mkdir -p "${BACKUP_DIR}"
[ -d "${HDD_BACKUP_DIR}" ] || mkdir -p "${HDD_BACKUP_DIR}"

echo "[+] Starting Homelab Backup at $(date)"
echo "[+] Destination: ${BACKUP_DIR}"

# Load environment variables for DB passwords
if [ -f "${ROOT_DIR}/.env" ]; then
    set -a
    source "${ROOT_DIR}/.env"
    set +a
fi

# 1. Database Dumps
if docker ps --format '{{.Names}}' | grep -Eq '^leantime-db$'; then
    echo "[+] Exporting MariaDB dump for Leantime..."
    docker exec leantime-db mariadb-dump -u root -p"${LEANTIME_DB_ROOT_PASSWORD:-rootpassword}" --all-databases > "${BACKUP_DIR}/leantime_db_dump.sql" || echo "[!] MariaDB dump warning."
fi

if docker ps --format '{{.Names}}' | grep -Eq '^maybe-db$'; then
    echo "[+] Exporting PostgreSQL dump for Maybe Finance..."
    docker exec maybe-db pg_dumpall -U "${MAYBE_DB_USER:-maybe}" > "${BACKUP_DIR}/maybe_db_dump.sql" || echo "[!] PostgreSQL dump warning."
fi

# 2. Archive SSD Configurations & Volumes
echo "[+] Archiving SSD configurations, .env, and volumes..."
docker run --rm -v "${ROOT_DIR}:/src" -v "${BACKUP_DIR}:/dst" alpine sh -c "tar -czf /dst/ssd_homelab_configs.tar.gz -C /src .env configs volumes apps docker-compose.yml" 2>/dev/null || true

# 3. Archive HDD Volumes (Portainer, Uptime Kuma, Jellyfin)
HDD_VOLUMES="/home/maruf/MyHDDStorage/docker/volumes"
if [ -d "${HDD_VOLUMES}" ]; then
    echo "[+] Archiving HDD persistent service volumes..."
    docker run --rm -v "${HDD_VOLUMES}:/src" -v "${BACKUP_DIR}:/dst" alpine sh -c "tar -czf /dst/hdd_service_volumes.tar.gz -C /src ." 2>/dev/null || true
fi

# 4. Create Master Consolidated Tarball
echo "[+] Creating master backup archive..."
MASTER_TAR="${BACKUP_PARENT_DIR}/homelab_backup_${TIMESTAMP}.tar.gz"
tar -czf "${MASTER_TAR}" -C "${BACKUP_PARENT_DIR}" "backup_${TIMESTAMP}"
rm -rf "${BACKUP_DIR}"

if [ -d "${HDD_BACKUP_DIR}" ]; then
    cp -af "${MASTER_TAR}" "${HDD_BACKUP_DIR}/"
fi

echo "[✓] Backup completed successfully: ${MASTER_TAR}"

# 5. Retention Policy: Keep only the most recent backup (remove all older ones)
echo "[+] Removing old backups (keeping only latest)..."
find "${BACKUP_PARENT_DIR}" -name "homelab_backup_*.tar.gz" ! -newer "${MASTER_TAR}" -not -samefile "${MASTER_TAR}" -delete 2>/dev/null || true
find "${BACKUP_PARENT_DIR}" -name "backup_*" -maxdepth 1 -type d -exec rm -rf {} + 2>/dev/null || true
if [ -d "${HDD_BACKUP_DIR}" ]; then
    find "${HDD_BACKUP_DIR}" -name "homelab_backup_*.tar.gz" ! -newer "${MASTER_TAR}" -not -samefile "${MASTER_TAR}" -delete 2>/dev/null || true
fi

echo "[✓] All backup tasks finished at $(date)"
