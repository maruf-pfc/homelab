<p align="center">
  <img src="assets/homelab_cover.png" alt="My DevOps Homelab Banner" width="100%" />
</p>

# Personal Homelab Architecture & Infrastructure

[![Docker Compose](https://img.shields.io/badge/Docker--Compose-v2.20%2B-blue?logo=docker)](https://docs.docker.com/compose/)
[![Proxy](https://img.shields.io/badge/Nginx%20Proxy%20Manager-Live-brightgreen?logo=nginx)](https://nginxproxymanager.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Proxied-orange?logo=cloudflare)](https://cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Production-grade, modular, self-hosted homelab infrastructure setup optimized for dual-storage (SSD/HDD) performance, automated monitoring, secure reverse proxy management with Cloudflare, and containerized orchestration.

## 📌 Infrastructure Highlights

- **⚡ Dual Storage Tiering**:
  - **SSD (`/home/maruf/homelab`)**: Fast storage hosting compose files, database engine files, container configs, and low-latency application state.
  - **HDD (`/home/maruf/MyHDDStorage`)**: High-capacity storage hosting bulk media libraries (Jellyfin: Movies, Music, Photos, TV), raw monitoring retention data, and system backups.
- **🛡️ Security & Zero Trust Preparedness**: Strict `.gitignore` rules preventing accidental commit of environment variables, private keys, database dumps, and SSL certificates.
- **🌐 Network & Cloudflare Integration**: All services run on a unified isolated bridge network (`homelab`) routed via Nginx Proxy Manager / Cloudflare Tunnels for secure HTTPS exposure.
- **📊 Comprehensive Monitoring**: Full metrics pipeline with Prometheus, Grafana, Node-Exporter, and cAdvisor.
- **🏠 CasaOS Coexistence**: Designed to run seamlessly alongside CasaOS host services without port or path collisions.

## 🧰 Applications & Services Catalog

All active services deployed within this repository:

| Service | Category | Port | Storage Tier | Volume Location | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Nginx Proxy Manager** | Core / Proxy | `80`, `443`, `8081` | SSD / HDD | `${HDD_DATA_DIR}/docker/volumes/nginx-proxy-manager` | Reverse proxy and SSL certificate management |
| **Portainer** | Core / Mgmt | `9000`, `9443` | SSD / HDD | `${HDD_DATA_DIR}/docker/volumes/portainer` | Container lifecycle & Docker stack management |
| **Uptime Kuma** | Core / Status | `3001` | SSD / HDD | `${HDD_DATA_DIR}/docker/volumes/uptime-kuma` | Real-time monitoring & status pages |
| **Homarr** | Dashboard | `7575` | SSD / HDD | `${HDD_DATA_DIR}/docker/volumes/homarr/appdata` | Dynamic homelab dashboard and application hub |
| **IT-Tools** | Utilities | `8091` | Stateless | N/A | Handy developer & sysadmin utilities web app |
| **Leantime** | Management | `8090` | SSD | `${SSD_DATA_DIR}/leantime/config` | Lean project management platform |
| **Leantime MariaDB** | Database | Internal (`3306`) | SSD | `${SSD_DATA_DIR}/leantime/mysql` | Database backend for Leantime |
| **Jellyfin** | Media | `8096` | SSD + HDD | Config: `${SSD_DATA_DIR}/jellyfin`<br>Media: `/home/maruf/MyHDDStorage/Jellyfin` | Self-hosted media streaming server |
| **Prometheus** | Monitoring | `9093` | SSD + HDD | Config: `./apps/monitoring/prometheus`<br>Data: `${HDD_DATA_DIR}/monitoring/prometheus` | Time-series metrics collection database |
| **Grafana** | Monitoring | `3005` | SSD | `${SSD_DATA_DIR}/grafana` | Metrics visualization & dashboards |
| **Node Exporter** | Monitoring | `9100` | Host | `/:/host:ro` | Host system hardware & OS metric exporter |
| **cAdvisor** | Monitoring | `8083` | Host | `/var/lib/docker:ro` | Container resource usage & performance metrics |

## 📂 Repository Structure

```
/home/maruf/homelab/
├── .env.example                  # Environment configuration template
├── .gitignore                     # Git safety & secret exclusion rules
├── README.md                      # Primary documentation & service table
├── ARCHITECTURE.md                # Network, storage, & security architecture
├── DEPLOYMENT.md                  # Deployment, upgrade, & backup runbook
├── SECURITY.md                    # Security best practices & hardening guide
├── docker-compose.yml             # Master Docker Compose file (utilizes 'include')
├── apps/                          # Modular application stacks
│   ├── core/                      # Core infrastructure (NPM, Portainer, Uptime Kuma)
│   │   └── docker-compose.yml
│   ├── dashboard/                 # User dashboard & tools (Homarr, IT-Tools)
│   │   └── docker-compose.yml
│   ├── management/                # Project management (Leantime + MariaDB)
│   │   └── docker-compose.yml
│   ├── media/                     # Media streaming (Jellyfin + HDD mount)
│   │   └── docker-compose.yml
│   └── monitoring/                # Observability (Prometheus, Grafana, Node-Exporter, cAdvisor)
│       ├── docker-compose.yml
│       └── prometheus/
│           └── prometheus.yml
├── scripts/                       # Infrastructure automation scripts
│   ├── init-homelab.sh            # Setup network, directories, and .env
│   └── remove-filebrowser.sh      # Legacy service removal script
└── volumes/                       # Local SSD persistent volume mount targets
    └── .gitkeep
```

## ⚡ Quick Start

### 1. Prerequisites
- Docker Engine `24.0+` and Docker Compose `v2.20+`
- Existing Docker network `homelab` (or created via initialization script)

### 2. Initialization
Run the initialization script to prepare environment configuration and Docker networks:
```bash
./scripts/init-homelab.sh
```

### 3. Environment Configuration
Copy `.env.example` to `.env` (if not auto-created) and adjust secrets/paths:
```bash
cp .env.example .env
nano .env
```

### 4. Validate Configuration
Ensure all modular compose files are valid:
```bash
docker compose config
```

### 5. Deploy Stacks

Deploy everything at once via the master compose file:
```bash
docker compose up -d
```

Or deploy individual stacks independently:
```bash
docker compose -f apps/core/docker-compose.yml up -d
docker compose -f apps/dashboard/docker-compose.yml up -d
docker compose -f apps/management/docker-compose.yml up -d
docker compose -f apps/media/docker-compose.yml up -d
docker compose -f apps/monitoring/docker-compose.yml up -d
```

## 🌐 Cloudflare & Reverse Proxy Integration

All web applications are connected via the `homelab` Docker network.

1. **Nginx Proxy Manager / Cloudflare Tunnels**: Point your domain/subdomain DNS records through Cloudflare.
2. **Container Routing**: In Nginx Proxy Manager or Cloudflare Tunnel configuration, route traffic directly using container names (e.g. `http://jellyfin:8096`, `http://homarr:7575`, `http://grafana:3000`).
3. **SSL Certificates**: TLS termination is handled at Cloudflare / Nginx Proxy Manager with automatic HTTP->HTTPS redirection.

## 🏠 CasaOS Coexistence

If running alongside CasaOS:
- CasaOS web UI runs on port `80` or custom port.
- This homelab repository uses explicit host port mappings (`8081` for NPM admin, `7575` for Homarr, `8090` for Leantime, etc.) to prevent port conflicts with CasaOS host applications.
- Docker containers deployed via CasaOS UI can easily join the `homelab` external network.

## 🤝 Maintenance & Support

- **Check Service Status**: `docker compose ps`
- **View Container Logs**: `docker compose logs -f [service_name]`
- **Stop All Services**: `docker compose down`

For detailed operational procedures, backup strategies, and recovery steps, see [DEPLOYMENT.md](DEPLOYMENT.md).
