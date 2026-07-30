# 🚀 Homelab Operations & Deployment Runbook

Full procedures for deploying, managing, backing up, and troubleshooting your homelab.

---

## 1. Initial System Setup

### Prerequisites
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

### First-Time Initialization
```bash
git clone https://github.com/maruf-pfc/homelab.git /home/maruf/homelab
cd /home/maruf/homelab
cp .env.example .env
nano .env                     # Configure passwords, paths, feature toggles
./scripts/init-homelab.sh     # Creates Docker 'homelab' network + volume dirs
```

---

## 2. Feature Toggle System

All services are gated by `ENABLE_<SERVICE>=true/false` flags in `.env`. No service runs unless explicitly enabled.

### Enable a service:
```bash
# Edit .env
ENABLE_LEANTIME=true
ENABLE_CHANGEDETECTION=true

# Redeploy
./scripts/deploy.sh
```

### Disable a service (stop + preserve data):
```bash
# Set in .env
ENABLE_LEANTIME=false

# Stop the container (data volumes remain intact)
docker compose -f apps/productivity/docker-compose.yml stop leantime leantime-db
```

---

## 3. Deploying Category Stacks

### Deploy all enabled services:
```bash
./scripts/deploy.sh
```

The deploy script runs pre-flight **port collision validation** before starting anything. If two enabled services share the same host port, it exits with a clear error message before touching any containers.

### Deploy a specific category manually:
```bash
# Category 1: Media
docker compose --env-file .env -f apps/media/docker-compose.yml up -d jellyfin

# Category 2: Finance (Postgres must be healthy before app starts)
docker compose --env-file .env -f apps/finance/docker-compose.yml up -d maybe-db maybe-redis maybe

# Category 3: Dashboards
docker compose --env-file .env -f apps/dashboards/docker-compose.yml up -d dashy

# Category 4: Network & Ingress
docker compose --env-file .env -f apps/network/docker-compose.yml up -d cloudflared

# Category 5: Monitoring
docker compose --env-file .env -f apps/monitoring/docker-compose.yml up -d prometheus grafana node-exporter cadvisor

# Category 8: Productivity (MariaDB must be healthy before leantime starts)
docker compose --env-file .env -f apps/productivity/docker-compose.yml up -d leantime-db leantime changedetection

# Category 10: Sysadmin
docker compose --env-file .env -f apps/sysadmin/docker-compose.yml up -d portainer it-tools
```

> **Note:** Always pass `--env-file .env` when running compose directly, to ensure all variables are loaded from your active configuration.

---

## 4. Container Health & Logs

### Check all container statuses:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Real-time logs:
```bash
docker logs leantime --tail=50 -f
docker logs maybe --tail=50 -f
docker logs cloudflared --tail=50 -f
docker logs grafana --tail=50 -f
```

### Check DB healthcheck status:
```bash
docker inspect leantime-db --format 'Health: {{.State.Health.Status}}'
docker inspect maybe-db --format 'Health: {{.State.Health.Status}}'
```

---

## 5. Backup & Recovery

See **[BACKUP_AND_RESTORE_GUIDE.md](BACKUP_AND_RESTORE_GUIDE.md)** for full procedures.

### Quick backup:
```bash
./scripts/backup.sh
```

### Nightly cron (already installed):
```
0 3 * * * /home/maruf/homelab/scripts/backup.sh >> /home/maruf/homelab/backups/backup.log 2>&1
```

- Creates a full tar snapshot of all volume data + DB dumps
- Mirrors to `/home/maruf/MyHDDStorage/backups/`
- **Keeps only the most recent backup** — older archives deleted on success

### View backup log:
```bash
tail -f /home/maruf/homelab/backups/backup.log
```

---

## 6. Port Reference

| Service | Host Port |
| :--- | :---: |
| Portainer | `9000`, `9443` |
| Uptime Kuma | `3001` |
| Dashy | `7575` |
| Grafana | `3005` |
| Prometheus | `9093` |
| cAdvisor | `8083` |
| Leantime | `8090` |
| Maybe Finance | `8092` |
| IT-Tools | `8091` |
| Jellyfin | `8096` |
| ChangeDetection | `5001` |
| Stirling PDF | `8084` |
| Memos | `5230` |
| Vikunja | `3456` |
| Sonarr | `8989` |
| Radarr | `7878` |
| Lidarr | `8686` |
| Readarr | `8787` |
| Prowlarr | `9696` |
| Bazarr | `6767` |
| Navidrome | `4533` |
| AudioBookshelf | `13378` |
| Kavita | `5003` |
| Komga | `8085` |
| qBittorrent | `8087` |

---

## 7. Troubleshooting

### Leantime shows install page (not login)
The app can't reach its DB. Check:
```bash
# Is the DB healthy?
docker inspect leantime-db --format '{{.State.Health.Status}}'

# Can leantime connect?
docker logs leantime --tail 30
```

Most common cause: DB password in `.env` doesn't match the password inside the MariaDB volume. Fix:
```bash
# Apply the correct password directly to the running DB
source .env
docker exec leantime-db mariadb -u root -p'<old_root_password>' \
  -e "ALTER USER 'leantime'@'%' IDENTIFIED BY '${LEANTIME_DB_PASSWORD}'; FLUSH PRIVILEGES;"

# Then restart leantime to pick up the env
docker compose --env-file .env -f apps/productivity/docker-compose.yml up -d --force-recreate leantime
```

### Cloudflare Tunnel Error 1033 (no route)
```bash
docker restart cloudflared
docker logs cloudflared --tail=30
```

### Port already in use on deploy
Edit `.env` and change the conflicting `_PORT` variable to a free port, then redeploy.

### Container stuck `health: starting`
```bash
docker inspect <container> --format '{{range .State.Health.Log}}[Exit={{.ExitCode}}] {{.Output}}{{end}}'
```

---

## 8. Storage Rules

| Tier | Path | Use For |
| :--- | :--- | :--- |
| **SSD** | `/home/maruf/homelab/volumes/` | Databases, app configs, low-latency reads |
| **HDD** | `/home/maruf/MyHDDStorage/` | Media libraries, Portainer state, backup archives |
| **Backups (SSD)** | `/home/maruf/homelab/backups/` | Latest local backup snapshot |
| **Backups (HDD)** | `/home/maruf/MyHDDStorage/backups/` | HDD mirror of latest backup |
