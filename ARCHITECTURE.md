# 🏛️ Architecture & Infrastructure Specification

This document details the architectural design, storage tiering strategy, network topology, and security model of the homelab environment.

---

## 1. Storage Tiering Strategy (SSD vs HDD)

A core design principle of this homelab is **Storage Tiering**, which optimizes disk I/O performance while maximizing storage cost-efficiency.

```
                  ┌──────────────────────────────────────────┐
                  │              Homelab Host                │
                  └────────────────────┬─────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────┐                             ┌───────────────────────┐
│     SSD Storage       │                             │     HDD Storage       │
│ `/home/maruf/homelab` │                             │`/home/maruf/MyHDDStorage`│
└───────────┬───────────┘                             └───────────┬───────────┘
            │                                                     │
            ├─► Docker Compose Stack Definitions                  ├─► Jellyfin Media Library
            ├─► Application Configurations & Config Files         │   (/Jellyfin/Movies, TV, etc)
            ├─► High I/O Databases (MariaDB, Grafana DB)          ├─► Prometheus TSDB Long Retention
            └─► Fast Appdata & Web Server Roots                   └─► Bulk System & Config Backups
```

### Tier 1: Solid State Drive (SSD)
- **Path**: `/home/maruf/homelab`
- **Characteristics**: High IOPS, low read/write latency.
- **Assigned Workloads**:
  - All Docker Compose definition files and scripts.
  - MariaDB transactional data files (`/volumes/leantime/mysql`).
  - Grafana SQLite database and state (`/volumes/grafana`).
  - Application configuration files for Jellyfin, Leantime, and IT-Tools.

### Tier 2: Hard Disk Drive (HDD)
- **Path**: `/home/maruf/MyHDDStorage`
- **Characteristics**: High storage density, cost-effective bulk capacity.
- **Assigned Workloads**:
  - Jellyfin media library files (`/home/maruf/MyHDDStorage/Jellyfin` containing `Movies`, `Music`, `Photos`, `TV`).
  - Prometheus time-series metrics storage (`/home/maruf/MyHDDStorage/monitoring/prometheus`).
  - Large persistent container volume stores (`Portainer`, `Uptime Kuma`, `Dashy`).

---

## 2. Container Network Topology

All homelab services are attached to a custom bridge network named `homelab`.

```
                    ┌─────────────────────────┐
                    │   Cloudflare Network    │
                    └────────────┬────────────┘
                                 │ Encrypted Tunnel
                                 ▼
                    ┌─────────────────────────┐
                    │ Cloudflare Tunnel Daemon│ (cloudflared container)
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │    Docker Network: homelab    │
                 └───────────────┬───────────────┘
                                 │
     ┌───────────────┬───────────┼───────────┬───────────────┐
     ▼               ▼           ▼           ▼               ▼
┌─────────┐    ┌──────────┐ ┌─────────┐ ┌─────────┐    ┌────────────┐
│  Dashy  │    │ Jellyfin │ │Leantime │ │ Grafana │    │Uptime Kuma │
│  :7575  │    │  :8096   │ │  :8090  │ │  :3005  │    │   :3001    │
└─────────┘    └──────────┘ └─────────┘ └─────────┘    └────────────┘
```

### Network Characteristics:
- **Subnet & Name**: `homelab` (External bridge network created via `docker network create homelab`).
- **Internal DNS Resolution**: Containers can communicate securely using service names (e.g., `leantime` communicates with `db:3306` via container hostname).
- **Inbound Access**: Ingress traffic is routed via Cloudflare Tunnels (`cloudflared`) directly into containers on the `homelab` network without exposing inbound host ports to the public internet.

---

## 3. Observability Architecture

The monitoring stack collects performance data from both host OS and container levels:

1. **Node-Exporter**: Mounts host filesystem (`/:/host:ro`) and host PID namespace (`pid: host`) to collect system metrics (CPU, RAM, Disk I/O, Network traffic).
2. **cAdvisor**: Mounts `/var/lib/docker:ro` and Docker socket to collect real-time container metrics (CPU throttle, memory usage, network per container).
3. **Prometheus**: Scrapes metrics from `prometheus:9090`, `node-exporter:9100`, and `cadvisor:8080` every 15 seconds.
4. **Grafana**: Visualizes metrics through customizable dashboards.

---

## 4. Reverse Proxy & Security Layer

- **Cloudflare Tunnels (`cloudflared`)**: Establishes an outbound-only encrypted tunnel connection to Cloudflare. No open inbound ports (80/443) required on the host firewall.
- **Cloudflare Edge Protection**: Provides Web Application Firewall (WAF) protection, DDoS prevention, Access policies (Zero Trust), and TLS certificate termination.
- **Environment Isolation**: Production credentials (database passwords, secret keys) are injected at container startup via `.env` files.
