/**
 * Homelab Infrastructure & Full Resource Catalog Database
 * Integrated from RECOMMENDED_TOOLS.md and RECOMMENDED_OPEN_SOURCE_APPS.md
 */

const HOMELAB_DATA = {
  system: {
    hostname: "mms",
    os: "Ubuntu Linux",
    lanIp: "192.168.1.75",
    domain: "baaankai.dpdns.org",
    ingress: "Cloudflare Zero Trust Tunnel (Host Systemd Daemon: cloudflared v2025.7.0)",
    networkBridge: "homelab (Docker Bridge, isolated)",
    storageTier1: {
      name: "Fast SSD NVMe Storage",
      mount: "/home/maruf/homelab/volumes",
      purpose: "Transactional databases, in-memory caches, application state, low-latency diffs"
    },
    storageTier2: {
      name: "Bulk HDD Storage",
      mount: "/home/maruf/MyHDDStorage",
      purpose: "Jellyfin media libraries (Movies, TV, Music, Videos), Prometheus TSDB long-term retention, Portainer volume state, nightly backup archives"
    },
    backupCadence: "Nightly at 03:00 AM via cron (scripts/backup.sh)",
    backupRetention: "Keeps 1 most recent master snapshot; mirrors to HDD and purges older archives"
  },

  categories: [
    { id: "media", name: "Media & Streaming", count: 15, icon: "film-strip", desc: "Streaming servers, PVR indexers, automated media downloaders, and readers." },
    { id: "finance", name: "Finance & Wealth", count: 6, icon: "wallet", desc: "Personal finance, net worth tracking, double-entry bookkeeping, and subscriptions." },
    { id: "dashboards", name: "Dashboards & Portals", count: 6, icon: "layout", desc: "Homelab control panels, bookmark managers, and glanceable server feeds." },
    { id: "network", name: "Network & Ingress", count: 8, icon: "globe", desc: "Zero Trust tunnels, DNS ad-blockers, reverse proxies, and mesh VPNs." },
    { id: "monitoring", name: "Monitoring & Observability", count: 10, icon: "activity", desc: "Prometheus metrics, Grafana dashboards, cAdvisor, and hardware telemetry." },
    { id: "storage", name: "Storage, Cloud & Backup", count: 11, icon: "hard-drive", desc: "Photo hubs, private cloud sync, continuous replication, and deduplicated backup tools." },
    { id: "security", name: "Security & Identity", count: 8, icon: "shield-check", desc: "Password vaults, SSO/2FA forward authentication, and intrusion prevention." },
    { id: "productivity", name: "Productivity & Docs", count: 12, icon: "check-square", desc: "Project management, Kanban boards, wiki systems, and document processing." },
    { id: "automation", name: "Home Automation & IoT", count: 7, icon: "cpu", desc: "Smart home controllers, MQTT brokers, Zigbee bridges, and NVR video cameras." },
    { id: "sysadmin", name: "Sysadmin & DevOps", count: 8, icon: "terminal", desc: "Container orchestrators, Git servers, sysadmin utility toolboxes, and auto-updaters." },
    { id: "ai", name: "Local AI & LLM Hub", count: 5, icon: "sparkle", desc: "Self-hosted LLM runners, AI chat workspaces, and document RAG pipelines." },
    { id: "workflows", name: "Workflows & Integration", count: 4, icon: "git-merge", desc: "Low-code flow automation, webhook routers, and scheduled event processing." }
  ],

  services: [
    // --- Active & Configured Homelab Container Stacks ---
    {
      id: "cloudflare-tunnel",
      name: "Cloudflare Tunnel",
      category: "network",
      status: "active",
      hostPort: "Outbound Only",
      internalPort: "N/A",
      storageTier: "Host Daemon",
      storagePath: "/usr/local/bin/cloudflared",
      techStack: "Go",
      database: "Stateless (Cloudflare Edge)",
      domain: "Managed via Cloudflare Zero Trust Dashboard",
      description: "Secure ingress routing external traffic to Docker services without opening router ports or exposing public IP. Runs as a persistent host systemd daemon.",
      healthcheck: "Systemd service status (4 active QUIC/HTTP2 tunnel connections)",
      url: "https://one.dash.cloudflare.com"
    },
    {
      id: "portainer",
      name: "Portainer CE",
      category: "sysadmin",
      status: "active",
      hostPort: "9000, 9443, 8000",
      internalPort: "9000 (HTTP), 9443 (HTTPS)",
      storageTier: "HDD",
      storagePath: "/home/maruf/MyHDDStorage/docker/volumes/portainer",
      techStack: "Go / Angular",
      database: "BoltDB",
      description: "Centralized GUI for Docker container lifecycle, image repository pruning, volume inspections, and stack composition.",
      healthcheck: "Docker engine ping & web endpoint",
      url: "http://192.168.1.75:9000"
    },
    {
      id: "it-tools",
      name: "IT-Tools",
      category: "sysadmin",
      status: "active",
      hostPort: "8091",
      internalPort: "80",
      storageTier: "Stateless",
      storagePath: "In-memory container",
      techStack: "Vue 3 / TypeScript",
      database: "Stateless (Client-side)",
      description: "Collection of handy online tools for developers and sysadmins (token generators, converters, regex testers, hash calculators).",
      healthcheck: "HTTP 200 GET /",
      url: "http://192.168.1.75:8091"
    },
    {
      id: "forgejo",
      name: "Forgejo Git",
      category: "sysadmin",
      status: "active",
      hostPort: "3000 (HTTP), 2222 (SSH)",
      internalPort: "3000, 22",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/forgejo",
      techStack: "Go / React",
      database: "SQLite",
      domain: "forgejo.baaankai.dpdns.org",
      description: "Lightweight, privacy-respecting self-hosted Git repository server with issue tracking, pull requests, and webhooks.",
      healthcheck: "HTTP GET /api/v1/version",
      url: "https://forgejo.baaankai.dpdns.org"
    },
    {
      id: "ntfy",
      name: "ntfy Push Service",
      category: "sysadmin",
      status: "active",
      hostPort: "8088",
      internalPort: "80",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/ntfy",
      techStack: "Go",
      database: "SQLite cache",
      domain: "ntfy.baaankai.dpdns.org",
      description: "HTTP-based pub-sub push notification bridge for sending instant alerts to phones and desktops from backup scripts and monitoring jobs.",
      healthcheck: "HTTP GET /v1/health",
      url: "https://ntfy.baaankai.dpdns.org"
    },
    {
      id: "leantime",
      name: "Leantime Project Hub",
      category: "productivity",
      status: "active",
      hostPort: "8090",
      internalPort: "8080",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/leantime & /github/leantime",
      techStack: "PHP / Vue / Tailwind",
      database: "MariaDB 11 (leantime-db)",
      domain: "leantime.baaankai.dpdns.org",
      description: "Strategic project management platform combining Kanban, milestone roadmaps, idea boards, and task tracking. Mounted directly to customized source.",
      healthcheck: "Depends on leantime-db (condition: service_healthy)",
      url: "https://leantime.baaankai.dpdns.org"
    },
    {
      id: "leantime-db",
      name: "Leantime MariaDB 11",
      category: "productivity",
      status: "active",
      hostPort: "3306 (Internal Only)",
      internalPort: "3306",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/leantime/mysql",
      techStack: "MariaDB 11",
      database: "Relational DB",
      description: "Dedicated MariaDB 11 transactional storage engine. Zero host port exposure — accessible only via the internal homelab network bridge.",
      healthcheck: "mariadb-admin ping -u root --silent",
      url: "Internal bridge network"
    },
    {
      id: "maybe",
      name: "Maybe Finance",
      category: "finance",
      status: "active",
      hostPort: "8092",
      internalPort: "3000",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/maybe",
      techStack: "Ruby on Rails / Hotwire",
      database: "PostgreSQL 15 (maybe-db) + Redis 7",
      description: "Personal wealth and net worth tracking engine. Aggregates multi-currency accounts, investment performance, and financial trajectory.",
      healthcheck: "Depends on maybe-db (condition: service_healthy) & maybe-redis",
      url: "http://192.168.1.75:8092"
    },
    {
      id: "maybe-db",
      name: "Maybe PostgreSQL 15",
      category: "finance",
      status: "active",
      hostPort: "5432 (Internal Only)",
      internalPort: "5432",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/maybe/postgres",
      techStack: "PostgreSQL 15 Alpine",
      database: "Relational DB",
      description: "Postgres database container for Maybe Finance with automated schema migrations. Healthcheck enforced prior to Rails boot.",
      healthcheck: "pg_isready -U maybe",
      url: "Internal bridge network"
    },
    {
      id: "maybe-redis",
      name: "Maybe Redis 7",
      category: "finance",
      status: "active",
      hostPort: "6379 (Internal Only)",
      internalPort: "6379",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/maybe/redis",
      techStack: "Redis 7 Alpine",
      database: "In-Memory Key-Value",
      description: "High-throughput in-memory cache and background job queue for Maybe Finance.",
      healthcheck: "service_started",
      url: "Internal bridge network"
    },
    {
      id: "jellyfin",
      name: "Jellyfin Media Server",
      category: "media",
      status: "active",
      hostPort: "8096",
      internalPort: "8096",
      storageTier: "HDD + SSD",
      storagePath: "/home/maruf/MyHDDStorage/Jellyfin/{Movies, TV, Music, Videos}",
      techStack: "C# (.NET 8)",
      database: "SQLite",
      description: "Self-hosted media system for 4K movies, TV series, lossless music, and personal videos with hardware transcoding acceleration.",
      healthcheck: "HTTP GET /health",
      url: "http://192.168.1.75:8096"
    },
    {
      id: "prometheus",
      name: "Prometheus TSDB",
      category: "monitoring",
      status: "active",
      hostPort: "9093",
      internalPort: "9090",
      storageTier: "HDD + SSD",
      storagePath: "/home/maruf/MyHDDStorage/monitoring/prometheus",
      techStack: "Go",
      database: "Prometheus TSDB",
      description: "Time-series metrics scraping engine querying Node Exporter and cAdvisor every 15 seconds. Retention stored on high-capacity HDD.",
      healthcheck: "HTTP GET /-/healthy",
      url: "http://192.168.1.75:9093"
    },
    {
      id: "grafana",
      name: "Grafana Dashboards",
      category: "monitoring",
      status: "active",
      hostPort: "3005",
      internalPort: "3000",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/grafana",
      techStack: "Go / React",
      database: "SQLite state",
      description: "Observability analytics platform visualizing host CPU, RAM, disk I/O, network throughput, and per-container resource metrics.",
      healthcheck: "HTTP GET /api/health",
      url: "http://192.168.1.75:3005"
    },
    {
      id: "node-exporter",
      name: "Node Exporter",
      category: "monitoring",
      status: "active",
      hostPort: "9100 (Internal Scrape)",
      internalPort: "9100",
      storageTier: "Host Mount",
      storagePath: "/:/host:ro",
      techStack: "Go",
      database: "Stateless",
      description: "Host hardware metrics exporter reading CPU cores, memory allocation, filesystem saturation, and thermal sensor outputs.",
      healthcheck: "Prometheus scrape target healthy",
      url: "http://192.168.1.75:9100/metrics"
    },
    {
      id: "cadvisor",
      name: "cAdvisor",
      category: "monitoring",
      status: "active",
      hostPort: "8083",
      internalPort: "8080",
      storageTier: "Host Mount",
      storagePath: "/var/lib/docker",
      techStack: "Go",
      database: "Stateless",
      description: "Container runtime performance analyzer tracking memory limits, CPU throttles, and network packet rates per Docker container.",
      healthcheck: "HTTP GET /healthz",
      url: "http://192.168.1.75:8083"
    },
    {
      id: "scrutiny",
      name: "Scrutiny HDD Health",
      category: "monitoring",
      status: "catalog",
      hostPort: "8089",
      internalPort: "8080",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/scrutiny",
      techStack: "Go / Vue",
      database: "InfluxDB",
      domain: "scrutiny.baaankai.dpdns.org",
      description: "Hard drive S.M.A.R.T. health and failure prediction dashboard monitoring drive temperatures, reallocated sectors, and read error rates.",
      healthcheck: "HTTP GET /api/health",
      url: "https://scrutiny.baaankai.dpdns.org"
    },
    {
      id: "stirling-pdf",
      name: "Stirling PDF",
      category: "productivity",
      status: "catalog",
      hostPort: "8084",
      internalPort: "8080",
      storageTier: "Stateless",
      storagePath: "In-memory container",
      techStack: "Java (Spring Boot)",
      database: "Stateless",
      description: "Complete browser-based PDF manipulation suite: split, merge, convert, OCR, sign, compress, and edit PDF files securely.",
      healthcheck: "HTTP GET /api/v1/info/status",
      url: "http://192.168.1.75:8084"
    },
    {
      id: "memos",
      name: "Memos Micro-Notes",
      category: "productivity",
      status: "catalog",
      hostPort: "5230",
      internalPort: "5230",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/memos",
      techStack: "Go / React",
      database: "SQLite",
      description: "Lightweight, privacy-first markdown memo hub for capturing quick daily thoughts, code snippets, and structured tags.",
      healthcheck: "HTTP GET /api/v1/ping",
      url: "http://192.168.1.75:5230"
    },
    {
      id: "vikunja",
      name: "Vikunja To-Do",
      category: "productivity",
      status: "catalog",
      hostPort: "3456",
      internalPort: "3456",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/vikunja",
      techStack: "Go / Vue",
      database: "SQLite / Postgres",
      description: "End-to-end task manager supporting subtasks, attachments, Kanban boards, Gantt timeline charts, and reminder alerts.",
      healthcheck: "HTTP GET /api/v1/info",
      url: "http://192.168.1.75:3456"
    },
    {
      id: "changedetection",
      name: "ChangeDetection.io",
      category: "productivity",
      status: "catalog",
      hostPort: "5001",
      internalPort: "5000",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/changedetection",
      techStack: "Python",
      database: "SQLite / JSON",
      description: "Automated web page monitor detecting price drops, stock changes, and text updates with notification dispatcher integration.",
      healthcheck: "HTTP GET /",
      url: "http://192.168.1.75:5001"
    },
    {
      id: "sonarr",
      name: "Sonarr PVR",
      category: "media",
      status: "catalog",
      hostPort: "8989",
      internalPort: "8989",
      storageTier: "SSD + HDD",
      storagePath: "SSD config + HDD /TV",
      techStack: "C# (.NET 8)",
      database: "SQLite",
      description: "Automated TV show PVR managing episode releases, quality upgrades, renaming rules, and indexer integration.",
      healthcheck: "HTTP GET /ping",
      url: "http://192.168.1.75:8989"
    },
    {
      id: "radarr",
      name: "Radarr PVR",
      category: "media",
      status: "catalog",
      hostPort: "7878",
      internalPort: "7878",
      storageTier: "SSD + HDD",
      storagePath: "SSD config + HDD /Movies",
      techStack: "C# (.NET 8)",
      database: "SQLite",
      description: "Automated movie library manager watching upcoming releases, parsing metadata, and managing downloads.",
      healthcheck: "HTTP GET /ping",
      url: "http://192.168.1.75:7878"
    },
    {
      id: "lidarr",
      name: "Lidarr Music",
      category: "media",
      status: "catalog",
      hostPort: "8686",
      internalPort: "8686",
      storageTier: "SSD + HDD",
      storagePath: "SSD config + HDD /Music",
      techStack: "C# (.NET 8)",
      database: "SQLite",
      description: "Automated music collection manager syncing discographies via MusicBrainz.",
      healthcheck: "HTTP GET /ping",
      url: "http://192.168.1.75:8686"
    },
    {
      id: "prowlarr",
      name: "Prowlarr Indexer Proxy",
      category: "media",
      status: "catalog",
      hostPort: "9696",
      internalPort: "9696",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/prowlarr",
      techStack: "C# (.NET 8)",
      database: "SQLite",
      description: "Torrent and Usenet indexer proxy syncing tracker credentials with Sonarr, Radarr, and Lidarr.",
      healthcheck: "HTTP GET /ping",
      url: "http://192.168.1.75:9696"
    },
    {
      id: "navidrome",
      name: "Navidrome Music Server",
      category: "media",
      status: "catalog",
      hostPort: "4533",
      internalPort: "4533",
      storageTier: "SSD + HDD",
      storagePath: "SSD config + HDD /Music",
      techStack: "Go / React",
      database: "SQLite",
      description: "Modern, Subsonic-compatible streaming music server with instant search, multi-user support, and mobile syncing.",
      healthcheck: "HTTP GET /ping",
      url: "http://192.168.1.75:4533"
    },
    {
      id: "audiobookshelf",
      name: "Audiobookshelf",
      category: "media",
      status: "catalog",
      hostPort: "13378",
      internalPort: "80",
      storageTier: "SSD + HDD",
      storagePath: "SSD config + HDD /Audiobooks",
      techStack: "Node.js / Vue",
      database: "SQLite",
      description: "Self-hosted audiobook and podcast server with position syncing across native iOS and Android apps.",
      healthcheck: "HTTP GET /healthcheck",
      url: "http://192.168.1.75:13378"
    },
    {
      id: "qbittorrent",
      name: "qBittorrent",
      category: "media",
      status: "catalog",
      hostPort: "8087",
      internalPort: "8080",
      storageTier: "HDD",
      storagePath: "/home/maruf/MyHDDStorage/downloads",
      techStack: "C++ (Qt / libtorrent)",
      database: "Flat Files",
      description: "High-performance BitTorrent download client with Web UI and automated categorizer.",
      healthcheck: "HTTP GET /api/v2/app/version",
      url: "http://192.168.1.75:8087"
    },
    {
      id: "homepage",
      name: "Homepage Dashboard",
      category: "dashboards",
      status: "catalog",
      hostPort: "3000",
      internalPort: "3000",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/homepage",
      techStack: "Next.js / React",
      database: "YAML Config",
      description: "Fast, elegant dashboard with direct Docker socket discovery and live service stat widgets.",
      healthcheck: "HTTP GET /api/healthcheck",
      url: "http://192.168.1.75:3000"
    },
    {
      id: "glance",
      name: "Glance Feed Aggregator",
      category: "dashboards",
      status: "catalog",
      hostPort: "8081",
      internalPort: "8080",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/glance",
      techStack: "Go",
      database: "YAML Config",
      description: "Ultra-fast single-page feed dashboard aggregating RSS news, Reddit subs, server metrics, and weather.",
      healthcheck: "HTTP GET /",
      url: "http://192.168.1.75:8081"
    },
    {
      id: "adguard",
      name: "AdGuard Home",
      category: "network",
      status: "catalog",
      hostPort: "53 (DNS), 3002 (Web)",
      internalPort: "53, 3000",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/adguard",
      techStack: "Go",
      database: "Internal YAML storage",
      description: "Network-wide DNS ad-blocker, tracker sinkhole, parental control, and local domain rewrite resolver.",
      healthcheck: "DNS query resolution test",
      url: "http://192.168.1.75:3002"
    },
    {
      id: "vaultwarden",
      name: "Vaultwarden",
      category: "security",
      status: "catalog",
      hostPort: "8082",
      internalPort: "80",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/vaultwarden",
      techStack: "Rust",
      database: "SQLite",
      description: "Lightweight, official Bitwarden-compatible password vault server with 2FA, passkeys, and organization sharing.",
      healthcheck: "HTTP GET /alive",
      url: "http://192.168.1.75:8082"
    },
    {
      id: "immich",
      name: "Immich Photo Cloud",
      category: "storage",
      status: "catalog",
      hostPort: "2283",
      internalPort: "2283",
      storageTier: "SSD + HDD",
      storagePath: "SSD DB + HDD /photos",
      techStack: "TypeScript / Dart",
      database: "PostgreSQL + pgvector + Redis",
      description: "Self-hosted Google Photos alternative with AI face recognition, semantic image search, and mobile camera backup.",
      healthcheck: "HTTP GET /api/server-info/ping",
      url: "http://192.168.1.75:2283"
    },
    {
      id: "home-assistant",
      name: "Home Assistant",
      category: "automation",
      status: "catalog",
      hostPort: "8123",
      internalPort: "8123",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/homeassistant",
      techStack: "Python",
      database: "SQLite",
      description: "Open-source home automation hub linking Zigbee/Z-Wave devices, sensors, smart lighting, and scripts.",
      healthcheck: "HTTP GET /manifest.json",
      url: "http://192.168.1.75:8123"
    },
    {
      id: "ollama",
      name: "Ollama Local AI",
      category: "ai",
      status: "catalog",
      hostPort: "11434",
      internalPort: "11434",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/ollama",
      techStack: "Go / C++ (llama.cpp)",
      database: "Stateless (Model Binaries)",
      description: "Local large language model runner supporting Llama 3, Qwen 2.5, DeepSeek, and Mistral with GPU acceleration.",
      healthcheck: "HTTP GET /api/tags",
      url: "http://192.168.1.75:11434"
    },
    {
      id: "open-webui",
      name: "Open WebUI",
      category: "ai",
      status: "catalog",
      hostPort: "8080",
      internalPort: "8080",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/open-webui",
      techStack: "Python / Svelte",
      database: "SQLite",
      description: "ChatGPT-grade user interface for local LLMs featuring multi-model chats, document RAG, and tool calling.",
      healthcheck: "HTTP GET /health",
      url: "http://192.168.1.75:8080"
    },
    {
      id: "n8n",
      name: "n8n Automation",
      category: "workflows",
      status: "catalog",
      hostPort: "5678",
      internalPort: "5678",
      storageTier: "SSD",
      storagePath: "/home/maruf/homelab/volumes/n8n",
      techStack: "Node.js / TypeScript",
      database: "SQLite / PostgreSQL",
      description: "Fair-code node-based workflow automation platform for connecting APIs, databases, webhooks, and AI pipelines.",
      healthcheck: "HTTP GET /healthz",
      url: "http://192.168.1.75:5678"
    }
  ],

  // --- Workstation Applications & Developer Tools (From RECOMMENDED_OPEN_SOURCE_APPS.md) ---
  workstationApps: [
    { name: "Neovim", category: "Code Editors & IDEs", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Hyperextensible Vim-fork with native LSP client, Tree-sitter syntax engine, and asynchronous Lua plugin API.", tech: "C / Lua", replaces: "Vim / Sublime Text" },
    { name: "Helix", category: "Code Editors & IDEs", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Post-modern modal editor inspired by Kakoune and Neovim; features built-in Tree-sitter and language server support out of the box.", tech: "Rust", replaces: "Vim / Micro" },
    { name: "Zed", category: "Code Editors & IDEs", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Lightning-fast GPU-accelerated code editor engineered for multiplayer pair programming and smooth inline AI workflows.", tech: "Rust / GPUI", replaces: "VS Code" },
    { name: "VSCodium", category: "Code Editors & IDEs", platforms: "Linux / macOS / Win", footprint: "Moderate", desc: "Fully open-source community distribution of VS Code with telemetry and proprietary tracking completely purged.", tech: "TypeScript / Electron", replaces: "VS Code" },
    { name: "Ghostty", category: "Terminals & Shells", platforms: "Linux / macOS", footprint: "Ultra-Light", desc: "Fast, feature-rich GPU-accelerated terminal emulator providing native platform rendering (Metal / GTK) and split panes.", tech: "Zig / Metal", replaces: "iTerm2 / Alacritty" },
    { name: "Alacritty", category: "Terminals & Shells", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Minimalist, blazing fast terminal emulator focused strictly on GPU-driven raw throughput without bloat.", tech: "Rust / OpenGL", replaces: "Default OS Terminals" },
    { name: "Kitty", category: "Terminals & Shells", platforms: "Linux / macOS", footprint: "Ultra-Light", desc: "Feature-packed GPU terminal with native graphic protocols (renders images directly) and scriptable kittens.", tech: "C / Python", replaces: "iTerm2 / Terminator" },
    { name: "Zellij", category: "Terminals & Shells", platforms: "Linux / macOS", footprint: "Ultra-Light", desc: "Modern workspace manager and terminal multiplexer offering discoverable keybindings and intuitive layouts.", tech: "Rust", replaces: "Tmux / Screen" },
    { name: "Starship", category: "Terminals & Shells", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Fast, customizable cross-shell prompt rendering contextual Git status and runtime language versions.", tech: "Rust", replaces: "Oh My Zsh" },
    { name: "Fish", category: "Terminals & Shells", platforms: "Linux / macOS", footprint: "Ultra-Light", desc: "User-friendly interactive shell with syntax autosuggestions and tab completions enabled by default.", tech: "C++", replaces: "Bash / Zsh" },
    { name: "ripgrep (rg)", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Blazingly fast recursive regex search tool that respects .gitignore rules by default and skips hidden files.", tech: "Rust", replaces: "grep / ack" },
    { name: "fzf", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "General-purpose interactive fuzzy finder for shell history, file trees, process IDs, and Git commit logs.", tech: "Go", replaces: "Ctrl+R / find" },
    { name: "bat", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Modern cat clone with syntax highlighting for dozens of languages, Git diff indicators, and automatic paging.", tech: "Rust", replaces: "cat / less" },
    { name: "eza", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Modern, maintained replacement for ls providing colorized file listings, Git status badges, and tree views.", tech: "Rust", replaces: "ls / tree" },
    { name: "zoxide", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Smarter cd command that tracks directory usage frequency and recency to jump to matching folders instantly.", tech: "Rust", replaces: "cd / autojump" },
    { name: "fd", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Fast, intuitive alternative to find featuring colorized output, regex support, and smart case sensitivity.", tech: "Rust", replaces: "find" },
    { name: "btop", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Responsive resource monitor displaying detailed CPU, memory, disks, network, and process graphs in TUI.", tech: "C++", replaces: "htop / Activity Monitor" },
    { name: "yazi", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Blazing fast terminal file manager with asynchronous I/O, image preview support, and fuzzy searching.", tech: "Rust / Lua", replaces: "Ranger / Midnight Commander" },
    { name: "dust", category: "Modern Unix CLI", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Visual disk space analyzer giving an instant ASCII tree of directory consumption without manual digging.", tech: "Rust", replaces: "du / TreeSize" },
    { name: "lazygit", category: "Git & DevOps", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Terminal UI for Git operations: interactive staging, branch switching, rebasing, stashes, and merge resolution.", tech: "Go", replaces: "GitKraken / SourceTree" },
    { name: "lazydocker", category: "Git & DevOps", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Terminal interface for inspecting Docker containers, real-time log streaming, CPU/RAM usage, and volume pruning.", tech: "Go", replaces: "Docker CLI / Portainer GUI" },
    { name: "K9s", category: "Git & DevOps", platforms: "Linux / macOS / Win", footprint: "Ultra-Light", desc: "Terminal UI to monitor and interact with Kubernetes clusters: live log tails, pod exec shells, and port-forwarding.", tech: "Go", replaces: "Lens / K8s Dashboard" },
    { name: "Bruno", category: "API & Database Tools", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Fast, privacy-focused API client that saves collections directly in plain text .bru files in your git repository.", tech: "Node.js / Electron", replaces: "Postman / Insomnia" },
    { name: "Beekeeper Studio", category: "API & Database Tools", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Polished, intuitive database manager and SQL workbench emphasizing simplicity, privacy, and clean presentation.", tech: "Vue.js / Electron", replaces: "TablePlus / Sequel Pro" },
    { name: "DBeaver", category: "API & Database Tools", platforms: "Linux / macOS / Win", footprint: "Moderate", desc: "Universal database client supporting 80+ engines including PostgreSQL, MySQL, SQLite, Oracle, DuckDB, and Redis.", tech: "Java / Eclipse RCP", replaces: "DataGrip / Navicat" },
    { name: "KeePassXC", category: "Security & Privacy", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Battle-tested, offline password manager using encrypted .kdbx databases with hardware key (YubiKey) 2FA.", tech: "C++ / Qt", replaces: "1Password / LastPass" },
    { name: "Cryptomator", category: "Security & Privacy", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Multi-platform client-side encryption that transparently encrypts individual files before cloud syncing.", tech: "Java / OpenJFX", replaces: "Boxcryptor / AxCrypt" },
    { name: "Logseq", category: "Notes & Knowledge", platforms: "Linux / macOS / Win", footprint: "Moderate", desc: "Local-first outliner and knowledge graph supporting bi-directional page linking, flashcards, and Git sync.", tech: "ClojureScript", replaces: "Obsidian / Roam" },
    { name: "Draw.io Desktop", category: "Office & Diagrams", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Offline diagramming tool for network topologies, cloud architecture, UML diagrams, and flowcharts.", tech: "JavaScript / Electron", replaces: "Visio / Lucidchart" },
    { name: "OBS Studio", category: "Media & Creation", platforms: "Linux / macOS / Win", footprint: "Moderate", desc: "Broadcasting and recording engine supporting multi-source compositing, audio filters, and low-latency encoding.", tech: "C / C++ / Qt", replaces: "Camtasia / XSplit" },
    { name: "Blender", category: "Media & Creation", platforms: "Linux / macOS / Win", footprint: "Heavy", desc: "Comprehensive 3D creation suite: modeling, digital sculpting, UV mapping, rigging, animation, and rendering.", tech: "C / C++ / Python", replaces: "Maya / 3ds Max" },
    { name: "Wireshark", category: "Network & Sysadmin", platforms: "Linux / macOS / Win", footprint: "Moderate", desc: "The world's foremost network protocol analyzer for deep packet inspection, TLS stream analysis, and auditing.", tech: "C / C++ / Qt", replaces: "Omnipeek" },
    { name: "RustDesk", category: "Network & Sysadmin", platforms: "Linux / macOS / Win", footprint: "Lightweight", desc: "Self-hostable remote desktop control client with end-to-end encryption and fast display streaming.", tech: "Rust / Flutter", replaces: "TeamViewer / AnyDesk" },
    { name: "Ventoy", category: "System & Boot", platforms: "Linux / Win", footprint: "Ultra-Light", desc: "Creates bootable USB drives where you copy ISO image files directly to the flash drive without reformatting.", tech: "C", replaces: "Rufus / BalenaEtcher" },
    { name: "Timeshift", category: "System & Boot", platforms: "Linux", footprint: "Lightweight", desc: "System restore utility that creates scheduled incremental filesystem snapshots for point-in-time rollback.", tech: "C / Vala / GTK", replaces: "Time Machine" },
    { name: "Linutil", category: "System & Boot", platforms: "Linux", footprint: "Ultra-Light", desc: "Distro-agnostic terminal toolbox providing automated system optimization, dev setup, and kernel tweaks via TUI.", tech: "Shell / Gum", replaces: "Manual setup scripts" }
  ],

  // --- Curated Role Stacks (From RECOMMENDED_OPEN_SOURCE_APPS.md) ---
  roleStacks: [
    {
      id: "developer",
      name: "Modern Software Developer",
      icon: "code",
      desc: "High-throughput development environment engineered for instant feedback, fast search, and offline-first workflows.",
      stack: [
        { role: "Editor / IDE", tools: "Neovim or Zed (Secondary: VSCodium)" },
        { role: "Terminal & Shell", tools: "Ghostty + Zellij + Fish (Starship Prompt)" },
        { role: "Modern Unix CLI", tools: "ripgrep, fzf, bat, eza, zoxide, yazi" },
        { role: "Git & Containers", tools: "lazygit, lazydocker, act, gh" },
        { role: "API & DB Workbench", tools: "Bruno + Beekeeper Studio" }
      ]
    },
    {
      id: "devops",
      name: "DevOps & System Administrator",
      icon: "terminal",
      desc: "Robust diagnostic, cluster inspection, and network troubleshooting toolkit for production infrastructure.",
      stack: [
        { role: "Cluster & Docker", tools: "K9s, Podman Desktop, lazydocker" },
        { role: "Diagnostics & Net", tools: "Wireshark, Nmap, btop, Angry IP Scanner" },
        { role: "Remote Access", tools: "Remmina + RustDesk + Tailscale" },
        { role: "System & Rescue", tools: "Timeshift, GParted, Ventoy, Linutil" }
      ]
    },
    {
      id: "privacy",
      name: "Privacy & Security Advocate",
      icon: "shield-check",
      desc: "Zero-knowledge encryption, decentralized messaging, and local-first document security suite.",
      stack: [
        { role: "Credentials & Vault", tools: "KeePassXC + Cryptomator + VeraCrypt" },
        { role: "Browsing & Cleanup", tools: "Tor Browser + BleachBit" },
        { role: "Notes & Docs", tools: "Logseq + OnlyOffice Desktop + PDF Arranger" },
        { role: "Secure Comm", tools: "Signal Desktop + Element (Matrix) + Thunderbird" }
      ]
    },
    {
      id: "ai",
      name: "AI Engineer & Agentic Developer",
      icon: "sparkle",
      desc: "Local inference execution, agentic terminal pairing, and codebase architecture knowledge graphing.",
      stack: [
        { role: "Agentic Coding", tools: "Antigravity / Crush / OpenCode" },
        { role: "Knowledge Graph", tools: "Graphify (AST Knowledge Graph)" },
        { role: "Local LLM Inference", tools: "Ollama (qwen2.5-coder / llama3) + llama.cpp" },
        { role: "Docs & Citations", tools: "Bruno + Harper + RenderCV + Refined GitHub" }
      ]
    },
    {
      id: "creative",
      name: "Creative & Media Professional",
      icon: "palette",
      desc: "Professional vector design, 3D modeling, video timeline editing, and lossless media trimming.",
      stack: [
        { role: "3D & Vector Design", tools: "Blender + Inkscape + Penpot" },
        { role: "Digital Painting & Art", tools: "Krita + GIMP" },
        { role: "Video & Audio Production", tools: "Kdenlive + OBS Studio + LosslessCut + Audacity" }
      ]
    }
  ],

  portMatrix: [
    { port: "3000", service: "Forgejo (Git Web)", type: "TCP", access: "LAN / Cloudflare", internal: "3000" },
    { port: "2222", service: "Forgejo (Git SSH)", type: "TCP", access: "LAN / SSH Direct", internal: "22" },
    { port: "3005", service: "Grafana (Observability)", type: "TCP", access: "LAN / Cloudflare", internal: "3000" },
    { port: "8083", service: "cAdvisor (Container Metrics)", type: "TCP", access: "LAN Only", internal: "8080" },
    { port: "8084", service: "Stirling PDF (Stateless PDF Tools)", type: "TCP", access: "LAN / Cloudflare", internal: "8080" },
    { port: "8088", service: "ntfy (Push Notifications)", type: "TCP", access: "LAN / Cloudflare", internal: "80" },
    { port: "8089", service: "Scrutiny (HDD S.M.A.R.T.)", type: "TCP", access: "LAN / Cloudflare", internal: "8080" },
    { port: "8090", service: "Leantime (Project Workspace)", type: "TCP", access: "LAN / Cloudflare", internal: "8080" },
    { port: "8091", service: "IT-Tools (Sysadmin Toolbox)", type: "TCP", access: "LAN Only", internal: "80" },
    { port: "8092", service: "Maybe Finance (Wealth Tracker)", type: "TCP", access: "LAN / Cloudflare", internal: "3000" },
    { port: "8096", service: "Jellyfin (Media Server)", type: "TCP", access: "LAN / Cloudflare", internal: "8096" },
    { port: "9000", service: "Portainer (Docker Web UI)", type: "TCP", access: "LAN Only", internal: "9000" },
    { port: "9093", service: "Prometheus (Metrics TSDB)", type: "TCP", access: "LAN Only", internal: "9090" },
    { port: "9100", service: "Node Exporter (Host Exporter)", type: "TCP", access: "Scrape Target (Internal)", internal: "9100" },
    { port: "9443", service: "Portainer (Docker HTTPS UI)", type: "TCP", access: "LAN Only", internal: "9443" },
    { port: "3306", service: "Leantime MariaDB", type: "TCP", access: "Bridge Isolated (Zero Host Port)", internal: "3306" },
    { port: "5432", service: "Maybe PostgreSQL", type: "TCP", access: "Bridge Isolated (Zero Host Port)", internal: "5432" },
    { port: "6379", service: "Maybe Redis", type: "TCP", access: "Bridge Isolated (Zero Host Port)", internal: "6379" }
  ],

  backupPipeline: [
    {
      step: 1,
      name: "MariaDB Database Dump",
      cmd: "docker exec leantime-db mariadb-dump -u root -p[SECRET] --all-databases > dump.sql",
      desc: "Performs consistent transactional database dump of Leantime workspace, user permissions, and tickets."
    },
    {
      step: 2,
      name: "PostgreSQL Database Dump",
      cmd: "docker exec maybe-db pg_dump -U maybe maybe_production > maybe.sql",
      desc: "Creates complete SQL snapshot of Maybe Finance account ledgers, historical transactions, and balances."
    },
    {
      step: 3,
      name: "SSD Persistent Volumes Snapshot",
      cmd: "docker run --rm -v /home/maruf/homelab/volumes:/v:ro -v /backups:/b alpine tar -czf ssd.tar.gz /v",
      desc: "Archives all persistent SQLite state, application configs, Git repositories, and notification logs in read-only mode."
    },
    {
      step: 4,
      name: "Master Archive Generation",
      cmd: "tar -czf homelab_backup_$(date +%Y%m%d_%H%M%S).tar.gz [dumps + volumes]",
      desc: "Packages database dumps, configs, and volume snapshots into a single timestamped gzip archive."
    },
    {
      step: 5,
      name: "HDD Mirror & Retention Cleanup",
      cmd: "cp master.tar.gz /home/maruf/MyHDDStorage/backups/ && rm older backups",
      desc: "Mirrors snapshot to secondary storage tier and retains only the single most recent clean archive to conserve storage."
    }
  ],

  cliTools: [
    { name: "eza", category: "CLI Nav", desc: "Modern, feature-rich replacement for ls with git integration and color icons." },
    { name: "bat", category: "CLI Viewer", desc: "A cat clone with syntax highlighting and Git integration." },
    { name: "fd", category: "CLI Search", desc: "Simple, fast and user-friendly alternative to find." },
    { name: "ripgrep (rg)", category: "CLI Search", desc: "Fastest recursive regex search tool across files." },
    { name: "fzf", category: "CLI Fuzzy", desc: "General-purpose command-line fuzzy finder for files, history, and processes." },
    { name: "btop", category: "CLI Monitor", desc: "Resource monitor that shows usage and stats for processor, memory, disks, network, and processes." },
    { name: "lazydocker", category: "TUI Docker", desc: "Simple terminal UI for docker and docker-compose management." },
    { name: "lazygit", category: "TUI Git", desc: "Simple terminal UI for git commands with visual branch graphs." },
    { name: "gum", category: "TUI Shell", desc: "A tool for glamorous shell scripts (spinners, inputs, table choosers)." },
    { name: "zoxide", category: "CLI Nav", desc: "Smarter cd command that remembers your most used directories." }
  ],

  opsSnippets: [
    {
      title: "Deploy Stack",
      cmd: "./scripts/deploy.sh",
      desc: "Validates port collisions, checks .env variables, and launches enabled category stacks."
    },
    {
      title: "Check Running Services",
      cmd: "docker ps --format \"table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\"",
      desc: "Lists all active containers, health check states, and port bindings."
    },
    {
      title: "Run Manual Backup",
      cmd: "./scripts/backup.sh",
      desc: "Triggers the full database dump and volume snapshot sequence immediately."
    },
    {
      title: "Restore from Archive",
      cmd: "./scripts/restore.sh",
      desc: "Guided interactive restore script to safely unpack databases and volumes."
    },
    {
      title: "Check Cloudflare Tunnel",
      cmd: "sudo systemctl status cloudflared",
      desc: "Inspects status of the host systemd daemon managing Zero Trust ingress."
    },
    {
      title: "Tail Container Logs",
      cmd: "docker compose -f apps/productivity/docker-compose.yml logs -f leantime",
      desc: "Streams live application logs for specific container stacks."
    }
  ]
};

if (typeof window !== "undefined") {
  window.HOMELAB_DATA = HOMELAB_DATA;
}
if (typeof globalThis !== "undefined") {
  globalThis.HOMELAB_DATA = HOMELAB_DATA;
}
