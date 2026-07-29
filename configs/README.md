# ⚙️ Service Configuration Templates

This directory contains version-controlled, non-sensitive configuration templates and provisioning files for homelab services.

---

## Directory Layout

```
configs/
├── grafana/
│   └── datasources/
│       └── prometheus.yml          # Auto-provisions Prometheus datasource in Grafana
├── nginx-proxy-manager/
│   └── custom_proxy.conf.example   # Custom Nginx proxy header snippets
├── prometheus/
│   └── prometheus.yml              # Prometheus scrape jobs & target configuration
└── README.md
```

## How Configurations are Applied

1. **Prometheus**: Mounted into Prometheus container at `/etc/prometheus/prometheus.yml`.
2. **Grafana Datasources**: Auto-configures Prometheus as the default datasource when Grafana boots up.
3. **Nginx Proxy Manager**: Custom Nginx rules for WebSocket proxying, large file uploads (Jellyfin), and custom SSL headers.
