// ═══════════════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
//  CSS в css/components/notifications.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.notifications = `.sb-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--gap-horiz-m);
  padding: var(--pad-vert-16) var(--pad-horiz-16);
  border-radius: var(--radius-8);
  border: var(--border-width-1) solid;
  font-size: var(--body-font-size-m);
  line-height: 1.5;
}
.sb-banner-icon { flex-shrink: 0; font-size: var(--body-font-size-l); }
.sb-banner-content { flex: 1; }
.sb-banner-title { font-weight: var(--font-weight-medium); margin-bottom: 2px; }
.sb-banner-text { font-size: var(--body-font-size-s); }
.sb-banner.info    { background: var(--primary-hover);    border-color: var(--primary); }
.sb-banner.success { background: var(--success-hover); border-color: var(--success); }
.sb-banner.warning { background: var(--warning-hover); border-color: var(--warning); }
.sb-banner.error   { background: var(--error-hover);   border-color: var(--error); }`;

// --- NOTIFICATIONS ---
sbRegister({
  name: 'notifications',
  title: 'Notifications & Banners',
  description: 'Banners provide contextual feedback about system events, errors, and informational messages.',
  sections: [
    {
      title: 'Banner Types', col: true, interactive: true,
      preview: `<div class="sb-banner info" style="width:100%">
          <span class="sb-banner-icon">&#8505;</span>
          <div class="sb-banner-content">
            <div class="sb-banner-title">System Update Available</div>
            <div class="sb-banner-text">Firmware v3.2.1 is ready for deployment across 12 terminals.</div>
          </div>
          <button class="sb-banner-close" onclick="dismissBanner(this)">&#10005;</button>
        </div>
        <div class="sb-banner success" style="width:100%">
          <span class="sb-banner-icon">&#10003;</span>
          <div class="sb-banner-content">
            <div class="sb-banner-title">Deployment Complete</div>
            <div class="sb-banner-text">All 48 terminals have been successfully updated to v3.2.0.</div>
          </div>
          <button class="sb-banner-close" onclick="dismissBanner(this)">&#10005;</button>
        </div>
        <div class="sb-banner warning" style="width:100%">
          <span class="sb-banner-icon">&#9888;</span>
          <div class="sb-banner-content">
            <div class="sb-banner-title">High Latency Detected</div>
            <div class="sb-banner-text">Terminal SB-003 is experiencing latency above 500ms threshold.</div>
          </div>
          <button class="sb-banner-close" onclick="dismissBanner(this)">&#10005;</button>
        </div>
        <div class="sb-banner error" style="width:100%">
          <span class="sb-banner-icon">&#10008;</span>
          <div class="sb-banner-content">
            <div class="sb-banner-title">Link Failure</div>
            <div class="sb-banner-text">Terminal SB-002 lost uplink connection. Automatic failover initiated.</div>
          </div>
          <button class="sb-banner-close" onclick="dismissBanner(this)">&#10005;</button>
        </div>`,
      html: `<div class="sb-banner info">
  <span class="sb-banner-icon">&#8505;</span>
  <div class="sb-banner-content">
    <div class="sb-banner-title">Title</div>
    <div class="sb-banner-text">Description</div>
  </div>
  <button class="sb-banner-close">&#10005;</button>
</div>

<!-- Types: info, success, warning, error -->`,
      css: COMP_CSS.notifications,
    },
  ],
});
