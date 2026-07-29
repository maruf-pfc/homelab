# 🚀 Homelab Operations & Deployment Runbook

This runbook provides step-by-step procedures for managing, deploying, backing up, and restoring services in your homelab.

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
   git clone https://github.com/your-username/homelab.git /home/maruf/homelab
   cd /home/maruf/homelab
   ```
2. Execute initialization script:
   ```bash
   ./scripts/init-homelab.sh
   ```
3. Configure environment variables in `.env`:
   ```bash
   nano .env
   ```

---

## 2. Managing Applications

### Starting All Services
```bash
cd /home/maruf/homelab
docker compose up -d
```

### Starting a Specific Stack
```bash
# Core Services (NPM, Portainer, Uptime Kuma)
docker compose -f apps/core/docker-compose.yml up -d

# Dashboard Services (Dashy, IT-Tools)
docker compose -f apps/dashboard/docker-compose.yml up -d

# Finance Stack (Maybe, PostgreSQL, Redis)
docker compose -f apps/finance/docker-compose.yml up -d

# Management Services (Leantime, MariaDB)
docker compose -f apps/management/docker-compose.yml up -d

# Media Server (Jellyfin)
docker compose -f apps/media/docker-compose.yml up -d

# Monitoring Stack (Prometheus, Grafana, Node-Exporter, cAdvisor)
docker compose -f apps/monitoring/docker-compose.yml up -d
```

### Checking Container Health
```bash
docker compose ps
```

### Viewing Real-Time Logs
```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f jellyfin
```

---

## 3. Upgrading Services

To safely pull latest images and update running containers:

```bash
cd /home/maruf/homelab

# Pull updated images for all stacks
docker compose pull

# Recreate updated containers without downtime for unchanged services
docker compose up -d --remove-orphans

# Clean up unused image layers
docker image prune -f
```

---

## 4. Removing Legacy File Browser

If File Browser container is still running from a previous installation, safely remove it:

```bash
./scripts/remove-filebrowser.sh
```

---

## 5. Backup & Disaster Recovery

### Data Directories to Backup
- **SSD Configs & DBs**: `/home/maruf/homelab/volumes`
- **HDD Proxy & App Data**: `/home/maruf/MyHDDStorage/docker/volumes`
- **Prometheus Data**: `/home/maruf/MyHDDStorage/monitoring/prometheus`

### Performing Manual Backup
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/maruf/MyHDDStorage/backups/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

echo "[+] Backing up SSD volume configurations..."
tar -czf "${BACKUP_DIR}/ssd_volumes.tar.gz" -C /home/maruf/homelab volumes .env

echo "[+] Backing up Nginx Proxy Manager & Portainer data..."
tar -czf "${BACKUP_DIR}/hdd_volumes.tar.gz" -C /home/maruf/MyHDDStorage/docker/volumes .

echo "[✓] Backup completed at ${BACKUP_DIR}"
```

### Restoring from Backup
1. Stop running containers: `docker compose down`
2. Extract config tarball to `/home/maruf/homelab`
3. Extract HDD data tarball to `/home/maruf/MyHDDStorage/docker/volumes`
4. Start containers: `docker compose up -d`
