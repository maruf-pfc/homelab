<p align="center">
  <img src="assets/homelab_cover.png" alt="My DevOps Homelab Banner" width="100%" />
</p>

# Personal Homelab Architecture & Infrastructure

[![Docker Compose](https://img.shields.io/badge/Docker--Compose-v2.20%2B-blue?logo=docker)](https://docs.docker.com/compose/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare-Tunnel-orange?logo=cloudflare)](https://cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Production-grade, category-wise modular, self-hosted homelab infrastructure setup optimized for dual-storage (SSD/HDD) performance, feature toggle orchestration, automated backups, secure ingress via Cloudflare Tunnels, and containerized orchestration across 12 application categories.

---

## 📌 Infrastructure Highlights

- **⚡ Dual Storage Tiering**:
  - **HDD Storage (`/home/maruf/MyHDDStorage`)**: High-capacity storage hosting bulk media libraries (`Jellyfin`), container management state (`Portainer`), status monitoring (`Uptime Kuma`), raw monitoring retention data, and system backups.
  - **SSD Storage (`/home/maruf/homelab/volumes`)**: Fast storage hosting database engines (`Leantime MariaDB`, `Maybe Postgres & Redis`), application configs (`Dashy`, `Grafana`), and low-latency services.
- **🎛️ Category-Wise Feature Toggle System**:
  - Master feature flags (`ENABLE_<SERVICE>=true/false`) in `.env` dictate runtime deployment across 12 distinct category compose files in `apps/`.
- **🌐 Network & Cloudflare Tunnel Integration**:
  - All services run on an isolated bridge network (`homelab`) routed securely via Cloudflare Tunnels (`cloudflared`) without opening host ports to the public internet.
- **📊 Comprehensive Monitoring & Observability**:
  - Unified metrics pipeline with Prometheus, Grafana, Node Exporter, and cAdvisor.
- **🛡️ Data Safety & Zero-Downtime Deployment**:
  - Clean pre-flight port collision checks, persistent volume mapping, and zero-downtime updates.

---

## 🧰 Active Services & Storage Allocation

| Service | Category | Host Port | Storage Tier | Volume Location | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Cloudflare Tunnel** | Category 4: Network | Outbound | Container | Host daemon | Zero Trust encrypted tunnel to Cloudflare |
| **Portainer** | Category 10: Sysadmin | `9000`, `9443` | **HDD** | `${HDD_DATA_DIR}/docker/volumes/portainer` | Container lifecycle & Docker stack management |
| **Uptime Kuma** | Category 10: Sysadmin | `3001` | **HDD** | `${HDD_DATA_DIR}/docker/volumes/uptime-kuma` | Real-time monitoring & status pages |
| **IT-Tools** | Category 10: Sysadmin | `8091` | **SSD** | Stateless | Developer & sysadmin utilities web app |
| **Dashy** | Category 3: Dashboards | `7575` | **SSD** | `${SSD_DATA_DIR}/dashy/conf.yml` | Feature-rich homelab dashboard |
| **Maybe Finance** | Category 2: Finance | `8092` | **SSD** | `${SSD_DATA_DIR}/maybe/storage` | Personal finance, net worth & investment tracker |
| **Maybe Postgres** | Category 2: Finance | Internal (`5432`) | **SSD** | `${SSD_DATA_DIR}/maybe/postgres` | PostgreSQL database backend for Maybe |
| **Leantime** | Category 8: Productivity | `8090` | **SSD** | `${SSD_DATA_DIR}/leantime/config` | Lean project management platform |
| **Leantime MariaDB** | Category 8: Productivity | Internal (`3306`) | **SSD** | `${SSD_DATA_DIR}/leantime/mysql` | Database backend for Leantime |
| **Jellyfin** | Category 1: Media | `8096` | **HDD** | Config: `${HDD_DATA_DIR}/docker/volumes/jellyfin/config`<br>Media: `${HDD_DATA_DIR}/Jellyfin` | Self-hosted media streaming server |
| **Prometheus** | Category 5: Monitoring | `9093` | **SSD + HDD** | Config: `./apps/monitoring/prometheus`<br>Data: `${HDD_DATA_DIR}/monitoring/prometheus` | Time-series metrics collection database |
| **Grafana** | Category 5: Monitoring | `3005` | **SSD** | `${SSD_DATA_DIR}/grafana` | Metrics visualization & dashboards |
| **Node Exporter** | Category 5: Monitoring | `9100` | Host | `/:/host:ro` | Host hardware & OS metric exporter |
| **cAdvisor** | Category 5: Monitoring | `8083` | Host | `/var/lib/docker:ro` | Container resource usage & performance metrics |

---

## 📂 Category-Wise Directory Layout (`apps/`)

```
/home/maruf/homelab/
├── .env.example                  # Environment configuration & feature toggle template
├── .env                          # Local active environment configuration
├── README.md                     # Primary architecture documentation & runbook
├── RECOMMENDED_TOOLS.md          # 12-Category mega-catalog of self-hosted tools
├── DEPLOYMENT.md                 # Operations & backup runbook
├── docker-compose.yml            # Master Docker Compose file (utilizes 'include')
├── apps/                         # 12 Category-Wise Application Stacks
│   ├── media/                    # Category 1: Media & Automation (Jellyfin, Sonarr, Radarr)
│   ├── finance/                  # Category 2: Finance & Wealth Management (Maybe, Actual)
│   ├── dashboards/               # Category 3: Dashboards & Portals (Dashy, Homepage, Glance)
│   ├── network/                  # Category 4: Network & Ingress (cloudflared, AdGuard)
│   ├── monitoring/               # Category 5: Observability (Prometheus, Grafana, Node Exporter, cAdvisor)
│   ├── storage/                  # Category 6: Storage & Cloud (Filebrowser, Syncthing, Mealie)
│   ├── security/                 # Category 7: Security & Auth (Vaultwarden, Authelia)
│   ├── productivity/             # Category 8: Productivity (Leantime + MariaDB, Stirling-PDF, Memos)
│   ├── automation/               # Category 9: Home Automation (Home Assistant, Node-RED)
│   ├── sysadmin/                 # Category 10: Sysadmin & DevOps (Portainer, Uptime Kuma, IT-Tools)
│   ├── ai/                       # Category 11: Local AI & LLM (Ollama, Open WebUI)
│   └── workflows/                # Category 12: Workflows & Low-Code (n8n, Activepieces)
├── scripts/                      # Infrastructure Automation Scripts
│   ├── init-homelab.sh           # Initialization & network check script
│   ├── deploy.sh                 # Master category deployer & port validator
│   ├── backup.sh                 # Automated database & volume backup script
│   └── restore.sh                # Backup restoration helper script
└── volumes/                      # Local SSD persistent volume mount targets
```

---

## ⚡ Quick Start & Deployment Runbook

### 1. Initialization
Run the initialization script to prepare Docker networks, volume directories, and `.env`:
```bash
./scripts/init-homelab.sh
```

### 2. Feature Toggle Configuration
Open `.env` and set `ENABLE_<SERVICE>=true` for any desired application in the 12 categories:
```bash
nano .env
```

### 3. Deploy Enabled Stacks
Execute the master category-wise deployer:
```bash
./scripts/deploy.sh
```

### 4. Automated Backup
Create a full automated snapshot of database dumps and persistent volumes:
```bash
./scripts/backup.sh
```
Backups are saved to `/home/maruf/MyHDDStorage/backups/homelab_backup_YYYYMMDD_HHMMSS.tar.gz` with an automatic 7-day retention prune.
