// ═══════════════════════════════════════════════════════════════════════════
//  FILE UPLOADER
//  CSS в css/components/file-uploader.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Пока только File Uploader Area (дропзона). Upload Cells (ячейки
//  загрузок) — следующий заход, спека ожидается.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS['file-uploader'] = `.sb-uploader-area { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--gap-vert-0); width: 328px; min-width: 320px; max-width: 1024px; min-height: 96px; max-height: 640px; padding: var(--pad-vert-16) var(--pad-horiz-16); box-sizing: border-box; border-radius: var(--radius-4); border: var(--border-width-1) dashed var(--border); background: var(--surface-1); cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.sb-uploader-area:hover, .sb-uploader-area.dragover { border-color: var(--primary); background: var(--primary-hover); }
.sb-uploader-center { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--gap-vert-s); padding: var(--pad-vert-0) var(--pad-horiz-0); text-align: center; }
.sb-uploader-icon  { display: inline-flex; color: var(--text-primary); }
.sb-uploader-title { color: var(--text-primary); }
.sb-uploader-hint  { color: var(--text-secondary); }
.sb-uploader-input { display: none; }
.sb-uploader-cell { position: relative; display: flex; align-items: center; gap: var(--gap-horiz-s); width: 272px; min-width: 80px; max-width: 1024px; min-height: 50px; max-height: 50px; padding: var(--pad-vert-8) var(--pad-horiz-8); box-sizing: border-box; background: var(--background); border-bottom: var(--border-width-1) solid var(--border-soft); }
.sb-uploader-cell-file { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 32px; height: 32px; box-sizing: border-box; flex-shrink: 0; border-radius: var(--radius-1); border: var(--border-width-1-5) solid var(--border-soft); background: var(--surface-1); color: var(--text-secondary); font-size: var(--badge-font-size); font-weight: var(--font-weight-medium); line-height: var(--title-line-height-s); text-transform: uppercase; }
.sb-uploader-cell-center { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: var(--gap-vert-xs); flex: 1 0 0; min-width: 0; }
.sb-uploader-cell-title { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-tertiary); text-transform: none; line-height: var(--body-line-height); }
.sb-uploader-cell-info { display: flex; align-items: center; gap: var(--gap-horiz-xxs); align-self: stretch; color: var(--text-secondary); }
.sb-uploader-cell-badge { display: inline-flex; justify-content: center; align-items: center; width: 16px; height: 16px; flex-shrink: 0; }
.sb-uploader-cell-badge svg { width: 16px; height: 16px; }
.sb-uploader-cell-status { font-size: var(--badge-font-size); font-weight: var(--font-weight-medium); line-height: var(--title-line-height-s); }
.sb-uploader { display: inline-flex; flex-direction: column; align-items: flex-start; gap: var(--gap-vert-m); padding: var(--pad-vert-16) var(--pad-horiz-16) var(--pad-vert-24) var(--pad-horiz-16); box-sizing: border-box; border-radius: var(--radius-18); border: var(--border-width-1) solid transparent; background: var(--background); box-shadow: 0 2px 8px 0 var(--shadow-overlay); }
.sb-uploader.framed { box-shadow: none; border-color: var(--border); }
.sb-uploader > .sb-uploader-area, .sb-uploader > .sb-header-xs { align-self: stretch; }
.sb-uploader-list { display: flex; flex-direction: column; align-self: stretch; gap: var(--gap-vert-m); }
.sb-uploader-list-done, .sb-uploader-list-active { display: flex; flex-direction: column; }
.sb-uploader-list-done:empty, .sb-uploader-list-active:empty { display: none; }
.sb-uploader-list .sb-uploader-cell { width: 100%; }
.sb-uploader-cell.completed .sb-uploader-cell-status { color: var(--success); }
.sb-uploader-cell.uploading .sb-uploader-cell-status { color: var(--primary); }
.sb-uploader-cell.failed .sb-uploader-cell-status { color: var(--error); }
.sb-uploader-cell.uploading .sb-uploader-cell-badge { --info: var(--primary); }
.sb-uploader-cell.failed .sb-uploader-cell-badge { --alert: var(--error); }
.sb-uploader-cell-retry { border: none; background: none; padding: 0; font-family: inherit; font-size: var(--badge-font-size); font-weight: var(--font-weight-medium); line-height: var(--title-line-height-s); color: var(--primary); cursor: pointer; }
.sb-uploader-cell-progress { position: absolute; left: 0; bottom: calc(var(--border-width-1) * -1); height: 2px; border-radius: var(--radius-2); background: var(--primary); }`;

// --- FILE UPLOADER ---
(() => {
  /**
   * sbMkUploaderArea(opts) — дропзона File Uploader.
   *   title    — заголовок (Title M)
   *   hint     — подсказка под тайтлом (Body M, --text-secondary)
   *   accept   — фильтр file input'а ('.json,.zip' и т.п.), '' = любой
   *   multiple — множественный выбор (default true)
   *   dragover — статически включённое drag-состояние (для доков)
   *   wide     — width:100% (растянуть до max-width 1024)
   */
  function mkUploaderArea(opts = {}) {
    const {
      title = 'Drag & Drop your files here or browse',
      hint = 'JSON format only, up to 50 Mb',
      accept = '', multiple = true, dragover = false, wide = false,
    } = opts;
    return `<div class="sb-uploader-area${dragover ? ' dragover' : ''}"${wide ? ' style="width:100%"' : ''}
         ondragover="sbUploaderDragOver(this, event)"
         ondragleave="sbUploaderDragLeave(this, event)"
         ondrop="sbUploaderDrop(this, event)"
         onclick="this.querySelector('.sb-uploader-input').click()">
      <div class="sb-uploader-center">
        <span class="sb-uploader-icon">${sbIcon('upload-cloud-2-line', 'L')}</span>
        <div class="sb-uploader-title sb-title-m">${title}</div>
        <div class="sb-uploader-hint sb-body-m">${hint}</div>
        ${sbMkButton({ icon: 'add-line', iconSize: 'S', size: 's', attrs: ' tabindex="-1" aria-label="Add files"' })}
        <input class="sb-uploader-input" type="file"${multiple ? ' multiple' : ''}${accept ? ` accept="${accept}"` : ''} onchange="sbUploaderPick(this)" onclick="event.stopPropagation()">
      </div>
    </div>`;
  }
  window.sbMkUploaderArea = mkUploaderArea;

  /**
   * sbMkUploadCell(opts) — ячейка списка загрузок.
   *   name     — имя файла с расширением ('backup-file-name-1.json')
   *   size     — строка полного размера ('110 Mb')
   *   type     — метка в File Icon; по умолчанию — расширение из name
   *   status   — 'completed' | 'uploading' | 'failed'
   *   loaded   — uploading: сколько уже скачано ('10 Mb')
   *   progress — uploading: заполнение Progress Bar, 0–100 (%)
   */
  function mkUploadCell(opts = {}) {
    const { name = 'file-name.json', size = '110 Mb', status = 'completed',
            loaded = '10 Mb', progress = 40 } = opts;
    const type = opts.type || (name.match(/\.([a-z0-9]+)$/i) || [])[1] || 'file';
    const up     = status === 'uploading';
    const failed = status === 'failed';
    // Инфострока. У Failed свой порядок: [badge][Failed][—][Retry], без размера.
    let info;
    if (failed) {
      info = `<span class="sb-uploader-cell-badge">${SB_SVG.warnLine}</span>
          <span class="sb-uploader-cell-status">Failed</span>
          <span>-</span>
          <button class="sb-uploader-cell-retry" type="button" onclick="sbUploaderRetry(this)">Retry</button>`;
    } else {
      const badge = up ? SB_SVG.time : SB_SVG.checkCircle;
      info = `<span class="sb-uploader-cell-size">${up ? `${loaded} of ${size}` : size}</span>
          <span>-</span>
          <span class="sb-uploader-cell-badge">${badge}</span>
          <span class="sb-uploader-cell-status">${up ? 'Uploading ...' : 'Completed'}</span>`;
    }
    // Правый слот: у Completed корзина (удалить), у Uploading/Failed крестик.
    const btnIcon  = up || failed ? sbIcon('close-line', 'S') : sbIcon('delete-bin-line', 'S');
    const btnLabel = up ? 'Cancel upload' : (failed ? 'Dismiss' : 'Remove file');
    const bar = up ? `<div class="sb-uploader-cell-progress" style="width:${progress}%"></div>` : '';
    // data-name/-size — для sbUploaderRetry (перезапуск Failed → Uploading).
    return `<div class="sb-uploader-cell ${status}" data-name="${name}" data-size="${size}">
      <div class="sb-uploader-cell-file">${type}</div>
      <div class="sb-uploader-cell-center">
        <div class="sb-uploader-cell-title sb-title-s">${name}</div>
        <div class="sb-uploader-cell-info sb-sub">
          ${info}
        </div>
      </div>
      ${sbMkButton({ iconOnly: true, size: 's', content: btnIcon, attrs: ` aria-label="${btnLabel}" onclick="sbUploaderCellRemove(this)"` })}
      ${bar}
    </div>`;
  }
  window.sbMkUploadCell = mkUploadCell;

  // ── Размеры файлов ──────────────────────────────────────────────────
  function fmtSize(bytes) {
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1).replace(/\.0$/, '') + ' Gb';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(1).replace(/\.0$/, '') + ' Mb';
    return Math.max(1, Math.round(bytes / 1e3)) + ' Kb';
  }
  // '110 Mb' → 110000000; для ячеек, созданных не из настоящего File.
  function parseSize(str) {
    const m = /([\d.]+)\s*(gb|mb|kb)/i.exec(str || '');
    if (!m) return 10e6;
    return parseFloat(m[1]) * { gb: 1e9, mb: 1e6, kb: 1e3 }[m[2].toLowerCase()];
  }

  // ── Живой пайплайн ──────────────────────────────────────────────────
  // Симуляция прогресса Uploading-ячейки (демо; в реальном аппе прогресс
  // приходит из XHR/fetch). По 100% ячейка перерождается в Completed.
  function simulate(cell) {
    if (!cell) return;
    const bytes = Number(cell.dataset.bytes) || parseSize(cell.dataset.size);
    let progress = 0;
    const timer = setInterval(() => {
      if (!cell.isConnected) { clearInterval(timer); return; }
      progress = Math.min(100, progress + 5 + Math.random() * 12);
      const bar    = cell.querySelector('.sb-uploader-cell-progress');
      const sizeEl = cell.querySelector('.sb-uploader-cell-size');
      if (bar)    bar.style.width = progress + '%';
      if (sizeEl) sizeEl.textContent = `${fmtSize(bytes * progress / 100)} of ${fmtSize(bytes)}`;
      if (progress >= 100) {
        clearInterval(timer);
        const root = cell.closest('.sb-uploader');
        const done = root && root.querySelector('.sb-uploader-list-done');
        const html = mkUploadCell({
          name: cell.dataset.name, size: fmtSize(bytes), status: 'completed',
        });
        // В композите готовый файл переезжает НАВЕРХ, к загруженным;
        // вне композита (доки) — перерождается на месте.
        if (done) done.insertAdjacentHTML('beforeend', html);
        else cell.insertAdjacentHTML('afterend', html);
        cell.remove();
        if (root) sbUploaderSyncCounter(root);
      }
    }, 350);
  }

  // Счётчик хедера: completed / всего. Молча скипает, если счётчика нет.
  window.sbUploaderSyncCounter = function(root) {
    const c = root.querySelector('.sb-uploader-counter');
    if (!c) return;
    c.querySelector('.sb-counter-online').textContent = root.querySelectorAll('.sb-uploader-cell.completed').length;
    c.querySelector('.sb-counter-total').textContent  = root.querySelectorAll('.sb-uploader-cell').length;
  };

  // Удаление ячейки (корзина / крестик) + синк счётчика композита.
  window.sbUploaderCellRemove = function(btn) {
    const cell = btn.closest('.sb-uploader-cell');
    const root = btn.closest('.sb-uploader');
    if (cell) cell.remove();
    if (root) sbUploaderSyncCounter(root);
  };

  // Демо-контроллер Style (Card ↔ Framed) в доках: тоглы взаимоисключающие,
  // клик переключает класс .framed на карточке внутри той же demo-обёртки.
  window.sbUploaderDemoStyle = function(input, framed) {
    const wrap = input.closest('[data-uploader-style-demo]');
    if (!wrap) return;
    const card = wrap.querySelector('.sb-uploader');
    if (card) card.classList.toggle('framed', framed);
    wrap.querySelectorAll('[data-style-card] input').forEach(i => { i.checked = !framed; });
    wrap.querySelectorAll('[data-style-framed] input').forEach(i => { i.checked = framed; });
  };

  // Retry: Failed-ячейка перезапускается в Uploading с нуля и «доезжает»
  // до Completed (демо; в реальном аппе тут повторный запрос на загрузку).
  window.sbUploaderRetry = function(btn) {
    const cell = btn.closest('.sb-uploader-cell');
    if (!cell) return;
    const root = cell.closest('.sb-uploader');
    cell.insertAdjacentHTML('afterend', mkUploadCell({
      name: cell.dataset.name, size: cell.dataset.size,
      status: 'uploading', loaded: '0 Kb', progress: 0,
    }));
    const fresh = cell.nextElementSibling;
    cell.remove();
    simulate(fresh);
    if (root) sbUploaderSyncCounter(root);
  };

  // ── Handlers ────────────────────────────────────────────────────────
  // dragover обязан звать preventDefault, иначе браузер не даст drop.
  window.sbUploaderDragOver = function(area, e) {
    e.preventDefault();
    area.classList.add('dragover');
  };
  // relatedTarget-чек: dragleave стреляет и при уходе на ребёнка зоны.
  window.sbUploaderDragLeave = function(area, e) {
    if (!area.contains(e.relatedTarget)) area.classList.remove('dragover');
  };
  window.sbUploaderDrop = function(area, e) {
    e.preventDefault();
    area.classList.remove('dragover');
    sbUploaderFiles(area, e.dataTransfer.files);
  };
  window.sbUploaderPick = function(input) {
    sbUploaderFiles(input.closest('.sb-uploader-area'), input.files);
    input.value = ''; // повторный выбор того же файла снова триггерит change
  };

  // Единая точка приёма файлов: событие наружу; внутри композита файлы
  // едут в список Uploading-ячейками, у одиночной area — демо-фидбек в hint.
  window.sbUploaderFiles = function(area, files) {
    if (!area || !files || !files.length) return;
    area.dispatchEvent(new CustomEvent('sb-uploader:files', {
      detail: { files: Array.from(files) }, bubbles: true,
    }));
    const root = area.closest('.sb-uploader');
    const active = root && root.querySelector('.sb-uploader-list-active');
    if (active) {
      Array.from(files).forEach(f => {
        active.insertAdjacentHTML('beforeend', mkUploadCell({
          name: f.name, size: fmtSize(f.size), status: 'uploading', loaded: '0 Kb', progress: 0,
        }));
        const cell = active.lastElementChild;
        cell.dataset.bytes = f.size;
        simulate(cell);
      });
      sbUploaderSyncCounter(root);
      return;
    }
    const hint = area.querySelector('.sb-uploader-hint');
    if (!hint) return;
    if (!area._sbHintOrig) area._sbHintOrig = hint.textContent;
    const names = Array.from(files).map(f => f.name);
    hint.textContent = names.slice(0, 2).join(', ') + (names.length > 2 ? ` +${names.length - 2}` : '');
    clearTimeout(area._sbHintT);
    area._sbHintT = setTimeout(() => { hint.textContent = area._sbHintOrig; }, 2500);
  };

  /**
   * sbMkUploader(opts) — составной File Uploader (карточка для UI):
   * дропзона + хедер списка (Header XS + Counter completed/total) +
   * стек Upload Cells. Живой из коробки: дроп/выбор файлов добавляет
   * Uploading-ячейки с прогрессом, Retry перезапускает, счётчик
   * обновляется сам. Наружу летит sb-uploader:files (bubbles) — в
   * реальном приложении на него вешается настоящая загрузка.
   *   title     — заголовок списка ('Uploads')
   *   files     — стартовые ячейки: [{ name, size, status, loaded, progress }]
   *   counter   — счётчик в хедере (default true)
   *   framed    — бордер вместо тени (Card ↔ Framed стили карточки)
   *   areaTitle / hint / accept / multiple — прокидываются в дропзону
   */
  function mkUploader(opts = {}) {
    const { title = 'Uploads', files = [], counter = true, framed = false } = opts;
    // Два процесса раздельно: Completed сверху, активные снизу.
    const doneFiles   = files.filter(f => !f.status || f.status === 'completed');
    const activeFiles = files.filter(f => f.status && f.status !== 'completed');
    const counterHtml = counter
      ? sbMkCounter({ type: 'range', value: doneFiles.length, max: files.length, cls: 'sb-uploader-counter' })
      : '';
    return `<div class="sb-uploader${framed ? ' framed' : ''}">
      ${mkUploaderArea({ title: opts.areaTitle, hint: opts.hint, accept: opts.accept, multiple: opts.multiple, wide: true })}
      ${sbMkHeaderXS({
        slotLeft: `<span class="sb-header-xs-title sb-title-m sb-fw-semibold">${title}</span>`,
        slotRight: counterHtml,
      })}
      <div class="sb-uploader-list">
        <div class="sb-uploader-list-done">${doneFiles.map(f => mkUploadCell(f)).join('')}</div>
        <div class="sb-uploader-list-active">${activeFiles.map(f => mkUploadCell(f)).join('')}</div>
      </div>
    </div>`;
  }
  window.sbMkUploader = mkUploader;

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'file-uploader',
    title: 'File Uploader',
    description: sbT(
      'A drag-and-drop area for uploading files from the computer. The whole area is clickable and opens the system file picker; dragging a file over it highlights the zone. Real File API under the hood — name, size and type of the picked files are available to the consumer via the sb-uploader:files event.',
      'Область drag-and-drop для загрузки файлов с компьютера. Вся зона кликабельна и открывает системный выбор файла; перетаскивание файла над зоной подсвечивает её. Под капотом настоящий File API — имя, размер и тип выбранных файлов доступны потребителю через событие sb-uploader:files.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Width: 328px (min 320 / max 1024);</li><li>Height: min 96 / max 640;</li><li>Padding: 16;</li><li>Radius: 4;</li><li>Border: 1px dashed --border.</li></ul>'
      + '<b>States:</b>'
      + '<ul><li>Hover / dragover — dashed --primary plus --primary-hover fill.</li></ul>'
      + '<b>Center slot:</b>'
      + '<ul><li>Icon upload-cloud-2-line (L);</li><li>Title M, --text-primary;</li><li>Hint — Body M, --text-secondary;</li><li>Add — Button Secondary Small (icon add-line S).</li></ul>'
      + '<b>Upload Cell:</b>'
      + '<ul><li>Width: 272px (min 80 / max 1024), height 50 fixed; padding 8×8, gap 8;</li><li>Divider — 1px --border-soft (spec says --surface-2, which vanishes in dark — translated per the border rule);</li><li>File Icon — 32×32, radius 1, 1.5px --border-soft, --surface-1 fill;</li><li>Title S --text-tertiary with an ellipsis; info line — Subscription, --text-secondary;</li><li>Status name — 10px medium; Completed — --success plus Symbol Badge S (16px check-circle);</li><li>Uploading — loaded-of-total size, --primary time badge and status, close-line S (stop), 2px progress bar (--primary, radius 2) running right over the bottom divider — no track, the divider itself plays that role;</li><li>Failed — no size; warning-dialogue-line badge and status name in --error, then a dash and a Retry text button (Badge typography, --primary) that restarts the upload; the right slot keeps the cross;</li><li>Remove — Button Secondary Small (delete-bin-line S).</li></ul>'
      + '<b>Assembled Uploader:</b>'
      + '<ul><li>Card — radius 18, --background, Shadow-S; padding 16/16/24, gap 16;</li><li>Framed — the .framed modifier: a 1px --border instead of the shadow;</li><li>List header — Header XS plus a Counter (range, completed of total, auto-updating);</li><li>List — two groups: Completed on top, active (Uploading / Failed) below, 16px gap between them; a finished file moves up to Completed;</li><li>Live — sb-uploader:files (bubbles) carries the picked File objects; the demo simulates progress.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Ширина: 328px (min 320 / max 1024);</li><li>Высота: min 96 / max 640;</li><li>Padding: 16;</li><li>Radius: 4;</li><li>Бордер: 1px dashed --border.</li></ul>'
      + '<b>Состояния:</b>'
      + '<ul><li>Hover / dragover — dashed --primary и заливка --primary-hover.</li></ul>'
      + '<b>Центральный слот:</b>'
      + '<ul><li>Иконка upload-cloud-2-line (L);</li><li>Title M, --text-primary;</li><li>Подсказка — Body M, --text-secondary;</li><li>Add — Button Secondary Small (иконка add-line S).</li></ul>'
      + '<b>Upload Cell:</b>'
      + '<ul><li>Ширина: 272px (min 80 / max 1024), высота 50 фикс; padding 8×8, gap 8;</li><li>Разделитель — 1px --border-soft (в спеке --surface-2, который пропадает в dark — транслирован по правилу границ);</li><li>File Icon — 32×32, radius 1, 1.5px --border-soft, заливка --surface-1;</li><li>Title S --text-tertiary с многоточием; инфострока — Subscription, --text-secondary;</li><li>Имя статуса — 10px medium; Completed — --success и Symbol Badge S (16px check-circle);</li><li>Uploading — размер «сколько из скольки», часы и статус --primary, close-line S (стоп), progress bar 2px (--primary, radius 2) прямо по нижнему разделителю — трека нет, его роль играет сам строук;</li><li>Failed — без размера; warning-dialogue-line бейдж и имя статуса в --error, затем тире и текст-кнопка Retry (Badge-типографика, --primary), перезапускающая загрузку; в правом слоте крестик;</li><li>Remove — Button Secondary Small (delete-bin-line S).</li></ul>'
      + '<b>Составной Uploader:</b>'
      + '<ul><li>Карточка — radius 18, --background, Shadow-S; padding 16/16/24, gap 16;</li><li>Framed — модификатор .framed: бордер 1px --border вместо тени;</li><li>Хедер списка — Header XS и Counter (range, completed из total, обновляется сам);</li><li>Список — две группы: сверху Completed, ниже активные (Uploading / Failed), между ними gap 16; докачавшийся файл переезжает наверх;</li><li>Live — sb-uploader:files (bubbles) несёт настоящие File-объекты; в демо прогресс симулируется.</li></ul>'
    )),
    playground: {
      title: 'File Uploader Playground',
      state: { dragover: false, wide: false },
      controls(pg) {
        return sbPgGroup('State', `
          <div class="pg-toggles">${pg.toggle('dragover', 'Dragover')}${pg.toggle('wide', 'Wide')}</div>
        `);
      },
      render(s) {
        return mkUploaderArea(s);
      },
      genCode(s) {
        const html = `<div class="sb-uploader-area${s.dragover ? ' dragover' : ''}"${s.wide ? ' style="width:100%"' : ''}>
  <div class="sb-uploader-center">
    <span class="sb-uploader-icon"><!-- upload-cloud-2-line L --></span>
    <div class="sb-uploader-title sb-title-m">Drag & Drop your files here or browse</div>
    <div class="sb-uploader-hint sb-body-m">JSON format only, up to 50 Mb</div>
    ${sbMkButton({ size: 's', iconOnly: true, content: '<!-- add-line S -->', attrs: ' aria-label="Add files"' })}
    <input class="sb-uploader-input" type="file" multiple>
  </div>
