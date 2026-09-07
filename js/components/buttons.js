// ═══════════════════════════════════════════════════════════════════════════
//  BUTTONS
//  CSS в css/components/buttons.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.buttons = `.sb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-horiz-s);
  height: var(--btn-primary-min-height);
  padding: 0 var(--pad-horiz-16);
  min-width: var(--btn-primary-min-width);
  border-radius: var(--radius-8);
  font-family: var(--font-body);
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  border: var(--border-width-1-5) solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, filter 0.15s ease;
  white-space: nowrap;
  text-decoration: none;
  letter-spacing: var(--letter-spacing);
  box-sizing: border-box;
  position: relative;
  -webkit-font-smoothing: antialiased;
}
.sb-btn-primary {
  background: var(--primary);
  color: var(--background);
  border-color: transparent;
}
.sb-btn-secondary { background: var(--surface-1); color: var(--primary); border-color: transparent; }
.sb-btn-text { background: transparent; color: var(--primary); border-color: transparent; min-width: unset; padding: 0 var(--pad-horiz-8); }
.sb-btn-link { background: var(--background); color: var(--primary); border-color: transparent; height: var(--btn-rounded-max-height-s); min-height: var(--btn-rounded-min-height-s); max-height: var(--btn-rounded-max-height-s); min-width: unset; padding: 0; border-radius: var(--radius-2); font-size: var(--link-font-size-s); line-height: var(--link-line-height); font-weight: var(--font-weight-medium); text-decoration: underline; text-underline-position: from-font; }
.sb-btn-link:hover, .sb-btn-link.is-hover { opacity: 0.8; }
.sb-btn-mini {
  height: var(--btn-rounded-max-height-s);
  min-height: var(--btn-rounded-min-height-s);
  max-height: var(--btn-rounded-max-height-s);
  min-width: var(--btn-rounded-min-width);
  max-width: var(--btn-rounded-max-width);
  padding: var(--pad-vert-4) var(--pad-horiz-8);
  gap: var(--gap-horiz-xs);
  border-radius: var(--radius-4);
  font-size: var(--button-mini-font-size);
  line-height: var(--button-mini-line-height);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-btn-with-label {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-vert-s);
  padding: var(--pad-vert-0) var(--pad-horiz-0);
}
.sb-btn-with-label-text {
  color: var(--text-tertiary);
  white-space: nowrap;
}`;

// --- BUTTONS ---
(() => {
/**
 * Канонический порядок классов кнопки — ЕДИНСТВЕННЫЙ разрешённый в DS:
 *   sb-btn → variant → critical → size → icon → loading → потребительский cls
 * До появления фабрики один и тот же вариант писался в двух порядках
 * (…sb-btn-sm sb-btn-icon ×39 против …sb-btn-icon sb-btn-sm ×12).
 *
 * Critical у Primary ЗАМЕЩАЕТ класс варианта (`.sb-btn-critical` в CSS — это
 * и есть primary-flavor критикал), у Secondary/Text — добавляется к нему.
 */
function btnClass({ variant, size, critical, iconOnly, twoIcons, loading, cls }) {
  let c = 'sb-btn';
  if (variant === 'primary')   c += critical ? ' sb-btn-critical' : ' sb-btn-primary';
  if (variant === 'secondary') c += critical ? ' sb-btn-secondary sb-btn-critical' : ' sb-btn-secondary';
  if (variant === 'text')      c += critical ? ' sb-btn-text sb-btn-critical' : ' sb-btn-text';
  if (variant === 'link')      c += ' sb-btn-link';
  if (size === 's')            c += ' sb-btn-sm';
  if (size === 'mini')         c += ' sb-btn-mini';
  if (iconOnly)                c += twoIcons ? ' sb-btn-icon-2' : ' sb-btn-icon';
  if (loading)                 c += ' sb-btn-loading';
  if (cls)                     c += ' ' + cls;
  return c;
}

/**
 * sbMkButton({ label, variant, size, critical, icon, iconRight, iconSize,
 *              iconOnly, disabled, loading, href, cls, attrs })
 *
 *  label      — текст кнопки. Пустой + есть icon → кнопка становится icon-only.
 *  variant    — 'primary' | 'secondary' | 'text' | 'link'   (default 'secondary')
 *               link — кнопка-ссылка Link S с underline; с critical и
 *               size не сочетается, обычно рендерится с href
 *  size       — 'l' | 's' | 'mini'                 (default 'l')
 *  critical   — деструктивный акцент (Delete и пр.)
 *  icon       — имя из ICON_PATHS; слева от лейбла, либо единственная иконка
 *  iconRight  — имя из ICON_PATHS; справа от лейбла. У icon-only вторая иконка
 *               даёт `.sb-btn-icon-2` (68px, две иконки — dropdown-триггер).
 *  iconSize   — 'L' | 'M' | 'S' | px. Default 'L' — как у sbIcon. НЕ выводится
 *               из size: S-иконки рисуются собственным path'ом из ICON_PATHS_S,
 *               так что подмена размера меняет геометрию глифа, а не масштаб.
 *  iconOnly   — явный override авто-вывода (нужен для кнопки без иконки и без
 *               лейбла, либо когда лейбл есть, а кнопка всё равно квадратная)
 *  href       — задан → рендерится <a>, иначе <button type="button">
 *  cls        — потребительский класс: 'sb-header-l-action', 'sb-tool-bar-action'
 *  attrs      — сырая строка атрибутов: onclick / aria-label / title / style
 *  content    — сырой inner HTML вместо сборки из icon/label. Для кнопок, где
 *               содержимое несёт собственную структуру: две иконки под
 *               CSS-переключение (Nav Bar burger), лейбл в своём span'е.
 *               Форму кнопки (в т.ч. iconOnly) при этом задаёшь явно.
 */
function mkButton(o = {}) {
  const {
    label = '', variant = 'secondary', size = 'l', critical = false,
    icon = '', iconRight = '', iconSize = 'L', content = '',
    disabled = false, loading = false, href = '', cls = '', attrs = '',
  } = o;

  // Авто-вывод: иконка без лейбла = icon-only. Явный iconOnly перебивает.
  const iconOnly = o.iconOnly !== undefined ? !!o.iconOnly : (!label && !!icon);
  const twoIcons = iconOnly && !!icon && !!iconRight;

  const c = btnClass({ variant, size, critical, iconOnly, twoIcons, loading, cls });

  let inner;
  if (content) {
    inner = content;
  } else if (iconOnly) {
    inner = (icon ? sbIcon(icon, iconSize) : '')
          + (twoIcons ? sbIcon(iconRight, iconSize) : '');
  } else {
    inner = (icon ? sbIcon(icon, iconSize) + ' ' : '')
          + label
          + (iconRight ? ' ' + sbIcon(iconRight, iconSize) : '');
  }

  // <a> не понимает атрибут disabled — гасим классом (.sb-btn.disabled в CSS).
  if (href) {
    const dis = disabled ? ' disabled' : '';
    return `<a class="${c}${dis}" href="${href}"${attrs}>${inner}</a>`;
  }
  return `<button type="button" class="${c}"${boolAttr('disabled', disabled)}${attrs}>${inner}</button>`;
}

/**
 * sbMkButtonWithLabel({ ...btnProps, text, side })
 * Композиция «icon-only кнопка + подпись рядом» (.sb-btn-with-label).
 * Подпись стоит СНАРУЖИ кнопки, поэтому это отдельная фабрика, а не опция:
 * side — 'left' | 'right' (default) | 'both'.
 */
function mkButtonWithLabel(o = {}) {
  const { text = '', side = 'right', ...btnProps } = o;
  const btn = mkButton(btnProps);
  if (!text) return btn;
  const lbl = `<span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">${text}</span>`;
  const parts = [
    (side === 'left'  || side === 'both') ? lbl : '',
    btn,
    (side === 'right' || side === 'both') ? lbl : '',
  ].filter(Boolean).join('');
  return `<span class="sb-btn-with-label">${parts}</span>`;
}

