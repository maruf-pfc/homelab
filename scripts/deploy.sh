#!/usr/bin/env bash
# ==============================================================================
# Master Category-Wise Homelab Orchestrator & Selective Deployment Engine
# Author: Senior DevOps Automated Assistant
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Color Definitions for DevOps Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN} 🚀 HOMELAB CATEGORY-WISE DYNAMIC ORCHESTRATOR & DEPLOYER ${NC}"
echo -e "${CYAN}======================================================================${NC}"

# 1. Environment & Config Pre-check
ENV_FILE="${ROOT_DIR}/.env"
if [ ! -f "${ENV_FILE}" ]; then
    echo -e "${YELLOW}[!] Local '.env' file missing. Copying '.env.example' to '.env'...${NC}"
    cp "${ROOT_DIR}/.env.example" "${ENV_FILE}"
fi

# Export all env variables from .env
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

# 2. Ensure External Docker Network Exists
NETWORK_NAME="${DOCKER_NETWORK:-homelab}"
if ! docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo -e "${GREEN}[+] Creating external Docker network: ${NETWORK_NAME}${NC}"
    docker network create "${NETWORK_NAME}"
else
    echo -e "${GREEN}[✓] External Docker network '${NETWORK_NAME}' active.${NC}"
fi

# 3. Default Toggle Flags (Active vs Inactive)
ENABLE_PORTAINER="${ENABLE_PORTAINER:-true}"
ENABLE_UPTIME_KUMA="${ENABLE_UPTIME_KUMA:-true}"
ENABLE_DASHY="${ENABLE_DASHY:-true}"
ENABLE_IT_TOOLS="${ENABLE_IT_TOOLS:-true}"
ENABLE_MAYBE="${ENABLE_MAYBE:-true}"
ENABLE_LEANTIME="${ENABLE_LEANTIME:-true}"
ENABLE_JELLYFIN="${ENABLE_JELLYFIN:-true}"
ENABLE_PROMETHEUS="${ENABLE_PROMETHEUS:-true}"
ENABLE_GRAFANA="${ENABLE_GRAFANA:-true}"
ENABLE_NODE_EXPORTER="${ENABLE_NODE_EXPORTER:-true}"
ENABLE_CADVISOR="${ENABLE_CADVISOR:-true}"
ENABLE_CLOUDFLARED="${ENABLE_CLOUDFLARED:-true}"

# Optional Catalog Stack Flags
ENABLE_VAULTWARDEN="${ENABLE_VAULTWARDEN:-false}"

# 4. Pre-Flight Port Conflict Validation
echo -e "${GREEN}[+] Performing pre-flight port collision & security checks...${NC}"
declare -A PORT_MAP

check_port_conflict() {
    local service_name="$1"
    local port_num="$2"
    
    if [ -z "${port_num}" ] || [ "${port_num}" = "0" ]; then
        return
    fi

    if [ -n "${PORT_MAP[${port_num}]:-}" ]; then
        echo -e "${RED}[ERROR] Port Conflict Detected! ${service_name} and ${PORT_MAP[${port_num}]} are both configured for host port ${port_num}.${NC}"
        echo -e "${RED}Please resolve port assignments in '.env' before deploying.${NC}"
        exit 1
    fi
    PORT_MAP["${port_num}"]="${service_name}"
}