</div>`;
        return { html, css: COMP_CSS['file-uploader'] };
      },
    },
    sections: [
      {
        title: sbT('Area — Default and Dragover', 'Area — Default и Dragover'),
        desc: sbT(
          'The default zone rests on --surface-1 with a dashed --border. Hovering or dragging a file over it switches the border to --primary and fills the zone with --primary-hover. Try dropping a real file — the hint briefly shows what was picked.',
          'Спокойная зона лежит на --surface-1 с dashed --border. Hover или файл над зоной переключают бордер на --primary и заливают зону --primary-hover. Попробуй бросить настоящий файл — подсказка на пару секунд покажет, что выбрано.'
        ),
        preview: `${sbMkFlex({ gap: 'm', align: 'center', wrap: true, content: `${mkUploaderArea({})}
          ${mkUploaderArea({ dragover: true })}` })}`,
        html: `<!-- Default -->
<div class="sb-uploader-area"> ... </div>

<!-- Dragover / hover -->
<div class="sb-uploader-area dragover"> ... </div>`,
        css: COMP_CSS['file-uploader'],
      },
      {
        title: sbT('Upload Cell — States', 'Upload Cell — состояния'),
        desc: sbT(
          'A row in the uploads list: a File Icon square with the file type, the file name (Title S, truncates with an ellipsis), an info line with a Symbol Badge S and the status name, and an action button in the right slot. Completed shows the size, a green check and a trash can (removes the row — try it). Uploading shows the loaded-of-total size, a --primary clock, a stop cross and a 2px progress bar across the full cell width. Failed shows an --error warning badge and name plus a Retry text button — clicking it restarts the upload.',
          'Строка списка загрузок: квадрат File Icon с типом файла, имя файла (Title S, обрезается многоточием), инфострока с Symbol Badge S и именем статуса, справа — кнопка действия. Completed показывает размер, зелёный check и корзину (удаляет строку — попробуй). Uploading — сколько из скольки скачано, часы --primary, крестик-стоп и progress bar 2px на всю ширину ячейки. Failed — warning-бейдж и имя статуса в --error и текст-кнопку Retry: клик перезапускает загрузку.'
        ),
        preview: `${sbMkFlex({ dir: 'col', gap: '0', full: true, content: `${mkUploadCell({ name: 'backup-file-name-1.json', size: '110 Mb' })}
          ${mkUploadCell({ name: 'backup-file-name-2.json', size: '110 Mb', status: 'uploading', loaded: '10 Mb', progress: 36 })}
          ${mkUploadCell({ name: 'backup-file-name-4.json', size: '110 Mb', status: 'failed' })}
          ${mkUploadCell({ name: 'a-very-long-blender-project-file-name-that-truncates.zip', size: '150 Mb' })}` })}`,
        html: `<div class="sb-uploader-cell completed">
  <div class="sb-uploader-cell-file">json</div>
  <div class="sb-uploader-cell-center">
    <div class="sb-uploader-cell-title sb-title-s">backup-file-name-1.json</div>
    <div class="sb-uploader-cell-info sb-sub">
      <span>110 Mb</span>
      <span>-</span>
      <span class="sb-uploader-cell-badge"><!-- Symbol-Badges/Type=check-circle.svg --></span>
      <span class="sb-uploader-cell-status">Completed</span>
    </div>
  </div>
  ${sbMkButton({ size: 's', iconOnly: true, content: '<!-- delete-bin-line S -->', attrs: ' aria-label="Remove file"' })}
