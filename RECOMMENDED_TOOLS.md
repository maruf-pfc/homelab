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

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Jellyfin** | Media Server | `8096` | 🟡 Moderate | Free & open-source media system for movies, TV, and music. *(Transcoding spikes CPU/GPU)* | `C# (.NET)` / `SQLite` | SSD + HDD |
| **Plex** | Media Server | `32400` | 🟡 Moderate | Popular media server with broad client app support and remote sharing. | `C++ / Go` / `SQLite` | SSD + HDD |
| **Emby** | Media Server | `8096` | 🟡 Moderate | Feature-rich media server alternative to Plex and Jellyfin. | `C# (.NET)` / `SQLite` | SSD + HDD |
| **Sonarr** | Media PVR | `8989` | 🟢 Lightweight | Smart PVR for downloading and managing TV shows automatically. | `C# (.NET)` / `SQLite` | SSD |
| **Radarr** | Media PVR | `7878` | 🟢 Lightweight | Smart PVR for downloading and organizing movie libraries automatically. | `C# (.NET)` / `SQLite` | SSD |
| **Lidarr** | Music PVR | `8686` | 🟢 Lightweight | Automated music downloader and library manager for Usenet and Torrent. | `C# (.NET)` / `SQLite` | SSD |
| **Readarr** | Book PVR | `8787` | 🟢 Lightweight | Book and audiobook collection manager for Usenet and BitTorrent. | `C# (.NET)` / `SQLite` | SSD |
| **Prowlarr** | Indexer Proxy | `9696` | 🟢 Lightweight | Torrent/Usenet indexer proxy syncing with Sonarr, Radarr, and Readarr. | `C# (.NET)` / `SQLite` | SSD |
| **Bazarr** | Subtitles | `6767` | 🟢 Lightweight | Companion app to Sonarr/Radarr for automated subtitle downloads. | `Python` / `SQLite` | SSD |
| **Jellyseerr** | Requests | `5055` | 🟢 Lightweight | Sleek media request management tool for Jellyfin and Plex users. | `Node.js / TypeScript` / `SQLite` | SSD |
| **Overseerr** | Requests | `5055` | 🟢 Lightweight | Native Plex media request management and discovery interface. | `Node.js / TypeScript` / `SQLite` | SSD |
| **Navidrome** | Music Server | `4533` | ⚡ Ultra-Light | Lightweight, Subsonic-compatible streaming music server written in Go. | `Go / React` / `SQLite` | SSD + HDD |
| **Audiobookshelf** | Audiobooks | `13378` | 🟢 Lightweight | Self-hosted audiobook and podcast server with mobile app sync. | `Node.js / Vue` / `SQLite` | SSD + HDD |
| **Kavita** | Manga / Books | `5000` | 🟢 Lightweight | Fast self-hosted digital library for manga, comics, and eBooks. | `C# (.NET)` / `SQLite` | SSD + HDD |
| **Komga** | Manga Reader | `8080` | 🟡 Moderate | Media server for comics, manga, BDs, and eBooks with OPDS support. | `Kotlin (JVM)` / `SQLite` | SSD + HDD |
| **Tdarr** | Transcoding | `8265` | 🟡 Moderate | Distributed media transcoding engine for converting libraries to H265/AV1. | `Node.js` / `MongoDB` | SSD |
| **qBittorrent** | Download Client | `8080` | 🟢 Lightweight | High-performance BitTorrent client with Web UI and Web API. | `C++ (Qt / libtorrent)` / `Flat Files` | HDD |
| **SABnzbd** | Usenet Client | `8080` | 🟢 Lightweight | Open-source binary newsreader for downloading files from Usenet. | `Python` / `Flat Files` | HDD |
| **Unpackerr** | Extraction | Background | ⚡ Ultra-Light | Automatically extracts downloaded archives (rar, zip) for Arr services. | `Go` / `Stateless` | HDD |

---

