// ═══════════════════════════════════════════════════════════════════════════
//  BANNERS — Banner / Notification Bar / Doc Note
//  CSS в css/components/banners.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//  Снэкбар живёт отдельно: js/components/snackbar.js.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.banners = `.sb-banner {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-s);
  width: 100%;
  min-width: 288px;
  max-width: 800px;
  min-height: 60px;
  padding: var(--pad-vert-16) var(--pad-horiz-16);
  border-radius: var(--radius-4);
  border-left: var(--border-width-4) solid var(--border);
  background: var(--surface-1);
  box-sizing: border-box;
}

/* Content column: title-row (lead + title) + description. Grows to ~80%. */
.sb-banner-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--gap-vert-xs);
  flex: 1 1 80%;
  min-width: 0;
  align-self: stretch;
}
.sb-banner-titlerow {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
  max-width: 100%;
}
.sb-banner-lead { flex-shrink: 0; display: inline-flex; align-items: center; }
/* Icon leads inherit the type colour (Status-dots carry their own bg). */
.sb-banner.info    .sb-banner-lead { color: var(--info); }
.sb-banner.success .sb-banner-lead { color: var(--success); }
.sb-banner.warning .sb-banner-lead { color: var(--alert); }
.sb-banner.error   .sb-banner-lead { color: var(--error); }

/* Title: Title M typography via .sb-title-m in markup; colour per type.
   Link-title — underlined, colour follows the type. */
.sb-banner-title { color: var(--text-tertiary); }
a.sb-banner-title {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-xxs);
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}
.sb-banner-text { color: var(--text-secondary); }

/* Right slot — pinned to the right edge, ~20% of the width. Generic:
   Badge-Status, close button, actions — any content. */
.sb-banner-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--gap-horiz-s);
  flex: 0 1 20%;
  /* НЕ stretch: растянутый слот центрировал контент по всей высоте, и при
     росте баннера (длинный текст, раскрытие) Badge-Status уезжал к середине.
     Прижимаем слот к верху; min-height 28 = 60(min-height баннера) − 2×16
     (padding) — в компактном баннере позиция та же, что была при центре,
     в выросшем бейдж остаётся на месте (паттерн закреплённого шеврона). */
  align-self: flex-start;
  min-height: 28px;
}

/* Types. Info / Success — neutral surface, coloured marker only.
   Warning / Critical — tinted surface + coloured title & text. */
.sb-banner.info    { border-left-color: var(--info); }
.sb-banner.success { border-left-color: var(--success); }
.sb-banner.warning {
  border-left-color: var(--alert);
  background: var(--alert-hover);
}
.sb-banner.warning .sb-banner-title,
.sb-banner.warning .sb-banner-text { color: var(--alert); }
.sb-banner.error {
  border-left-color: var(--error);
  background: var(--error-hover);
}
.sb-banner.error .sb-banner-title,
.sb-banner.error .sb-banner-text { color: var(--error); }

/* ── Collapsible Banner ── правило контента: баннер С правым слотом несёт
   не более 5 строк body — кламп молча (.capped), без раскрытия. Баннер
   БЕЗ правого слота (.collapsible) тоже клампится 5 строками, но при
   переполнении (замер sbBannerSyncOverflow → .has-overflow) получает
   закреплённый Chevron Button в правом верхнем углу (16/16) — раскрытие
   и сборка. docNote-плашки (sbDocNote в docs-i18n.js) собраны тем же
   контрактом — длинные Tech Info сворачиваются из коробки. */
.sb-banner { position: relative; }
.sb-banner.capped .sb-banner-text,
.sb-banner.collapsible .sb-banner-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}
.sb-banner.collapsible.expanded .sb-banner-text {
  -webkit-line-clamp: unset;
  max-height: none;
}
.sb-banner-chevron {
  display: none;
  position: absolute;
  top: var(--pad-vert-16);
  right: var(--pad-horiz-16);
}
.sb-banner.has-overflow .sb-banner-chevron,
.sb-banner.expanded .sb-banner-chevron { display: flex; }
/* Плавный collapse: line-clamp не анимируется, поэтому sbBannerToggle ведёт
   высоту инлайновым max-height (px→px) — transition ниже его подхватывает.
   0.28s — синхронно с таймаутом в JS (300ms). Без inline max-height переход
   не срабатывает вовсе (none→none), так что первичный рендер мгновенный. */
