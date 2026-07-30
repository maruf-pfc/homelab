# 🏛️ Architecture & Infrastructure Specification

Detailed architectural design, storage tiering strategy, network topology, service dependency graph, and security model of the homelab environment.

---

## 1. Storage Tiering Strategy

A core design principle is **Storage Tiering** — fast SSD for databases and configs, bulk HDD for media and backups.

```
                  ┌──────────────────────────────────────────┐
                  │           Homelab Host (mms)             │
                  │         Ubuntu Linux  ·  192.168.1.75    │
                  └────────────────────┬─────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────┐                             ┌───────────────────────┐
│     SSD Storage       │                             │     HDD Storage       │
│  /home/maruf/homelab  │                             │ /home/maruf/MyHDDStorage│
└───────────┬───────────┘                             └───────────┬───────────┘
            │                                                     │
            ├─► Docker Compose stack definitions                  ├─► Jellyfin media library
            ├─► MariaDB (Leantime) transactional data             │   (Movies, TV, Music, Videos)
            ├─► PostgreSQL (Maybe Finance) data                   ├─► Prometheus TSDB long retention
            ├─► Grafana dashboards & state                        ├─► Portainer & Uptime Kuma state
            ├─► Application configs (Dashy, Sonarr…)             └─► Backup archives (latest snapshot)
            └─► Nightly backup snapshots (local copy)
```

### Tier 1 — SSD (`/home/maruf/homelab/volumes/`)
| Path | Service | Reason |
|------|---------|--------|
| `volumes/leantime/mysql` | Leantime MariaDB | High-frequency transactional writes |
| `volumes/maybe/postgres` | Maybe Postgres | Relational DB with frequent queries |
| `volumes/maybe/redis` | Maybe Redis | In-memory cache |
| `volumes/grafana` | Grafana | SQLite state + dashboard reads |
| `volumes/dashy` | Dashy | Config file reads on every page load |
| `volumes/changedetection` | ChangeDetection | Frequent diff writes |
| `volumes/sonarr`, `radarr`… | Arr suite | Config + DB writes on indexer scan |

### Tier 2 — HDD (`/home/maruf/MyHDDStorage/`)
| Path | Service | Reason |
|------|---------|--------|
| `Jellyfin/Movies`, `TV`, `Music` | Jellyfin | Large sequential media reads |
| `docker/volumes/portainer` | Portainer | Docker state — infrequent writes |
| `docker/volumes/uptime-kuma` | Uptime Kuma | Monitoring history — bulk writes |
| `monitoring/prometheus` | Prometheus | High-volume time-series retention |
| `backups/` | Backup script | Large tar archives — bulk sequential |

---

## 2. Network Topology

All Docker services attach to a single custom bridge network named `homelab`. External ingress is handled exclusively by the **Cloudflare Tunnel host daemon** — not a container.

```
                    ┌──────────────────────────┐
                    │   Cloudflare Edge (CDN)  │
                    │  WAF · DDoS · TLS · Zero │
                    │  Trust · Access Policies  │
                    └────────────┬─────────────┘
                                 │ Encrypted outbound tunnel
                                 ▼
                    ┌─────────────────────────────────┐
                    │  cloudflared  (HOST systemd)    │
                    │  /usr/local/bin/cloudflared     │
                    │  v2025.7.0 · 4 connections      │
                    │  sudo systemctl status          │
                    │  cloudflared                    │
                    └────────────┬────────────────────┘
                                 │ Routes to Docker host ports
                                 ▼
                 ┌───────────────────────────────┐
                 │    Docker Network: homelab    │
                 │    (bridge, isolated)         │
                 └───────────┬───────────────────┘
                             │
     ┌──────────┬────────────┼────────────┬──────────────┐
     ▼          ▼            ▼            ▼              ▼
┌─────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐ ┌────────────────┐
│  Dashy  │ │ Maybe  │ │Leantime │ │ Grafana  │ │ChangeDetection │
│  :7575  │ │ :8092  │ │  :8090  │ │  :3005   │ │    :5001       │
└─────────┘ └────────┘ └─────────┘ └──────────┘ └────────────────┘
     ▼          ▼            ▼
┌──────────┐ ┌────────┐ ┌──────────────┐
│ Jellyfin │ │Portainer│ │  Prometheus  │
│  :8096   │ │ :9000  │ │    :9093     │
└──────────┘ └────────┘ └──────────────┘
```