## 2. Finance & Wealth Management

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Maybe** | Wealth & Net Worth | `8092` | 🟡 Moderate | Startup-grade net worth, investment & personal finance tracker. *(Active in homelab)* | `Ruby on Rails` / `PostgreSQL + Redis` | SSD |
| **Actual Budget** | Personal Finance | `5006` | ⚡ Ultra-Light | Privacy-first, fast envelope budgeting manager with End-to-End Encryption. | `Node.js / React` / `SQLite` | SSD |
| **Firefly III** | Expense Auditor | `8080` | 🟡 Moderate | Detailed double-entry expense manager with powerful automation rules. | `PHP (Laravel)` / `MariaDB / Postgres` | SSD |
| **Ghostfolio** | Investment Portfolio| `3333` | 🟢 Lightweight | Privacy-focused wealth management dashboard for stock & crypto tracking. | `TypeScript (NestJS)` / `PostgreSQL + Redis` | SSD |
| **Wallos** | Subscription Tracker| `80` | ⚡ Ultra-Light | Dedicated tracker for recurring subscriptions with renewal notification alerts. | `PHP` / `SQLite` | SSD |
| **Fava + Beancount** | Plain Text Finance | `5000` | ⚡ Ultra-Light | Plain-text accounting Web UI for hacker-grade Git-versioned bookkeeping. | `Python` / `Plain Text (.beancount)` | SSD |

---

## 3. Dashboards & Portals

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Dashy** | Dashboard | `7575` | 🟢 Lightweight | Feature-rich, highly customizable homelab dashboard. *(Active in homelab)* | `Vue.js` / `YAML Config (No DB)` | SSD |
| **Homarr** | Dashboard | `7575` | 🟢 Lightweight | Customizable dashboard with real-time Docker integration widgets. | `Next.js / Node.js` / `SQLite` | SSD / HDD |
| **Homepage** | Dashboard | `3000` | 🟢 Lightweight | Highly customizable, YAML-configured dashboard with service integration badges. | `Next.js / React` / `YAML Config (No DB)` | SSD |
| **Glance** | All-in-One Feed | `8080` | ⚡ Ultra-Light | Ultra-fast feed aggregator for RSS, Reddit, weather, and server status. | `Go` / `YAML Config (No DB)` | SSD |
| **Linkwarden** | Bookmarks | `3000` | 🟡 Moderate | Self-hosted bookmark manager that archives webpages and PDFs automatically. | `TypeScript / Next.js` / `PostgreSQL` | SSD |
| **Shiori** | Simple Bookmarks | `8080` | ⚡ Ultra-Light | Simple, clean bookmark manager written in Go (Pocket alternative). | `Go` / `SQLite` | SSD |
| **Bento** | Startpage | `80` | ⚡ Ultra-Light | Minimalist, elegant browser startpage with dark/light themes. | `Vue.js` / `JSON Config` | SSD |
| **Flame** | Startpage | `5005` | ⚡ Ultra-Light | Self-hosted startpage for application links with built-in web search. | `Node.js` / `SQLite` | SSD |

---

