// ═══════════════════════════════════════════════════════════════════════════
//  TABLE
//  CSS в css/components/table.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.table = `.sb-table-wrap {
  border: var(--border-width-1) solid var(--border);
  border-radius: var(--radius-8);
  overflow: hidden;
}
.sb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--body-font-size-m);
}
.sb-table th {
  text-align: left;
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  font-weight: var(--font-weight-medium);
  font-size: var(--body-font-size-s);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border);
}
.sb-table td {
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  border-bottom: var(--border-width-1) solid var(--border);
}
.sb-table tr:last-child td { border-bottom: none; }
.sb-table tr:hover td { background: var(--surface-2); }`;

// --- TABLE ---
sbRegister({
  name: 'table',
  title: 'Table',
  description: 'Data tables for displaying structured terminal and device data. Supports sorting, row selection, and inline status indicators.',
  renderPage() {
    const rows = [
      { name: 'SB-Terminal-001', ip: '192.168.1.10', band: 'Ka-Band', status: 'online', signal: '98%' },
      { name: 'SB-Terminal-002', ip: '192.168.1.11', band: 'Ku-Band', status: 'error', signal: '0%' },
      { name: 'SB-Terminal-003', ip: '192.168.1.12', band: 'C-Band', status: 'warning', signal: '67%' },
      { name: 'SB-Terminal-004', ip: '192.168.1.13', band: 'Ka-Band', status: 'online', signal: '95%' },
      { name: 'SB-Terminal-005', ip: '192.168.1.14', band: 'X-Band', status: 'maintenance', signal: '--' },
    ];
    const statusMap = {
      online: { dot: 'online', label: 'Online' },
      error: { dot: 'error', label: 'Error' },
      warning: { dot: 'warning', label: 'Warning' },
      maintenance: { dot: 'maintenance', label: 'Maintenance' },
    };
    let tableRows = '';
    rows.forEach(r => {
      const s = statusMap[r.status];
      tableRows += `<tr>
        <td class="cell-checkbox"><input type="checkbox" class="sb-checkbox" /></td>
        <td><strong>${r.name}</strong></td>
        <td class="sb-body-s sb-mono" style="color:var(--text-tertiary)">${r.ip}</td>
        <td>${r.band}</td>
        <td><div class="cell-status"><span class="sb-status-dot ${s.dot}"></span>${s.label}</div></td>
        <td>${r.signal}</td>
      </tr>`;
    });

    const previewHTML = `<div class="sb-table-wrap" style="width:100%">
          <table class="sb-table">
            <thead><tr>
              <th class="cell-checkbox"><input type="checkbox" class="sb-checkbox" /></th>
              <th>Terminal <span class="sort-icon">&#9650;</span></th>
              <th>IP Address <span class="sort-icon">&#9650;</span></th>
              <th>Band <span class="sort-icon">&#9650;</span></th>
              <th>Status <span class="sort-icon">&#9650;</span></th>
              <th>Signal <span class="sort-icon">&#9660;</span></th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <div class="table-pagination">
            <span>Showing 1-5 of 128 terminals</span>
            <div class="pages">
              <button class="page-btn">&laquo;</button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">...</button>
              <button class="page-btn">26</button>
              <button class="page-btn">&raquo;</button>
            </div>
          </div>
        </div>`;

    return `<div class="page fade-in">
      <h1 class="page-title sb-h4">Table</h1>
      <p class="page-desc sb-body-l">Data tables for displaying structured terminal and device data. Supports sorting, row selection, and inline status indicators.</p>
      <div class="comp-section">
        <h2 class="comp-title sb-title-l">Data Table</h2>
        ${exampleBox(previewHTML, `<div class="sb-table-wrap">
  <table class="sb-table">
    <thead>
      <tr>
        <th>Terminal</th>
        <th>IP Address</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>SB-Terminal-001</td>
        <td>192.168.1.10</td>
        <td><span class="sb-status-dot online"></span> Online</td>
      </tr>
    </tbody>
  </table>
</div>`, COMP_CSS.table, { col: true, interactive: true })}
      </div>
    </div>`;
  },
});
