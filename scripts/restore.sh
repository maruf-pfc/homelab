#!/usr/bin/env bash
# ==============================================================================
# Disaster Recovery Restore Script for Homelab Infrastructure
# Usage: ./scripts/restore.sh /path/to/homelab_backup_YYYYMMDD_HHMMSS.tar.gz
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path-to-backup-tarball.tar.gz>"
    exit 1
fi

BACKUP_TAR="$1"

if [ ! -f "${BACKUP_TAR}" ]; then
    echo "[!] Error: Backup file '${BACKUP_TAR}' does not exist."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TEMP_RESTORE_DIR="/tmp/homelab_restore_$(date +%s)"

echo "[+] Starting Restoration Process from: ${BACKUP_TAR}"

mkdir -p "${TEMP_RESTORE_DIR}"
tar -xzf "${BACKUP_TAR}" -C "${TEMP_RESTORE_DIR}"

UNPACKED_DIR=$(find "${TEMP_RESTORE_DIR}" -mindepth 1 -maxdepth 1 -type d | head -n 1)

echo "[+] Extracting SSD configurations to ${ROOT_DIR}..."
if [ -f "${UNPACKED_DIR}/ssd_homelab_configs.tar.gz" ]; then
    tar -xzf "${UNPACKED_DIR}/ssd_homelab_configs.tar.gz" -C "${ROOT_DIR}"
fi

HDD_VOLUMES="/home/maruf/MyHDDStorage/docker/volumes"
if [ -f "${UNPACKED_DIR}/hdd_service_volumes.tar.gz" ]; then
    echo "[+] Extracting HDD persistent service volumes to ${HDD_VOLUMES}..."
    mkdir -p "${HDD_VOLUMES}"
    tar -xzf "${UNPACKED_DIR}/hdd_service_volumes.tar.gz" -C "${HDD_VOLUMES}"
fi

rm -rf "${TEMP_RESTORE_DIR}"

echo "[✓] Restoration complete!"
echo "[!] If restoring database dumps, run:"
echo "    docker exec -i leantime-db mariadb -u root -prootpassword < /path/to/leantime_db_dump.sql"
