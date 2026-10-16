#!/usr/bin/env bash
# ==============================================================================
# 🔄 Disaster Recovery Restore Script for Homelab Infrastructure
# Usage: ./scripts/restore.sh [/path/to/homelab_backup_YYYYMMDD_HHMMSS.tar.gz]
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Source .env if available
[ -f "${ROOT_DIR}/.env" ] && source "${ROOT_DIR}/.env" 2>/dev/null || true

HDD_BASE="${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}"
HDD_VOLUMES="${HDD_BASE}/docker/volumes"

if [ "$#" -ge 1 ]; then
    BACKUP_TAR="$1"
else
    BACKUP_TAR=$(find "${ROOT_DIR}/backups" -name "homelab_backup_*.tar.gz" 2>/dev/null | sort -r | head -n 1 || true)
    if [ -z "${BACKUP_TAR}" ]; then
        BACKUP_TAR=$(find "${HDD_BASE}/backups" -name "homelab_backup_*.tar.gz" 2>/dev/null | sort -r | head -n 1 || true)
    fi
fi

if [ -z "${BACKUP_TAR:-}" ] || [ ! -f "${BACKUP_TAR}" ]; then
    echo "Usage: $0 [path-to-backup-tarball.tar.gz]"
    echo "[!] Error: No backup archive found in backups/ directory."
    exit 1
fi

TEMP_RESTORE_DIR="/tmp/homelab_restore_$(date +%s)"
echo "[+] Starting Restoration Process from: ${BACKUP_TAR}"

mkdir -p "${TEMP_RESTORE_DIR}"
tar -xzf "${BACKUP_TAR}" -C "${TEMP_RESTORE_DIR}"

UNPACKED_DIR=$(find "${TEMP_RESTORE_DIR}" -mindepth 1 -maxdepth 1 -type d | head -n 1)

echo "[+] Extracting SSD configurations to ${ROOT_DIR}..."
if [ -f "${UNPACKED_DIR}/ssd_homelab_configs.tar.gz" ]; then
    tar -xzf "${UNPACKED_DIR}/ssd_homelab_configs.tar.gz" -C "${ROOT_DIR}"
fi

if [ -f "${UNPACKED_DIR}/hdd_service_volumes.tar.gz" ]; then
    echo "[+] Extracting HDD persistent service volumes to ${HDD_VOLUMES}..."
    mkdir -p "${HDD_VOLUMES}"
    tar -xzf "${UNPACKED_DIR}/hdd_service_volumes.tar.gz" -C "${HDD_VOLUMES}"
fi

# Preserve database dump if present
DB_DUMP="${UNPACKED_DIR}/leantime_db_dump.sql"
RESTORED_DUMP="${ROOT_DIR}/backups/leantime_db_dump.sql"
if [ -f "${DB_DUMP}" ]; then
    cp -f "${DB_DUMP}" "${RESTORED_DUMP}"
    echo "[✓] Preserved database dump at: ${RESTORED_DUMP}"
fi

# Fix MariaDB volume ownership if container is running
if docker ps --format '{{.Names}}' | grep -qw "leantime-db"; then
    docker exec -u 0 leantime-db chown -R mysql:mysql /var/lib/mysql 2>/dev/null || true
fi

rm -rf "${TEMP_RESTORE_DIR}"

echo "[✓] Restoration complete!"
if [ -f "${RESTORED_DUMP}" ]; then
    echo "[!] To import the restored Leantime database dump into MariaDB, run:"
    echo "    docker exec -i leantime-db mariadb -u root -p\"\${LEANTIME_DB_ROOT_PASSWORD}\" leantime < \"${RESTORED_DUMP}\""
fi