window.sbMkButton = mkButton;
window.sbMkButtonWithLabel = mkButtonWithLabel;

// Playground-state → props фабрики. Size в state разложен на два независимых
// тогла (small — только у icon-only, mini — только у текстовой), в API это
// одна ось size.
function pgProps(s) {
  return {
    label:     s.iconOnly ? '' : 'Button',
    variant:   s.type,
    size:      s.iconOnly ? (s.small ? 's' : 'l') : (s.mini ? 'mini' : 'l'),
    critical:  s.critical,
    icon:      s.iconOnly ? 'add-line' : (s.iconL ? 'radar-line' : ''),
    iconRight: s.iconOnly ? (s.twoIcons ? 'arrow-drop-down-line' : '') : (s.iconR ? 'arrow-drop-down-line' : ''),
    iconOnly:  s.iconOnly,
    disabled:  s.disabled,
    loading:   s.loading,
  };
}
sbRegister({
  name: 'buttons',
  title: 'Buttons',
  description: sbT(
    'The Basic button component from Figma. Types: Primary, Secondary, Text. States: Hover, Disable, Loading, Critical. Icon options: left, right, icon-only. Examples: Primary — a form submit; Secondary — a Back button in a header.',
    'Компонент Basic из Figma. Типы: Primary, Secondary, Text. Состояния: Hover, Disable, Loading, Critical. Иконки: слева, справа, icon-only. Примеры: Primary — отправка формы; Secondary — кнопка Back в хедере.'
  ) + sbDocNote('Tech Info', sbT(
    '<b>Sizes:</b>'
    + '<ul><li>L: 40px;</li><li>S: 32px;</li><li>Mini: 24px — width 40–68, Button-Mini typography (12/500/10), for dense spots like Snackbar actions.</li></ul>'
    + '<b>API — never hand-write the markup:</b>'
    + '<ul><li><code>sbMkButton({ label, variant, size, critical, icon, iconRight, iconSize, iconOnly, disabled, loading, href, cls, attrs, content })</code>;</li>'
    + '<li><code>sbMkButtonWithLabel({ ...btnProps, text, side })</code> — icon-only button with a caption next to it;</li>'
    + '<li>an icon with no label makes the button icon-only automatically; two icons on an icon-only button give the 68px two-icon shape;</li>'
    + '<li>the factory owns the class order — <code>sb-btn</code> → variant → critical → size → icon → loading → your <code>cls</code>.</li></ul>',
    '<b>Размеры:</b>'
    + '<ul><li>L: 40px;</li><li>S: 32px;</li><li>Mini: 24px — ширина 40–68, типографика Button-Mini (12/500/10), для плотных мест вроде действий Snackbar.</li></ul>'
    + '<b>API — разметку руками не писать:</b>'
    + '<ul><li><code>sbMkButton({ label, variant, size, critical, icon, iconRight, iconSize, iconOnly, disabled, loading, href, cls, attrs, content })</code>;</li>'
    + '<li><code>sbMkButtonWithLabel({ ...btnProps, text, side })</code> — icon-only кнопка с подписью рядом;</li>'
    + '<li>иконка без лейбла делает кнопку icon-only сама; две иконки на icon-only дают форму 68px под две иконки;</li>'
    + '<li>порядок классов держит фабрика — <code>sb-btn</code> → вариант → critical → размер → icon → loading → твой <code>cls</code>.</li></ul>'
  )),
  playground: {
    title: 'Regular',
    state: { type: 'primary', iconL: false, iconR: false, disabled: false, loading: false, critical: false, iconOnly: false, twoIcons: false, small: false, mini: false, labelLeft: false, labelRight: false },
    controls(pg) {
      // Variant — одиночный select с label'ом (без обёртки в pg-group: один
      // контрол в группе — избыточная декорация). Modifiers / State — pg-group'ы
      // с 3 toggle'ами каждый.
      return `${pg.select('type', [
          { value: 'primary',   label: 'Primary'   },
          { value: 'secondary', label: 'Secondary' },
          { value: 'text',      label: 'Text'      },
          { value: 'link',      label: 'Link'      },
        ], { label: 'Variant' })}
        ${sbPgGroup('Modifiers', `
            <div class="pg-toggles">
              ${pg.toggle('iconL',    'Icon-L')}
              ${pg.toggle('iconR',    'Icon-R')}
              ${pg.toggle('iconOnly', 'Icon-Only')}
            </div>
          `)}
        ${sbPgGroup('State', `
            <div class="pg-toggles">
              ${pg.toggle('disabled', 'Disable')}
              ${pg.toggle('loading',  'Loading')}
              ${pg.toggle('critical', 'Critical')}
            </div>
          `)}`;
    },
    onControlChange(key, val, s) {
      if (key === 'iconOnly') {
        if (s.iconOnly) { s.iconL = false; s.iconR = false; s.mini = false; }
        else { s.twoIcons = false; s.small = false; }
      }
      if ((key === 'iconL' || key === 'iconR') && val) {
        s.iconOnly = false;
      }
    },
    syncControls(s, container) {
      container.querySelectorAll('[data-pg-ctrl]').forEach(el => {
        const key = el.getAttribute('data-pg-ctrl');
        if (key === 'iconL' || key === 'iconR') {
          el.classList.toggle('is-disabled', !!s.iconOnly);
        }
      });
    },
    render(s) {
      const props = pgProps(s);
      // Label composition: только для icon-only кнопок. Label-левый и -правый
      // независимы — обе галки = label с обеих сторон.
      if (s.iconOnly && (s.labelLeft || s.labelRight)) {
        const side = (s.labelLeft && s.labelRight) ? 'both' : (s.labelLeft ? 'left' : 'right');
        return sbMkButtonWithLabel({ ...props, text: 'Label', side });
      }
      return sbMkButton(props);
    },
    extraPreview(s) {
      // Контрол плейграунда на НАТИВНОМ DS-чекбоксе (был <input class="sb-checkbox">
      // — нативный инпут под чужим классом, мимо компонента). Режим static: состояние
      // живёт в SB_PG, поэтому тогл наш, а не встроенный. Лейбл встроен в компонент,
      // отдельный <label> и обёртка .pg-cb-group больше не нужны.
      const cb = (key, label) => sbMkCheckbox({
        label,
        checked: !!s[key],
        static: true,
        attrs: `onclick="SB_PG.set('buttons','${key}',!SB_PG.state('buttons').${key})"`,
      });
      // Текстовая кнопка: чекбокс Mini (24px, типографика Button-Mini).
      if (!s.iconOnly) {
        return `<div class="pg-extras-row" style="display:grid;grid-template-columns:auto;justify-content:center">
          ${cb('mini', 'Mini')}
        </div>`;
      }
      // 4 чекбокса в сетке 2×2 (2 столбца). Inline-style чтобы не плодить
      // буттон-специфичный класс в playground.css.
      return `<div class="pg-extras-row" style="display:grid;grid-template-columns:auto auto;gap:var(--gap-vert-s) var(--gap-horiz-lg);justify-content:center">
        ${cb('twoIcons', '2 Icons')}
        ${cb('small', 'Small')}
        ${cb('labelLeft', 'Label Left')}
        ${cb('labelRight', 'Label Right')}
      </div>`;
    },
    genCode(s) {
      // Та же фабрика, что и в render — расходиться им нельзя. Разница только
      // в содержимом: в code-sample иконки идут голым <svg> (sbIconRaw, без
      // .sb-icon-wrap) и с переносами под копипасту, поэтому оно передаётся
      // через content.
      const IL = sbIconRaw('add-line');
      const IR = sbIconRaw('arrow-drop-down-line');
      const p = pgProps(s);
      let content = '';
      if (s.iconOnly) {
        content = s.twoIcons ? `\n  ${IL}\n  ${IR}\n` : `\n  ${IL}\n`;
      } else {
        if (s.iconL) content += `\n  ${IL}`;
        content += '\n  Button';
        if (s.iconR) content += `\n  ${IR}`;
        content += '\n';
      }
      const btnProps = { ...p, content, iconOnly: !!s.iconOnly };
      let html = sbMkButton(btnProps);
      if (s.iconOnly && (s.labelLeft || s.labelRight)) {
        const side = (s.labelLeft && s.labelRight) ? 'both' : (s.labelLeft ? 'left' : 'right');
        html = sbMkButtonWithLabel({ ...btnProps, text: 'Label', side });
      }
      return { html, css: COMP_CSS.buttons };
    },
  },
});
})();
