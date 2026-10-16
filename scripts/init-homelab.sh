#!/usr/bin/env bash
# ==============================================================================
# 🚀 Homelab Initialization & Environment Setup Script
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN} 🚀 HOMELAB SYSTEM INITIALIZATION & ENVIRONMENT SETUP ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo -e "[+] Homelab Root: ${ROOT_DIR}"

# 1. User & Docker Group Setup
TARGET_USER="${SUDO_USER:-$USER}"
if command -v usermod &>/dev/null && [ -n "${TARGET_USER}" ]; then
    if ! id -nG "${TARGET_USER}" 2>/dev/null | grep -qw "docker"; then
        echo -e "${YELLOW}[+] Adding user '${TARGET_USER}' to 'docker' group...${NC}"
        usermod -aG docker "${TARGET_USER}" || true
        echo -e "${GREEN}[✓] User '${TARGET_USER}' added to docker group. (Run 'newgrp docker' to use without sudo).${NC}"
    fi
fi

if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}[!] Cannot connect to Docker daemon.${NC}"
    echo -e "${YELLOW}[!] If you were just added to the docker group, run: 'newgrp docker' or log in again.${NC}"
    echo -e "${YELLOW}[!] Or run with sudo: sudo ./scripts/init-homelab.sh${NC}"
    exit 1
fi

# 2. External Docker Network
NETWORK_NAME="homelab"
if ! docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo -e "${GREEN}[+] Creating external Docker network: ${NETWORK_NAME}${NC}"
    docker network create "${NETWORK_NAME}"
else
    echo -e "${GREEN}[✓] External Docker network '${NETWORK_NAME}' active.${NC}"
fi

# 3. Environment File (.env) Verification & Auto-Recovery
ENV_FILE="${ROOT_DIR}/.env"
if [ ! -f "${ENV_FILE}" ]; then
    LATEST_BACKUP=$(find "${ROOT_DIR}/backups" -name "homelab_backup_*.tar.gz" 2>/dev/null | sort -r | head -n 1 || true)
    if [ -n "${LATEST_BACKUP}" ] && [ -f "${LATEST_BACKUP}" ]; then
        echo -e "${YELLOW}[+] .env missing, recovering from backup: ${LATEST_BACKUP}${NC}"
        tar -xzf "${LATEST_BACKUP}" --wildcards "*ssd_homelab_configs.tar.gz" --to-stdout | tar -xzf - .env --to-stdout > "${ENV_FILE}" || true
    fi

    if [ ! -f "${ENV_FILE}" ] || [ ! -s "${ENV_FILE}" ]; then
        echo -e "${YELLOW}[+] Copying .env.example to .env...${NC}"
        cp "${ROOT_DIR}/.env.example" "${ENV_FILE}"
    else
        echo -e "${GREEN}[✓] Successfully restored .env from backup archive!${NC}"
    fi
else
    echo -e "${GREEN}[✓] Local .env file exists.${NC}"
fi

if [ -n "${SUDO_USER:-}" ]; then
    chown "${SUDO_USER}:${SUDO_USER}" "${ENV_FILE}" 2>/dev/null || true
fi

# 4. Source Environment Variables
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

# 5. Stop Disabled Containers (Data Preserved)
echo -e "\n${CYAN}[+] Checking for disabled services to terminate (data preserved)...${NC}"
declare -A SERVICE_FLAGS=(
    ["forgejo"]="${ENABLE_FORGEJO:-false}"
    ["ntfy"]="${ENABLE_NTFY:-false}"
    ["scrutiny"]="${ENABLE_SCRUTINY:-false}"
    ["maybe"]="${ENABLE_MAYBE:-false}"
    ["maybe-db"]="${ENABLE_MAYBE:-false}"
    ["maybe-redis"]="${ENABLE_MAYBE:-false}"
    ["uptime-kuma"]="${ENABLE_UPTIME_KUMA:-false}"
    ["dashy"]="${ENABLE_DASHY:-false}"
    ["changedetection"]="${ENABLE_CHANGEDETECTION:-false}"
    ["leantime-telegram"]="${ENABLE_LEANTIME_DEV:-false}"
    ["prometheus"]="${ENABLE_PROMETHEUS:-false}"
    ["grafana"]="${ENABLE_GRAFANA:-false}"
    ["node-exporter"]="${ENABLE_NODE_EXPORTER:-false}"
    ["cadvisor"]="${ENABLE_CADVISOR:-false}"
)

for svc in "${!SERVICE_FLAGS[@]}"; do
    if [ "${SERVICE_FLAGS[$svc]}" = "false" ]; then
        if docker ps -a --format '{{.Names}}' | grep -qw "^${svc}$"; then
            echo -e "${YELLOW}[-] Stopping inactive container: ${svc}${NC}"
            docker stop "${svc}" >/dev/null 2>&1 || true
            docker rm -f "${svc}" >/dev/null 2>&1 || true
        fi
    fi
done

# 6. Ensure Essential Storage Directories
echo -e "\n${GREEN}[+] Ensuring active volume directories exist...${NC}"
mkdir -p "${ROOT_DIR}/volumes"
HDD_BASE="${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}"

[ "${ENABLE_LEANTIME:-false}" = "true" ] && mkdir -p "${ROOT_DIR}/volumes/leantime/config" "${ROOT_DIR}/volumes/leantime/mysql"
[ "${ENABLE_IT_TOOLS:-false}" = "true" ] && mkdir -p "${ROOT_DIR}/volumes/it-tools"
[ "${ENABLE_N8N:-false}" = "true" ] && mkdir -p "${ROOT_DIR}/volumes/n8n"
[ "${ENABLE_JELLYFIN:-false}" = "true" ] && mkdir -p "${HDD_BASE}/docker/volumes/jellyfin/config" "${HDD_BASE}/docker/volumes/jellyfin/cache"
[ "${ENABLE_PORTAINER:-false}" = "true" ] && mkdir -p "${HDD_BASE}/docker/volumes/portainer"

# Fix host volume ownership safely (excluding database folders like leantime/mysql which require mysql uid 999)
if [ -n "${SUDO_USER:-}" ]; then
    find "${ROOT_DIR}/volumes" -mindepth 1 ! -path "${ROOT_DIR}/volumes/leantime/mysql*" -exec chown "${SUDO_USER}:${SUDO_USER}" {} + 2>/dev/null || true
fi

# 7. Launch Dynamic Deployer
echo -e "\n${CYAN}[+] Launching Master Orchestrator (scripts/deploy.sh)...${NC}"
bash "${SCRIPT_DIR}/deploy.sh"
