# 🧰 Popular & Recommended Homelab Tools & Applications

A comprehensive, categorized reference guide to popular open-source and self-hosted tools. Includes resource usage profiles (Lightweight / Moderate / Heavy), underlying technology stacks, and database dependencies.

---

## 📌 Resource Footprint Legend
- **⚡ Ultra-Lightweight**: `< 50 MB` RAM footprint, negligible CPU usage.
- **🟢 Lightweight**: `50 MB – 200 MB` RAM footprint, low idle CPU.
- **🟡 Moderate**: `200 MB – 800 MB` RAM footprint, moderate CPU under active workload.
- **🔴 Heavy**: `800 MB+` RAM footprint or requires multi-container stacks (e.g., Postgres + Redis + AI Workers).

---

## 📂 Table of Contents
1. [Media & Automation (Arr Stack & Streaming)](#1-media--automation-arr-stack--streaming)
2. [Finance & Wealth Management](#2-finance--wealth-management)
3. [Dashboards & Portals](#3-dashboards--portals)
4. [Network, DNS & Ingress](#4-network-dns--ingress)
5. [Monitoring, Logging & Observability](#5-monitoring-logging--observability)
6. [Storage, Cloud & Photo Management](#6-storage-cloud--photo-management)
7. [Security, Password Management & Auth](#7-security-password-management--auth)
8. [Productivity, Documents & Knowledge Bases](#8-productivity-documents--knowledge-bases)
9. [Home Automation & IoT](#9-home-automation--iot)
10. [Sysadmin, DevOps & Container Utilities](#10-sysadmin-devops--container-utilities)

---

## 1. Media & Automation (Arr Stack & Streaming)

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Jellyfin** | Media Server | `8096` | 🟡 Moderate | `C# (.NET)` / `SQLite` | SSD + HDD | Free & open-source media system for movies, TV, and music. *(Transcoding spikes CPU/GPU)* |
| **Plex** | Media Server | `32400` | 🟡 Moderate | `C++ / Go` / `SQLite` | SSD + HDD | Popular media server with broad client app support and remote sharing. |
| **Emby** | Media Server | `8096` | 🟡 Moderate | `C# (.NET)` / `SQLite` | SSD + HDD | Feature-rich media server alternative to Plex and Jellyfin. |
| **Sonarr** | Media PVR | `8989` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD | Smart PVR for downloading and managing TV shows automatically. |
| **Radarr** | Media PVR | `7878` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD | Smart PVR for downloading and organizing movie libraries automatically. |
| **Lidarr** | Music PVR | `8686` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD | Automated music downloader and library manager for Usenet and Torrent. |
| **Readarr** | Book PVR | `8787` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD | Book and audiobook collection manager for Usenet and BitTorrent. |
| **Prowlarr** | Indexer Proxy | `9696` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD | Torrent/Usenet indexer proxy syncing with Sonarr, Radarr, and Readarr. |
| **Bazarr** | Subtitles | `6767` | 🟢 Lightweight | `Python` / `SQLite` | SSD | Companion app to Sonarr/Radarr for automated subtitle downloads. |
| **Jellyseerr** | Requests | `5055` | 🟢 Lightweight | `Node.js / TypeScript` / `SQLite` | SSD | Sleek media request management tool for Jellyfin and Plex users. |
| **Overseerr** | Requests | `5055` | 🟢 Lightweight | `Node.js / TypeScript` / `SQLite` | SSD | Native Plex media request management and discovery interface. |
| **Navidrome** | Music Server | `4533` | ⚡ Ultra-Light | `Go / React` / `SQLite` | SSD + HDD | Lightweight, Subsonic-compatible streaming music server written in Go. |
| **Audiobookshelf** | Audiobooks | `13378` | 🟢 Lightweight | `Node.js / Vue` / `SQLite` | SSD + HDD | Self-hosted audiobook and podcast server with mobile app sync. |
| **Kavita** | Manga / Books | `5000` | 🟢 Lightweight | `C# (.NET)` / `SQLite` | SSD + HDD | Fast self-hosted digital library for manga, comics, and eBooks. |
| **Komga** | Manga Reader | `8080` | 🟡 Moderate | `Kotlin (JVM)` / `SQLite` | SSD + HDD | Media server for comics, manga, BDs, and eBooks with OPDS support. |
| **Tdarr** | Transcoding | `8265` | 🟡 Moderate | `Node.js` / `MongoDB` | SSD | Distributed media transcoding engine for converting libraries to H265/AV1. |
| **qBittorrent** | Download Client | `8080` | 🟢 Lightweight | `C++ (Qt / libtorrent)` / `Flat Files` | HDD | High-performance BitTorrent client with Web UI and Web API. |
| **SABnzbd** | Usenet Client | `8080` | 🟢 Lightweight | `Python` / `Flat Files` | HDD | Open-source binary newsreader for downloading files from Usenet. |
| **Unpackerr** | Extraction | Background | ⚡ Ultra-Light | `Go` / `Stateless` | HDD | Automatically extracts downloaded archives (rar, zip) for Arr services. |

---

## 2. Finance & Wealth Management

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Maybe** | Wealth & Net Worth | `8092` | 🟡 Moderate | `Ruby on Rails` / `PostgreSQL + Redis` | SSD | Startup-grade net worth, investment & personal finance tracker. *(Active in homelab)* |
| **Actual Budget** | Personal Finance | `5006` | ⚡ Ultra-Light | `Node.js / React` / `SQLite` | SSD | Privacy-first, fast envelope budgeting manager with End-to-End Encryption. |
| **Firefly III** | Expense Auditor | `8080` | 🟡 Moderate | `PHP (Laravel)` / `MariaDB / Postgres` | SSD | Detailed double-entry expense manager with powerful automation rules. |
| **Ghostfolio** | Investment Portfolio| `3333` | 🟢 Lightweight | `TypeScript (NestJS)` / `PostgreSQL + Redis` | SSD | Privacy-focused wealth management dashboard for stock & crypto tracking. |
| **Wallos** | Subscription Tracker| `80` | ⚡ Ultra-Light | `PHP` / `SQLite` | SSD | Dedicated tracker for recurring subscriptions with renewal notification alerts. |
| **Fava + Beancount** | Plain Text Finance | `5000` | ⚡ Ultra-Light | `Python` / `Plain Text (.beancount)` | SSD | Plain-text accounting Web UI for hacker-grade Git-versioned bookkeeping. |

---

## 3. Dashboards & Portals

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Dashy** | Dashboard | `7575` | 🟢 Lightweight | `Vue.js` / `YAML Config (No DB)` | SSD | Feature-rich, highly customizable homelab dashboard. *(Active in homelab)* |
| **Homarr** | Dashboard | `7575` | 🟢 Lightweight | `Next.js / Node.js` / `SQLite` | SSD / HDD | Customizable dashboard with real-time Docker integration widgets. |
| **Homepage** | Dashboard | `3000` | 🟢 Lightweight | `Next.js / React` / `YAML Config (No DB)` | SSD | Highly customizable, YAML-configured dashboard with service integration badges. |
| **Glance** | All-in-One Feed | `8080` | ⚡ Ultra-Light | `Go` / `YAML Config (No DB)` | SSD | Ultra-fast feed aggregator for RSS, Reddit, weather, and server status. |
| **Linkwarden** | Bookmarks | `3000` | 🟡 Moderate | `TypeScript / Next.js` / `PostgreSQL` | SSD | Self-hosted bookmark manager that archives webpages and PDFs automatically. |
| **Shiori** | Simple Bookmarks | `8080` | ⚡ Ultra-Light | `Go` / `SQLite` | SSD | Simple, clean bookmark manager written in Go (Pocket alternative). |
| **Bento** | Startpage | `80` | ⚡ Ultra-Light | `Vue.js` / `JSON Config` | SSD | Minimalist, elegant browser startpage with dark/light themes. |
| **Flame** | Startpage | `5005` | ⚡ Ultra-Light | `Node.js` / `SQLite` | SSD | Self-hosted startpage for application links with built-in web search. |

---

## 4. Network, DNS & Ingress

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Cloudflare Tunnel (`cloudflared`)** | Zero Trust Ingress | Outbound | ⚡ Ultra-Light | `Go` / `Stateless (No DB)` | Container | Securely exposes local web apps to the internet without open router ports. |
| **AdGuard Home** | DNS & Ad Blocking | `53` / `3002` | ⚡ Ultra-Light | `Go` / `YAML + Internal Storage` | SSD | Network-wide ad blocker, tracking protection, and local DNS rewrite engine. |
| **Pi-hole** | DNS & Ad Blocking | `53` / `80` | ⚡ Ultra-Light | `C / Shell / PHP` / `SQLite` | SSD | Classic DNS sinkhole for network-wide ad blocking and query logging. |
| **Headscale** | Control Plane | `8080` | ⚡ Ultra-Light | `Go` / `SQLite` | SSD | Open-source self-hosted control server for Tailscale mesh networks. |
| **Caddy** | Web Server / Proxy | `80` / `443` | ⚡ Ultra-Light | `Go` / `Caddyfile / JSON` | SSD | Modern web server with automated HTTPS certificate issuance via Let's Encrypt. |
| **Traefik** | Reverse Proxy | `80` / `443` | 🟢 Lightweight | `Go` / `YAML / Docker API` | SSD | Cloud-native reverse proxy with dynamic Docker label discovery. |
| **Nginx Proxy Manager** | Reverse Proxy | `80` / `443` | 🟢 Lightweight | `Node.js / Python / Nginx` / `SQLite` | SSD | Web GUI for managing Nginx proxy routes and Let's Encrypt TLS certs. |
| **Nginx UI** | Reverse Proxy | `8080` | 🟢 Lightweight | `Go / Vue` / `SQLite` | SSD | Modern, lightweight Nginx management interface with real-time stats. |
| **Tailscale** | Mesh VPN | Host Native | ⚡ Ultra-Light | `Go` / `Stateless` | Host | Zero-config mesh VPN based on WireGuard for secure remote access. |
| **Netbird** | Mesh VPN | `80` / `443` | 🟢 Lightweight | `Go` / `SQLite / Postgres` | SSD | Zero-configuration mesh VPN built on WireGuard with SSO integration. |

---

## 5. Monitoring, Logging & Observability

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Prometheus** | Metrics TSDB | `9093` | 🟡 Moderate | `Go` / `Built-in TSDB` | SSD + HDD | Time-series metrics collection engine. *(Active in homelab)* |
| **Grafana** | Visualization | `3005` | 🟢 Lightweight | `Go / React` / `SQLite` | SSD | Analytics & dashboard platform for visualizing Prometheus metrics. *(Active)* |
| **Uptime Kuma** | Status Monitoring | `3001` | 🟢 Lightweight | `Node.js / Vue` / `SQLite` | SSD | Fancy self-hosted monitoring tool supporting HTTP, Ping, and push alerts. *(Active)* |
| **Node Exporter** | Host Metrics | `9100` | ⚡ Ultra-Light | `Go` / `Stateless` | Host | Prometheus hardware exporter for CPU, RAM, Disk, and Network metrics. *(Active)* |
| **cAdvisor** | Container Metrics | `8083` | 🟢 Lightweight | `Go` / `Stateless` | Host | Resource usage and performance analyzer for running Docker containers. *(Active)* |
| **Beszel** | Server Monitoring | `8090` | ⚡ Ultra-Light | `Go / PocketBase` / `SQLite` | SSD | Ultra-lightweight server monitoring hub with Docker stats and alerts. |
| **Dozzle** | Log Viewer | `8080` | ⚡ Ultra-Light | `Go / Vue` / `Stateless (No DB)` | Lightweight | Real-time log viewer for Docker containers with instant filtering. |
| **Loki + Promtail** | Log Aggregation | `3100` | 🟡 Moderate | `Go` / `Loki Index + Filesystem` | SSD + HDD | Prometheus-inspired log aggregation system optimized for Grafana. |
| **Gatus** | Health Dashboard | `8080` | ⚡ Ultra-Light | `Go` / `SQLite / Postgres` | SSD | Developer-oriented health dashboard with status badges and incident logs. |
| **ntfy** | Push Notifications | `80` | ⚡ Ultra-Light | `Go` / `SQLite` | SSD | HTTP-based pub-sub notification service for sending phone/desktop alerts. |
| **Gotify** | Push Notifications | `80` | ⚡ Ultra-Light | `Go / React` / `SQLite` | SSD | Self-hosted push notification server for real-time alert messages. |
| **Scrutiny** | Drive Health | `8080` | 🟢 Lightweight | `Go / Vue` / `InfluxDB` | SSD | Web UI for monitoring S.M.A.R.T. hard drive health metrics and failure predictions. |

---

## 6. Storage, Cloud & Photo Management

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Immich** | Photo & Video Backup | `2283` | 🔴 Heavy | `TypeScript / Dart` / `PostgreSQL + Redis + Vector DB` | SSD + HDD | High-performance Google Photos alternative with AI face recognition. |
| **Photoprism** | Photo Management | `2342` | 🔴 Heavy | `Go / Vue` / `MariaDB + TensorFlow` | SSD + HDD | AI-powered photo app using computer vision for automatic categorization. |
| **Nextcloud** | Private Cloud Suite | `8080` | 🔴 Heavy | `PHP / Vue` / `PostgreSQL / MariaDB + Redis` | SSD + HDD | Enterprise cloud suite for file storage, sync, calendar, and office docs. |
| **ownCloud Infinite Scale**| Cloud Storage | `9200` | 🟢 Lightweight | `Go` / `Metadata Index` | HDD | High-speed, microservice-based Cloud storage engine rewritten in Go. |
| **Filebrowser** | File Manager | `8082` | ⚡ Ultra-Light | `Go / Vue` / `SQLite` | HDD | Simple, browser-based file manager for uploads and directory browsing. |
| **Syncthing** | Continuous File Sync | `8384` | 🟢 Lightweight | `Go` / `LevelDB` | HDD | Decentralized, peer-to-peer file synchronization between devices. |
| **Seafile** | High-Speed Cloud | `8000` | 🟡 Moderate | `C / Python` / `MariaDB + Memcached` | HDD | Fast, reliable self-hosted file syncing solution for large document libraries. |
| **Kopia** | Encrypted Backup | `5115` | 🟢 Lightweight | `Go / Vue` / `Flat Files` | HDD | Fast, secure backup tool with deduplication, compression, and encryption. |
| **Restic** | CLI Backup Tool | Host Native | ⚡ Ultra-Light | `Go` / `Repository Index` | HDD | Secure CLI backup program supporting SFTP, S3, MinIO, and local mounts. |
| **BorgBackup** | Deduplicating Backup | Host Native | 🟢 Lightweight | `Python / C` / `Flat Files` | HDD | Space-efficient deduplicating backup tool with authenticated encryption. |
| **Mealie** | Recipe & Meal Planner| `9000` | 🟢 Lightweight | `Python (FastAPI) / Vue` / `SQLite / Postgres` | SSD | Recipe manager and meal planner with automatic web scraping. |

---

## 7. Security, Password Management & Auth

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Vaultwarden** | Password Manager | `8082` | ⚡ Ultra-Light | `Rust` / `SQLite / MariaDB / Postgres` | SSD | Lightweight Bitwarden-compatible server written in Rust. *(<30MB RAM)* |
| **Passbolt** | Team Passwords | `80` | 🟡 Moderate | `PHP (CakePHP)` / `MariaDB / MySQL` | SSD | Open-source password manager designed for team security collaboration. |
| **Authelia** | SSO & 2FA | `9091` | 🟢 Lightweight | `Go` / `SQLite / Redis / Postgres` | SSD | Companion authentication server adding 2FA and SSO to reverse proxies. |
| **Authentik** | Identity Provider | `9000` | 🔴 Heavy | `Python / Go` / `PostgreSQL + Redis` | SSD | Comprehensive Identity Provider supporting OAuth2, SAML, and LDAP. |
| **Keycloak** | Enterprise IAM | `8080` | 🔴 Heavy | `Java (Quarkus)` / `PostgreSQL` | SSD | Industry-standard open-source Identity and Access Management system. |
| **Kanidm** | Identity / LDAP | `8443` | 🟢 Lightweight | `Rust` / `Embedded DB` | SSD | Modern, fast identity management server written in Rust. |
| **CrowdSec** | Intrusion Prevention | `8080` | 🟢 Lightweight | `Go` / `SQLite` | SSD | Collaborative security engine that blocks malicious IPs analyzing log patterns. |
| **Fail2ban** | IP Banning | Host Native | ⚡ Ultra-Light | `Python` / `Flat Files` | Host | Scans log files and bans IPs showing malicious signature patterns. |

---

## 8. Productivity, Documents & Knowledge Bases

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Leantime** | Project Management | `8090` | 🟡 Moderate | `PHP / Vue` / `MariaDB / MySQL` | SSD | Lean project management platform designed for developers. *(Active)* |
| **Vikunja** | Task & ToDo Manager | `3456` | 🟢 Lightweight | `Go / Vue` / `SQLite / Postgres` | SSD | Feature-rich task manager with ToDo lists, Kanban, Gantt charts, and reminders. |
| **Planka** | Kanban Board | `1337` | 🟢 Lightweight | `Node.js / React` / `PostgreSQL` | SSD | Elegant real-time Kanban board for project tracking (Trello alternative). |
| **BookStack** | Wiki & Documentation | `8080` | 🟡 Moderate | `PHP (Laravel)` / `MariaDB / MySQL` | SSD | Highly organized, book-structured wiki platform for team documentation. |
| **Outline** | Knowledge Base | `3000` | 🟡 Moderate | `Node.js / React` / `PostgreSQL + Redis` | SSD | Fast, collaborative wiki and knowledge base editor with markdown support. |
| **Wiki.js** | Wiki Engine | `3000` | 🟢 Lightweight | `Node.js` / `PostgreSQL / SQLite` | SSD | Modern wiki engine supporting Git sync, Markdown, and WYSIWYG. |
| **Paperless-ngx** | Document OCR | `8000` | 🟡 Moderate | `Python (Django) / Angular` / `PostgreSQL + Redis + Tesseract OCR` | SSD + HDD | Converts physical papers into searchable digital PDFs via OCR. |
| **Trilium Notes** | Knowledge Base | `8080` | 🟢 Lightweight | `Node.js` / `SQLite` | SSD | Hierarchical note-taking app with mind mapping and code editing capabilities. |
| **Memos** | Micro-Notes | `5230` | ⚡ Ultra-Light | `Go / React` / `SQLite` | SSD | Privacy-first, lightweight memo hub for quick micro-thoughts. |
| **Stirling-PDF** | PDF Utility Suite | `8080` | 🟡 Moderate | `Java (Spring Boot)` / `Stateless (No DB)` | Stateless | Browser utility for merging, splitting, compressing, and editing PDFs. |
| **Hoarder** | Bookmark & Curation | `3000` | 🟡 Moderate | `TypeScript / Next.js` / `PostgreSQL + Meilisearch` | SSD | AI-powered bookmarking app with automatic tagging, OCR, and full-page archiving. |
| **Wallabag** | Read-It-Later | `80` | 🟢 Lightweight | `PHP (Symfony)` / `SQLite / Postgres` | SSD | Save articles and web pages for offline reading in clean text view. |
| **Open WebUI** | AI Productivity Hub | `8080` | 🟢 Lightweight | `Python (FastAPI) / Svelte` / `SQLite` | SSD | Sleek, self-hosted ChatGPT-style UI for interacting with local LLMs (Ollama). |
| **LibreChat** | AI Chat Workspace | `3080` | 🟡 Moderate | `Node.js / React` / `MongoDB + Redis` | SSD | Advanced AI chat UI supporting Claude, OpenAI, Ollama, and agent plugins. |
| **Affine** | Hyper-Workspace | `3000` | 🔴 Heavy | `TypeScript / Rust` / `PostgreSQL + Redis` | SSD | Privacy-first workspace combining documents, whiteboards, and tables. |
| **ChangeDetection.io**| Website Monitor| `5000` | 🟢 Lightweight | `Python` / `SQLite` | SSD | Automated web page change monitoring and notification tool. |

---

## 9. Home Automation & IoT

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Home Assistant** | Smart Home Hub | `8123` | 🟡 Moderate | `Python` / `SQLite` | SSD | Open-source home automation platform integrating thousands of smart devices. |
| **Node-RED** | Flow Automation | `1880` | 🟢 Lightweight | `Node.js` / `JSON Flows` | SSD | Flow-based programming tool for wiring together hardware devices and APIs. |
| **Zigbee2MQTT** | Zigbee Bridge | `8080` | ⚡ Ultra-Light | `Node.js` / `JSON Config` | SSD | Connects Zigbee smart devices directly to MQTT brokers without vendor hubs. |
| **Mosquitto** | MQTT Broker | `1883` | ⚡ Ultra-Light | `C` / `Stateless` | SSD | Lightweight MQTT message broker for IoT device telemetry and command routing. |
| **ESPHome** | Microcontroller Hub| `6053` | 🟢 Lightweight | `Python / C++` / `Flat Files` | SSD | System for controlling ESP8266/ESP32 microcontrollers via simple YAML configs. |
| **Scrypted** | Camera Integration | `10443` | 🟡 Moderate | `TypeScript / Node.js` / `LevelDB` | SSD | High-performance home video integration platform with HomeKit HomeKit Secure Video support. |

---

## 10. Sysadmin, DevOps & Container Utilities

| App / Tool | Category | Port | Footprint | Tech Stack & Database | Storage | Description |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Portainer** | Container Manager | `9000` | ⚡ Ultra-Light | `Go / Angular` / `BoltDB` | SSD | GUI tool for managing Docker containers, stacks, volumes, and networks. *(Active)* |
| **Dockge** | Docker Stack Manager | `5001` | ⚡ Ultra-Light | `Node.js / Vue` / `YAML Compose Files` | SSD | Reactive, clean Docker Compose stack manager created by the author of Uptime Kuma. |
| **Forgejo / Gitea** | Git Server | `3000` | 🟢 Lightweight | `Go / React` / `SQLite / PostgreSQL` | SSD | Lightweight, fast self-hosted Git service (GitHub/GitLab alternative). |
| **Woodpecker CI** | CI/CD Engine | `8000` | 🟢 Lightweight | `Go / Vue` / `SQLite / Postgres` | SSD | Simple, container-based CI/CD engine that integrates with Forgejo/Gitea. |
| **IT-Tools** | Admin Utilities | `8091` | ⚡ Ultra-Light | `Vue.js (Client-side JS)` / `Stateless (No DB)` | Stateless | Handy online tools for developers and sysadmins. *(Active in homelab)* |
| **Watchtower** | Auto-Updater | Background | ⚡ Ultra-Light | `Go` / `Stateless` | Stateless | Automatically updates running Docker containers when new images are published. |
| **CyberChef** | Data Manipulation | `8000` | ⚡ Ultra-Light | `JavaScript (Client-side)` / `Stateless` | Stateless | The "Swiss Army Knife" for encoding, decoding, encryption, and data parsing. |
| **n8n** | Workflow Automation | `5678` | 🟡 Moderate | `Node.js / TypeScript` / `SQLite / PostgreSQL` | SSD | Node-based workflow automation tool (Zapier alternative). |
| **Appsmith** | Internal Tool Builder| `80` | 🔴 Heavy | `Java / React` / `MongoDB + Redis` | SSD | Low-code platform to build internal admin panels and dashboards. |

---

## 💡 Summary Comparison

- **Top Ultra-Lightweight Champions (`< 50 MB` RAM)**: `Vaultwarden` (Rust), `Cloudflare Tunnel` (Go), `Dockge` (Node/Vue), `Memos` (Go), `Navidrome` (Go), `Glance` (Go), `AdGuard Home` (Go), `Filebrowser` (Go), `Portainer` (Go), `Dozzle` (Go), `Beszel` (Go), `ntfy` (Go), `Actual Budget` (Node/SQLite).
- **Heavyweight Enterprise Stacks (`8000 MB+` RAM)**: `Maybe` (Rails + Postgres + Redis), `Immich` (Postgres + Redis + Machine Learning Workers), `Nextcloud` (PHP + Postgres/MariaDB + Redis), `Authentik` (Python + Postgres + Redis), `Keycloak` (Java + Postgres), `Appsmith` (Java + MongoDB + Redis).
