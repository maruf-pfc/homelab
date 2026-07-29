# 💾 Backup & Disaster Recovery Framework

This directory manages backup strategies, retention policies, database dumps, and disaster recovery procedures.

---

## Backup Architecture

Backups are executed via `./scripts/backup.sh` and stored in `/home/maruf/MyHDDStorage/backups` or `/home/maruf/homelab/backups/`.

### What gets backed up:
1. **Database Dumps**: Automated `leantime-db` MariaDB database dumps (`mariadb-dump`).
2. **SSD App Data & Configs**: `/home/maruf/homelab/volumes`, `.env`, and `configs/`.
3. **HDD Service State**: `/home/maruf/MyHDDStorage/docker/volumes` (Nginx Proxy Manager SSL certs, Portainer state, Uptime Kuma data, Homarr appdata).

---

## Quick Backup Commands

### Run Manual Backup
```bash
./scripts/backup.sh
```

### Restore from Backup
```bash
./scripts/restore.sh /home/maruf/MyHDDStorage/backups/homelab_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## ⏰ Automated Daily Backup via Cron

To schedule automated daily backups at 3:00 AM:

1. Open crontab editor:
   ```bash
   crontab -e
   ```
2. Add the following cron rule:
   ```cron
   0 3 * * * /home/maruf/homelab/scripts/backup.sh >> /home/maruf/homelab/backups/backup.log 2>&1
   ```

---

## 🗑️ Retention Policy

The `backup.sh` script automatically purges backups older than **7 days** to manage disk space on HDD storage.