.sb-banner.collapsible .sb-banner-text { transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
@media (prefers-reduced-motion: reduce) {
  .sb-banner.collapsible .sb-banner-text { transition: none; }
}
.sb-banner-chevron svg { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
.sb-banner.expanded .sb-banner-chevron svg { transform: rotate(180deg); }
/* Контент не подлезает под закреплённый шеврон. */
.sb-banner.has-overflow .sb-banner-content,
.sb-banner.expanded .sb-banner-content { padding-right: var(--pad-horiz-32); }

/* ── Notification Bar ── slim full-width strip right under the Navigation Bar.
   Content centered by default; .align-left pins it to the left edge.
   Text — Body M in the type colour; links inherit it, bold + underline. */
.sb-notif-bar {
  display: flex;
  width: 100%;
  min-width: 320px;
  height: 28px;
  padding: var(--pad-vert-2) var(--pad-horiz-8);
  justify-content: center;
  align-items: center;
  gap: var(--gap-horiz-s);
  box-sizing: border-box;
  border-left: var(--border-width-4) solid var(--info);
  background: var(--primary-hover);
  color: var(--info);
}
.sb-notif-bar.align-left { justify-content: flex-start; }
.sb-notif-bar-lead { flex-shrink: 0; display: inline-flex; align-items: center; }
/* Fixed 28px height — no wrapping; long text truncates with an ellipsis. */
.sb-notif-bar-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sb-notif-bar a {
  color: inherit;
  font-weight: var(--font-weight-bold);
  text-decoration: underline;
  cursor: pointer;
}
.sb-notif-bar.success { border-left-color: var(--success); background: var(--success-hover); color: var(--success); }
.sb-notif-bar.warning { border-left-color: var(--alert);   background: var(--alert-hover);   color: var(--alert); }
.sb-notif-bar.error   { border-left-color: var(--error);   background: var(--error-hover);   color: var(--error); }`;

(() => {
  // ── Banner builder ──────────────────────────────────────────────────
  // type: 'info' | 'success' | 'warning' | 'error' (error = Critical)
  // lead:  произвольный HTML слева от тайтла — Status-dot / Symbol Badge / Icon
  // title: строка; href → тайтл становится ссылкой (переход к источнику ошибки)
  // text:  описание (Body M) — произвольный HTML, дизайнер верстает как нужно
  // right: правый слот — Badge-Status Mini / close / кнопки / любой HTML
  // [SYNC:doc-note-fallback] sbDocNote (docs-i18n.js) держит bootstrap-зеркало
  // collapsible-ветки этой разметки для chevron.js (регистрируется до нас).
  // Меняешь структуру баннера — синхронизируй фолбэк.
  function mkBanner(o) {
    const c = o || {};
    const type = c.type || 'info';
    const lead = c.lead ? `<span class="sb-banner-lead">${c.lead}</span>` : '';
    const title = c.title
      ? (c.href
          ? `<a class="sb-banner-title sb-title-m" href="${c.href}">${c.title}${sbIcon('arrow-right-s-line', 'S')}</a>`
          : `<span class="sb-banner-title sb-title-m">${c.title}</span>`)
      : '';
    const titleRow = (lead || title) ? `<div class="sb-banner-titlerow">${lead}${title}</div>` : '';
    const text = c.text ? `<div class="sb-banner-text sb-body-m">${c.text}</div>` : '';
    const right = c.right ? `<div class="sb-banner-right">${c.right}</div>` : '';
    // Collapse-правило: баннер С правым слотом — кламп 5 строк без раскрытия
    // (.capped); БЕЗ правого слота — .collapsible + закреплённый Chevron
    // Button (виден только при реальном переполнении — sbBannerSyncOverflow).
    const modCls = c.right ? ' capped' : (c.text ? ' collapsible' : '');
    const chevron = (!c.right && c.text)
      ? sbMkChevron({ cls: 'sb-banner-chevron', attrs: 'role="button" aria-label="Expand" onclick="sbBannerToggle(this)"' })
      : '';
    return `<div class="sb-banner ${type}${modCls}">`
      + `<div class="sb-banner-content">${titleRow}${text}</div>`
      + right
      + chevron
      + `</div>`;
  }
  window.sbMkBanner = mkBanner;

  // Раскрытие/сборка collapsible-баннера (Chevron Button в правом верхнем углу).
  // Плавно: line-clamp не анимируется, поэтому высоту ведём инлайновым
  // max-height (px → px) с transition из CSS (0.28s — синхронно с таймаутом).
  // Раскрытие: снять кламп → анимировать от клампнутой высоты к полной.
  // Сборка: кламп вернуть ТОЛЬКО по завершении, иначе многоточие прыгает
  // в первый же кадр. Повторный клик до конца анимации — отменяем хвост.
  window.sbBannerToggle = function(el) {
    const b = el.closest('.sb-banner');
    if (!b) return;
    const t = b.querySelector('.sb-banner-text');
    if (!t) { b.classList.toggle('expanded'); return; }
    if (t._sbAnim) { clearTimeout(t._sbAnim); t._sbAnim = null; t.style.maxHeight = ''; }
    const expanding = !b.classList.contains('expanded');
    const from = t.getBoundingClientRect().height;
    let to;
    if (expanding) {
      b.classList.add('expanded');                 // кламп снят — меряем полную
      to = t.getBoundingClientRect().height;
    } else {
      b.classList.remove('expanded');              // кламп на месте — меряем цель
      to = t.getBoundingClientRect().height;
      b.classList.add('expanded');                 // и снимаем обратно на время анимации
    }
    t.style.maxHeight = from + 'px';
    void t.offsetHeight;                            // reflow: стартовая точка зафиксирована
    t.style.maxHeight = to + 'px';
    t._sbAnim = setTimeout(() => {
      t._sbAnim = null;
      if (!expanding) b.classList.remove('expanded');
      t.style.maxHeight = '';
    }, 300);
  };
  // Замер переполнения: если кламп 5 строк скрыл часть текста → .has-overflow,
  // шеврон становится видимым. Страницы рендерятся динамически (SPA), поэтому
  // авто-вызов через MutationObserver (паттерн nav-bar smart-collapse);
  // замеряем только свёрнутые — раскрытый оставляет шеврон для сборки.
  function syncBannerOverflow(root) {
    (root || document).querySelectorAll('.sb-banner.collapsible:not(.expanded)').forEach(b => {
      const t = b.querySelector('.sb-banner-text');
      if (!t) return;
      b.classList.toggle('has-overflow', t.scrollHeight > t.clientHeight + 1);
    });
  }
  window.sbBannerSyncOverflow = syncBannerOverflow;
  if (!window.__sbBannerMO) {
    window.__sbBannerMO = true;
    const wire = () => {
      const mo = new MutationObserver(() => {
        if (window.__sbBannerRaf) return;
        window.__sbBannerRaf = requestAnimationFrame(() => {
          window.__sbBannerRaf = null;
          syncBannerOverflow(document);
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      syncBannerOverflow(document);
    };
    if (document.body) wire();
    else document.addEventListener('DOMContentLoaded', wire);
  }

  // Fill-иконки типов для лида Notification Bar — пути из наших Symbol Badges
  // (SB_BADGE_SPECS, badge.js грузится раньше). Регистрируем в ICON_PATHS,
  // чтобы рендерить через sbIcon(size 'S' = 16px) и красить currentColor'ом.
  if (typeof SB_BADGE_SPECS !== 'undefined') {
    ICON_PATHS['success-fill']  = SB_BADGE_SPECS.checkCircle.d;
    ICON_PATHS['warning-fill']  = SB_BADGE_SPECS.warnFilled.d;
    ICON_PATHS['critical-fill'] = SB_BADGE_SPECS.critFilled.d;
  }
  // Лид-иконка per type (information-fill регистрируется в docs-i18n.js).
  const NOTIF_BAR_ICON = {
    info: 'information-fill', success: 'success-fill',
    warning: 'warning-fill', error: 'critical-fill',
  };

  // ── Notification Bar builder ────────────────────────────────────────
  // type:  'info' | 'success' | 'warning' | 'error'
  // text:  строка, может содержать разметку (<a>, <b> — кликабельный текст)
  // lead:  false → без иконки; строка → свой HTML; по умолчанию — fill-иконка типа
  // align: 'center' (default) | 'left'
  function mkNotifBar(o) {
    const c = o || {};
    const type = c.type || 'info';
    const leadHtml = c.lead === false ? ''
      : `<span class="sb-notif-bar-lead">${c.lead || sbIcon(NOTIF_BAR_ICON[type], 'S')}</span>`;
    const align = c.align === 'left' ? ' align-left' : '';
    return `<div class="sb-notif-bar ${type}${align}">`
      + leadHtml
      + `<span class="sb-notif-bar-text sb-body-m">${c.text || ''}</span>`
      + `</div>`;
  }
  window.sbMkNotifBar = mkNotifBar;

  // Демо-хелперы: dot — Status Indicator, badge — Badge-Status Mini.
  const dot   = cls => `<span class="sb-status-dot ${cls}"></span>`;
  const badge = (cls, label) => `<span class="sb-badge-status mini ${cls}">${label}</span>`;

  // Per-type демо-контент для playground: цвет индикатора (Status), глиф
  // Symbol Badge, Badge-Status класс/лейбл, тайтл/описание баннера и тексты
  // Notification Bar (barText — обычный, barLink — с кликабельной частью).
  // Long body (>5 строк) для демо collapse-правила: с right-слотом текст
  // молча клампится (.capped), без него появляется Chevron Button.
  const LONG_BODY_TAIL = ' Diagnostics show intermittent packet loss on the uplink path, and the modem has entered a self-recovery cycle twice in the last hour. Field engineers are advised to verify the antenna alignment, check the cable integrity and confirm the LNB power supply before escalating. If the condition persists after the corrective actions, open an incident ticket and attach the last 24 hours of telemetry for the affected terminal, including the demodulator lock history and the observed Es/No margins for both polarizations.';

  // Демо-тела Doc Note (playground). Long доклеивает LONG_BODY_TAIL —
  // на нём видно кламп, шеврон и плавное раскрытие.
  const PG_NOTE_BODY = {
    tech: '<b>Width: 100%</b><ul><li>min-width: 288px;</li><li>max-width: 800px;</li><li>min-height: 60px;</li><li>padding: 16/16; radius: 4;</li><li>left stroke 4px in the type colour.</li></ul>',
    imp:  'Breaking contract: a banner with a right slot switches to the silent 5-line clamp — no chevron, no expand. Recheck consumers after changing slots.',
  };

  const PG_DEMO = {
    info:    { dot: 'info',        glyph: 'infoFilled',  bs: 'bs-blue',   bsLabel: 'Info',     title: 'Firmware Update Available', text: 'Version 3.2.1 is ready for deployment across 12 terminals.',
               barText: 'Firmware 3.2.1 rollout starts at 02:00 UTC.',                barLink: 'Firmware 3.2.1 is available. <a href="#">Release notes</a>.' },
    success: { dot: 'online',      glyph: 'checkCircle', bs: 'bs-green',  bsLabel: 'Done',     title: 'Deployment Complete',       text: 'All 48 terminals have been updated to v3.2.0.',
               barText: 'All 48 terminals have been updated to v3.2.0.',               barLink: 'All terminals updated. <a href="#">View report</a>.' },
    warning: { dot: 'maintenance', glyph: 'warnFilled',  bs: 'bs-orange', bsLabel: 'Warning',  title: 'High Latency Detected',     text: 'Terminal SB-003 latency exceeds the 500 ms threshold.',
               barText: 'Terminal SB-003 latency exceeds the 500 ms threshold.',       barLink: 'You have <b>2</b> unsaved changes. <a href="#">Click here</a> to apply.' },
    error:   { dot: 'error',       glyph: 'critFilled',  bs: 'bs-red',    bsLabel: 'Critical', title: 'PHS 1: Process is DOWN',    text: 'A service-affecting condition has occurred and immediate corrective action is required.',
               barText: 'Terminal SB-002 lost uplink connection.',                     barLink: 'Terminal SB-002 lost uplink. <a href="#">Open incident</a>.' },
  };

  sbRegister({
    name: 'banners',
    title: 'Banners',
    description: sbT(
      'Banners give contextual feedback about system events, errors and informational messages. Four types — Info, Success, Warning, Critical — differ by their left marker and, for the loud ones, a tinted surface. Example: a Critical alarm with a link title that jumps to the affected process. The Notification Bar — a slim full-width strip under the Navigation Bar — shares the same four types. The Doc Note the DS docs run on is the same banner too.',
      'Баннеры дают контекстную обратную связь о системных событиях, ошибках и информационных сообщениях. Четыре типа — Info, Success, Warning, Critical — различаются левым маркером, а «громкие» ещё и тонированным фоном. Пример: Critical-алярм с тайтлом-ссылкой, ведущей к затронутому процессу. Notification Bar — тонкая полоса на всю ширину под Navigation Bar — использует те же четыре типа. Плашка Doc Note, на которой ездят доки DS, — тот же баннер.'
    ),
    playground: {
      title: 'Banners Playground',
      state: { comp: 'banner', type: 'info', lead: 'dot', right: 'badge', align: 'center', title: true, link: false, text: true, icon: true, longBody: false, noteKind: 'tech' },
      controls(pg) {
        return `${sbPgGroup('Component', `
              ${pg.select('comp', [
                { value: 'banner', label: 'Banner' },
                { value: 'bar',    label: 'Notification Bar' },
                { value: 'note',   label: 'Doc Note' },
              ], { label: 'Component' })}
              ${pg.select('type', [
                { value: 'info',    label: 'Info' },
                { value: 'success', label: 'Success' },
                { value: 'warning', label: 'Warning' },
                { value: 'error',   label: 'Critical' },
              ], { label: 'Type' })}
          `)}
          ${sbPgGroup('Slots', `
              ${pg.select('lead', [
                { value: 'none',  label: 'None' },
                { value: 'dot',   label: 'Indicator' },
                { value: 'glyph', label: 'Badge' },
                { value: 'icon',  label: 'Icon' },
              ], { label: 'Lead' })}
              ${pg.select('right', [
                { value: 'none',    label: 'None' },
                { value: 'badge',   label: 'Status' },
                { value: 'close',   label: 'Close' },
                { value: 'buttons', label: 'Buttons' },
              ], { label: 'Right Slot' })}
              <div class="pg-toggles">
                ${pg.toggle('longBody', 'Long')}
              </div>
          `, { attrs: 'data-nb-scope="banner"' })}
          ${sbPgGroup('Alignment', `
              ${pg.select('align', [
                { value: 'center', label: 'Center' },
                { value: 'left',   label: 'Left' },
              ], { label: 'Align' })}
          `, { attrs: 'data-nb-scope="bar"' })}
          ${sbPgGroup('Note', `
              <div class="pg-toggles">
                ${pg.radio('noteKind', [
                  { value: 'tech', label: 'Tech Info' },
                  { value: 'imp',  label: 'Important' },
                ])}
                ${pg.toggle('longBody', 'Long')}
              </div>
          `, { attrs: 'data-nb-scope="note"' })}
          ${sbPgGroup('Content', `
              <div class="pg-toggles">
                ${pg.toggle('title', 'Title')}
                ${pg.toggle('link', 'Link')}
                ${pg.toggle('text', 'Text')}
                ${pg.toggle('icon', 'Icon')}
              </div>
          `, { fullRow: true, attrs: 'data-nb-content' })}`;
      },
      // Banner, Bar и Doc Note делят playground: нерелевантные контролы прячем.
      // Banner: Lead / Right Slot / Title / Text. Bar: Align / Icon. Link — у
      // banner и bar. Note: только своя группа (Kind + Long) — Type тоже прячем,
      // тип у плашки диктует Kind (Important → warning).
      syncControls(s, container) {
        const scope = s.comp === 'bar' ? 'bar' : s.comp === 'note' ? 'note' : 'banner';
        container.querySelectorAll('[data-nb-scope]').forEach(el => {
          el.style.display = el.getAttribute('data-nb-scope') === scope ? '' : 'none';
        });
        const isBar = scope === 'bar', isNote = scope === 'note';
        const typeSel = container.querySelector('select[data-pg-ctrl="type"]');
        const typeField = typeSel && typeSel.closest('.sb-field');
        if (typeField) typeField.style.display = isNote ? 'none' : '';
        // Для note вся Content-группа пуста — прячем рамку целиком,
        // иначе висел бы пустой fieldset с тайтлом (грабли из toggles).
        const contentGroup = container.querySelector('[data-nb-content]');
        if (contentGroup) contentGroup.style.display = isNote ? 'none' : '';
        const show = { title: !isBar && !isNote, text: !isBar && !isNote, icon: isBar, link: !isNote };
        Object.keys(show).forEach(k => {
          const el = container.querySelector(`.tgl-ctrl-wrap[data-pg-ctrl="${k}"]`);
          if (el) el.style.display = show[k] ? '' : 'none';
        });
      },
      render(s) {
        // Doc Note — плашка доков: собирается sbDocNote (та же, что под
        // описаниями компонентов). Тип диктует Kind: Important → warning.
        if (s.comp === 'note') {
          const kind = s.noteKind === 'imp' ? 'Important' : 'Tech Info';
          const note = sbDocNote(kind, PG_NOTE_BODY[s.noteKind] + (s.longBody ? LONG_BODY_TAIL : ''));
          return `<div style="overflow-x:auto;width:100%"><div style="width:680px;max-width:100%;padding:var(--pad-vert-8) 0">${note}</div></div>`;
        }
        if (s.comp === 'bar') {
          const d = PG_DEMO[s.type];
          const bar = mkNotifBar({
            type: s.type,
            align: s.align,
            lead: s.icon ? undefined : false,
            text: s.link ? d.barLink : d.barText,
          });
          return `<div style="overflow-x:auto;width:100%"><div style="width:680px;max-width:100%;padding:var(--pad-vert-8) 0">${bar}</div></div>`;
        }
        const d = PG_DEMO[s.type];
        const lead = s.lead === 'dot'   ? `<span class="sb-status-dot ${d.dot}"></span>`
                   : s.lead === 'glyph' ? SB_SVG[d.glyph]
                   : s.lead === 'icon'  ? sbIcon('notification-3-line', 'L')
                   : '';
        const right = s.right === 'badge'   ? `<span class="sb-badge-status mini ${d.bs}">${d.bsLabel}</span>`
                    : s.right === 'close'   ? sbMkButton({ icon: 'close-line', attrs: ' onclick="dismissBanner(this)" title="Dismiss"' })
                    : s.right === 'buttons' ? sbMkButton({ label: 'Details', size: 's' })
                                              + sbMkButton({ label: 'Dismiss', size: 's', attrs: ' onclick="dismissBanner(this)"' })
                    : '';
        const banner = mkBanner({
          type: s.type,
          lead,
          title: s.title ? d.title : '',
          href: s.title && s.link ? '#' : '',
          text: s.text ? (s.longBody ? d.text + LONG_BODY_TAIL : d.text) : '',
          right,
        });
        // Width-обёртка: width:100% баннера в центрирующем playground-превью
        // схлопнулся бы; 680 даёт реальную ширину, overflow-x — узкие вьюпорты.
        return `<div style="overflow-x:auto;width:100%"><div style="width:680px;max-width:100%;padding:var(--pad-vert-8) 0">${banner}</div></div>`;
      },
      genCode(s) {
        if (s.comp === 'note') {
          const kind = s.noteKind === 'imp' ? 'Important' : 'Tech Info';
          const type = s.noteKind === 'imp' ? 'warning' : 'info';
          const html = `<!-- Собирается хелпером (docs-i18n.js): -->
sbDocNote('${kind}', body)
// → sbMkBanner({ type: '${type}', lead: <information-fill L>, title: '${kind}', text: body })

<!-- Разметка — обычный collapsible-баннер: -->
<div class="sb-banner ${type} collapsible">
  <div class="sb-banner-content">
    <div class="sb-banner-titlerow">
      <span class="sb-banner-lead"><!-- information-fill L --></span>
      <span class="sb-banner-title sb-title-m">${kind}</span>
    </div>
    <div class="sb-banner-text sb-body-m">Body…</div>
  </div>
  <div class="sb-chevron sb-banner-chevron" onclick="sbBannerToggle(this)"><!-- arrow-down-s-line --></div>
</div>`;
          return { html, css: COMP_CSS.banners };
        }
        const d = PG_DEMO[s.type];
        if (s.comp === 'bar') {
          const cls = `sb-notif-bar ${s.type}` + (s.align === 'left' ? ' align-left' : '');
          const lines = [`<div class="${cls}">`];
          if (s.icon) lines.push(`  <span class="sb-notif-bar-lead"><!-- ${NOTIF_BAR_ICON[s.type]} icon --></span>`);
          lines.push(`  <span class="sb-notif-bar-text sb-body-m">${s.link ? d.barLink : d.barText}</span>`);
          lines.push(`</div>`);
          lines.push(``, `<!-- sbMkNotifBar({ type:'info'|'success'|'warning'|'error', text, lead?, align? }) -->`);
          return { html: lines.join('\n'), css: COMP_CSS.banners };
        }
        const lines = [`<div class="sb-banner ${s.type}">`, `  <div class="sb-banner-content">`];
        if (s.title || s.lead !== 'none') {
          lines.push(`    <div class="sb-banner-titlerow">`);
          if (s.lead === 'dot')   lines.push(`      <span class="sb-banner-lead"><span class="sb-status-dot ${d.dot}"></span></span>`);
          if (s.lead === 'glyph') lines.push(`      <span class="sb-banner-lead"><!-- Symbol Badge: ${d.glyph} --></span>`);
          if (s.lead === 'icon')  lines.push(`      <span class="sb-banner-lead"><!-- icon --></span>`);
          if (s.title) {
            lines.push(s.link
              ? `      <a class="sb-banner-title sb-title-m" href="#">${d.title} <!-- arrow icon --></a>`
              : `      <span class="sb-banner-title sb-title-m">${d.title}</span>`);
          }
          lines.push(`    </div>`);
        }
        if (s.text) lines.push(`    <div class="sb-banner-text sb-body-m">${d.text}</div>`);
        lines.push(`  </div>`);
        if (s.right === 'badge')   lines.push(`  <div class="sb-banner-right"><span class="sb-badge-status mini ${d.bs}">${d.bsLabel}</span></div>`);
        if (s.right === 'close')   lines.push(`  <div class="sb-banner-right">${sbMkButton({ iconOnly: true, content: '<!-- close icon -->' })}</div>`);
        if (s.right === 'buttons') lines.push(`  <div class="sb-banner-right">${sbMkButton({ label: 'Details', size: 's' })}${sbMkButton({ label: 'Dismiss', size: 's' })}</div>`);
        lines.push(`</div>`);
        lines.push(``, `<!-- sbMkBanner({ type:'info'|'success'|'warning'|'error', lead?, title?, href?, text?, right? }) -->`);
        return { html: lines.join('\n'), css: COMP_CSS.banners };
      },
    },
    sections: [
      {
        title: sbT('Anatomy', 'Анатомия'),
        desc: sbT(
          'A row with a coloured left marker in the type colour. The content column holds a title (optionally a link) with an optional leading indicator, and a description below. A generic right slot is pinned to the right edge — a Badge-Status, a close button or actions.',
          'Строка с цветным левым маркером под тип. Колонка контента несёт тайтл (опционально ссылку) с опциональным ведущим индикатором и описание под ним. Генерик-слот справа прижат к правому краю — Badge-Status, кнопка закрытия или действия.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Width: 100%</b>'
          + '<ul><li>min-width: 288px;</li><li>max-width: 800px;</li><li>min-height: 60px;</li><li>padding: 16/16;</li><li>radius: 4;</li><li>border-left: 4px in the type colour.</li></ul>'
          + '<b>Titles and descriptions:</b>'
          + '<ul><li>Title — Title M;</li><li>description — Body M.</li></ul>'
          + '<b>Info & Success:</b>'
          + '<ul><li>sit on --surface-1.</li></ul>'
          + '<b>Warning & Critical:</b>'
          + '<ul><li>tint the surface (--alert-hover / --error-hover);</li><li>colour the title and text.</li></ul>'
          + '<b>Collapse:</b>'
          + '<ul><li>A banner with a right-slot status carries at most 5 body lines — clamped silently;</li><li>Without a right slot, text over 5 lines pins a Chevron Button to the top-right corner (16/16) that expands and folds the banner;</li><li>The chevron appears only on real overflow (<code>sbBannerSyncOverflow</code> measures automatically).</li></ul>',
          '<b>Ширина: 100%</b>'
          + '<ul><li>min-width: 288px;</li><li>max-width: 800px;</li><li>min-height: 60px;</li><li>padding: 16/16;</li><li>radius: 4;</li><li>border-left: 4px в цвет типа.</li></ul>'
          + '<b>Тайтл и описание:</b>'
          + '<ul><li>тайтл — Title M;</li><li>описание — Body M.</li></ul>'
          + '<b>Info и Success:</b>'
          + '<ul><li>сидят на --surface-1.</li></ul>'
          + '<b>Warning и Critical:</b>'
          + '<ul><li>тонируют фон (--alert-hover / --error-hover);</li><li>красят тайтл и текст.</li></ul>'
          + '<b>Collapse:</b>'
          + '<ul><li>Баннер со статусом в правом слоте несёт не более 5 строк body — клампится молча;</li><li>Без правого слота текст длиннее 5 строк закрепляет Chevron Button в правом верхнем углу (16/16) — раскрытие и сборка баннера;</li><li>Шеврон появляется только при реальном переполнении (<code>sbBannerSyncOverflow</code> замеряет автоматически).</li></ul>'
        )),
        col: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, maxWidth: '800px', content: `${mkBanner({ type: 'info', lead: dot('info'), title: 'Firmware Update Available', text: 'Version 3.2.1 is ready for deployment across 12 terminals.', right: badge('bs-blue', 'Info') })}` })}`,
        html: `<div class="sb-banner info">
  <div class="sb-banner-content">
    <div class="sb-banner-titlerow">
      <span class="sb-banner-lead"><span class="sb-status-dot info"></span></span>
      <span class="sb-banner-title sb-title-m">Firmware Update Available</span>
    </div>
    <div class="sb-banner-text sb-body-m">Version 3.2.1 is ready for deployment across 12 terminals.</div>
  </div>
  <div class="sb-banner-right"><span class="sb-badge-status mini bs-blue">Info</span></div>
</div>

<!-- sbMkBanner({ type, lead, title, href, text, right }) -->`,
        css: COMP_CSS.banners,
      },
      {
        title: sbT('Banner Types', 'Типы баннеров'),
        desc: sbT(
          'The four types. Info and Success stay calm — a neutral surface with a coloured marker. Warning and Critical demand attention — a tinted surface and coloured text. The Critical banner below uses a link title (with a trailing arrow) that navigates to the source, and a Badge-Status Mini on the right.',
          'Четыре типа. Info и Success спокойны — нейтральный фон и цветной маркер. Warning и Critical требуют внимания — тонированный фон и цветной текст. Critical-баннер ниже использует тайтл-ссылку (со стрелкой), ведущую к источнику, и Badge-Status Mini справа.'
        ),
        col: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, maxWidth: '800px', content: `${mkBanner({ type: 'info', lead: dot('info'), title: 'Firmware Update Available', text: 'Version 3.2.1 is ready for deployment across 12 terminals.', right: badge('bs-blue', 'Info') })}
          ${mkBanner({ type: 'success', lead: dot('online'), title: 'Deployment Complete', text: 'All 48 terminals have been updated to v3.2.0.', right: badge('bs-green', 'Done') })}
          ${mkBanner({ type: 'warning', lead: dot('maintenance'), title: 'High Latency Detected', text: 'Terminal SB-003 latency exceeds the 500 ms threshold.', right: badge('bs-orange', 'Warning') })}
          ${mkBanner({ type: 'error', lead: dot('error'), title: 'PHS 1: Process is DOWN', href: '#', text: 'A service-affecting condition has occurred and immediate corrective action is required.', right: badge('bs-red', 'Critical') })}` })}`,
        html: `<!-- Types: info, success, warning, error (Critical) -->
