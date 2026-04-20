// ═══════════════════════════════════════════════════════════════════════════
//  TEMPLATE — новый компонент
//
//  Как использовать:
//    1. Скопируй этот файл в js/components/<name>.js
//    2. Создай css/components/<name>.css с SYNC-маркерами
//    3. Добавь в index.html:
//       <link rel="stylesheet" href="css/components/<name>.css">
//       <script src="js/components/<name>.js"></script>
//    4. Добавь запись в NAV (js/core.js) с inProgress: true
//    5. Проверь локально через `open index.html` (file:// должно работать)
//    6. Когда дизайнер подтвердит — переведи inProgress → ready
//
//  ПРАВИЛА (НАРУШАТЬ НЕЛЬЗЯ):
//    - Цвета ТОЛЬКО через var(--token). Никаких #hex/rgba().
//    - Шрифты ТОЛЬКО через sb-* классы (sb-h1..h8, sb-body-*, sb-title-*,
//      sb-caption, sb-sub, sb-mono, sb-brand). Никаких inline font-size/weight/family.
//    - Иконки ТОЛЬКО через sbIcon(name, size) или sbIconRaw(name, size) с именами
//      из ICON_PATHS (js/core.js). Новые иконки — добавлять в ICON_PATHS, не инлайнить <svg>.
//    - Работай только в своём файле компонента. Чужие components/* не редактируй.
//    - При сомнениях — inProgress: true (оранжевая точка в сайдбаре).
// ═══════════════════════════════════════════════════════════════════════════

// --- CSS snippet для code panel (копия css/components/<name>.css без SYNC-маркеров) ---
window.COMP_CSS.myComponent = `.sb-my {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 32px;
  border-radius: var(--radius-2);
  background: var(--surface-1);
  color: var(--text-primary);
}`;

// --- MY COMPONENT ---
(() => {
  function myClass(s) {
    let cls = 'sb-my';
    if (s.active)   cls += ' active';
    if (s.disabled) cls += ' disabled';
    return cls;
  }

  sbRegister({
    name: 'my-component',           // должен совпадать с id в NAV
    title: 'My Component',
    description: 'Краткое описание компонента — что делает, когда применять.',
    // Вариант A: playground (интерактивная песочница)
    playground: {
      title: 'My Component Playground',
      state: { active: false, disabled: false },
      controls(pg) {
        return pg.toggle('active', 'Active') + pg.toggle('disabled', 'Disabled');
      },
      render(s) {
        return `<div class="${myClass(s)}">Hello</div>`;
      },
      genCode(s) {
        const cls = myClass(s);
        return {
          html: `<div class="${cls}">Hello</div>`,
          css: COMP_CSS.myComponent,
        };
      },
    },
    // Вариант B: sections (статичные примеры)
    // sections: [
    //   {
    //     title: 'Basic',
    //     desc: 'Описание секции.',
    //     preview: `<div class="sb-my">Hello</div>`,
    //     html: `<div class="sb-my">Hello</div>`,
    //     css: COMP_CSS.myComponent,
    //   },
    // ],
  });
})();