## 4. Network, DNS & Ingress

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Cloudflare Tunnel (`cloudflared`)** | Zero Trust Ingress | Outbound | ⚡ Ultra-Light | Securely exposes local web apps to the internet without open router ports. | `Go` / `Stateless (No DB)` | Container |
| **AdGuard Home** | DNS & Ad Blocking | `53` / `3002` | ⚡ Ultra-Light | Network-wide ad blocker, tracking protection, and local DNS rewrite engine. | `Go` / `YAML + Internal Storage` | SSD |
| **Pi-hole** | DNS & Ad Blocking | `53` / `80` | ⚡ Ultra-Light | Classic DNS sinkhole for network-wide ad blocking and query logging. | `C / Shell / PHP` / `SQLite` | SSD |
| **Headscale** | Control Plane | `8080` | ⚡ Ultra-Light | Open-source self-hosted control server for Tailscale mesh networks. | `Go` / `SQLite` | SSD |
| **Caddy** | Web Server / Proxy | `80` / `443` | ⚡ Ultra-Light | Modern web server with automated HTTPS certificate issuance via Let's Encrypt. | `Go` / `Caddyfile / JSON` | SSD |
| **Traefik** | Reverse Proxy | `80` / `443` | 🟢 Lightweight | Cloud-native reverse proxy with dynamic Docker label discovery. | `Go` / `YAML / Docker API` | SSD |
| **Nginx Proxy Manager** | Reverse Proxy | `80` / `443` | 🟢 Lightweight | Web GUI for managing Nginx proxy routes and Let's Encrypt TLS certs. | `Node.js / Python / Nginx` / `SQLite` | SSD |
| **Nginx UI** | Reverse Proxy | `8080` | 🟢 Lightweight | Modern, lightweight Nginx management interface with real-time stats. | `Go / Vue` / `SQLite` | SSD |
| **Tailscale** | Mesh VPN | Host Native | ⚡ Ultra-Light | Zero-config mesh VPN based on WireGuard for secure remote access. | `Go` / `Stateless` | Host |
| **Netbird** | Mesh VPN | `80` / `443` | 🟢 Lightweight | Zero-configuration mesh VPN built on WireGuard with SSO integration. | `Go` / `SQLite / Postgres` | SSD |

---

## 5. Monitoring, Logging & Observability

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Prometheus** | Metrics TSDB | `9093` | 🟡 Moderate | Time-series metrics collection engine. *(Active in homelab)* | `Go` / `Built-in TSDB` | SSD + HDD |
| **Grafana** | Visualization | `3005` | 🟢 Lightweight | Analytics & dashboard platform for visualizing Prometheus metrics. *(Active)* | `Go / React` / `SQLite` | SSD |
| **Uptime Kuma** | Status Monitoring | `3001` | 🟢 Lightweight | Fancy self-hosted monitoring tool supporting HTTP, Ping, and push alerts. *(Active)* | `Node.js / Vue` / `SQLite` | SSD |
| **Node Exporter** | Host Metrics | `9100` | ⚡ Ultra-Light | Prometheus hardware exporter for CPU, RAM, Disk, and Network metrics. *(Active)* | `Go` / `Stateless` | Host |
| **cAdvisor** | Container Metrics | `8083` | 🟢 Lightweight | Resource usage and performance analyzer for running Docker containers. *(Active)* | `Go` / `Stateless` | Host |
| **Beszel** | Server Monitoring | `8090` | ⚡ Ultra-Light | Ultra-lightweight server monitoring hub with Docker stats and alerts. | `Go / PocketBase` / `SQLite` | SSD |
| **Dozzle** | Log Viewer | `8080` | ⚡ Ultra-Light | Real-time log viewer for Docker containers with instant filtering. | `Go / Vue` / `Stateless (No DB)` | Lightweight |
| **Loki + Promtail** | Log Aggregation | `3100` | 🟡 Moderate | Prometheus-inspired log aggregation system optimized for Grafana. | `Go` / `Loki Index + Filesystem` | SSD + HDD |
| **Gatus** | Health Dashboard | `8080` | ⚡ Ultra-Light | Developer-oriented health dashboard with status badges and incident logs. | `Go` / `SQLite / Postgres` | SSD |
| **ntfy** | Push Notifications | `80` | ⚡ Ultra-Light | HTTP-based pub-sub notification service for sending phone/desktop alerts. | `Go` / `SQLite` | SSD |
| **Gotify** | Push Notifications | `80` | ⚡ Ultra-Light | Self-hosted push notification server for real-time alert messages. | `Go / React` / `SQLite` | SSD |
| **Scrutiny** | Drive Health | `8080` | 🟢 Lightweight | Web UI for monitoring S.M.A.R.T. hard drive health metrics and failure predictions. | `Go / Vue` / `InfluxDB` | SSD |

---

