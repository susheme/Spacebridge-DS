// ═══════════════════════════════════════════════════════════════════════════
//  ACTION BAR
//  Плашка с 1–2 кнопками внизу модалки / карточки / алерта / окна.
//  Завершает flow (commit / dismiss). НЕ путать с Tool Bar (манипуляция) и
//  Info Footer (данные). CSS в css/components/action-bar.css — SYNC обязателен.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["action-bar"] = `.sb-action-bar {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-s);
  width: 100%;
  padding: var(--pad-vert-16) var(--pad-horiz-16);
  background: var(--background);
  border-top: var(--border-width-1) solid var(--border-soft);
  box-sizing: border-box;
}
/* Выравнивание кнопок. Default — left (по Figma). */
.sb-action-bar.align-right   { justify-content: flex-end; }
.sb-action-bar.align-between { justify-content: space-between; }
/* Center — кнопки тянутся на всю ширину бара (flex:1): одна = full-width, две =
   поровну. min-width:0 перебивает дефолтный min-width кнопки в узких контейнерах. */
.sb-action-bar.align-center > .sb-btn { flex: 1 1 0; min-width: 0; }
/* Floating — отрывается от контента: radius + Shadow-S, без верхнего бордера.
   Та же роль, что «shadow drop при скролле» — выделиться над контентом. */
