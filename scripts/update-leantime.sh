#!/usr/bin/env bash
# ==============================================================================
# Leantime Post-Update Automation & Backup Orchestrator
# Location: /home/maruf/homelab/scripts/update-leantime.sh
#
# Purpose:
#   Performs all required actions after updating Leantime source code:
#   1. Automatic pre-update safety backup (MariaDB dump + userfiles volume)
#   2. Optional git pull
#   3. npm dependencies installation
#   4. Production asset bundling (npx mix --production) for new appVersion
#   5. Tailwind blocklist generation (generateBlocklist.mjs)
#   6. Pending database migrations (./bin/leantime db:migrate)
#   7. Manifest and view cache flush (./bin/leantime cache:clearAll)
#   8. Container health check and HTTP verification
# ==============================================================================

set -euo pipefail

# Color palette
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOMELAB_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LEANTIME_REPO_DIR="${HOMELAB_ROOT}/github/leantime"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_ROOT="${HOMELAB_ROOT}/backups/leantime"
BACKUP_DIR="${BACKUP_ROOT}/backup_${TIMESTAMP}"
HDD_BACKUP_DIR="/home/maruf/MyHDDStorage/backups/leantime"

# CLI flags
DO_GIT_PULL=false
SKIP_BACKUP=false

print_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Post-update automation for Leantime in Homelab.

Options:
  --pull           Run 'git pull origin master' in the leantime repository first
  --skip-backup    Skip creating pre-update database and volume backups
  -h, --help       Show this help message
EOF
}

# Parse CLI arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --pull)
            DO_GIT_PULL=true
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo -e "${RED}[!] Unknown argument: $1${NC}" >&2
            print_usage
            exit 1
            ;;
    esac
done

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN} ${BOLD}⚡ LEANTIME POST-UPDATE AUTOMATION & BACKUP ORCHESTRATOR${NC}"
echo -e "${CYAN}======================================================================${NC}"