### Network Rules
- **No open inbound host ports** — all external access via Cloudflare outbound tunnel only
- **Internal DNS**: Containers communicate by service name (e.g. `leantime` → `leantime-db:3306`)
- **DB containers not exposed**: MariaDB (`3306`) and Postgres (`5432`) have zero host port mappings — only reachable inside the `homelab` bridge network

---

## 3. Service Dependency Graph

```
leantime-db (MariaDB)
│  healthcheck: mariadb-admin ping (CMD-SHELL)
│  condition:   service_healthy
└──► leantime

maybe-db (Postgres)
│  healthcheck: pg_isready
│  condition:   service_healthy
└──► maybe
      └── maybe-redis (condition: service_started)

prometheus
└──► grafana (depends_on: prometheus)

node-exporter  ──► prometheus (scrape target)
cadvisor       ──► prometheus (scrape target)
```

---

## 4. Observability Stack

```
  Host OS & Hardware              Docker Containers
┌──────────────────┐            ┌──────────────────┐
│  node-exporter   │            │    cAdvisor       │
│  pid: host       │            │  privileged: true │
│  /:/host:ro      │            │  /var/lib/docker  │
└────────┬─────────┘            └────────┬──────────┘
         │  :9100                        │  :8080
         └──────────────┬────────────────┘
                        ▼
               ┌──────────────────┐
               │   Prometheus     │  scrapes every 15s
               │   :9093 (host)   │  stores on HDD TSDB
               └────────┬─────────┘
                        ▼
               ┌──────────────────┐
               │    Grafana       │  dashboards + alerts
               │   :3005 (host)   │
               └──────────────────┘
```

---

## 5. Backup Architecture

```
         [3:00 AM — cron]
               │
               ▼
    scripts/backup.sh
    ┌────────────────────────────────────────────────────┐
    │  1. MariaDB dump  (docker exec mariadb-dump)       │
    │  2. PostgreSQL dump  (docker exec pg_dump)         │
    │  3. SSD volumes tar  (docker run alpine tar)       │
    │  4. HDD volumes tar  (docker run alpine tar)       │
    │  5. Master archive  homelab_backup_YYYYMMDD.tar.gz │
    └──────────────┬────────────────────────────────────-┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  /homelab/backups/     /MyHDDStorage/backups/
  (SSD — local)         (HDD — mirror)
        │                     │
        └──── delete older ───┘
              keep 1 only
```

- **Logs**: `/home/maruf/homelab/backups/backup.log`
- **Cron**: `0 3 * * * /home/maruf/homelab/scripts/backup.sh >> .../backup.log 2>&1`

---

## 6. Security Model

| Layer | Implementation |
|-------|---------------|
| **External ingress** | Cloudflare Tunnel only — no host ports 80/443 open |
| **TLS termination** | Cloudflare edge (Full Strict mode) |
| **WAF** | Cloudflare Managed Rules + DDoS protection |
| **Secrets** | `.env` only — gitignored, never committed |
| **Default passwords** | All replaced with `openssl rand` generated secrets |
| **DB network exposure** | Zero — MariaDB & Postgres have no host port mapping |
| **DB startup ordering** | `condition: service_healthy` — apps wait for DB healthcheck |
| **Docker socket access** | Portainer & Homepage only (LAN-scoped services) |
| **Host firewall** | UFW — deny inbound, allow LAN (192.168.1.0/24) only |
