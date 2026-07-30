# DevOps Audit Report — 2026-07-30

## ISSUES FOUND & STATUS

| # | Severity | Issue | File | Status |
|---|----------|-------|------|--------|
| 1 | 🔴 Critical | **Port collision**: `KOMGA_PORT=8084` and `STIRLING_PDF_PORT=8084` map same host port | `.env`, `apps/media`, `apps/productivity` | TO FIX |
| 2 | 🔴 Critical | **6 compose files missing** referenced in master `docker-compose.yml`: `network`, `storage`, `security`, `automation`, `ai`, `workflows` | `docker-compose.yml` | TO FIX |
| 3 | 🔴 Critical | **Network compose file missing** — `cloudflared` deployed ad-hoc, not via compose | `apps/network/` | TO FIX |
| 4 | 🟠 High | **Weak default secrets in .env**: `GRAFANA_ADMIN_PASSWORD=admin123`, `LEANTIME_DB_ROOT_PASSWORD=rootpassword`, `LEANTIME_DB_PASSWORD=leantimepassword`, `MAYBE_DB_PASSWORD=...change_me` | `.env` | TO FIX |
| 5 | 🟠 High | **No DB healthchecks**: leantime-db, maybe-db have no healthchecks — app containers may start before DB is ready | `apps/productivity`, `apps/finance` | TO FIX |
| 6 | 🟡 Medium | **Vikunja JWT secret hardcoded** as literal string in compose, not from .env | `apps/productivity/docker-compose.yml` | TO FIX |
| 7 | 🟡 Medium | **Grafana default password** `admin123` is weak and in plaintext `.env` | `.env` | TO FIX |
| 8 | 🟡 Medium | **wp-wordpress-1 / wp-db-1 / mysql containers** running but not managed by homelab compose — orphaned containers | Runtime | WARN |
| 9 | 🟢 Low | **`ENABLE_CHANGEDETECTION` defaults to `true`** in deploy.sh status table — should match .env value | `scripts/deploy.sh` | TO FIX |
