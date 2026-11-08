/**
 * Homelab Static Portal Application Controller (Multi-Page Architecture)
 * Supports index.html, services.html, ports.html, storage.html, workstation.html, and runbook.html
 */

document.addEventListener("DOMContentLoaded", () => {
  // Global & Page State
  let activeCategory = "all";
  let searchQuery = "";
  let workstationCategory = "all";
  let workstationSearchQuery = "";

  // Highlight active nav link based on current page path
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-menu-overlay a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else if (href && !href.startsWith("#") && href !== currentPath) {
      link.classList.remove("active");
    }
  });

  // Common DOM Elements
  const servicesContainer = document.getElementById("services-grid");
  const filterChipsContainer = document.getElementById("category-chips");
  const searchInput = document.getElementById("service-search-input");
  const portTableBody = document.getElementById("port-table-body");
  const portSearchInput = document.getElementById("port-search-input");
  const backupPipelineContainer = document.getElementById("backup-pipeline-steps");
  const runbookContainer = document.getElementById("runbook-grid");
  const workstationContainer = document.getElementById("workstation-grid");
  const workstationChipsContainer = document.getElementById("workstation-chips");
  const workstationSearchInput = document.getElementById("workstation-search-input");
  const roleStacksContainer = document.getElementById("role-stacks-grid");
  const modalBackdrop = document.getElementById("cmd-modal");
  const modalInput = document.getElementById("modal-search-input");
  const modalResults = document.getElementById("modal-results");
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  // ==========================================
  // 1. Stats Counter Rendering
  // ==========================================
  function renderStats() {
    if (typeof HOMELAB_DATA === "undefined") return;

    const totalServices = HOMELAB_DATA.services.length;
    const activeServices = HOMELAB_DATA.services.filter(s => s.status === "active").length;
    const totalPorts = HOMELAB_DATA.portMatrix.length;
    const totalWorkstation = HOMELAB_DATA.workstationApps.length;

    const statActiveEl = document.getElementById("stat-active-services");
    const statTotalEl = document.getElementById("stat-total-catalog");
    const statPortsEl = document.getElementById("stat-total-ports");
    const statWorkstationEl = document.getElementById("stat-total-workstation");

    if (statActiveEl) statActiveEl.textContent = activeServices.toString();
    if (statTotalEl) statTotalEl.textContent = totalServices.toString();
    if (statPortsEl) statPortsEl.textContent = totalPorts.toString();
    if (statWorkstationEl) statWorkstationEl.textContent = totalWorkstation.toString();
  }

  // ==========================================
  // 2. Homelab Services Rendering & Filtering
  // ==========================================
  function renderCategoryChips() {
    if (!filterChipsContainer || typeof HOMELAB_DATA === "undefined") return;

    const totalCount = HOMELAB_DATA.services.length;
    let html = `
      <button class="filter-chip active" data-category="all">
        All Stacks <span class="chip-count">${totalCount}</span>
      </button>
      <button class="filter-chip" data-category="active-only">
        Active Only <span class="chip-count">${HOMELAB_DATA.services.filter(s => s.status === 'active').length}</span>
      </button>
    `;

    HOMELAB_DATA.categories.forEach(cat => {
      const count = HOMELAB_DATA.services.filter(s => s.category === cat.id).length;
      html += `
        <button class="filter-chip" data-category="${cat.id}">
          ${cat.name} <span class="chip-count">${count}</span>
        </button>
      `;
    });

    filterChipsContainer.innerHTML = html;

    filterChipsContainer.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        filterChipsContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeCategory = chip.dataset.category;
        renderServices();
      });
    });
  }

  function renderServices() {
    if (!servicesContainer || typeof HOMELAB_DATA === "undefined") return;

    let filtered = HOMELAB_DATA.services;

    if (activeCategory === "active-only") {
      filtered = filtered.filter(s => s.status === "active");
    } else if (activeCategory !== "all") {
      filtered = filtered.filter(s => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.techStack.toLowerCase().includes(q) ||
        s.hostPort.toLowerCase().includes(q) ||
        s.database.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      servicesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--bg-dark-1); border: 1px solid var(--border-medium); border-radius: var(--radius-xl);">
          <p style="color: #FFFFFF; font-size: 1.125rem; font-weight: 600;">No services match your query.</p>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 8px;">Try clearing filters or searching for another keyword.</p>
        </div>
      `;
      return;
    }

    servicesContainer.innerHTML = filtered.map(service => {
      const statusBadge = service.status === "active"
        ? `<span class="badge badge-active">Active</span>`
        : `<span class="badge badge-catalog">Configured</span>`;

      return `
        <article class="service-card reveal">
          <div class="service-card-header">
            <div>
              <h3 class="service-title">${escapeHtml(service.name)}</h3>
              <p class="service-desc">${escapeHtml(service.description)}</p>
            </div>
            ${statusBadge}
          </div>

          <div class="service-meta-matrix">
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Host Port</span>
              <span class="meta-matrix-val tabular-nums">${escapeHtml(service.hostPort)}</span>
            </div>
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Storage Tier</span>
              <span class="meta-matrix-val">${escapeHtml(service.storageTier)}</span>
            </div>
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Database / Cache</span>
              <span class="meta-matrix-val">${escapeHtml(service.database)}</span>
            </div>
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Tech Stack</span>
              <span class="meta-matrix-val">${escapeHtml(service.techStack)}</span>
            </div>
          </div>

          <div class="service-footer">
            <span class="service-tag">${escapeHtml(service.storagePath)}</span>
            ${service.url && service.url.startsWith("http") ? `
              <a href="${service.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="padding: 5px 12px; font-size: 0.75rem;">
                Open Endpoint ↗
              </a>
            ` : `
              <span class="badge badge-catalog" style="font-size: 0.6875rem;">Internal</span>
            `}
          </div>
        </article>
      `;
    }).join("");

    observeReveals();
  }

  // ==========================================
  // 3. Port Matrix Rendering
  // ==========================================
  function renderPortMatrix(filterText = "") {
    if (!portTableBody || typeof HOMELAB_DATA === "undefined") return;

    let rows = HOMELAB_DATA.portMatrix;
    if (filterText.trim()) {
      const q = filterText.toLowerCase().trim();
      rows = rows.filter(p =>
        p.port.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.access.toLowerCase().includes(q)
      );
    }

    portTableBody.innerHTML = rows.map(p => `
      <tr>
        <td class="port-num tabular-nums">${escapeHtml(p.port)}</td>
        <td style="font-weight: 600; color: #FFFFFF;">${escapeHtml(p.service)}</td>
        <td class="tabular-nums">${escapeHtml(p.type)}</td>
        <td class="tabular-nums">${escapeHtml(p.internal)}</td>
        <td>
          <span class="badge ${p.access.includes('Isolated') ? 'badge-catalog' : 'badge-active'}">
            ${escapeHtml(p.access)}
          </span>
        </td>
      </tr>
    `).join("");
  }

  // ==========================================
  // 4. Backup Pipeline Rendering
  // ==========================================
  function renderBackupPipeline() {
    if (!backupPipelineContainer || typeof HOMELAB_DATA === "undefined") return;

    backupPipelineContainer.innerHTML = HOMELAB_DATA.backupPipeline.map(item => `
      <div class="backup-step-card reveal">
        <div class="backup-step-num">${item.step}</div>
        <div class="backup-step-info">
          <h4>${escapeHtml(item.name)}</h4>
          <p>${escapeHtml(item.desc)}</p>
        </div>
        <div class="backup-step-code">
          <code>${escapeHtml(item.cmd)}</code>
        </div>
      </div>
    `).join("");
  }

  // ==========================================
  // 5. Ops Runbook Rendering
  // ==========================================
  function renderRunbook() {
    if (!runbookContainer || typeof HOMELAB_DATA === "undefined") return;

    runbookContainer.innerHTML = HOMELAB_DATA.opsSnippets.map(item => `
      <div class="runbook-card reveal">
        <div class="runbook-card-header">
          <h4 class="runbook-title">${escapeHtml(item.title)}</h4>
          <span class="badge badge-catalog" style="font-size: 0.6875rem;">Bash</span>
        </div>
        <p class="runbook-desc">${escapeHtml(item.desc)}</p>
        <div class="code-block">
          <code>${escapeHtml(item.cmd)}</code>
          <button class="copy-btn" data-copy="${escapeHtml(item.cmd)}" title="Copy command">
            Copy
          </button>
        </div>
      </div>
    `).join("");

    runbookContainer.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.copy;
        copyToClipboard(text, btn);
      });
    });
  }

  // ==========================================
  // 6. Workstation Apps Rendering
  // ==========================================
  function renderWorkstationChips() {
    if (!workstationChipsContainer || typeof HOMELAB_DATA === "undefined") return;

    const categories = ["all", ...new Set(HOMELAB_DATA.workstationApps.map(a => a.category))];
    let html = "";

    categories.forEach(cat => {
      const count = cat === "all"
        ? HOMELAB_DATA.workstationApps.length
        : HOMELAB_DATA.workstationApps.filter(a => a.category === cat).length;
      
      const label = cat === "all" ? "All Apps" : cat;
      html += `
        <button class="filter-chip ${cat === 'all' ? 'active' : ''}" data-workstation-cat="${cat}">
          ${label} <span class="chip-count">${count}</span>
        </button>
      `;
    });

    workstationChipsContainer.innerHTML = html;

    workstationChipsContainer.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        workstationChipsContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        workstationCategory = chip.dataset.workstationCat;
        renderWorkstationApps();
      });
    });
  }

  function renderWorkstationApps() {
    if (!workstationContainer || typeof HOMELAB_DATA === "undefined") return;

    let filtered = HOMELAB_DATA.workstationApps;

    if (workstationCategory !== "all") {
      filtered = filtered.filter(a => a.category === workstationCategory);
    }

    if (workstationSearchQuery.trim()) {
      const q = workstationSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.tech.toLowerCase().includes(q) ||
        a.replaces.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      workstationContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--bg-dark-1); border: 1px solid var(--border-medium); border-radius: var(--radius-xl);">
          <p style="color: #FFFFFF; font-size: 1.125rem; font-weight: 600;">No workstation tools found matching your query.</p>
          <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 8px;">Try clearing search keywords or selecting another category.</p>
        </div>
      `;
      return;
    }

    workstationContainer.innerHTML = filtered.map(app => {
      const footprintClass = app.footprint.includes("Ultra") ? "badge-active" : "badge-ssd";
      return `
        <article class="service-card reveal">
          <div class="service-card-header">
            <div>
              <h3 class="service-title">${escapeHtml(app.name)}</h3>
              <span class="badge badge-catalog" style="margin-bottom: 6px; font-size: 0.6875rem;">${escapeHtml(app.category)}</span>
              <p class="service-desc">${escapeHtml(app.desc)}</p>
            </div>
            <span class="badge ${footprintClass}">${escapeHtml(app.footprint)}</span>
          </div>

          <div class="service-meta-matrix" style="grid-template-columns: 1fr 1fr;">
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Core Tech</span>
              <span class="meta-matrix-val">${escapeHtml(app.tech)}</span>
            </div>
            <div class="meta-matrix-item">
              <span class="meta-matrix-label">Platforms</span>
              <span class="meta-matrix-val">${escapeHtml(app.platforms)}</span>
            </div>
          </div>

          <div class="service-footer">
            <span class="service-tag" style="max-width: 100%;">Replaces: <strong style="color: var(--text-secondary);">${escapeHtml(app.replaces)}</strong></span>
          </div>
        </article>
      `;
    }).join("");

    observeReveals();
  }

  // ==========================================
  // 7. Role Stacks Rendering
  // ==========================================
  function renderRoleStacks() {
    if (!roleStacksContainer || typeof HOMELAB_DATA === "undefined") return;

    roleStacksContainer.innerHTML = HOMELAB_DATA.roleStacks.map(role => `
      <div class="tier-card reveal">
        <div class="tier-header">
          <div class="tier-title-group">
            <h3>${escapeHtml(role.name)}</h3>
            <p>${escapeHtml(role.desc)}</p>
          </div>
          <span class="badge badge-ssd">Role Blueprint</span>
        </div>

        <ul class="tier-items">
          ${role.stack.map(s => `
            <li class="tier-item">
              <span class="tier-item-name">${escapeHtml(s.role)}</span>
              <span class="tier-item-path" style="color: #FFFFFF; font-weight: 500;">${escapeHtml(s.tools)}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `).join("");
  }

  // ==========================================
  // 8. Clipboard Copy & Toast Feedback
  // ==========================================
  function copyToClipboard(text, triggerBtn) {
    navigator.clipboard.writeText(text).then(() => {
      if (triggerBtn) {
        const originalText = triggerBtn.textContent;
        triggerBtn.textContent = "Copied!";
        triggerBtn.classList.add("copied");
        setTimeout(() => {
          triggerBtn.textContent = originalText;
          triggerBtn.classList.remove("copied");
        }, 2000);
      }
      showToast("Command copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  }

  function showToast(message) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ==========================================
  // 9. Command Palette Modal (Cmd+K / Ctrl+K)
  // ==========================================
  function openCmdModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add("open");
    if (modalInput) {
      modalInput.value = "";
      modalInput.focus();
      renderModalResults("");
    }
  }

  function closeCmdModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("open");
  }

  function renderModalResults(query) {
    if (!modalResults || typeof HOMELAB_DATA === "undefined") return;

    let items = [];
    const q = query.toLowerCase().trim();

    // Quick page navigation entries
    const pages = [
      { name: "Architecture & System Map", path: "index.html", cat: "Page" },
      { name: "App Catalog (12 Categories)", path: "services.html", cat: "Page" },
      { name: "Resources & Workstation Toolkits", path: "resources.html", cat: "Page" },
      { name: "DevOps Operations Playbook", path: "runbook.html", cat: "Page" },
      { name: "Port Matrix & Network Security", path: "ports.html", cat: "Page" },
      { name: "Dual Storage & Nightly Backups", path: "storage.html", cat: "Page" }
    ];

    pages.forEach(p => {
      if (!q || p.name.toLowerCase().includes(q)) {
        items.push({
          title: p.name,
          category: "Navigation",
          type: "Page",
          action: () => { window.location.href = p.path; }
        });
      }
    });

    // Add services
    HOMELAB_DATA.services.forEach(s => {
      if (!q || s.name.toLowerCase().includes(q) || s.category.includes(q)) {
        items.push({
          title: s.name,
          category: `Server: ${s.category}`,
          type: "Container",
          action: () => { window.location.href = `services.html?cat=${s.category}`; }
        });
      }
    });

    // Add Workstation Apps
    HOMELAB_DATA.workstationApps.forEach(app => {
      if (!q || app.name.toLowerCase().includes(q) || app.category.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)) {
        items.push({
          title: app.name,
          category: `Workstation: ${app.category}`,
          type: "App",
          action: () => { window.location.href = `resources.html`; }
        });
      }
    });

    // Add runbook commands
    HOMELAB_DATA.opsSnippets.forEach(cmd => {
      if (!q || cmd.title.toLowerCase().includes(q) || cmd.cmd.includes(q)) {
        items.push({
          title: cmd.title,
          category: "Runbook",
          type: "Command",
          action: () => {
            closeCmdModal();
            copyToClipboard(cmd.cmd);
          }
        });
      }
    });

    if (items.length === 0) {
      modalResults.innerHTML = `<li style="padding: 16px; color: var(--text-muted); text-align: center;">No matches found.</li>`;
      return;
    }

    modalResults.innerHTML = items.slice(0, 8).map((item, idx) => `
      <li class="modal-result-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <div>
          <span style="font-weight: 600; color: #FFFFFF;">${escapeHtml(item.title)}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">${escapeHtml(item.category)}</span>
        </div>
        <span class="badge badge-catalog" style="font-size: 0.6875rem;">${escapeHtml(item.type)}</span>
      </li>
    `).join("");

    modalResults.querySelectorAll(".modal-result-item").forEach((el, idx) => {
      el.addEventListener("click", () => {
        items[idx].action();
      });
    });
  }

  // ==========================================
  // 10. Scroll Reveals via IntersectionObserver
  // ==========================================
  function observeReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal:not(.revealed)").forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================
  // 11. Event Listeners & Keybindings
  // ==========================================
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderServices();
    });
  }

  if (workstationSearchInput) {
    workstationSearchInput.addEventListener("input", (e) => {
      workstationSearchQuery = e.target.value;
      renderWorkstationApps();
    });
  }

  if (portSearchInput) {
    portSearchInput.addEventListener("input", (e) => {
      renderPortMatrix(e.target.value);
    });
  }

  // Cmd+K / Ctrl+K shortcut
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modalBackdrop && modalBackdrop.classList.contains("open")) {
        closeCmdModal();
      } else {
        openCmdModal();
      }
    } else if (e.key === "/" && document.activeElement !== searchInput && document.activeElement !== modalInput && document.activeElement !== portSearchInput && document.activeElement !== workstationSearchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      else if (workstationSearchInput) workstationSearchInput.focus();
    } else if (e.key === "Escape") {
      closeCmdModal();
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("open");
      if (mobileNavToggle) mobileNavToggle.classList.remove("open");
    }
  });

  document.querySelectorAll(".nav-search-btn").forEach(btn => {
    btn.addEventListener("click", openCmdModal);
  });

  if (modalInput) {
    modalInput.addEventListener("input", (e) => {
      renderModalResults(e.target.value);
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeCmdModal();
      }
    });
  }

  // Mobile menu toggle
  if (mobileNavToggle && mobileMenuOverlay) {
    mobileNavToggle.addEventListener("click", () => {
      mobileNavToggle.classList.toggle("open");
      mobileMenuOverlay.classList.toggle("open");
    });
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Interactive Diagram Tab Controller
  function initDiagramTabs() {
    const tabNav = document.getElementById("diagram-tab-nav");
    if (!tabNav) return;

    const buttons = tabNav.querySelectorAll(".diagram-tab-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const diagramId = btn.dataset.diagram;
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".diagram-view-pane").forEach(pane => {
          pane.classList.remove("active");
        });

        const targetPane = document.getElementById(`pane-${diagramId}`);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });
  }

  // Initializers based on current page
  renderStats();
  renderCategoryChips();
  renderServices();
  renderPortMatrix();
  renderBackupPipeline();
  renderRunbook();
  renderWorkstationChips();
  renderWorkstationApps();
  renderRoleStacks();
  initDiagramTabs();
  observeReveals();
});
