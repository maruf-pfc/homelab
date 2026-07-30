#!/usr/bin/env bash
# ==============================================================================
# 🚀 Ultimate Bash Terminal Setup Script
# Automatically configures:
#   1. Oh My Posh (Prompt engine + slim.omp.json theme)
#   2. Nerd Fonts (FiraCode & MesloLGS NF for terminal icons)
#   3. ble.sh (Real-time history auto-suggestions & syntax highlighting)
#   4. .bashrc & VS Code / Antigravity IDE font settings
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN} 🚀 STARTING AUTOMATED BASH TERMINAL ENHANCEMENT SETUP ${NC}"
echo -e "${CYAN}======================================================================${NC}"

# ------------------------------------------------------------------------------
# 1. Install Oh My Posh & Download Themes
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/4] Installing Oh My Posh and downloading themes...${NC}"

if ! command -v oh-my-posh &> /dev/null; then
    mkdir -p "$HOME/bin"
    curl -shttps://ohmyposh.dev/install.sh | bash -s -- -d "$HOME/bin"
    export PATH="$HOME/bin:$PATH"
fi

mkdir -p "$HOME/.poshthemes"
if command -v wget &> /dev/null && command -v unzip &> /dev/null; then
    wget -q https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/themes.zip -O "$HOME/.poshthemes/themes.zip"
    unzip -o -q "$HOME/.poshthemes/themes.zip" -d "$HOME/.poshthemes"
    rm -f "$HOME/.poshthemes/themes.zip"
else
    curl -sSL https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/slim.omp.json -o "$HOME/.poshthemes/slim.omp.json"
fi

echo -e "${GREEN}[✓] Oh My Posh & Themes installed successfully.${NC}"

# ------------------------------------------------------------------------------
# 2. Install Nerd Fonts (FiraCode & MesloLGS NF)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/4] Installing Nerd Fonts (FiraCode & MesloLGS NF) for icons...${NC}"

FONT_DIR="$HOME/.local/share/fonts"
mkdir -p "$FONT_DIR"

# Download FiraCode Nerd Font if missing
if [ ! -f "$FONT_DIR/FiraCodeNerdFont-Regular.ttf" ]; then
    curl -sSL "https://github.com/ryanoasis/nerd-fonts/raw/main/patched-fonts/FiraCode/Regular/FiraCodeNerdFont-Regular.ttf" -o "$FONT_DIR/FiraCodeNerdFont-Regular.ttf"
fi

# Download MesloLGS NF fonts if missing
for font in "Regular" "Bold" "Italic" "Bold%20Italic"; do
    target_name=$(echo "MesloLGS NF ${font}.ttf" | sed 's/%20/ /g')
    if [ ! -f "$FONT_DIR/$target_name" ]; then
        curl -sSL "https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20${font}.ttf" -o "$FONT_DIR/$target_name" || true
    fi
done

if command -v fc-cache &> /dev/null; then
    fc-cache -fv "$FONT_DIR" &> /dev/null || true
fi

echo -e "${GREEN}[✓] Nerd Fonts installed and font cache refreshed.${NC}"

# ------------------------------------------------------------------------------
# 3. Install ble.sh (Bash Line Editor for Auto-Suggestions)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/4] Installing ble.sh for real-time history auto-suggestions...${NC}"

BLE_DIR="$HOME/.local/share/ble.sh"
mkdir -p "$BLE_DIR"

if [ ! -f "$BLE_DIR/ble.sh" ]; then
    TMP_DIR=$(mktemp -d)
    curl -L https://github.com/akinomyoga/ble.sh/releases/download/nightly/ble-nightly.tar.xz | tar xJf - -C "$TMP_DIR"
    cp -rf "$TMP_DIR"/ble-nightly/* "$BLE_DIR/"
    rm -rf "$TMP_DIR"
fi

echo -e "${GREEN}[✓] ble.sh installed successfully.${NC}"

# ------------------------------------------------------------------------------
# 4. Configure .bashrc & IDE Settings
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/4] Updating .bashrc and IDE terminal font settings...${NC}"

BASHRC="$HOME/.bashrc"

# Ensure ble.sh top hook exists
if ! grep -q "ble.sh/ble.sh" "$BASHRC"; then
    sed -i '1s|^|[[ $- == *i* ]] && source ~/.local/share/ble.sh/ble.sh --noattach\n|' "$BASHRC"
fi

# Ensure Oh My Posh initialization exists
if ! grep -q "oh-my-posh init bash" "$BASHRC"; then
    echo '' >> "$BASHRC"
    echo '# Oh My Posh Prompt Initialization' >> "$BASHRC"
    echo 'eval "$(oh-my-posh init bash --config ~/.poshthemes/slim.omp.json)"' >> "$BASHRC"
fi

# Ensure ble-attach exists at the bottom of .bashrc
if ! grep -q "ble-attach" "$BASHRC"; then
    echo '' >> "$BASHRC"
    echo '# Enable ble.sh (real-time history auto-suggestions & syntax highlighting)' >> "$BASHRC"
    echo '[[ ${BLE_VERSION-} ]] && ble-attach' >> "$BASHRC"
fi

# Update VS Code / Antigravity IDE settings.json if present
for settings_file in "$HOME/.config/Antigravity IDE/User/settings.json" "$HOME/.config/Code/User/settings.json" "$HOME/.config/Cursor/User/settings.json"; do
    if [ -f "$settings_file" ]; then
        if ! grep -q "terminal.integrated.fontFamily" "$settings_file"; then
            sed -i 's/}/,\n    "terminal.integrated.fontFamily": "FiraCode Nerd Font"\n}/' "$settings_file" || true
        fi
    fi
done

echo -e "\n${CYAN}======================================================================${NC}"
echo -e "${GREEN} 🎉 ALL TERMINAL ENHANCEMENTS INSTALLED & CONFIGURED! ${NC}"
echo -e "${CYAN}======================================================================${NC}"
echo -e "To apply changes immediately in your current terminal session, run:"
echo -e "${YELLOW}  exec bash${NC}"
echo -e "Or open a new terminal tab!"
echo -e "${CYAN}======================================================================${NC}"