</div>

<!-- Uploading: loaded-of-total, часы --primary, крестик-стоп, progress bar -->
<div class="sb-uploader-cell uploading">
  <div class="sb-uploader-cell-file">json</div>
  <div class="sb-uploader-cell-center">
    <div class="sb-uploader-cell-title sb-title-s">backup-file-name-2.json</div>
    <div class="sb-uploader-cell-info sb-sub">
      <span>10 Mb of 110 Mb</span>
      <span>-</span>
      <span class="sb-uploader-cell-badge"><!-- Symbol-Badges/Type=time.svg --></span>
      <span class="sb-uploader-cell-status">Uploading ...</span>
    </div>
  </div>
  ${sbMkButton({ size: 's', iconOnly: true, content: '<!-- close-line S -->', attrs: ' aria-label="Cancel upload"' })}
  <div class="sb-uploader-cell-progress" style="width:36%"></div>
</div>

<!-- Failed: warning-бейдж и статус --error, Retry перезапускает загрузку -->
<div class="sb-uploader-cell failed">
  <div class="sb-uploader-cell-file">json</div>
  <div class="sb-uploader-cell-center">
    <div class="sb-uploader-cell-title sb-title-s">backup-file-name-4.json</div>
    <div class="sb-uploader-cell-info sb-sub">
      <span class="sb-uploader-cell-badge"><!-- Symbol-Badges/Type=warning-dialogue-line.svg --></span>
      <span class="sb-uploader-cell-status">Failed</span>
      <span>-</span>
      <button class="sb-uploader-cell-retry" type="button">Retry</button>
    </div>
  </div>
  ${sbMkButton({ size: 's', iconOnly: true, content: '<!-- close-line S -->', attrs: ' aria-label="Dismiss"' })}