.sb-action-bar.floating {
  border-top: none;
  border-radius: var(--radius-12);
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
}`;

// --- ACTION BAR ---
(() => {
  // Кнопка по DS-конвенции (классы .sb-btn-*, лейбл — текст, иконки — sbIcon).
  // Хелпера sbMkButton в DS нет, поэтому рендерим инлайном (как в side-nav и др.).
  function actionBtn(b) {
    const v = b.variant === 'primary' ? 'sb-btn-primary'
            : b.variant === 'text'    ? 'sb-btn-text'
            : 'sb-btn-secondary';
    const cls = 'sb-btn ' + v
      + (b.critical ? ' sb-btn-critical' : '')
      + (b.iconOnly ? ' sb-btn-icon' : '');
    const dis = b.disabled ? ' disabled' : '';
    const onclick = b.onClick ? ` onclick="${b.onClick}"` : '';
    let inner;
    if (b.iconOnly) {
      inner = b.icon ? sbIcon(b.icon, 'L') : '';
    } else {
      inner = (b.icon ? sbIcon(b.icon, 'L') + ' ' : '')
        + (b.label || 'Button')
        + (b.iconR ? ' ' + sbIcon(b.iconR, 'L') : '');
    }
    return `<button class="${cls}"${dis}${onclick}>${inner}</button>`;
  }

  // mkActionBar({ buttons:[{label,variant,icon,iconR,iconOnly,critical,disabled,onClick}],
  //               align:'left'|'right'|'between', floating:bool })
  function mkActionBar({ buttons = [], align = 'left', floating = false } = {}) {
    let cls = 'sb-action-bar';
    if (align === 'right')   cls += ' align-right';
    if (align === 'center')  cls += ' align-center';
    if (align === 'between') cls += ' align-between';
    if (floating)            cls += ' floating';
    const btns = buttons.map(actionBtn).join('');
    return `<nav class="${cls}" aria-label="Actions">${btns}</nav>`;
  }
  window.sbMkActionBar = mkActionBar;

  // ── Демо ─────────────────────────────────────────────────────────────
  const TWO = [{ label: 'Save', variant: 'primary' }, { label: 'Cancel', variant: 'secondary' }];
  const ONE = [{ label: 'Save', variant: 'primary' }];

  // Подложка surface-1 — бар на --background контрастит (см. правило: превью
  // компонентов с фоном --background ставим на surface-1).
  function stage(content, w = 480) {
    return `<div style="width:100%;max-width:${w}px;background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12)">${content}</div>`;
  }

  // Мок-карточка: контент + Action Bar прижатый к низу (реальный контекст).
  function card(bar) {
    return `<div style="width:100%;max-width:480px;background:var(--background);border:var(--border-width-1) solid var(--border);border-radius:var(--radius-12);overflow:hidden">
      <div style="padding:var(--pad-vert-24)"><span class="sb-body-m" style="color:var(--text-secondary)">Card content…</span><div style="height:96px"></div></div>
      ${bar}
    </div>`;
  }

  sbRegister({
    name: 'action-bar',
    title: 'Action Bar',
    description: 'Плашка с 1–2 кнопками внизу модалки / pop-up / критического сообщения / окна. Завершает flow — commit (Primary) / dismiss (Secondary). Варианты: divider (border-top, встроена в низ карточки/алерта) и floating (radius + Shadow-S, «отрывается» от контента — та же роль, что shadow-drop при скролле). Выравнивание Left (по умолчанию) / Right / Between. Captions короткие (одно слово) или иконки. НЕ путать с Tool Bar (манипуляция контентом) и Info Footer (системные данные).',
    playground: {
      title: 'Action Bar Playground',
      state: { count: 'two', align: 'left', floating: false },
      controls(pg) {
        return `${pg.select('count', [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ], { label: 'Buttons' })}
          ${pg.select('align', [
            { value: 'left',    label: 'Left' },
            { value: 'right',   label: 'Right' },
            { value: 'center',  label: 'Center' },
            { value: 'between', label: 'Between' },
          ], { label: 'Align' })}
          <div class="pg-toggles">
            ${pg.toggle('floating', 'Floating')}
          </div>`;
      },
      render(s) {
        const buttons = s.count === 'one' ? ONE : TWO;
        const bar = mkActionBar({ buttons, align: s.align, floating: s.floating });
        // Фикс-ширина: non-wide playground центрирует контент по его ширине →
        // width:100% бара схлопнулся бы и center-fill было бы не видно. 320 даёт
        // бару реальную ширину; overflow-x:auto — на случай узких вьюпортов.
        return `<div style="overflow-x:auto"><div style="width:320px;box-sizing:border-box;background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12)">${bar}</div></div>`;
      },
      genCode(s) {
        return {
          html: `<!-- sbMkActionBar({ buttons:[{label,variant:'primary'|'secondary'|'text',icon?,iconOnly?,critical?,disabled?,onClick?}], align:'left'|'right'|'between', floating?:bool }) -->`,
          css: COMP_CSS["action-bar"],
        };
      },
    },
    sections: [
      {
        title: 'In a card (default)',
        desc: 'Встроенная: border-top отделяет от контента карточки/модалки. Primary (commit) слева, Secondary (dismiss) рядом. Фон бара — --background.',
        preview: stage(card(mkActionBar({ buttons: TWO }))),
        html: `<!-- sbMkActionBar({ buttons:[{label:'Save',variant:'primary'},{label:'Cancel',variant:'secondary'}] }) -->`,
        css: COMP_CSS["action-bar"],
      },
      {
        title: 'Floating',
        desc: 'Отрывается от контента — radius + Shadow-S, без верхнего бордера. Применяется когда бар «висит» над скроллящимся контентом (выделяется тенью).',
        preview: stage(mkActionBar({ buttons: TWO, floating: true })),
        html: `<!-- sbMkActionBar({ buttons:[...], floating:true }) -->`,
        css: COMP_CSS["action-bar"],
      },
      {
        title: 'Alignment',
        desc: 'Left (по умолчанию — по Figma) / Right (канон западных диалогов) / Between (кнопки к разным краям) / Center (кнопки тянутся на всю ширину бара: одна = full-width, две = поровну).',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-m)">
          ${stage(mkActionBar({ buttons: TWO, align: 'left' }))}
          ${stage(mkActionBar({ buttons: TWO, align: 'right' }))}
          ${stage(mkActionBar({ buttons: TWO, align: 'between' }))}
          ${stage(mkActionBar({ buttons: TWO, align: 'center' }))}
        </div>`,
        html: `<!-- align: 'left' | 'right' | 'center' | 'between' -->`,
        css: COMP_CSS["action-bar"],
      },
      {
        title: 'Single button',
        desc: 'Один Primary — подтверждающее окно без отмены (ack / continue). Default — натуральная ширина; Center — на всю ширину плашки.',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-m)">
          ${stage(mkActionBar({ buttons: ONE }))}
          ${stage(mkActionBar({ buttons: ONE, align: 'center' }))}
        </div>`,
        html: `<!-- sbMkActionBar({ buttons:[{label:'Save',variant:'primary'}], align:'center' }) -->`,
        css: COMP_CSS["action-bar"],
      },
    ],
  });
})();
