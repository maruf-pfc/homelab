#!/bin/bash
# ==============================================================================
# Script Name  : Safe Automated Storage Cleanup
# Target OS    : Pop!_OS / Ubuntu / Debian-based systems
# File Location: /usr/local/bin/auto-cleanup.sh
# Permissions  : 700 (Root only)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. COLOR CODES & FORMATTING
# ------------------------------------------------------------------------------
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    BOLD='\033[1m'
    RESET='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' RESET=''
fi

# ------------------------------------------------------------------------------
# 2. LOGGING SETUP & TRY/CATCH ERROR HANDLER
# ------------------------------------------------------------------------------
LOG_FILE="/var/log/auto-cleanup.log"
exec > >(tee -a "${LOG_FILE}") 2>&1

try() {
    local task_name="$1"
    shift
    echo -e "${CYAN}--> Executing:${RESET} ${task_name}..."
    
    "$@"
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✔ Successfully completed:${RESET} ${task_name}"
    else
        echo -e "${RED}✖ [Warning] Task failed with exit code ${exit_code}:${RESET} ${task_name} (Skipping safely...)"
    fi
    return 0
}

trap 'echo -e "${RED}\n[CRITICAL ERROR] Script interrupted. Exiting safely.${RESET}"; exit 1' ERR INT TERM

# ------------------------------------------------------------------------------
# 3. INITIALIZATION & SAFETY CHECKS
# ------------------------------------------------------------------------------
echo -e "${BOLD}${BLUE}=================================================="${RESET}
echo -e "${BOLD}${BLUE}   Pop!_OS Safe System Storage Cleanup Task       "${RESET}
echo -e "${CYAN}   Started at: $(date)"${RESET}
echo -e "${BOLD}${BLUE}=================================================="${RESET}

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] This script must be executed with root privileges (sudo).${RESET}"
  exit 1
fi

get_free_space() {
    df -h / | awk 'NR==2 {print $4}'
}

BEFORE_SPACE=$(get_free_space)
echo -e "${YELLOW}${BOLD}Free space before cleanup:${RESET} ${BEFORE_SPACE}"
echo -e "${BLUE}--------------------------------------------------"${RESET}

# ------------------------------------------------------------------------------
# SECTION 1: SYSTEM & PACKAGE MANAGEMENT CLEANUP
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${YELLOW}[1/5] Cleaning System & Package Manager Caches...${RESET}"

try "APT Clean (Removing stored installer archives)" apt-get clean -y
try "APT Autoremove (Removing unneeded orphan packages)" apt-get autoremove --purge -y
try "Vacuuming Systemd Journal Logs (>3 days)" journalctl --vacuum-time=3d
try "Clearing Crash Reports & Rotated Logs" bash -c 'rm -rf /var/crash/* /var/log/*.gz /var/log/*.[0-9] 2>/dev/null || true'

# ------------------------------------------------------------------------------
# SECTION 2: FLATPAK & SNAP CLEANUP
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${YELLOW}[2/5] Cleaning Flatpak & Snap Dependencies...${RESET}"

if command -v flatpak &> /dev/null; then
    try "Uninstalling Unused Flatpak Runtimes" flatpak uninstall --unused -y
    try "Clearing Flatpak Build Temp Dir" bash -c 'rm -rf /var/tmp/flatpak-cache-* 2>/dev/null || true'
fi

if command -v snap &> /dev/null; then
    try "Removing Disabled Snap Revisions" bash -c 'snap list --all 2>/dev/null | awk "/disabled/{print \$1, \$3}" | while read snapname revision; do snap remove "$snapname" --revision "$revision" 2>/dev/null || true; done'
fi

# ------------------------------------------------------------------------------
# SECTION 3: DOCKER CLEANUP
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${YELLOW}[3/5] Cleaning Docker Engine Assets...${RESET}"

if command -v docker &> /dev/null && systemctl is-active --quiet docker; then
    try "Pruning Dangling Docker Containers & Images" docker image prune -f
fi