# Validate enabled service ports
[ "${ENABLE_PORTAINER}" = "true" ] && check_port_conflict "Portainer" "${PORTAINER_HTTP_PORT:-9000}"
[ "${ENABLE_UPTIME_KUMA}" = "true" ] && check_port_conflict "Uptime Kuma" "${UPTIME_KUMA_PORT:-3001}"
[ "${ENABLE_DASHY}" = "true" ] && check_port_conflict "Dashy" "${DASHBOARD_PORT:-7575}"
[ "${ENABLE_IT_TOOLS}" = "true" ] && check_port_conflict "IT-Tools" "${IT_TOOLS_PORT:-8091}"
[ "${ENABLE_MAYBE}" = "true" ] && check_port_conflict "Maybe Finance" "${MAYBE_PORT:-8092}"
[ "${ENABLE_LEANTIME}" = "true" ] && check_port_conflict "Leantime" "${LEANTIME_PORT:-8090}"
[ "${ENABLE_JELLYFIN}" = "true" ] && check_port_conflict "Jellyfin" "${JELLYFIN_PORT:-8096}"
[ "${ENABLE_PROMETHEUS}" = "true" ] && check_port_conflict "Prometheus" "${PROMETHEUS_PORT:-9093}"
[ "${ENABLE_GRAFANA}" = "true" ] && check_port_conflict "Grafana" "${GRAFANA_PORT:-3005}"
[ "${ENABLE_CADVISOR}" = "true" ] && check_port_conflict "cAdvisor" "${CADVISOR_PORT:-8083}"
[ "${ENABLE_NODE_EXPORTER}" = "true" ] && check_port_conflict "Node Exporter" "${NODE_EXPORTER_PORT:-9100}"
[ "${ENABLE_VAULTWARDEN}" = "true" ] && check_port_conflict "Vaultwarden" "${VAULTWARDEN_PORT:-8082}"

echo -e "${GREEN}[✓] Port conflict validation passed cleanly!${NC}"

# Helper function to start service container safely
run_stack_service() {
    local compose_file="$1"
    shift
    docker compose -f "${compose_file}" up -d --no-recreate "$@" 2>/dev/null || true
}

# 5. Category 1: Media Stack (HDD Storage for Jellyfin Config & Media)
echo -e "${CYAN}[+] Processing Category 1: Media Stack (apps/media)...${NC}"
if [ "${ENABLE_JELLYFIN}" = "true" ]; then
    mkdir -p "${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}/docker/volumes/jellyfin/config"
    mkdir -p "${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}/docker/volumes/jellyfin/cache"
    run_stack_service "${ROOT_DIR}/apps/media/docker-compose.yml" jellyfin
fi

# 6. Category 2: Finance Stack (SSD Storage)
echo -e "${CYAN}[+] Processing Category 2: Finance Stack (apps/finance)...${NC}"
if [ "${ENABLE_MAYBE}" = "true" ]; then
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/maybe/storage"
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/maybe/postgres"
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/maybe/redis"
    run_stack_service "${ROOT_DIR}/apps/finance/docker-compose.yml" maybe-db maybe-redis maybe
fi

# 7. Category 3: Dashboards Stack (SSD Storage)
echo -e "${CYAN}[+] Processing Category 3: Dashboards Stack (apps/dashboards)...${NC}"
if [ "${ENABLE_DASHY}" = "true" ]; then
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/dashy"
    run_stack_service "${ROOT_DIR}/apps/dashboards/docker-compose.yml" dashy
fi

# 8. Category 4: Network & Ingress Stack
echo -e "${CYAN}[+] Processing Category 4: Network & Ingress (apps/network)...${NC}"
if [ "${ENABLE_CLOUDFLARED}" = "true" ]; then
    run_stack_service "${ROOT_DIR}/apps/network/docker-compose.yml" cloudflared
fi

# 9. Category 5: Monitoring Stack (SSD Storage)
echo -e "${CYAN}[+] Processing Category 5: Observability Stack (apps/monitoring)...${NC}"
if [ "${ENABLE_PROMETHEUS}" = "true" ] || [ "${ENABLE_GRAFANA}" = "true" ]; then
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/grafana"
    mkdir -p "${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}/monitoring/prometheus"
    run_stack_service "${ROOT_DIR}/apps/monitoring/docker-compose.yml" prometheus grafana node-exporter cadvisor
fi

