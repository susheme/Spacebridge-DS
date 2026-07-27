// ═══════════════════════════════════════════════════════════════════════════
//  CHECKBOX
//  CSS в css/components/checkbox.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.checkbox = `.sb-checkbox {
  display: inline-flex; align-items: center; gap: var(--gap-horiz-s);
  cursor: pointer; user-select: none;
  outline: none; -webkit-tap-highlight-color: transparent; vertical-align: middle;
}
.sb-checkbox:focus-visible {
  outline: var(--border-width-2) solid var(--primary);
  outline-offset: 2px; border-radius: var(--radius-4);
}
.sb-checkbox-box { outline: none; }
.sb-checkbox-box > svg { display: block; }
.sb-checkbox-box {
  width: 20px; height: 20px; flex-shrink: 0;
  border-radius: var(--radius-4); border: var(--border-width-1-5) solid var(--text-secondary);
  background: var(--background);
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box; transition: border-color 0.15s, background 0.15s;
}
.sb-checkbox:hover:not(.disabled):not(.checked):not(.indeterminate) .sb-checkbox-box,
.sb-checkbox.hover:not(.checked):not(.indeterminate) .sb-checkbox-box { border-color: var(--primary); background: var(--surface-1); }
.sb-checkbox.checked .sb-checkbox-box,
.sb-checkbox.indeterminate .sb-checkbox-box { background: var(--primary); border-color: var(--primary); }
.sb-checkbox.disabled { cursor: not-allowed; pointer-events: none; }
.sb-checkbox.disabled .sb-checkbox-box { border-color: transparent; background: var(--surface-1); }
.sb-checkbox.disabled.checked .sb-checkbox-box { background: var(--surface-1); border-color: transparent; }
.sb-checkbox-label { font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); line-height: 1.4; color: var(--text-primary); white-space: nowrap; }
.sb-checkbox.disabled .sb-checkbox-label { color: var(--border); }`;

// --- CHECKBOX ---
(() => {
  const { check: CHECK, checkDisabled: CHECK_DIS, minus: MINUS } = SB_GLYPHS;

  /**
   * sbMkCheckbox(opts) — DS-чекбокс. Не <input>: коробка рисуется дивом,
   * поэтому доступность приходится собирать руками (role/tabindex/aria).
   *   checked / indeterminate / disabled / hover — состояния
   *   label   — текст справа от коробки
   *   cls     — доп. классы потребителя (модификаторы вроде sb-dialogue-check)
   *   attrs   — сырые атрибуты (свой onclick/id); нужен playground'у, чтобы
   *             вешать SB_PG.set вместо штатного тогла
   *   static  — презентационный режим: без фокуса и обработчиков.
   *             Для витрин состояний в доках, где 5 чекбоксов подряд не
   *             должны собирать на себя Tab. Живой контрол — по умолчанию.
   *   managed — семантика есть (role/tabindex/aria), встроенного тогла нет.
   *             Для потребителей, где источник правды снаружи и поведением
   *             владеют они сами — так Table рулит выбором ряда.
   *
   * Состояние наружу: событие 'sb-checkbox:change' (bubbles, detail.checked)
   * либо sbCheckboxChecked(el). Класс .checked — источник правды.
   */
  function mkCb(opts = {}) {
    const { checked, indeterminate, disabled, hover, label, cls: extra = '', attrs = '', static: isStatic = false, managed = false } = opts;
    let cls = 'sb-checkbox';
    if (hover)         cls += ' hover';
    if (checked)       cls += ' checked';
    if (indeterminate) cls += ' indeterminate';
    if (disabled)      cls += ' disabled';
    if (extra)         cls += ' ' + extra;
    const icon = indeterminate ? MINUS : (checked && disabled) ? CHECK_DIS : checked ? CHECK : '';
    const lbl  = label ? `<span class="sb-checkbox-label">${label}</span>` : '';
    // ARIA-состояние: indeterminate — это 'mixed', а не false.
    const ariaChecked = indeterminate ? 'mixed' : checked ? 'true' : 'false';
    // Disabled не забираем в таб-очередь, но роль оставляем — скринридер
    // должен объявить «чекбокс, недоступен», а не молча пропустить.
    // managed — семантика без data-sb-checkbox: делегированный тогл его не
    // тронет, поведение целиком на потребителе.
    const a11y = isStatic ? '' :
      `${managed ? ' ' : ' data-sb-checkbox '}role="checkbox" aria-checked="${ariaChecked}"`
      + (disabled ? ' aria-disabled="true"' : ' tabindex="0"');
    return `<div class="${cls}"${a11y}${attrs ? ' ' + attrs : ''}><div class="sb-checkbox-box">${icon}</div>${lbl}</div>`;
  }
  window.sbMkCheckbox = mkCb;

  // Программная установка состояния — включая indeterminate, который тоглом
  // не выражается. Нужен потребителям вроде Table, где источник правды снаружи
  // (выбор ряда), а чекбокс лишь отражает его. Событие НЕ шлём: это не действие
  // юзера, а синхронизация отображения — иначе поймаем эхо-циклы.
  window.sbCheckboxSet = function(el, { checked = false, indeterminate = false } = {}) {
    if (!el) return;
    el.classList.toggle('checked', checked && !indeterminate);
    el.classList.toggle('indeterminate', indeterminate);
    const box = el.querySelector('.sb-checkbox-box');
    if (box) box.innerHTML = indeterminate ? MINUS : (checked ? CHECK : '');
    // Роль может жить не на самом чекбоксе, а на кликабельной обёртке
    // (в Table это ячейка) — тогда aria обновляет потребитель.
    if (el.hasAttribute('role')) {
      el.setAttribute('aria-checked', indeterminate ? 'mixed' : checked ? 'true' : 'false');
    }
  };

  // Переключение состояния. Публичное — потребитель может дёрнуть programmatically.
  window.sbCheckboxToggle = function(el) {
    if (!el || el.classList.contains('disabled')) return;
    // Из indeterminate уходим в checked — как ведёт себя нативный «select all».
    const on = el.classList.contains('indeterminate') ? true : !el.classList.contains('checked');
    window.sbCheckboxSet(el, { checked: on });
    el.dispatchEvent(new CustomEvent('sb-checkbox:change', { bubbles: true, detail: { checked: on } }));
    return on;
  };

  // Чтение состояния — чтобы потребителю не лезть в классы руками.
  window.sbCheckboxChecked = function(el) {
    return !!(el && el.classList.contains('checked'));
  };

  // Делегирование, один раз на документ: работает и для разметки, вставленной
  // после загрузки (доки перерисовываются). Скоуп — только [data-sb-checkbox],
  // чтобы не перехватывать легаси-чекбоксы со своими inline-onclick.
  if (!window.__sbCheckboxBound) {
    window.__sbCheckboxBound = true;
    document.addEventListener('click', (e) => {
      const cb = e.target.closest('[data-sb-checkbox]');
      if (cb) window.sbCheckboxToggle(cb);
    });
    document.addEventListener('keydown', (e) => {
      // Только Space — как у нативного чекбокса. Enter не трогаем: в диалоге
      // он принадлежит кнопке подтверждения, перехват сломал бы форму.
      if (e.key !== ' ' && e.key !== 'Spacebar') return;
      const cb = e.target.closest && e.target.closest('[data-sb-checkbox]');
      if (!cb) return;
      e.preventDefault(); // иначе Space проскроллит страницу
      window.sbCheckboxToggle(cb);
    });
  }

  // Code-samples для доков — генерим из самой фабрики, чтобы разметка в
  // примерах не разъезжалась с боевой (aria/tabindex забыли бы обновить).
  function sample(items) {
    return items.map(([caption, opts]) => {
      const markup = mkCb(opts)
        .replace('><div class="sb-checkbox-box"', '>\n  <div class="sb-checkbox-box"')
        .replace('</div><span', '</div>\n  <span')
        .replace(/<\/(div|span)><\/div>$/, '</$1>\n</div>');
      return `<!-- ${caption} -->\n${markup}`;
    }).join('\n\n');
  }

  sbRegister({
    name: 'checkbox',
    title: 'Checkbox',
    description: sbT(
      'A form element for selecting options — any number can be checked. Examples: row selection in a table, a filter list. States: Default, Hover, Checked, Disabled, Indeterminate (Unselect All). Label supported.',
      'Элемент формы для выбора опций — отметить можно любое количество. Примеры: выбор рядов в таблице, список фильтров. Состояния: Default, Hover, Checked, Disabled, Indeterminate (Unselect All). Поддерживает Label.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Size: 20×20px;</li><li>Border-radius: 4px.</li></ul>'
      + '<b>Keyboard and state:</b>'
      + '<ul><li>Not an &lt;input&gt; — the box is a div, so the semantics are hand-built: role="checkbox", tabindex="0", aria-checked (indeterminate reports "mixed");</li><li>Space toggles. Enter deliberately does not: inside a dialogue it belongs to the confirm button;</li><li>Disabled keeps the role but leaves the tab order — a screen reader announces it instead of skipping it silently;</li><li>Focus ring — the same one Button uses, on :focus-visible only, so it does not flash on mouse clicks;</li><li>Read the state with sbCheckboxChecked(el) or the sb-checkbox:change event (bubbles, detail.checked). The .checked class is the source of truth;</li><li>Handlers are delegated on the document and scoped to [data-sb-checkbox], so markup injected later works too;</li><li>static: true renders a presentational box with no focus or handlers — for the state showcases above.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Размер: 20×20px;</li><li>Border-radius: 4px.</li></ul>'
      + '<b>Клавиатура и состояние:</b>'
      + '<ul><li>Это не &lt;input&gt; — коробка рисуется дивом, поэтому семантика собрана руками: role="checkbox", tabindex="0", aria-checked (у indeterminate — "mixed");</li><li>Переключает Space. Enter сознательно не трогаем: в диалоге он принадлежит кнопке подтверждения;</li><li>Disabled сохраняет роль, но уходит из таб-очереди — скринридер объявит его, а не пропустит молча;</li><li>Кольцо фокуса — то же, что у Button, и только на :focus-visible, чтобы не мигало по клику мышью;</li><li>Состояние читается через sbCheckboxChecked(el) или событие sb-checkbox:change (всплывает, detail.checked). Источник правды — класс .checked;</li><li>Обработчики делегированы на документ и ограничены [data-sb-checkbox], поэтому разметка, вставленная позже, тоже живая;</li><li>static: true — презентационная коробка без фокуса и обработчиков, для витрин состояний выше.</li></ul>'
    )),
    playground: {
      title: 'Checkbox Playground',
      state: { checked: false, disabled: false, hasLabel: false, type: 'check' },
      controls(pg) {
        return `${sbPgGroup('State', `
            <div class="pg-toggles">
              ${pg.toggle('checked', 'Checked')}
              ${pg.toggle('disabled', 'Disabled')}
              ${pg.toggle('hasLabel', 'Label')}
            </div>
          `)}
        ${sbPgGroup('Type', `
            <div class="pg-toggles">
              ${pg.radio('type', [
                { value: 'check',    label: 'Check' },
                { value: 'unselect', label: 'Unselect All' },
              ])}
            </div>
          `)}`;
      },
      // syncControls не нужен: подсветку радиогруппы держит SB_PG (pg.radio).
      render(s) {
        const indeterminate = s.type === 'unselect';
        // static + свой onclick: состояние живёт в SB_PG, а не в классе, иначе
        // штатный тогл и playground-стейт разъедутся на первом же клике.
        return mkCb({
          checked: s.checked,
          indeterminate,
          disabled: s.disabled,
          label: s.hasLabel ? 'Title' : '',
          static: true,
          attrs: (!s.disabled && !indeterminate)
            ? `style="cursor:pointer" onclick="SB_PG.set('checkbox','checked',!SB_PG.state('checkbox').checked)"`
            : 'style="cursor:pointer"',
        });
      },
      genCode(s) {
        // Отдаём боевую разметку — с role/tabindex/aria, как её увидит потребитель.
        const call = `sbMkCheckbox({ ${[
          s.checked ? 'checked: true' : '',
          s.type === 'unselect' ? 'indeterminate: true' : '',
          s.disabled ? 'disabled: true' : '',
          s.hasLabel ? `label: 'Title'` : '',
        ].filter(Boolean).join(', ')} })`;
        const markup = mkCb({
          checked: s.checked,
          indeterminate: s.type === 'unselect',
          disabled: s.disabled,
          label: s.hasLabel ? 'Title' : '',
        }).replace('><div class="sb-checkbox-box"', '>\n  <div class="sb-checkbox-box"')
          .replace('</div><span', '</div>\n  <span')
          .replace(/<\/(div|span)><\/div>$/, '</$1>\n</div>');
        const html = `<!-- Собирается фабрикой: -->\n${call}\n\n`
          + `<!-- Разметка (Space переключает, состояние читать через\n`
          + `     sbCheckboxChecked(el) или событие sb-checkbox:change): -->\n${markup}`;
        return { html, css: COMP_CSS.checkbox };
      },
    },
    sections: [
      {
        title: sbT('States — No Label', 'Состояния — без лейбла'),
        preview: `<div class="sec-row gap-lg">
          ${mkCb({ static: true })}
          ${mkCb({ hover: true, static: true })}
          ${mkCb({ checked: true, static: true })}
          ${mkCb({ checked: true, disabled: true, static: true })}
          ${mkCb({ indeterminate: true, static: true })}
        </div>`,
        html: sample([
          ['Default', {}],
          ['Checked', { checked: true }],
          ['Disabled + Checked', { checked: true, disabled: true }],
          ['Indeterminate', { indeterminate: true }],
        ]),
        css: COMP_CSS.checkbox,
      },
      {
        title: sbT('States — With Label', 'Состояния — с лейблом'),
        preview: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap: var(--gap-horiz-m) 8px;width:100%">
          ${mkCb({ label: 'Title', static: true })}
          ${mkCb({ hover: true, label: 'Title', static: true })}
          ${mkCb({ checked: true, label: 'Title', static: true })}
          ${mkCb({ disabled: true, label: 'Title', static: true })}
          ${mkCb({ indeterminate: true, label: 'Unselect All', static: true })}
        </div>`,
        html: sample([
          ['Default', { label: 'Title' }],
          ['Checked', { checked: true, label: 'Title' }],
          ['Unselect All', { indeterminate: true, label: 'Unselect All' }],
        ]),
        css: COMP_CSS.checkbox,
      },
    ],
  });
})();