# ------------------------------------------------------------------------------
# SECTION 4: USER-LEVEL DEVELOPER & APPLICATION CACHES
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${YELLOW}[4/5] Cleaning User-Level Caches & Tooling...${RESET}"

# Explicitly target primary user directory
user="maruf"
user_dir="/home/maruf"

if [ -d "$user_dir" ]; then
    echo -e "${CYAN}--> Processing User:${RESET} ${BOLD}${user}${RESET} (${user_dir})"

    # Helper function that loads user PATHs (NVM, Bun, Cargo, etc.) before running commands
    run_dev_cmd() {
        local tool="$1"
        local action_cmd="$2"

        try "$tool cache clean" sudo -u "$user" bash -c "
            export NVM_DIR=\"$user_dir/.nvm\"
            [ -s \"\$NVM_DIR/nvm.sh\" ] && \. \"\$NVM_DIR/nvm.sh\"
            export PATH=\"$user_dir/.bun/bin:$user_dir/.cargo/bin:$user_dir/.local/bin:\$PATH\"
            
            if command -v $tool &>/dev/null; then
                $action_cmd
            fi
        "
    }

    # Run Developer Cache Purges
    run_dev_cmd "npm" "npm cache clean --force"
    run_dev_cmd "pnpm" "pnpm store prune"
    run_dev_cmd "yarn" "yarn cache clean"
    run_dev_cmd "bun" "bun pm cache rm"
    run_dev_cmd "pip" "pip cache purge"
    run_dev_cmd "uv" "uv cache clean"
    run_dev_cmd "go" "go clean -cache -modcache"

    # Rust / Cargo Registry Archives
    if [ -d "$user_dir/.cargo/registry/cache" ]; then
        try "Rust/Cargo Registry Cache Clean" bash -c "rm -rf '$user_dir/.cargo/registry/cache/'* 2>/dev/null || true"
    fi

    # IDE Temporary Rendering Caches
    try "VS Code Cache Clean" bash -c "rm -rf '$user_dir/.config/Code/Cache' '$user_dir/.config/Code/CachedData' 2>/dev/null || true"
    try "Cursor IDE Cache Clean" bash -c "rm -rf '$user_dir/.config/Cursor/Cache' '$user_dir/.config/Cursor/CachedData' 2>/dev/null || true"

    # Desktop Render & Flatpak App Caches
    try "Mesa Shader & Font Cache Clean" bash -c "rm -rf '$user_dir/.cache/thumbnails/'* '$user_dir/.cache/fontconfig/'* '$user_dir/.cache/mesa_shader_cache/'* 2>/dev/null || true"
    try "Flatpak Sandbox App Caches Clean" bash -c "rm -rf '$user_dir/.var/app/'*/cache/* 2>/dev/null || true"

    # Empty Desktop Trash Bin
    try "Emptying Desktop Trash Bin" bash -c "rm -rf '$user_dir/.local/share/Trash/'* 2>/dev/null || true"
fi

# ------------------------------------------------------------------------------
# SECTION 5: SYSTEM TEMP DIRECTORY PURGE
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${YELLOW}[5/5] Purging Stale /tmp Files (>7 days)...${RESET}"
try "Purging Old /tmp Data" bash -c 'find /tmp -type f -atime +7 -delete 2>/dev/null || true'

# ------------------------------------------------------------------------------
# SUMMARY & COMPLETION LOGS
# ------------------------------------------------------------------------------
AFTER_SPACE=$(get_free_space)

echo -e "\n${BLUE}--------------------------------------------------"${RESET}
echo -e "${GREEN}${BOLD}✔ System Storage Cleanup Completed Successfully!${RESET}"
echo -e "${CYAN}Finished at:${RESET} $(date)"
echo -e "${YELLOW}${BOLD}Free Space Before:${RESET} ${BEFORE_SPACE}  |  ${GREEN}${BOLD}Free Space Now:${RESET} ${AFTER_SPACE}"
echo -e "${BOLD}${BLUE}=================================================="${RESET}