</div>`,
        css: COMP_CSS['file-uploader'],
      },
      {
        title: sbT('Uploader — Assembled Example', 'Uploader — собранный пример'),
        desc: sbT(
          'The full component for real UI: a card (radius 18, Shadow-S) with the drop area, an Uploads header (Header XS with a Counter — completed of total) and the list split into two processes: Completed on top, active uploads (Uploading / Failed) below, with a 16px gap between the groups. A finished file moves up to the Completed group. The consumer sets the card width; everything inside stretches.',
          'Полный компонент для боевого UI: карточка (radius 18, Shadow-S) с дропзоной, хедером Uploads (Header XS со счётчиком — completed из total) и списком, разделённым на два процесса: сверху Completed, ниже активные загрузки (Uploading / Failed), между группами gap 16. Докачавшийся файл переезжает наверх, к загруженным. Ширину карточки задаёт consumer, внутренности тянутся.'
        ),
        preview: `${sbMkFlex({ gap: 'xl', align: 'start', wrap: true, attrs: ' data-uploader-style-demo', content: `<div style="width:min(420px, 100%)">${mkUploader({
            files: [
              { name: 'backup-file-name-1.json', size: '110 Mb' },
              { name: 'backup-file-name-2.json', size: '110 Mb' },
            ],
          }).replace('class="sb-uploader"', 'class="sb-uploader" style="width:100%"')}</div>
          <div style="flex:1 1 220px;min-width:200px;max-width:320px;display:flex;flex-direction:column;gap:var(--gap-vert-m)">
            ${sbPgGroup('Style', `
              ${sbMkFlex({ dir: 'col', gap: 's', content: `${sbMkToggle({ on: true, label: 'Card', attrs: 'data-style-card', inputAttrs: 'onchange="sbUploaderDemoStyle(this, false)"' })}
                ${sbMkToggle({ label: 'Framed', attrs: 'data-style-framed', inputAttrs: 'onchange="sbUploaderDemoStyle(this, true)"' })}` })}
            `)}
            <div class="sb-body-m" style="color:var(--text-secondary)">${sbT(
              'The example is alive and shows the real process: drop or pick real files — an Uploading cell with a progress bar appears in the lower group, runs to Completed and jumps up to the finished ones. The trash and crosses remove rows, and the counter keeps up by itself.',
              'Пример живой и показывает реальный процесс: брось или выбери настоящие файлы — в нижней группе появится Uploading-ячейка с прогрессом, доедет до Completed и перепрыгнет наверх, к загруженным. Корзина и крестики удаляют строки, счётчик обновляется сам.'
            )}</div>
          </div>` })}`,
        html: `<!-- Стили карточки: Card (Shadow-S, default) — class="sb-uploader",
     Framed (1px --border вместо тени) — class="sb-uploader framed" -->