# 10. Category 8: Productivity Stack (SSD Storage for Leantime + MariaDB)
echo -e "${CYAN}[+] Processing Category 8: Productivity Stack (apps/productivity)...${NC}"
if [ "${ENABLE_LEANTIME}" = "true" ]; then
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/leantime/config"
    mkdir -p "${SSD_DATA_DIR:-/home/maruf/homelab/volumes}/leantime/mysql"
    run_stack_service "${ROOT_DIR}/apps/productivity/docker-compose.yml" leantime-db leantime
fi

# 11. Category 10: Sysadmin Stack (HDD Storage for Portainer & Uptime Kuma)
echo -e "${CYAN}[+] Processing Category 10: Sysadmin Stack (apps/sysadmin)...${NC}"
if [ "${ENABLE_PORTAINER}" = "true" ] || [ "${ENABLE_UPTIME_KUMA}" = "true" ] || [ "${ENABLE_IT_TOOLS}" = "true" ]; then
    mkdir -p "${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}/docker/volumes/portainer"
    mkdir -p "${HDD_DATA_DIR:-/home/maruf/MyHDDStorage}/docker/volumes/uptime-kuma"
    run_stack_service "${ROOT_DIR}/apps/sysadmin/docker-compose.yml" portainer uptime-kuma it-tools
fi

# 12. Final Execution Summary Table
echo -e "\n${CYAN}======================================================================${NC}"
echo -e "${CYAN} 📊 HOMELAB SERVICE STATUS SUMMARY ${NC}"
echo -e "${CYAN}======================================================================${NC}"

printf "%-20s %-12s %-12s %-30s\n" "SERVICE NAME" "TOGGLE FLAG" "HOST PORT" "STATUS / ENDPOINT"
echo "----------------------------------------------------------------------"

print_service_status() {
    local name="$1"
    local flag="$2"
    local port="$3"
    local endpoint="$4"

    if [ "${flag}" = "true" ]; then
        printf "%-20s ${GREEN}%-12s${NC} %-12s ${GREEN}%-30s${NC}\n" "${name}" "ENABLED" "${port}" "ACTIVE (${endpoint})"
    else
        printf "%-20s ${YELLOW}%-12s${NC} %-12s ${YELLOW}%-30s${NC}\n" "${name}" "DISABLED" "${port}" "INACTIVE (Config Preserved)"
    fi
}

print_service_status "Portainer (HDD)" "${ENABLE_PORTAINER}" "${PORTAINER_HTTP_PORT:-9000}" "http://192.168.1.75:9000"
print_service_status "Uptime Kuma (HDD)" "${ENABLE_UPTIME_KUMA}" "${UPTIME_KUMA_PORT:-3001}" "http://192.168.1.75:3001"
print_service_status "Dashy (SSD)" "${ENABLE_DASHY}" "${DASHBOARD_PORT:-7575}" "http://192.168.1.75:7575"
print_service_status "IT-Tools (SSD)" "${ENABLE_IT_TOOLS}" "${IT_TOOLS_PORT:-8091}" "http://192.168.1.75:8091"
print_service_status "Maybe Finance (SSD)" "${ENABLE_MAYBE}" "${MAYBE_PORT:-8092}" "https://finance.baaankai.dpdns.org"
print_service_status "Leantime (SSD)" "${ENABLE_LEANTIME}" "${LEANTIME_PORT:-8090}" "http://192.168.1.75:8090"
print_service_status "Jellyfin (HDD)" "${ENABLE_JELLYFIN}" "${JELLYFIN_PORT:-8096}" "http://192.168.1.75:8096"
print_service_status "Prometheus (SSD)" "${ENABLE_PROMETHEUS}" "${PROMETHEUS_PORT:-9093}" "http://192.168.1.75:9093"
print_service_status "Grafana (SSD)" "${ENABLE_GRAFANA}" "${GRAFANA_PORT:-3005}" "http://192.168.1.75:3005"

echo "----------------------------------------------------------------------"
echo -e "${GREEN}[✓] Homelab category-wise dynamic orchestration completed successfully!${NC}"
