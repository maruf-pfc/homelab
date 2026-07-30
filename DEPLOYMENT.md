# 🚀 Homelab Operations & Deployment Runbook

This runbook provides step-by-step procedures for managing, deploying, backing up, and restoring services in your homelab across 12 modular categories.

---

## 1. Initial System Setup

### Prerequisites
- Install Docker Engine:
  ```bash
  curl -fsSL https://get.docker.com | sudo sh
  ```
- Ensure user is in the `docker` group:
  ```bash
  sudo usermod -aG docker $USER
  ```

### First-Time Initialization
1. Clone the repository into `/home/maruf/homelab`:
   ```bash
   git clone https://github.com/maruf-pfc/homelab.git /home/maruf/homelab
   cd /home/maruf/homelab
   ```
2. Execute initialization script:
   ```bash
   ./scripts/init-homelab.sh
   ```
3. Configure environment variables and feature toggles in `.env`:
   ```bash
   nano .env
   ```

---

## 2. Managing Applications via Feature Toggle Engine

### Master Category Deployment
To deploy all enabled applications (`ENABLE_<SERVICE>=true` in `.env`):
```bash
cd /home/maruf/homelab
./scripts/deploy.sh
```

### Starting a Specific Category Stack Directly
```bash
# Category 1: Media Stack (Jellyfin, Sonarr, Radarr)
docker compose -f apps/media/docker-compose.yml up -d jellyfin

# Category 2: Finance Stack (Maybe Finance, PostgreSQL, Redis)
docker compose -f apps/finance/docker-compose.yml up -d maybe-db maybe-redis maybe

# Category 3: Dashboards Stack (Dashy, Homepage, Glance)
docker compose -f apps/dashboards/docker-compose.yml up -d dashy

# Category 4: Network & Ingress (Cloudflare Tunnel cloudflared)
docker compose -f apps/network/docker-compose.yml up -d cloudflared

# Category 5: Monitoring Stack (Prometheus, Grafana, Node-Exporter, cAdvisor)
docker compose -f apps/monitoring/docker-compose.yml up -d prometheus grafana node-exporter cadvisor

# Category 8: Productivity Stack (Leantime, MariaDB, Stirling-PDF, Memos)
docker compose -f apps/productivity/docker-compose.yml up -d leantime-db leantime

# Category 10: Sysadmin Stack (Portainer, Uptime Kuma, IT-Tools)
docker compose -f apps/sysadmin/docker-compose.yml up -d portainer uptime-kuma it-tools
```

### Checking Container Health
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Viewing Real-Time Logs
```bash
# View Cloudflare Tunnel daemon logs
docker logs cloudflared --tail=50 -f

# View Leantime logs
docker logs leantime --tail=50 -f

# View Maybe Finance logs
docker logs maybe --tail=50 -f
```

---

## 3. Automated Backup & Recovery

### Executing Full System Backup
Create an automated snapshot of all database dumps and volume files:
```bash
./scripts/backup.sh
```
- **Output location**: `/home/maruf/MyHDDStorage/backups/homelab_backup_YYYYMMDD_HHMMSS.tar.gz`
- **Retention**: Automatically prunes snapshots older than 7 days.

---

## 4. Troubleshooting & Maintenance

### Clearing Cloudflare Tunnel Connectivity
If Cloudflare returns Error 1033:
```bash
docker restart cloudflared
docker logs cloudflared --tail=30
```

### Storage Audit Rules
- **HDD Storage (`/home/maruf/MyHDDStorage`)**: Reserved for `Jellyfin`, `Portainer`, `Uptime Kuma`, and bulk media downloads.
- **SSD Storage (`/home/maruf/homelab/volumes`)**: Reserved for `Leantime MariaDB`, `Maybe Postgres & Redis`, `Dashy`, `Grafana`, and fast database workloads.