<div class="sb-uploader">
  <!-- 1. Дропзона -->
  <div class="sb-uploader-area"> ... </div>

  <!-- 2. Хедер списка: Header XS + Counter (range) -->
  <div class="sb-header-xs">
    <div class="sb-header-xs-left">
      <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Uploads</span>
    </div>
    <div class="sb-counter range sb-uploader-counter">
      <span class="sb-counter-online">2</span><span class="sb-counter-sep">/</span><span class="sb-counter-total">4</span>
    </div>
  </div>

  <!-- 3. Список: два процесса раздельно, gap 16 между группами.
       Докачавшийся файл переезжает из active в done. -->
  <div class="sb-uploader-list">
    <div class="sb-uploader-list-done">
      <div class="sb-uploader-cell completed"> ... </div>
    </div>
    <div class="sb-uploader-list-active">
      <div class="sb-uploader-cell uploading"> ... </div>
      <div class="sb-uploader-cell failed"> ... </div>
    </div>
  </div>
</div>

<!-- JS: sbMkUploader({ title, files, counter, hint, accept }) → html.
     Приём файлов: элемент кидает bubbling-событие sb-uploader:files
     с detail.files (настоящие File из drag&drop / выбора). -->`,
        css: COMP_CSS['file-uploader'],
      },
    ],
  });
})();
