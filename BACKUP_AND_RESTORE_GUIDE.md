# 📦 Homelab Backup & Restoration Guide

Complete procedures for creating, inspecting, and restoring homelab backups — covering databases, service configurations, and persistent volumes.

---

## 📌 Backup Architecture

All backups are managed by `./scripts/backup.sh`.

| | Primary (SSD) | Mirror (HDD) |
|---|---|---|
| **Path** | `/home/maruf/homelab/backups/` | `/home/maruf/MyHDDStorage/backups/` |
| **Format** | `homelab_backup_YYYYMMDD_HHMMSS.tar.gz` | Same |
| **Retention** | **Latest 1 only** — older archives deleted on success | Same |
| **Log** | `/home/maruf/homelab/backups/backup.log` | — |

### What's captured in each snapshot:
1. **`leantime_db_dump.sql`** — Full MariaDB export for Leantime (all 37 tables)
2. **`maybe_db_dump.sql`** — Full PostgreSQL export for Maybe Finance
3. **`ssd_homelab_configs.tar.gz`** — All compose files, `apps/`, `.env`, and `/home/maruf/homelab/volumes/`
4. **`hdd_service_volumes.tar.gz`** — `/home/maruf/MyHDDStorage/docker/volumes/` (Portainer, Uptime Kuma, Jellyfin)

---

## ⚡ Creating a Backup

### Manual (run anytime):
```bash
cd /home/maruf/homelab
./scripts/backup.sh
```

### Automated nightly cron (already installed — runs at 3:00 AM):
```
0 3 * * * /home/maruf/homelab/scripts/backup.sh >> /home/maruf/homelab/backups/backup.log 2>&1
```

Verify it's installed:
```bash
crontab -l
```

### Sample output:
```
[+] Starting Homelab Backup at Thu Jul 30 03:00:00 2026
[+] Destination: /home/maruf/homelab/backups/tmp_backup_20260730_030000
[+] Exporting MariaDB dump for Leantime...
[+] Exporting PostgreSQL dump for Maybe Finance...
[+] Archiving SSD configurations, .env, and volumes...
[+] Archiving HDD persistent service volumes...
[+] Creating master backup archive...
[✓] Backup completed successfully: /home/maruf/homelab/backups/homelab_backup_20260730_030000.tar.gz
[+] Mirroring to HDD...
[+] Removing old backups (keeping only latest)...
[✓] All backup tasks finished at Thu Jul 30 03:14:22 2026
```

---

## 🔄 Restoring from a Backup

### Method A: Automated (recommended)
```bash
# Restore from latest snapshot
./scripts/restore.sh

# Or restore from a specific archive
./scripts/restore.sh /home/maruf/MyHDDStorage/backups/homelab_backup_20260730_030000.tar.gz
```

---

### Method B: Manual Restoration

#### Step 1 — Extract the archive
```bash
mkdir -p /tmp/homelab_restore
tar -zxvf /home/maruf/homelab/backups/homelab_backup_YYYYMMDD_HHMMSS.tar.gz \
    -C /tmp/homelab_restore
cd /tmp/homelab_restore/backup_YYYYMMDD_HHMMSS
```

#### Step 2 — Restore Leantime (MariaDB)
```bash
source /home/maruf/homelab/.env

# Clean the dump (remove any system-level CREATE DATABASE statements)
grep -v "^CREATE DATABASE\|^USE \`mysql\`" leantime_db_dump.sql > /tmp/leantime_clean.sql

# Import into running container
docker exec -i leantime-db mariadb \
  -u "${LEANTIME_DB_USER}" \
  -p"${LEANTIME_DB_PASSWORD}" \
  "${LEANTIME_DB_NAME}" < /tmp/leantime_clean.sql

docker restart leantime
```

#### Step 3 — Restore Maybe Finance (PostgreSQL)
```bash
source /home/maruf/homelab/.env

docker exec -i maybe-db psql \
  -U "${MAYBE_DB_USER}" \
  -d "${MAYBE_DB_NAME}" < maybe_db_dump.sql

docker restart maybe
```

#### Step 4 — Restore HDD service volumes (Portainer, Uptime Kuma, Jellyfin)
```bash
docker stop portainer uptime-kuma jellyfin

docker run --rm \
  -v /home/maruf/MyHDDStorage/docker/volumes:/dst \
  -v $(pwd):/src \
  alpine sh -c "tar -zxvf /src/hdd_service_volumes.tar.gz -C /dst"

./scripts/deploy.sh
```

#### Step 5 — Restore SSD configs & volumes
```bash
docker stop leantime leantime-db maybe maybe-db maybe-redis grafana

tar -zxvf ssd_homelab_configs.tar.gz -C /home/maruf/homelab/

./scripts/deploy.sh
```

---

## 🗂️ Backup Directory Structure

```
/home/maruf/homelab/backups/
├── homelab_backup_20260730_030000.tar.gz   ← Latest snapshot (only one kept)
├── backup.log                               ← Cron run history
└── README.md                                ← This directory's notes
```

> Only **one archive** is kept at any time. The previous backup is deleted after each successful run to conserve disk space.

---

## ⚠️ Important Notes

- **`.env` is included in the backup** — store backup archives securely (not in a public location).
- **DB passwords must match** between `.env` and the live DB. If you restore `.env` from backup, re-apply any passwords that were changed after the backup was taken.
- **Backup archives are gitignored** — they will never be accidentally committed to git.
- After restoring volumes, always run `./scripts/deploy.sh` to recreate containers with correct mount paths.