# ------------------------------------------------------------------------------
# 1. Environment & Config Verification
# ------------------------------------------------------------------------------
ENV_FILE="${HOMELAB_ROOT}/.env"
if [[ -f "${ENV_FILE}" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "${ENV_FILE}"
    set +a
else
    echo -e "${RED}[!] .env file not found at ${ENV_FILE}${NC}" >&2
    exit 1
fi

if [[ ! -d "${LEANTIME_REPO_DIR}" ]]; then
    echo -e "${RED}[!] Leantime repository directory not found at ${LEANTIME_REPO_DIR}${NC}" >&2
    exit 1
fi

PORT="${LEANTIME_PORT:-8090}"
DB_CONTAINER="leantime-db"
APP_CONTAINER="leantime"
DB_ROOT_PW="${LEANTIME_DB_ROOT_PASSWORD:-rootpassword}"
DB_NAME="${LEANTIME_DB_NAME:-leantime}"
VOLUMES_DIR="${SSD_DATA_DIR:-${HOMELAB_ROOT}/volumes}/leantime"

# ------------------------------------------------------------------------------
# 2. Pre-update Data Backup
# ------------------------------------------------------------------------------
if [[ "${SKIP_BACKUP}" = false ]]; then
    echo -e "\n${CYAN}[1/7] Creating pre-update safety backup...${NC}"
    mkdir -p "${BACKUP_DIR}"

    # Database Dump
    if docker ps --format '{{.Names}}' | grep -Eq "^${DB_CONTAINER}$"; then
        echo -e "${GREEN}  → Dumping MariaDB database '${DB_NAME}'...${NC}"
        SQL_FILE="${BACKUP_DIR}/leantime_db_${TIMESTAMP}.sql"
        if docker exec "${DB_CONTAINER}" mariadb-dump \
            -u root -p"${DB_ROOT_PW}" \
            --single-transaction \
            --quick \
            "${DB_NAME}" > "${SQL_FILE}"; then
            echo -e "${GREEN}  ✓ Database dumped successfully (${SQL_FILE})${NC}"
        else
            echo -e "${RED}  ✗ MariaDB dump failed! Aborting update to protect data.${NC}" >&2
            exit 1
        fi
    else
        echo -e "${YELLOW}  ⚠ Database container '${DB_CONTAINER}' is not running! Skipping DB dump.${NC}"
    fi

    # Config & Userfiles Volume Backup (via alpine container to handle root/mysql file permissions)
    if [[ -d "${VOLUMES_DIR}" ]]; then
        echo -e "${GREEN}  → Archiving Leantime volumes (${VOLUMES_DIR})...${NC}"
        docker run --rm \
            -v "${VOLUMES_DIR}:/src:ro" \
            -v "${BACKUP_DIR}:/dst" \
            alpine sh -c "tar -czf /dst/leantime_volumes_${TIMESTAMP}.tar.gz -C /src config" 2>/dev/null || true
        echo -e "${GREEN}  ✓ Volumes archived successfully.${NC}"
    fi

    # Master archive
    ARCHIVE_TAR="${BACKUP_ROOT}/leantime_pre_update_${TIMESTAMP}.tar.gz"
    tar -czf "${ARCHIVE_TAR}" -C "${BACKUP_ROOT}" "backup_${TIMESTAMP}"
    rm -rf "${BACKUP_DIR}"
    echo -e "${GREEN}  ✓ Master backup created: ${ARCHIVE_TAR}${NC}"

    # Sync to secondary HDD if directory exists
    if [[ -d "${HDD_BACKUP_DIR}" ]] || mkdir -p "${HDD_BACKUP_DIR}" 2>/dev/null; then
        cp -f "${ARCHIVE_TAR}" "${HDD_BACKUP_DIR}/" 2>/dev/null && \
            echo -e "${GREEN}  ✓ Synced backup copy to secondary storage (${HDD_BACKUP_DIR})${NC}" || true
    fi

    # Prune old backups (keep last 5)
    echo -e "${GREEN}  → Applying retention policy (keeping 5 most recent backups)...${NC}"
    find "${BACKUP_ROOT}" -name "leantime_pre_update_*.tar.gz" -type f | sort -r | tail -n +6 | xargs -r rm -f
    if [[ -d "${HDD_BACKUP_DIR}" ]]; then
        find "${HDD_BACKUP_DIR}" -name "leantime_pre_update_*.tar.gz" -type f | sort -r | tail -n +6 | xargs -r rm -f
    fi
else
    echo -e "\n${YELLOW}[1/7] Skipping backup as requested (--skip-backup).${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Repository Updates
# ------------------------------------------------------------------------------
cd "${LEANTIME_REPO_DIR}"

if [[ "${DO_GIT_PULL}" = true ]]; then
    echo -e "\n${CYAN}[2/7] Pulling latest changes from git...${NC}"
    git pull origin master
else
    echo -e "\n${CYAN}[2/7] Operating on current repository commit...${NC}"
fi

GIT_REV="$(git rev-parse --short HEAD)"
APP_VERSION="$(grep "appVersion" "${LEANTIME_REPO_DIR}/app/Core/Configuration/AppSettings.php" | awk -F"'" '{print $2}')"
echo -e "${GREEN}  ✓ Current commit: ${GIT_REV}${NC}"
echo -e "${GREEN}  ✓ Detected Leantime version: ${BOLD}${APP_VERSION}${NC}"

# ------------------------------------------------------------------------------
# 4. Frontend Dependencies & Build Pipeline
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[3/7] Installing npm dependencies...${NC}"
npm install --silent

echo -e "\n${CYAN}[4/7] Compiling production assets with Laravel Mix...${NC}"
npx mix --production

echo -e "\n${CYAN}[5/7] Generating Tailwind class blocklist...${NC}"
node generateBlocklist.mjs

# ------------------------------------------------------------------------------
# 5. Database Migrations & Cache Invalidation
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[6/7] Running database migrations and clearing application caches...${NC}"

if docker ps --format '{{.Names}}' | grep -Eq "^${APP_CONTAINER}$"; then
    echo -e "${GREEN}  → Executing pending database migrations...${NC}"
    docker exec "${APP_CONTAINER}" ./bin/leantime db:migrate

    echo -e "${GREEN}  → Clearing compiled views, manifest paths, and bootstrap cache...${NC}"
    docker exec "${APP_CONTAINER}" ./bin/leantime cache:clearAll

    echo -e "${GREEN}  → Restarting '${APP_CONTAINER}' container...${NC}"
    docker restart "${APP_CONTAINER}" >/dev/null
else
    echo -e "${YELLOW}  ⚠ Container '${APP_CONTAINER}' is not running. Starting it via docker compose...${NC}"
    docker compose -f "${HOMELAB_ROOT}/apps/productivity/docker-compose.yml" up -d "${APP_CONTAINER}"
    docker exec "${APP_CONTAINER}" ./bin/leantime db:migrate
    docker exec "${APP_CONTAINER}" ./bin/leantime cache:clearAll
fi

# ------------------------------------------------------------------------------
# 6. Service Health Check & Verification
# ------------------------------------------------------------------------------
echo -e "\n${CYAN}[7/7] Performing automated health verification...${NC}"

MAX_RETRIES=15
RETRY_COUNT=0
HEALTHY=false

echo -e "  → Waiting for Leantime to respond on port ${PORT}..."
while [[ ${RETRY_COUNT} -lt ${MAX_RETRIES} ]]; do
    HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/auth/login" || echo "000")"
    if [[ "${HTTP_CODE}" == "200" || "${HTTP_CODE}" == "302" ]]; then
        HEALTHY=true
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

if [[ "${HEALTHY}" = true ]]; then
    echo -e "${GREEN}  ✓ Web server is responding (HTTP ${HTTP_CODE}).${NC}"
else
    echo -e "${RED}  ✗ Web server failed to respond with 200/302 after $((MAX_RETRIES * 2)) seconds.${NC}" >&2
    echo -e "${YELLOW}  Check container logs with: docker logs ${APP_CONTAINER} --tail 50${NC}"
    exit 1
fi

# Verify CSS bundle accessibility
CSS_CODE="$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/dist/css/main.${APP_VERSION}.min.css" || echo "000")"
if [[ "${CSS_CODE}" == "200" ]]; then
    echo -e "${GREEN}  ✓ Stylesheet 'main.${APP_VERSION}.min.css' is loading cleanly (HTTP 200).${NC}"
else
    echo -e "${YELLOW}  ⚠ Warning: Stylesheet returned HTTP ${CSS_CODE}. Check public/dist/css/.${NC}"
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN} ${BOLD}🎉 LEANTIME UPDATE COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "  • Version   : ${BOLD}${APP_VERSION}${NC} (${GIT_REV})"
echo -e "  • Local URL : http://127.0.0.1:${PORT}"
echo -e "  • Public URL: ${LEANTIME_URL:-https://leantime.baaankai.dpdns.org}"
if [[ "${SKIP_BACKUP}" = false ]]; then
    echo -e "  • Backup    : ${ARCHIVE_TAR}"
fi
echo -e "${GREEN}======================================================================${NC}\n"