<div class="sb-banner error">
  <div class="sb-banner-content">
    <div class="sb-banner-titlerow">
      <span class="sb-banner-lead"><span class="sb-status-dot error"></span></span>
      <a class="sb-banner-title sb-title-m" href="#">PHS 1: Process is DOWN <!-- arrow icon --></a>
    </div>
    <div class="sb-banner-text sb-body-m">A service-affecting condition has occurred and immediate corrective action is required.</div>
  </div>
  <div class="sb-banner-right"><span class="sb-badge-status mini bs-red">Critical</span></div>
</div>`,
        css: COMP_CSS.banners,
      },
      {
        title: sbT('Collapsible Banner', 'Раскрывающийся баннер'),
        desc: sbT(
          'A banner without a right slot clamps its body at 5 lines; when the text is longer, a Chevron Button pinned to the top-right corner (16/16 offsets) expands and folds it. Banners with a right-slot status carry no chevron — their content rule is 5 lines maximum, clamped silently. The chevron shows up only on real overflow: <code>sbBannerSyncOverflow</code> measures the text automatically. Below: a collapsible Warning and, for contrast, an Info with a right-slot status — same long text, silent clamp.',
          'Баннер без правого слота клампит body пятью строками; если текст длиннее, закреплённый в правом верхнем углу Chevron Button (отступы 16/16) раскрывает и сворачивает его. У баннеров со статусом в правом слоте шеврона нет — их контент-правило: максимум 5 строк, кламп молча. Шеврон появляется только при реальном переполнении: <code>sbBannerSyncOverflow</code> замеряет текст автоматически. Ниже: раскрывающийся Warning и для контраста Info со статусом справа — тот же длинный текст, молчаливый кламп.'
        ),
        col: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, maxWidth: '800px', content: `${mkBanner({ type: 'warning', lead: dot('maintenance'), title: 'High Latency Detected', text: 'Terminal SB-003 latency exceeds the 500 ms threshold.' + LONG_BODY_TAIL })}
          ${mkBanner({ type: 'info', lead: dot('info'), title: 'Firmware Update Available', text: 'Version 3.2.1 is ready for deployment across 12 terminals.' + LONG_BODY_TAIL, right: badge('bs-blue', 'Info') })}` })}`,
        html: `<div class="sb-banner warning collapsible">
  <div class="sb-banner-content">
    <div class="sb-banner-titlerow">...</div>
    <div class="sb-banner-text sb-body-m">Long text…</div>
  </div>
  <div class="sb-chevron sb-banner-chevron" onclick="sbBannerToggle(this)"><!-- arrow-down-s-line --></div>
</div>

<!-- Правило: есть right-слот → .capped (кламп 5 строк, без шеврона);
     нет right-слота → .collapsible, шеврон виден при переполнении
     (sbBannerSyncOverflow / MutationObserver — автоматически) -->`,
        css: COMP_CSS.banners,
      },
      {
        title: sbT('Doc Note — Tech Info / Important', 'Doc Note — Tech Info / Important'),
        desc: sbT(
          'The collapsible banner the DS docs themselves run on: the Tech Info / Important note under every component description — including the one at the top of this very page — is this exact type. Built by <code>sbDocNote(title, body)</code>, a thin wrapper over <code>sbMkBanner</code>: an information-fill lead, «Important» in the title switches the type to warning, everything else is info; no right slot is passed, so by the banner contract the note is collapsible out of the box — 5-line clamp, a chevron on real overflow, smooth expand and collapse. Nothing hand-rolled inside: the banner, the chevron and the toggle all come from their own components.',
          'Раскрывающийся баннер, на котором ездят сами доки DS: плашка Tech Info / Important под описанием каждого компонента — включая ту, что выше на этой самой странице — это ровно он. Собирается <code>sbDocNote(title, body)</code> — тонкой обёрткой над <code>sbMkBanner</code>: лид information-fill, «Important» в тайтле переключает тип на warning, всё остальное — info; правый слот не передаётся, поэтому по контракту баннера плашка сворачиваема из коробки — кламп 5 строк, шеврон при реальном переполнении, плавное раскрытие и сборка. Внутри ничего рукописного: баннер, шеврон и тогл — из своих компонентов.'
        ),
        col: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, maxWidth: '800px', content: `${sbDocNote('Tech Info', sbT(
            '<b>Width: 100%</b><ul><li>min-width: 288px;</li><li>max-width: 800px;</li><li>min-height: 60px;</li><li>padding: 16/16;</li><li>radius: 4; left stroke 4px in the type colour;</li><li>title — Title M, lead — Symbol 24px;</li><li>body — Body M --text-secondary.</li></ul>',
            '<b>Width: 100%</b><ul><li>min-width: 288px;</li><li>max-width: 800px;</li><li>min-height: 60px;</li><li>padding: 16/16;</li><li>radius: 4; левый строук 4px цвета типа;</li><li>тайтл — Title M, лид — Symbol 24px;</li><li>body — Body M --text-secondary.</li></ul>'
          ))}
          ${sbDocNote('Important', sbT(
            'Warning-toned note for things a developer must not miss: breaking contracts, load-order traps, deprecations.',
            'Warning-плашка для того, что разработчику нельзя пропустить: ломающие контракты, ловушки порядка загрузки, депрекейшены.'
          ))}` })}`,
        html: `<!-- Собирается хелпером (docs-i18n.js): -->
