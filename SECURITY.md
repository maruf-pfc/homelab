# 🔒 Security Guidelines & Best Practices

Security and confidentiality are top priorities when maintaining a public or private homelab repository on GitHub.

---

## 1. Secret Hygiene & Git Isolation

- **Never Commit Secrets**: Database credentials, passwords, API tokens, and private SSH/TLS keys must never be committed to Git repositories.
- **Environment Variables**: All passwords and variable configuration parameters are populated via runtime `.env` files.
- **Git Ignore Enforcement**: The `.gitignore` file explicitly blocks `.env`, `*.key`, `*.pem`, `letsencrypt/`, database dumps, and application data directories from tracking.

---

## 2. Cloudflare & Edge Protection

- **Cloudflare Proxying**: Enable proxy mode (orange cloud) for all external subdomains to mask your origin server IP address.
- **Cloudflare WAF Rules**:
  - Enable automatic Managed Rules for Common Vulnerabilities and Exposures (CVEs).
  - Enforce SSL/TLS encryption mode set to **Full (Strict)**.
- **Cloudflare Tunnels (Optional / Recommended)**: Replace open router port forwards with `cloudflared` tunnel connections to expose services without opening incoming firewall ports.

---

## 3. Host System Hardening

- **Unnecessary Port Exposure**: Web ports are mapped locally. If accessing primarily through Nginx Proxy Manager or Cloudflare Tunnels, restrict external firewall access (UFW) to ports `80` and `443` only:
  ```bash
  sudo ufw default deny incoming
  sudo ufw default allow outgoing
  sudo ufw allow 22/tcp  # SSH
  sudo ufw allow 80/tcp  # HTTP
  sudo ufw allow 443/tcp # HTTPS
  sudo ufw enable
  ```
- **Docker Socket Security**: Containers with Docker socket mounts (`/var/run/docker.sock`) such as Portainer and Homarr have elevated control over the host. Keep image tags updated and limit container exposure.
