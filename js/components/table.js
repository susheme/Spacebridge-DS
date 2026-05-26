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
  height: 40px;
  min-width: 80px;
  text-align: left;
  padding: var(--pad-vert-8) var(--pad-horiz-2) var(--pad-vert-8) var(--pad-horiz-8);
  color: var(--text-secondary);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border);
  user-select: none;
  white-space: nowrap;
  vertical-align: middle;
}
.sb-table th .sb-sort-icon {
  display: inline-flex;
  vertical-align: middle;
  margin-left: var(--gap-horiz-xs);
  color: var(--border);
  transition: color 0.15s;
}
.sb-table th.sorted .sb-sort-icon { color: var(--primary); }
.sb-table th,
.sb-table td { position: relative; }
.sb-table th > .sb-sep.sep-v,
.sb-table td > .sb-sep.sep-v {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.sb-table .cell-checkbox,
.sb-table .cell-control {
  width: 40px;
  min-width: 40px;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  text-align: center;
}
.sb-table thead tr:first-child th:first-child { border-top-left-radius: var(--radius-8); }
.sb-table thead tr:first-child th:last-child  { border-top-right-radius: var(--radius-8); }
.sb-table td {
  height: 40px;
  width: 200px;
  min-width: 80px;
  padding: var(--pad-vert-8) var(--pad-horiz-0) var(--pad-vert-8) var(--pad-horiz-8);
  color: var(--text-tertiary);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border);
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-table tr:last-child td { border-bottom: none; }
.sb-table tr:hover td { background: var(--surface-1); }
.sb-table tr.selected td { background: var(--primary-hover); }
.sb-table td.cell-wrap {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}
.sb-table .cell-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.sb-table .cell-status { display: flex; align-items: center; gap: var(--gap-horiz-s); }`;

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
    // Inter-cell vertical separator (sb-sep sep-v sep-s) — переиспользуем
    // готовый компонент Separator. Добавляется в каждую ячейку кроме последней
    // в строке (последняя у правого края wrap'а — отдельный sep избыточен).
    const cellSep = '<span class="sb-sep sep-v sep-s"></span>';

    // Demo row cells — typography через "sb-title-m sb-fw-semibold"
    // (16/600/lh-12 по Figma). Control-cells (.cell-checkbox) без typo-класса.
    let tableRows = '';
    rows.forEach(r => {
      const s = statusMap[r.status];
      tableRows += `<tr>
        <td class="cell-checkbox"><input type="checkbox" class="sb-checkbox" />${cellSep}</td>
        <td class="sb-title-m sb-fw-semibold">${r.name}${cellSep}</td>
        <td class="sb-title-m sb-fw-semibold">${r.ip}${cellSep}</td>
        <td class="sb-title-m sb-fw-semibold">${r.band}${cellSep}</td>
        <td class="sb-title-m sb-fw-semibold"><div class="cell-status"><span class="sb-status-dot ${s.dot}"></span>${s.label}</div>${cellSep}</td>
        <td class="sb-title-m sb-fw-semibold">${r.signal}</td>
      </tr>`;
    });

    // Footer: left = summary, right = Pagination controls.
    // Jump-input временно отключён — вернёмся отдельной итерацией.
    const footerHTML = (typeof sbMkTableFooter === 'function' && typeof sbMkPagination === 'function')
      ? sbMkTableFooter({
          left: `<span class="sb-body-s" style="color:var(--text-tertiary)">5 of 128</span>`,
          right: sbMkPagination({ currentPage: 1, totalPages: 26 }),
        })
      : '';

    // Sort-iconы: default — arrow-up-s-fill в цвете --border (ghost).
    // На sorted-th'е (демо: Signal) переключаем на arrow-down-s-fill + color
    // --primary через class="sorted". Реальный sort-toggle (asc↔desc + active
    // column swap) придёт в Table v1.
    const sortUp = `<span class="sb-sort-icon">${sbIconRaw('arrow-up-s-fill', 'L')}</span>`;
    const sortDown = `<span class="sb-sort-icon">${sbIconRaw('arrow-down-s-fill', 'L')}</span>`;

    const previewHTML = `<div class="sb-table-wrap" style="width:100%">
          <table class="sb-table">
            <thead><tr>
              <th class="cell-checkbox"><input type="checkbox" class="sb-checkbox" />${cellSep}</th>
              <th class="sb-caption">Terminal ${sortUp}${cellSep}</th>
              <th class="sb-caption">IP Address ${sortUp}${cellSep}</th>
              <th class="sb-caption">Band ${sortUp}${cellSep}</th>
              <th class="sb-caption">Status ${sortUp}${cellSep}</th>
              <th class="sb-caption sorted">Signal ${sortDown}</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          ${footerHTML}
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