## 6. Storage, Cloud & Photo Management

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Immich** | Photo & Video Backup | `2283` | 🔴 Heavy | High-performance Google Photos alternative with AI face recognition. | `TypeScript / Dart` / `PostgreSQL + Redis + Vector DB` | SSD + HDD |
| **Photoprism** | Photo Management | `2342` | 🔴 Heavy | AI-powered photo app using computer vision for automatic categorization. | `Go / Vue` / `MariaDB + TensorFlow` | SSD + HDD |
| **Nextcloud** | Private Cloud Suite | `8080` | 🔴 Heavy | Enterprise cloud suite for file storage, sync, calendar, and office docs. | `PHP / Vue` / `PostgreSQL / MariaDB + Redis` | SSD + HDD |
| **ownCloud Infinite Scale**| Cloud Storage | `9200` | 🟢 Lightweight | High-speed, microservice-based Cloud storage engine rewritten in Go. | `Go` / `Metadata Index` | HDD |
| **Filebrowser** | File Manager | `8082` | ⚡ Ultra-Light | Simple, browser-based file manager for uploads and directory browsing. | `Go / Vue` / `SQLite` | HDD |
| **Syncthing** | Continuous File Sync | `8384` | 🟢 Lightweight | Decentralized, peer-to-peer file synchronization between devices. | `Go` / `LevelDB` | HDD |
| **Seafile** | High-Speed Cloud | `8000` | 🟡 Moderate | Fast, reliable self-hosted file syncing solution for large document libraries. | `C / Python` / `MariaDB + Memcached` | HDD |
| **Kopia** | Encrypted Backup | `5115` | 🟢 Lightweight | Fast, secure backup tool with deduplication, compression, and encryption. | `Go / Vue` / `Flat Files` | HDD |
| **Restic** | CLI Backup Tool | Host Native | ⚡ Ultra-Light | Secure CLI backup program supporting SFTP, S3, MinIO, and local mounts. | `Go` / `Repository Index` | HDD |
| **BorgBackup** | Deduplicating Backup | Host Native | 🟢 Lightweight | Space-efficient deduplicating backup tool with authenticated encryption. | `Python / C` / `Flat Files` | HDD |
| **Mealie** | Recipe & Meal Planner| `9000` | 🟢 Lightweight | Recipe manager and meal planner with automatic web scraping. | `Python (FastAPI) / Vue` / `SQLite / Postgres` | SSD |

---

## 7. Security, Password Management & Auth

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Vaultwarden** | Password Manager | `8082` | ⚡ Ultra-Light | Lightweight Bitwarden-compatible server written in Rust. *(<30MB RAM)* | `Rust` / `SQLite / MariaDB / Postgres` | SSD |
| **Passbolt** | Team Passwords | `80` | 🟡 Moderate | Open-source password manager designed for team security collaboration. | `PHP (CakePHP)` / `MariaDB / MySQL` | SSD |
| **Authelia** | SSO & 2FA | `9091` | 🟢 Lightweight | Companion authentication server adding 2FA and SSO to reverse proxies. | `Go` / `SQLite / Redis / Postgres` | SSD |
| **Authentik** | Identity Provider | `9000` | 🔴 Heavy | Comprehensive Identity Provider supporting OAuth2, SAML, and LDAP. | `Python / Go` / `PostgreSQL + Redis` | SSD |
| **Keycloak** | Enterprise IAM | `8080` | 🔴 Heavy | Industry-standard open-source Identity and Access Management system. | `Java (Quarkus)` / `PostgreSQL` | SSD |
| **Kanidm** | Identity / LDAP | `8443` | 🟢 Lightweight | Modern, fast identity management server written in Rust. | `Rust` / `Embedded DB` | SSD |
| **CrowdSec** | Intrusion Prevention | `8080` | 🟢 Lightweight | Collaborative security engine that blocks malicious IPs analyzing log patterns. | `Go` / `SQLite` | SSD |
| **Fail2ban** | IP Banning | Host Native | ⚡ Ultra-Light | Scans log files and bans IPs showing malicious signature patterns. | `Python` / `Flat Files` | Host |

---

