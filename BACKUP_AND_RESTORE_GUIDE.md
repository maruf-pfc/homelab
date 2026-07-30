# 📦 Homelab Backup & Restoration Comprehensive Guide

This guide provides step-by-step instructions on how to create, inspect, and restore backups for your entire homelab infrastructure, including databases, service configurations, and volume data.

---

## 📌 Overview & Backup Architecture

All homelab backups are managed dynamically via `./scripts/backup.sh`. 

- **Primary Dedicated Backup Directory**: `/home/maruf/homelab/backups/`
- **Secondary HDD Archive Target**: `/home/maruf/MyHDDStorage/backups/`
- **Archive File Naming**: `homelab_backup_YYYYMMDD_HHMMSS.tar.gz`
- **Automated Pruning**: Retains snapshots for **7 days** (older snapshots are auto-deleted).

### 🛠️ Captured Data Components:
1. **MariaDB SQL Dump (`leantime_db_dump.sql`)**: Full database export for Leantime (all 37 tables & tickets).
2. **PostgreSQL SQL Dump (`maybe_db_dump.sql`)**: Full database dump for Maybe Finance.
3. **SSD Configs & Volumes Archive (`ssd_homelab_configs.tar.gz`)**: Archives `.env`, compose files, `apps/`, and `/home/maruf/homelab/volumes/`.
4. **HDD Persistent Volumes Archive (`hdd_service_volumes.tar.gz`)**: Archives `/home/maruf/MyHDDStorage/docker/volumes/` (`Portainer`, `Uptime Kuma`, `Jellyfin`).

---

## ⚡ How to Create a Backup

To trigger a complete system snapshot at any time, run:

```bash
cd /home/maruf/homelab
./scripts/backup.sh
```

### Output Example:
```text
[+] Starting Homelab Backup at Thu Jul 30 17:35:24 2026
[+] Destination: /home/maruf/MyHDDStorage/backups/backup_20260730_173524
[+] Exporting MariaDB dump for Leantime...
[+] Exporting PostgreSQL dump for Maybe Finance...
[+] Archiving SSD configurations, .env, and volumes...
[+] Archiving HDD persistent service volumes...
[+] Creating master backup archive...
[✓] Backup completed successfully: /home/maruf/MyHDDStorage/backups/homelab_backup_20260730_173524.tar.gz
[+] Pruning backups older than 7 days...
[✓] All backup tasks finished!
```

---

## 🔄 How to Restore from a Backup

### Method A: Automated Restoration Helper (`./scripts/restore.sh`)

To restore from the latest snapshot automatically:
```bash
cd /home/maruf/homelab
./scripts/restore.sh
```

To restore from a specific archive:
```bash
./scripts/restore.sh /home/maruf/MyHDDStorage/backups/homelab_backup_20260730_173524.tar.gz
```

---

### Method B: Manual Restoration (Step-by-Step)

If you prefer to restore specific services (e.g. only Leantime or only Maybe Finance):

#### 1. Extract the Master Archive
```bash
# Create a temporary extraction folder
mkdir -p /tmp/homelab_restore
tar -zxvf /home/maruf/MyHDDStorage/backups/homelab_backup_20260730_173524.tar.gz -C /tmp/homelab_restore

# Change into the extracted folder
cd /tmp/homelab_restore/backup_20260730_173524
```

#### 2. Restore Leantime MariaDB Database (`leantime_db_dump.sql`)
```bash
# Extract the leantime table statements
python3 -c "
with open('leantime_db_dump.sql', 'r') as f:
    lines = f.readlines()
clean = [l for l in lines if not l.startswith('CREATE DATABASE') and not l.startswith('USE `mysql`')]
with open('/tmp/leantime_clean.sql', 'w') as f:
    f.writelines(clean)
"

# Import into leantime-db container
docker exec -i leantime-db mariadb -u leantime -pleantimepassword leantime < /tmp/leantime_clean.sql

# Restart Leantime
docker restart leantime
```

#### 3. Restore Maybe Finance PostgreSQL Database (`maybe_db_dump.sql`)
```bash
docker exec -i maybe-db psql -U maybe -d maybe_production < maybe_db_dump.sql
docker restart maybe
```

#### 4. Restore HDD Persistent Service Volumes (`hdd_service_volumes.tar.gz`)
```bash
# Stop HDD containers
docker stop portainer uptime-kuma jellyfin

# Extract HDD volumes to MyHDDStorage
docker run --rm -v /home/maruf/MyHDDStorage/docker/volumes:/dst -v $(pwd):/src alpine sh -c "tar -zxvf /src/hdd_service_volumes.tar.gz -C /dst"

# Restart containers
./scripts/deploy.sh
```

---

## ⏰ Automated Daily Backup via Cron

To automatically take a backup every night at 3:00 AM:

1. Open crontab:
   ```bash
   crontab -e
   ```
2. Add the following line:
   ```cron
   0 3 * * * /home/maruf/homelab/scripts/backup.sh > /dev/null 2>&1
   ```