sbDocNote('Tech Info', body)   // → sbMkBanner({ type:'info',    lead, title, text })
sbDocNote('Important', body)   // → sbMkBanner({ type:'warning', lead, title, text })

<!-- Разметка — обычный collapsible-баннер: -->
<div class="sb-banner info collapsible">
  <div class="sb-banner-content">
    <div class="sb-banner-titlerow">
      <span class="sb-banner-lead"><!-- information-fill L --></span>
      <span class="sb-banner-title sb-title-m">Tech Info</span>
    </div>
    <div class="sb-banner-text sb-body-m">Body…</div>
  </div>
  <div class="sb-chevron sb-banner-chevron" onclick="sbBannerToggle(this)"><!-- arrow-down-s-line --></div>
</div>`,
        css: COMP_CSS.banners,
      },
      {
        title: 'Notification Bar',
        desc: sbT(
          'A slim strip at the very top of the screen, right under the Navigation Bar, stretching the full width. Content is centered by default or pinned to the left edge. The text may include clickable parts — for example, an apply link. Example: an unsaved-changes warning stuck on top.',
          'Тонкая полоса в самом верху экрана, сразу под Navigation Bar, на всю ширину. Контент по центру или прижат к левому краю. Текст может содержать кликабельные части — например, ссылку применения. Пример: закреплённое сверху предупреждение о несохранённых изменениях.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Height: 28px, fixed — long text truncates with an ellipsis;</li><li>Min-width: 320px;</li><li>Padding: 2/8;</li><li>Gap: 8;</li><li>Border-left: 4px in the type colour.</li></ul>'
          + '<b>Background:</b>'
          + '<ul><li>Tinted per type: <code>--primary-hover</code> / <code>--success-hover</code> / <code>--alert-hover</code> / <code>--error-hover</code>.</li></ul>'
          + '<b>Text:</b>'
          + '<ul><li>Body M in the type colour;</li><li>Links: bold, underlined, inherit the colour.</li></ul>'
          + '<b>API:</b>'
          + '<ul><li><code>sbMkNotifBar({ type, text, lead, align })</code>.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Высота: 28px, фиксированная — длинный текст обрезается многоточием;</li><li>Min-width: 320px;</li><li>Padding: 2/8;</li><li>Gap: 8;</li><li>Border-left: 4px в цвет типа.</li></ul>'
          + '<b>Фон:</b>'
          + '<ul><li>Тонированный под тип: <code>--primary-hover</code> / <code>--success-hover</code> / <code>--alert-hover</code> / <code>--error-hover</code>.</li></ul>'
          + '<b>Текст:</b>'
          + '<ul><li>Body M в цвет типа;</li><li>Ссылки: bold, подчёркнуты, наследуют цвет.</li></ul>'
          + '<b>API:</b>'
          + '<ul><li><code>sbMkNotifBar({ type, text, lead, align })</code>.</li></ul>'
        )),
        col: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, content: `${mkNotifBar({ type: 'info',    text: 'Firmware 3.2.1 rollout starts at 02:00 UTC for all terminals.' })}
          ${mkNotifBar({ type: 'success', text: 'All 48 terminals have been updated to v3.2.0.' })}
          ${mkNotifBar({ type: 'warning', text: 'You have <b>2</b> unsaved changes. <a href="#">Click here</a> to apply.' })}
          ${mkNotifBar({ type: 'error',   text: 'Terminal SB-002 lost uplink connection. <a href="#">Open incident</a>.' })}
          ${mkNotifBar({ type: 'info', align: 'left', text: 'Scheduled maintenance window: 02:00–04:00 UTC.' })}` })}`,
        html: `<div class="sb-notif-bar warning">
  <span class="sb-notif-bar-lead"><!-- warning-fill icon --></span>
  <span class="sb-notif-bar-text sb-body-m">You have <b>2</b> unsaved changes. <a href="#">Click here</a> to apply.</span>
</div>

<!-- Types: info, success, warning, error · .align-left pins content to the left
     sbMkNotifBar({ type, text, lead?, align? }) -->`,
        css: COMP_CSS.banners,
      },
    ],
  });
})();