## 8. Productivity, Documents & Knowledge Bases

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Leantime** | Project Management | `8090` | 🟡 Moderate | Lean project management platform designed for developers. *(Active)* | `PHP / Vue` / `MariaDB / MySQL` | SSD |
| **Vikunja** | Task & ToDo Manager | `3456` | 🟢 Lightweight | Feature-rich task manager with ToDo lists, Kanban, Gantt charts, and reminders. | `Go / Vue` / `SQLite / Postgres` | SSD |
| **Planka** | Kanban Board | `1337` | 🟢 Lightweight | Elegant real-time Kanban board for project tracking (Trello alternative). | `Node.js / React` / `PostgreSQL` | SSD |
| **BookStack** | Wiki & Documentation | `8080` | 🟡 Moderate | Highly organized, book-structured wiki platform for team documentation. | `PHP (Laravel)` / `MariaDB / MySQL` | SSD |
| **Outline** | Knowledge Base | `3000` | 🟡 Moderate | Fast, collaborative wiki and knowledge base editor with markdown support. | `Node.js / React` / `PostgreSQL + Redis` | SSD |
| **Wiki.js** | Wiki Engine | `3000` | 🟢 Lightweight | Modern wiki engine supporting Git sync, Markdown, and WYSIWYG. | `Node.js` / `PostgreSQL / SQLite` | SSD |
| **Paperless-ngx** | Document OCR | `8000` | 🟡 Moderate | Converts physical papers into searchable digital PDFs via OCR. | `Python (Django) / Angular` / `PostgreSQL + Redis + Tesseract OCR` | SSD + HDD |
| **Trilium Notes** | Knowledge Base | `8080` | 🟢 Lightweight | Hierarchical note-taking app with mind mapping and code editing capabilities. | `Node.js` / `SQLite` | SSD |
| **Memos** | Micro-Notes | `5230` | ⚡ Ultra-Light | Privacy-first, lightweight memo hub for quick micro-thoughts. | `Go / React` / `SQLite` | SSD |
| **Stirling-PDF** | PDF Utility Suite | `8080` | 🟡 Moderate | Browser utility for merging, splitting, compressing, and editing PDFs. | `Java (Spring Boot)` / `Stateless (No DB)` | Stateless |
| **Hoarder** | Bookmark & Curation | `3000` | 🟡 Moderate | AI-powered bookmarking app with automatic tagging, OCR, and full-page archiving. | `TypeScript / Next.js` / `PostgreSQL + Meilisearch` | SSD |
| **Wallabag** | Read-It-Later | `80` | 🟢 Lightweight | Save articles and web pages for offline reading in clean text view. | `PHP (Symfony)` / `SQLite / Postgres` | SSD |
| **Open WebUI** | AI Productivity Hub | `8080` | 🟢 Lightweight | Sleek, self-hosted ChatGPT-style UI for interacting with local LLMs (Ollama). | `Python (FastAPI) / Svelte` / `SQLite` | SSD |
| **LibreChat** | AI Chat Workspace | `3080` | 🟡 Moderate | Advanced AI chat UI supporting Claude, OpenAI, Ollama, and agent plugins. | `Node.js / React` / `MongoDB + Redis` | SSD |
| **Affine** | Hyper-Workspace | `3000` | 🔴 Heavy | Privacy-first workspace combining documents, whiteboards, and tables. | `TypeScript / Rust` / `PostgreSQL + Redis` | SSD |
| **ChangeDetection.io**| Website Monitor| `5000` | 🟢 Lightweight | Automated web page change monitoring and notification tool. | `Python` / `SQLite` | SSD |

---

