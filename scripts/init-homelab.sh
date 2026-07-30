#!/usr/bin/env bash
# ==============================================================================
# Homelab Initialization & Environment Setup Script
# Author: DevOps Automated Assistant
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "[+] Initializing Homelab Setup at: ${ROOT_DIR}"

# 1. Ensure external docker network exists
NETWORK_NAME="homelab"
if ! docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo "[+] Creating external Docker network: ${NETWORK_NAME}"
    docker network create "${NETWORK_NAME}"
else
    echo "[✓] External Docker network '${NETWORK_NAME}' already exists."
fi

# 2. Check for .env file
if [ ! -f "${ROOT_DIR}/.env" ]; then
    echo "[+] Copying .env.example to .env..."
    cp "${ROOT_DIR}/.env.example" "${ROOT_DIR}/.env"
    echo "[!] Created .env file. Please edit .env to customize passwords and paths if needed."
else
    echo "[✓] Local .env file exists."
fi

# 3. Ensure essential volume directories exist
echo "[+] Checking volume directories..."
mkdir -p "${ROOT_DIR}/volumes"

# 4. Trigger Master Category Deployer
echo "[+] Launching Master Orchestrator (scripts/deploy.sh)..."
bash "${SCRIPT_DIR}/deploy.sh"
