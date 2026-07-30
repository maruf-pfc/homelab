# 🔒 Security Guidelines & Best Practices

---

## 1. Secret Hygiene & Git Isolation

- **Never commit `.env`** — it is explicitly gitignored. Use `.env.example` as a template and document variable names only, never values.
- **All passwords are randomly generated** — default weak passwords (`admin123`, `rootpassword`, etc.) have been replaced with strong cryptographically-random secrets via `openssl rand`.
- **DB credentials** are stored only in `.env` and passed to containers at runtime via Docker Compose environment interpolation.
- **Cloudflare Tunnel token** is stored in `.env` as `CLOUDFLARE_TUNNEL_TOKEN` — never hardcoded in compose files or scripts.

### What is gitignored:
```
.env                        # Active secrets — never committed
volumes/                    # Container data — too large & sensitive
backups/                    # Backup archives — gitignored by pattern
*.tar.gz                    # Archive files
*.sql                       # DB dumps
```

---

## 2. Cloudflare Zero Trust Ingress

- **No open inbound ports**: All external traffic enters exclusively via outbound Cloudflare Tunnels. The host firewall has no ports 80/443 open.
- **Cloudflare WAF**: Enable Managed Rules for CVE protection on all proxied hostnames.
- **TLS Mode**: Set to **Full (Strict)** on all Cloudflare-proxied subdomains.
- **Orange Cloud**: All external subdomains must be proxied (orange cloud) in Cloudflare DNS — never DNS-only (grey cloud) for production services.

---

## 3. Host Firewall (UFW)

Since ingress is handled by Cloudflare Tunnels, restrict the host to LAN-only:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.1.0/24 to any port 22   # SSH — LAN only
sudo ufw allow from 192.168.1.0/24 to any           # LAN access to all services
sudo ufw enable
```

---

## 4. Docker Security

- **Docker socket mounts** (`/var/run/docker.sock`): Only Portainer and Homepage mount the Docker socket. Both are LAN-only services. Keep their images updated.
- **Privileged containers**: `cadvisor` runs `privileged: true` — required for full container metrics. Limit exposure to monitoring network only.
- **`user: "0:0"`**: Prometheus and Grafana run as root inside containers to write to mounted volumes. This is intentional for volume permission compatibility — restrict network access instead.
- **Image tags**: All images use `latest` for ease of maintenance. For production pinning, replace with specific digest tags.

---

## 5. Database Security

- **Healthchecks on all DB containers**: `leantime-db` and `maybe-db` both have Docker healthchecks configured. App containers use `condition: service_healthy` — they will not start until the DB passes its health probe.
- **DB not exposed on host**: MariaDB (`3306`) and Postgres (`5432`) have no `ports:` mapping — they are only accessible inside the `homelab` Docker network.
- **Password rotation**: To rotate a DB password:
  ```bash
  # 1. Generate new password
  NEW_PASS=$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 20)

  # 2. Apply to running DB
  docker exec leantime-db mariadb -u root -p"${LEANTIME_DB_ROOT_PASSWORD}" \
    -e "ALTER USER 'leantime'@'%' IDENTIFIED BY '${NEW_PASS}'; FLUSH PRIVILEGES;"

  # 3. Update .env
  sed -i "s/^LEANTIME_DB_PASSWORD=.*/LEANTIME_DB_PASSWORD=${NEW_PASS}/" .env

  # 4. Restart app container
  docker compose --env-file .env -f apps/productivity/docker-compose.yml up -d --force-recreate leantime
  ```

---

## 6. Backup Security

- Backup archives are stored locally (`backups/`) and mirrored to HDD — both locations are gitignored.
- Archive filenames include timestamps only — no secrets embedded in filenames.
- Backup cron log at `backups/backup.log` contains operation results only — no credentials.