## 9. Home Automation & IoT

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Home Assistant** | Smart Home Hub | `8123` | 🟡 Moderate | Open-source home automation platform integrating thousands of smart devices. | `Python` / `SQLite` | SSD |
| **Node-RED** | Flow Automation | `1880` | 🟢 Lightweight | Flow-based programming tool for wiring together hardware devices and APIs. | `Node.js` / `JSON Flows` | SSD |
| **Zigbee2MQTT** | Zigbee Bridge | `8080` | ⚡ Ultra-Light | Connects Zigbee smart devices directly to MQTT brokers without vendor hubs. | `Node.js` / `JSON Config` | SSD |
| **Mosquitto** | MQTT Broker | `1883` | ⚡ Ultra-Light | Lightweight MQTT message broker for IoT device telemetry and command routing. | `C` / `Stateless` | SSD |
| **ESPHome** | Microcontroller Hub| `6053` | 🟢 Lightweight | System for controlling ESP8266/ESP32 microcontrollers via simple YAML configs. | `Python / C++` / `Flat Files` | SSD |
| **Scrypted** | Camera Integration | `10443` | 🟡 Moderate | High-performance home video integration platform with HomeKit HomeKit Secure Video support. | `TypeScript / Node.js` / `LevelDB` | SSD |

---

## 10. Sysadmin, DevOps & Container Utilities

| App / Tool | Category | Port | Footprint | Description | Tech Stack & Database | Storage |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Portainer** | Container Manager | `9000` | ⚡ Ultra-Light | GUI tool for managing Docker containers, stacks, volumes, and networks. *(Active)* | `Go / Angular` / `BoltDB` | SSD |
| **Dockge** | Docker Stack Manager | `5001` | ⚡ Ultra-Light | Reactive, clean Docker Compose stack manager created by the author of Uptime Kuma. | `Node.js / Vue` / `YAML Compose Files` | SSD |
| **Forgejo / Gitea** | Git Server | `3000` | 🟢 Lightweight | Lightweight, fast self-hosted Git service (GitHub/GitLab alternative). | `Go / React` / `SQLite / PostgreSQL` | SSD |
| **Woodpecker CI** | CI/CD Engine | `8000` | 🟢 Lightweight | Simple, container-based CI/CD engine that integrates with Forgejo/Gitea. | `Go / Vue` / `SQLite / Postgres` | SSD |
| **IT-Tools** | Admin Utilities | `8091` | ⚡ Ultra-Light | Handy online tools for developers and sysadmins. *(Active in homelab)* | `Vue.js (Client-side JS)` / `Stateless (No DB)` | Stateless |
| **Watchtower** | Auto-Updater | Background | ⚡ Ultra-Light | Automatically updates running Docker containers when new images are published. | `Go` / `Stateless` | Stateless |
| **CyberChef** | Data Manipulation | `8000` | ⚡ Ultra-Light | The "Swiss Army Knife" for encoding, decoding, encryption, and data parsing. | `JavaScript (Client-side)` / `Stateless` | Stateless |
| **n8n** | Workflow Automation | `5678` | 🟡 Moderate | Node-based workflow automation tool (Zapier alternative). | `Node.js / TypeScript` / `SQLite / PostgreSQL` | SSD |
| **Appsmith** | Internal Tool Builder| `80` | 🔴 Heavy | Low-code platform to build internal admin panels and dashboards. | `Java / React` / `MongoDB + Redis` | SSD |

---

## 💡 Summary Comparison

- **Top Ultra-Lightweight Champions (`< 50 MB` RAM)**: `Vaultwarden` (Rust), `Cloudflare Tunnel` (Go), `Dockge` (Node/Vue), `Memos` (Go), `Navidrome` (Go), `Glance` (Go), `AdGuard Home` (Go), `Filebrowser` (Go), `Portainer` (Go), `Dozzle` (Go), `Beszel` (Go), `ntfy` (Go), `Actual Budget` (Node/SQLite).
- **Heavyweight Enterprise Stacks (`800 MB+` RAM)**: `Maybe` (Rails + Postgres + Redis), `Immich` (Postgres + Redis + Machine Learning Workers), `Nextcloud` (PHP + Postgres/MariaDB + Redis), `Authentik` (Python + Postgres + Redis), `Keycloak` (Java + Postgres), `Appsmith` (Java + MongoDB + Redis).
