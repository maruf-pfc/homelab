<p align="center">
  <img src="assets/homelab_cover.png" alt="My DevOps Homelab Banner" width="100%" />
</p>

# Personal Homelab Architecture & Infrastructure

[![Docker Compose](https://img.shields.io/badge/Docker--Compose-v2.20%2B-blue?logo=docker)](https://docs.docker.com/compose/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare-Tunnel-orange?logo=cloudflare)](https://cloudflare.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Backup](https://img.shields.io/badge/Backup-Nightly%203AM-green?logo=linux)](scripts/backup.sh)

Production-grade, category-wise modular, self-hosted homelab infrastructure optimized for dual-storage (SSD/HDD) performance, feature toggle orchestration, nightly automated backups, secure ingress via Cloudflare Tunnels, and containerized orchestration across 12 application categories.

---

## 📌 Infrastructure Highlights

- **⚡ Dual Storage Tiering**:
  - **HDD Storage (`/home/maruf/MyHDDStorage`)**: High-capacity storage for bulk media libraries (`Jellyfin`), container management state (`Portainer`), monitoring data retention, and backup archives.
  - **SSD Storage (`/home/maruf/homelab/volumes`)**: Fast NVMe storage for database engines (`Leantime MariaDB`, `Maybe Postgres & Redis`), application configs (`Dashy`, `Grafana`), and low-latency services.
- **🎛️ Category-Wise Feature Toggle System**:
  - Master feature flags (`ENABLE_<SERVICE>=true/false`) in `.env` control deployment across 12 distinct category compose files under `apps/`.
- **🌐 Cloudflare Zero Trust Ingress**:
  - All external traffic routes via outbound-only Cloudflare Tunnels (`cloudflared`) — no open inbound firewall ports. Tunnel token managed securely in `.env`.
- **📊 Comprehensive Monitoring**:
  - Full observability pipeline: Prometheus → Grafana, Node Exporter (host metrics), cAdvisor (container metrics).
- **🗄️ DB Healthchecks & Startup Ordering**:
  - All database-backed services (`leantime`, `maybe`) use `condition: service_healthy` to guarantee DB is ready before the app starts.
- **💾 Nightly Automated Backups**:
  - Cron job at **3:00 AM** runs `scripts/backup.sh` — creates a full tar snapshot of all volumes & DB dumps, mirrors to HDD, removes the previous backup, and logs the result.

---

## 🧰 Active Services & Storage Allocation

| Service | Category | Host Port | Storage | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Cloudflare Tunnel** | 4: Network | Outbound only | — | Zero Trust encrypted tunnel |
| **Portainer** | 10: Sysadmin | `9000`, `9443` | HDD | Docker stack & container management |
| **IT-Tools** | 10: Sysadmin | `8091` | Stateless | Developer & sysadmin utilities |
| **Dashy** | 3: Dashboards | `7575` | SSD | Homelab dashboard & service portal |
| **Maybe Finance** | 2: Finance | `8092` | SSD | Personal finance & net worth tracker |
| **Maybe Postgres** | 2: Finance | `5432` (internal) | SSD | PostgreSQL backend for Maybe |
| **Leantime** | 8: Productivity | `8090` | SSD | Lean project management platform |
| **Leantime MariaDB** | 8: Productivity | `3306` (internal) | SSD | MariaDB 11 backend for Leantime |
| **ChangeDetection** | 8: Productivity | `5001` | SSD | Website change monitoring |
| **Stirling PDF** | 8: Productivity | `8084` | Stateless | Self-hosted PDF toolbox |
| **Memos** | 8: Productivity | `5230` | SSD | Lightweight note-taking |
| **Vikunja** | 8: Productivity | `3456` | SSD | Open-source task manager |
| **Jellyfin** | 1: Media | `8096` | HDD | Self-hosted media streaming server |
| **Sonarr / Radarr / Lidarr** | 1: Media | `8989 / 7878 / 8686` | SSD + HDD | Arr media automation suite |
| **Prowlarr** | 1: Media | `9696` | SSD | Indexer manager for Arr suite |
| **qBittorrent** | 1: Media | `8087` | HDD | Torrent download client |
| **Navidrome** | 1: Media | `4533` | SSD + HDD | Music streaming server |
| **Prometheus** | 5: Monitoring | `9093` | SSD + HDD | Time-series metrics collector |
| **Grafana** | 5: Monitoring | `3005` | SSD | Metrics visualization & dashboards |
| **Node Exporter** | 5: Monitoring | `9100` (internal) | Host | Host hardware & OS metrics |
| **cAdvisor** | 5: Monitoring | `8083` | Host | Container resource usage metrics |

---

## 📂 Repository Layout

```
/home/maruf/homelab/
├── .env.example                  # Environment template — copy to .env & configure
├── .env                          # Active environment (gitignored — never commit)
├── .gitignore                    # Protects secrets, volumes, and backup archives
├── README.md                     # This file — architecture overview & quick start
├── DEPLOYMENT.md                 # Full ops runbook: deploy, update, troubleshoot
├── BACKUP_AND_RESTORE_GUIDE.md   # Backup & restore procedures, cron setup
├── SECURITY.md                   # Security best practices & hardening guide
├── RECOMMENDED_TOOLS.md          # 12-category self-hosted tools catalog
├── docker-compose.yml            # Master compose file (uses 'include' directive)
├── apps/                         # 12 Category-Wise Application Stacks
│   ├── media/                    # Category 1: Media (Jellyfin, Sonarr, Radarr…)
│   ├── finance/                  # Category 2: Finance (Maybe + Postgres + Redis)
│   ├── dashboards/               # Category 3: Dashboards (Dashy, Homepage, Glance)
│   ├── network/                  # Category 4: Network & Ingress (cloudflared)
│   ├── monitoring/               # Category 5: Observability (Prometheus, Grafana…)
│   ├── storage/                  # Category 6: Storage & Cloud (placeholder)
│   ├── security/                 # Category 7: Security & Auth (placeholder)
│   ├── productivity/             # Category 8: Productivity (Leantime, ChangeDetection…)
│   ├── automation/               # Category 9: Home Automation (placeholder)
│   ├── sysadmin/                 # Category 10: Sysadmin (Portainer, IT-Tools)
│   ├── ai/                       # Category 11: Local AI (placeholder)
│   └── workflows/                # Category 12: Workflows (placeholder)
├── scripts/
│   ├── init-homelab.sh           # First-run: creates Docker network & volume dirs
│   ├── deploy.sh                 # Category deployer with port collision validation
│   ├── backup.sh                 # Full snapshot backup + HDD mirror + retention
│   └── restore.sh                # Guided restore from backup archive
├── backups/                      # Local backup archives (gitignored)
│   └── README.md                 # Backup directory notes
└── volumes/                      # SSD persistent volume mount targets (gitignored)
```

---

## ⚡ Quick Start

### 1. Clone & Initialize
```bash
git clone https://github.com/maruf-pfc/homelab.git /home/maruf/homelab
cd /home/maruf/homelab
cp .env.example .env
nano .env           # Set passwords, paths, and feature toggles
./scripts/init-homelab.sh
```

### 2. Enable Services
In `.env`, set `ENABLE_<SERVICE>=true` for each service you want to run:
```bash
ENABLE_LEANTIME=true
ENABLE_MAYBE=true
ENABLE_CHANGEDETECTION=true
ENABLE_GRAFANA=true
```

### 3. Deploy
```bash
./scripts/deploy.sh
```

### 4. Verify
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 💾 Backup & Restore

Nightly automated backup runs at **3:00 AM** via cron:
```
0 3 * * * /home/maruf/homelab/scripts/backup.sh >> /home/maruf/homelab/backups/backup.log 2>&1
```

- **Snapshot**: Full tar archive of all volumes + DB dumps
- **Mirror**: Auto-copied to `/home/maruf/MyHDDStorage/backups/`
- **Retention**: Keeps only the **most recent** backup — older archives deleted automatically

Manual backup:
```bash
./scripts/backup.sh
```

See [BACKUP_AND_RESTORE_GUIDE.md](BACKUP_AND_RESTORE_GUIDE.md) for full restore procedures.

---

## 🔒 Security Model

- All secrets live in `.env` only — never committed to git (enforced by `.gitignore`)
- All default passwords have been **replaced with strong randomly-generated secrets**
- External traffic routed exclusively via Cloudflare Zero Trust Tunnels — no exposed host ports
- DB containers use **healthchecks** (`mariadb-admin ping`, `pg_isready`) to ensure service readiness before app containers start
- See [SECURITY.md](SECURITY.md) for hardening guide

---

## 📄 License

[MIT](LICENSE) — © Maruf
