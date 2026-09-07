// ═══════════════════════════════════════════════════════════════════════════
//  CARDS
//  CSS в css/components/cards.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Карточка — контейнер со слотами (шапка / слот контента / Action Bar).
//  Своего контента у неё нет: в слоты кладут готовые компоненты DS.
//  Типы карточек (Default Content / Stat and Metrics / Alert / Selectable /
//  List) — композиции слотов, а не отдельные классы.
//
//  Зависимости (все грузятся раньше в index.html):
//    Button, Badge, Status, Counter, Avatar, Checkbox, Tags, Popover,
//    Context Menu, Property List (list.js), Action Bar, Grid System.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.cards = `.sb-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
  container-type: inline-size;
  width: 100%;
  align-self: start;
  gap: var(--gap-vert-0);
  background: var(--background);
  border: var(--border-width-1) solid transparent;
  border-radius: var(--radius-8);
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
  transition: var(--transition);
}
.sb-card:not(:has(> .sb-card-footer)):not(:has(> .sb-action-bar)):not(:has(> .sb-card-body.is-stat)) { padding-bottom: var(--pad-vert-16); }
.sb-card.is-interactive { cursor: pointer; }
.sb-card.is-interactive:hover, .sb-card.is-selected { border-color: var(--primary); box-shadow: 0 6px 10px -6px var(--primary-hover), 0 2px 8px 0 var(--primary-hover), 0 10px 20px 0 var(--primary-hover); }
.sb-card.is-interactive:focus-visible { outline: var(--border-width-2) solid var(--primary); outline-offset: 2px; }
.sb-card.bordered { border-color: var(--border-soft); box-shadow: none; }
.sb-card.is-disabled { pointer-events: none; }
.sb-card.is-disabled .sb-card-title, .sb-card.is-disabled .sb-card-subtitle, .sb-card.is-disabled .sb-card-text-title, .sb-card.is-disabled .sb-card-body { color: var(--border); }

.sb-card-header { display: flex; justify-content: space-between; align-items: flex-start; align-self: stretch; box-sizing: border-box; min-height: var(--card-header-min-height); max-height: var(--card-header-max-height); padding: var(--pad-vert-16) var(--pad-horiz-16) var(--pad-vert-8); border-radius: var(--radius-8) var(--radius-8) var(--radius-0) var(--radius-0); background: var(--background); min-width: 0; }
.sb-card-header-left { display: flex; align-items: center; gap: var(--gap-vert-s); min-height: 24px; max-height: 40px; max-width: var(--nav-menu-max-width-right-content); min-width: 0; }
.sb-card-header-lead { display: inline-flex; align-items: center; flex-shrink: 0; }
.sb-card-header-stack { display: inline-flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: var(--gap-horiz-xs); min-width: 0; }
.sb-card-header-right { display: flex; justify-content: flex-end; align-items: center; gap: var(--gap-vert-s); min-height: 24px; max-height: 40px; max-width: var(--nav-menu-max-width-right-content); flex-shrink: 0; }
.sb-card-title, .sb-card-subtitle { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; padding-block: 4px; margin-block: -4px; }
.sb-card-title { color: var(--text-tertiary); }
.sb-card-subtitle { color: var(--text-secondary); }

.sb-card-body { display: flex; flex-direction: column; gap: var(--gap-vert-s); padding: var(--pad-vert-8) var(--pad-horiz-16) var(--pad-vert-0); min-width: 0; color: var(--text-tertiary); }
.sb-card > .sb-card-body:first-child { padding-top: var(--pad-vert-16); }
.sb-card-body.has-media { gap: var(--gap-vert-m); }
.sb-card-body.is-alert { padding: var(--pad-vert-0) var(--pad-horiz-16); align-items: flex-start; }
.sb-card:has(> .sb-action-bar) > .sb-card-body { padding-bottom: var(--pad-vert-8); }
.sb-card:has(> .sb-action-bar) > .sb-card-body.is-list { padding-bottom: var(--pad-vert-16); }
.sb-card-text { display: flex; flex-direction: column; gap: var(--gap-vert-s); align-self: stretch; min-width: 0; }
.sb-card-text-stack { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: var(--gap-horiz-s); align-self: stretch; min-width: 0; }
.sb-card-text-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; color: var(--text-tertiary); padding-block: 4px; margin-block: -4px; }

.sb-card > .sb-action-bar:last-child { border-radius: var(--radius-0) var(--radius-0) var(--radius-8) var(--radius-8); }

.sb-card-footer { display: flex; align-items: center; justify-content: space-between; gap: var(--gap-horiz-m); padding: var(--pad-vert-8) var(--pad-horiz-16); min-width: 0; border-top: var(--border-width-1) solid var(--border); }

.sb-card-body.is-stat { padding: var(--pad-vert-0) var(--pad-horiz-16) var(--pad-vert-16); }
.sb-card-stat { display: flex; align-items: flex-start; gap: var(--gap-horiz-m); flex-wrap: wrap; min-width: 0; }
.sb-card-stat-value { color: var(--text-primary); }`;

// --- CARDS ---
(() => {
  /**
   * sbMkCard(opts) — контейнер-карточка.
   *   header / body / footer — html-слоты (пустой слот не рендерится)
   *   media — медиа в контент-слот (sbMkPlaceholder или img); текст body
   *           уходит в свой блок ниже медиа, карточка переключается на
   *           gap 0 (спека Content Card with Media)
   *   title / subtitle — стек Title L + Subscription в контент-слоте, над
   *           текстом body (Stack Slot медиа-карточки)
   *   actionBar — готовый sbMkActionBar; встаёт прямым ребёнком карточки,
   *               бордер и поля несёт сам
   *   interactive — вся плашка кликабельна (hover + focus-visible)
   *   border — рамка --border-soft вместо тени (плотные стопки карточек)
   *   selected / disabled — состояния
   *   width / maxWidth — раскладочные свойства для витрин
   *   bodyCls — доп. класс слота контента (is-stat у метрики)
   *   cls / attrs — доп. классы и сырые атрибуты потребителя
   */
  function mkCard(opts = {}) {
    const { header = '', media = '', title = '', subtitle = '', body = '',
            footer = '', actionBar = '',
            interactive = false, border = false, selected = false, disabled = false,
            width = '', maxWidth = '', bodyCls = '', cls = '', attrs = '' } = opts;

    let c = 'sb-card';
    if (media)       c += ' has-media';
    if (border)      c += ' bordered';
    if (interactive) c += ' is-interactive';
    if (selected)    c += ' is-selected';
    if (disabled)    c += ' is-disabled';
    if (cls)         c += ' ' + cls;

    let style = '';
    if (width)    style += 'width:' + width + ';';
    if (maxWidth) style += 'max-width:' + maxWidth + ';';
    const styleAttr = style ? ` style="${style.replace(/;$/, '')}"` : '';

    // Кликабельная карточка — таргет для клавиатуры, иначе фокус её минует.
    const a11y = interactive && !disabled ? ' role="button" tabindex="0"' : '';

    const stackHtml = (title || subtitle)
      ? `<div class="sb-card-text-stack">`
        + (title ? `<span class="sb-card-text-title sb-title-l">${title}</span>` : '')
        + (subtitle ? `<span class="sb-card-subtitle sb-sub">${subtitle}</span>` : '')
        + `</div>`
      : '';
    const textHtml = (stackHtml || body)
      ? `<div class="sb-card-text">${stackHtml}${body}</div>`
      : '';
    const bc = 'sb-card-body' + (bodyCls ? ' ' + bodyCls : '');
    const bodyHtml = media
      ? `<div class="${bc} has-media">${media}${textHtml}</div>`
      : stackHtml
        ? `<div class="${bc}">${textHtml}</div>`
        : body ? `<div class="${bc}">${body}</div>` : '';

    return `<div class="${c}"${styleAttr}${a11y}${attrs ? ' ' + attrs : ''}>`
      + (header ? header : '')
      + bodyHtml
      + (footer ? `<div class="sb-card-footer">${footer}</div>` : '')
      + (actionBar ? actionBar : '')
      + `</div>`;
  }

  /**
   * sbMkCardHeader(opts) — шапка карточки по Figma-спеке Cards/Header.
   * Отдельным компонентом в NAV не выносится: вне карточки смысла не имеет.
   *   lead     — лид в левом слоте: иконка, аватар, статус-точка, чекбокс
   *   title    — заголовок, Headline H8 (Title Case ставит типографика DS)
   *   titleCls — класс типографики заголовка вместо sb-h8
   *              (Title M у Notification Card)
   *   subtitle — подпись под заголовком, Subscription
   *   content  — полная замена стека title/subtitle: слот наполняется как
   *              угодно (кэпшен метрики и т.п.)
   *   right    — правый слот: kebab-меню, badge, кнопка, тогл
   *   cls / attrs — доп. классы и сырые атрибуты потребителя
   * Заголовок и подпись трункейтятся: длинное имя устройства не должно
   * распирать колонку грида.
   */
  function mkCardHeader(opts = {}) {
    const { lead = '', title = '', subtitle = '', content = '', right = '',
            titleCls = 'sb-h8', cls = '', attrs = '' } = opts;

    let c = 'sb-card-header';
    if (cls) c += ' ' + cls;

    const stackHtml = content
      ? content
      : (title || subtitle)
        ? `<span class="sb-card-header-stack">`
          + (title ? `<span class="sb-card-title ${titleCls}">${title}</span>` : '')
          + (subtitle ? `<span class="sb-card-subtitle sb-sub">${subtitle}</span>` : '')
          + `</span>`
        : '';
    const leftHtml = (lead || stackHtml)
      ? `<span class="sb-card-header-left">`
        + (lead ? `<span class="sb-card-header-lead">${lead}</span>` : '')
        + stackHtml
        + `</span>`
      : '';
    const rightHtml = right ? `<span class="sb-card-header-right">${right}</span>` : '';
    return `<div class="${c}"${attrs ? ' ' + attrs : ''}>${leftHtml}${rightHtml}</div>`;
  }

  window.sbMkCard = mkCard;
  window.sbMkCardHeader = mkCardHeader;

  // ── Demo-хелперы ──────────────────────────────────────────────────────
  // Kebab-меню карточки: Popover + карточка Context Menu. Своей разметки
  // выпадашки здесь нет — примитив собирает всё сам.
  function demoKebab(items) {
    return sbMkPopover({
      trigger: sbMkButton({ icon: 'more-2-line', iconSize: 'S', size: 's', attrs: ' aria-label="Card actions"' }),
      content: sbMkContextCard(items.map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' })).join('')),
      placement: 'bottom-end',
      arrow: true,
    });
  }

  const KEBAB_ITEMS = [
    { icon: 'pencil-line',     label: 'Rename' },
    { icon: 'file-copy-line',  label: 'Duplicate' },
    { icon: 'delete-bin-line', label: 'Delete' },
  ];

  // Витрина: карточки в гриде. Минимум колонки — --card-min-width из Figma,
  // auto-fit сам схлопывает в одну колонку на узком превью.
  function stage(cards) {
    return sbMkGrid({ gap: 'lg', items: cards });
  }

  // ── Card Header ───────────────────────────────────────────────────────
  // Витрина ТОЛЬКО шапки, без карточки вокруг: полный набор содержимого
  // слотов. Лид: иконка, аватар, статус-точка, чекбокс. Правый: kebab,
  // Text Badge, кнопка, тогл.
  const HEADERS = stage([
    mkCardHeader({
      lead: sbIcon('radar-line', 'L'),
      title: 'Headline',
      subtitle: 'Subscription',
      right: demoKebab(KEBAB_ITEMS),
    }),
    mkCardHeader({
      lead: sbMkAvatar({ type: 'company' }),
      title: 'Headline',
      subtitle: 'Subscription',
      right: sbMkBadgeText({ label: 'Default' }),
    }),
    mkCardHeader({
      lead: sbMkAvatar({ type: 'image' }),
      title: 'Headline',
      subtitle: 'Subscription',
      right: sbMkButton({ icon: 'more-2-line', iconSize: 'S', size: 's', attrs: ' aria-label="Actions"' }),
    }),
    mkCardHeader({
      lead: sbMkStatusDot({ status: 'online' }),
      title: 'Headline',
      subtitle: 'Subscription',
      right: sbMkToggle({ checked: true }),
    }),
    mkCardHeader({
      lead: sbMkCheckbox({ static: true }),
      title: 'Headline',
      subtitle: 'Subscription',
    }),
    mkCardHeader({
      title: 'Headline',
      subtitle: 'Subscription',
      right: sbMkButton({ label: 'Button', size: 'mini' }),
    }),
  ]);

  // ── 1. Default Content Card ───────────────────────────────────────────
  // Два варианта по спеке: с Action Bar (padding карточки 0) и без него
  // (нижнее поле 16 даёт карточка).
  const CONTENT_HEADER = () => mkCardHeader({
    lead: sbMkAvatar({ type: 'company' }),
    title: 'Headline',
    subtitle: 'Subscription',
    right: sbMkBadgeText({ label: 'Default' }),
  });

  const CONTENT_AB = () => sbMkActionBar({
    align: 'center',
    buttons: [
      { label: 'Button', variant: 'primary' },
      { label: 'Button', variant: 'secondary' },
    ],
  });

  const DEFAULT_CONTENT = stage([
    mkCard({
      header: CONTENT_HEADER(),
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
      actionBar: CONTENT_AB(),
    }),
    mkCard({
      header: CONTENT_HEADER(),
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    }),
    mkCard({
      header: CONTENT_HEADER(),
      media: sbMkPlaceholder({ shape: 'landscape' }),
      title: 'Title',
      subtitle: 'Subscription',
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
      actionBar: CONTENT_AB(),
    }),
    mkCard({
      header: CONTENT_HEADER(),
      media: sbMkPlaceholder({ shape: 'landscape' }),
      title: 'Title',
      subtitle: 'Subscription',
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    }),
    mkCard({
      media: sbMkPlaceholder({ shape: 'landscape' }),
      title: 'Title',
      subtitle: 'Subscription',
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
      actionBar: CONTENT_AB(),
    }),
    mkCard({
      media: sbMkPlaceholder({ shape: 'landscape' }),
      title: 'Title',
      subtitle: 'Subscription',
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    }),
  ]);

  // ── 2. Stat and Metrics Card ──────────────────────────────────────────
  // Кэпшен — в шапке (слот content), значение H4 — в слоте is-stat, под
  // ним Subscription. Вариант со Status Bar ждёт компонент Status Bar.
  function statCard(caption, badgeLabel, badgeVariant, value, sub) {
    return mkCard({
      header: mkCardHeader({
        content: `<span class="sb-caption" style="color:var(--text-secondary)">${caption}</span>`,
        right: sbMkBadgeText({ label: badgeLabel, variant: badgeVariant }),
      }),
      bodyCls: 'is-stat',
      body: `<span class="sb-card-stat">
          <span class="sb-card-stat-value sb-h4">${value}</span>
        </span>`
        + (sub ? `<span class="sb-card-subtitle sb-sub">${sub}</span>` : ''),
    });
  }

  const STATS = stage([
    statCard('Custom Info', 'Default', 'primary', '99.9 %', 'Subscription'),
    statCard('Custom Info', 'Warning', 'alert', '99.9 %', ''),
  ]);

  // ── 3. Alert Card ─────────────────────────────────────────────────────
  // Та же механика: шапка + текстовый слот. Справа — Text Badge уровня и
  // колокольчик. Дата в тексте — вставка цветом text-tertiary.
  const ALERTS = stage([
    mkCard({
      header: mkCardHeader({
        title: 'Headline',
        right: sbMkBadgeText({ label: 'Alert', variant: 'error' })
          + sbIcon('notification-3-line', 'M'),
      }),
      bodyCls: 'is-alert',
      body: `<span class="sb-body-l" style="color:var(--text-secondary)">Please add your content here. Keep it short and simple <span style="color:var(--text-tertiary)">Jun 1, 2026</span></span>`,
    }),
  ]);

  // ── 4. Selectable Card ────────────────────────────────────────────────
  // Чекбокс в managed-режиме: источником правды владеет карточка, поэтому
  // встроенный тогл чекбокса выключен, состояние ставит потребитель.
  function selectCard(selected, disabled, badgeLabel, badgeVariant) {
    return mkCard({
      interactive: !disabled,
      selected,
      disabled,
      header: mkCardHeader({
        lead: sbMkCheckbox({ checked: selected, disabled, static: true }),
        title: 'Headline',
        subtitle: 'Subscription',
        right: sbMkBadgeText({ label: badgeLabel, variant: badgeVariant }),
      }),
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    });
  }

  const SELECTABLE = stage([
    selectCard(false, false, 'Default', 'primary'),
    selectCard(true,  false, 'Default', 'primary'),
    selectCard(false, true,  'Unknown', 'pending'),
  ]);

  // ── Bordered Card ─────────────────────────────────────────────────────
  // Рамка вместо тени. Вторая карточка — interactive: ховер красит рамку
  // в primary, тень не включается.
  const BORDERED = stage([
    mkCard({
      border: true,
      header: mkCardHeader({
        title: 'Headline',
        subtitle: 'Subscription',
        right: sbMkBadgeText({ label: 'Default' }),
      }),
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    }),
    mkCard({
      border: true,
      interactive: true,
      header: mkCardHeader({
        title: 'Headline',
        subtitle: 'Subscription',
        right: sbMkBadgeText({ label: 'Default' }),
      }),
      body: `<span class="sb-body-l">Please add your content here. Keep it short and simple.</span>`,
    }),
  ]);

  // ── Notification Card ─────────────────────────────────────────────────
  // Карточка ленты обновлений (спека 04.09): bordered-контейнер, шапка с
  // Title M + датой + бейджем «New», слот is-alert, ряд ссылок на компоненты.
  const NOTIFICATION = stage([
    mkCard({
      border: true,
      interactive: true,
      header: mkCardHeader({
        lead: sbMkMark({ variant: 'success' }),
        titleCls: 'sb-title-m',
        title: 'New 1.14.0 Version Updates',
        subtitle: 'September 3, 2026',
        right: sbMkBadgeText({ label: 'New', variant: 'success' }),
      }),
      bodyCls: 'is-alert',
      body: `<span class="sb-body-l">Discover the latest updates in our design system, featuring enhanced components and improved accessibility.</span>`
        + sbMkFlex({ gapX: 's', gapY: 's', wrap: true, content:
          sbMkButton({ label: 'Cards', variant: 'link', href: '#cards' })
          + sbMkButton({ label: 'Table', variant: 'link', href: '#table' })
          + sbMkButton({ label: 'Context Menu', variant: 'link', href: '#context-menu' }) }),
    }),
  ]);

  // ── 5. List Card ──────────────────────────────────────────────────────
  // Head-ячейка, обычный список и Framed-список Property List в одном
  // слоте контента (is-list).
  function listCard(withActionBar) {
    const cells = n => Array.from({ length: n }, () => ({
      icon: 'radar-line', label: 'Left Slot', value: 'Right Slot',
    }));
    return mkCard({
      header: mkCardHeader({
        title: 'Property List',
        right: sbMkBadgeText({ label: 'Default' }),
      }),
      bodyCls: 'is-list',
      body: sbMkPropertyCell({ head: true, icon: 'time-line', label: 'Time', value: '2025-10-27 | 00:00:00' })
        + sbMkPropertyList({ items: cells(5) })
        + sbMkPropertyList({ framed: true, items: cells(3) }),
      actionBar: withActionBar ? CONTENT_AB() : '',
    });
  }

  const LISTS = stage([listCard(true), listCard(false)]);

  sbRegister({
    name: 'cards',
    title: 'Cards',
    description: sbT(
      'A container assembled from three zones: the header, the content slot and Action Bar. The header and Action Bar are optional. The card carries no content of its own — DS components go into the slots. Five types — Default Content, Stat and Metrics, Alert, Selectable and List — are compositions of those slots, not separate classes.',
      'Контейнер из трёх зон: шапка, слот контента и Action Bar. Шапка и Action Bar необязательны. Собственного контента у карточки нет — в слоты кладут компоненты DS. Пять типов — Default Content, Stat and Metrics, Alert, Selectable и List — композиции слотов, а не отдельные классы.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Container:</b>'
      + '<ul><li>Background: background;</li><li>Radius: 8;</li><li>Shadow: Shadow-S (0 2 8 shadow-overlay);</li><li>Gap between slots: 0 — the rhythm comes from the slot paddings;</li><li>Bottom padding 16 when the footer and Action Bar are absent;</li><li>min-width: 0 — the card is a grid child.</li></ul>'
      + '<b>Header:</b>'
      + '<ul><li>Height: card-header-min-height to card-header-max-height;</li><li>Padding: 16/16/8;</li><li>Radius: 8 8 0 0;</li><li>Slots: left and right, split by space-between;</li><li>Slot height: 24 to 40;</li><li>Slot gap: 8;</li><li>Left slot: lead + Headline H8 with Subscription; content replaces the stack;</li><li>Right slot: actions, aligned to the end;</li><li>Title color: text-tertiary; subtitle color: text-secondary;</li><li>The title and subtitle truncate with an ellipsis.</li></ul>'
      + '<b>Slots:</b>'
      + '<ul><li>Content slot: padding 8/16/0, gap 8, Body L in text-tertiary; the card adds 16 below, with Action Bar the slot adds 8;</li><li>Content slot as the first child: top padding 16;</li><li>Media: inside the content slot, 16px gap to the text block;</li><li>Content stack: Title L in text-tertiary + Subscription, gap 8, one-line truncation;</li><li>Alert slot: is-alert, padding 0/16, the items pin to the start;</li><li>Stat slot: is-stat, padding 0/16/16, the card adds no bottom field, the value is H4 in text-primary;</li><li>List slot: is-list, with Action Bar the bottom padding is 16;</li><li>Action Bar: a direct child of the card, carries its own padding and border;</li><li>Footer: padding 8/16, top border.</li></ul>'
      + '<b>States:</b>'
      + '<ul><li>is-interactive: the Selectable style on hover, focus ring on keyboard;</li><li>is-selected: primary border, Hover-blue shadow (three layers of primary-hover);</li><li>bordered: a border in the border-soft color, no shadow at rest; hover and selection use the Selectable style;</li><li>is-disabled: the header and content texts in the border color, no pointer events.</li></ul>'
      + '<b>Layout:</b>'
      + '<ul><li>Cards go into Grid System. The column minimum is card-min-width: 320 on wide screens, 280 on narrow.</li></ul>'
      + '<b>Reuse:</b>'
      + '<ul><li>The kebab menu is Popover + Context Menu;</li><li>Action Bar goes in through the actionBar slot.</li></ul>',
      '<b>Контейнер:</b>'
      + '<ul><li>Фон: background;</li><li>Radius: 8;</li><li>Тень: Shadow-S (0 2 8 shadow-overlay);</li><li>Gap между слотами: 0 — ритм несут поля слотов;</li><li>Нижнее поле 16 при отсутствии футера и Action Bar;</li><li>min-width: 0 — карточка живёт ребёнком грида.</li></ul>'
      + '<b>Шапка:</b>'
      + '<ul><li>Высота: от card-header-min-height до card-header-max-height;</li><li>Padding: 16/16/8;</li><li>Radius: 8 8 0 0;</li><li>Слоты: левый и правый, разведены space-between;</li><li>Высота слота: от 24 до 40;</li><li>Gap слота: 8;</li><li>Левый слот: лид + Headline H8 с Subscription; content заменяет стек;</li><li>Правый слот: действия, прижаты к концу;</li><li>Цвет заголовка: text-tertiary; цвет подписи: text-secondary;</li><li>Заголовок и подпись сокращаются многоточием.</li></ul>'
      + '<b>Слоты:</b>'
      + '<ul><li>Слот контента: padding 8/16/0, gap 8, Body L цветом text-tertiary; снизу 16 несёт карточка, при Action Bar слот добирает 8;</li><li>Слот контента первым ребёнком: верхнее поле 16;</li><li>Медиа: внутри слота контента, gap 16 до текстового блока;</li><li>Стек контента: Title L цветом text-tertiary + Subscription, gap 8, трункейт в одну строку;</li><li>Слот уведомления: is-alert, padding 0/16, элементы прижаты к началу;</li><li>Слот метрики: is-stat, padding 0/16/16, карточка нижнего поля не добавляет, значение — H4 цветом text-primary;</li><li>Слот списков: is-list, при Action Bar нижнее поле 16;</li><li>Action Bar: прямой ребёнок карточки, поля и бордер несёт сам;</li><li>Footer: padding 8/16, верхняя граница.</li></ul>'
      + '<b>Состояния:</b>'
      + '<ul><li>is-interactive: стиль Selectable на ховере, фокус-кольцо с клавиатуры;</li><li>is-selected: рамка primary, тень Hover-blue (три слоя primary-hover);</li><li>bordered: рамка цветом border-soft, в покое без тени; ховер и выбор — стиль Selectable;</li><li>is-disabled: тексты шапки и контента цветом border, без pointer events.</li></ul>'
      + '<b>Раскладка:</b>'
      + '<ul><li>Карточки кладут в Grid System. Минимум колонки — card-min-width: 320 на широких экранах, 280 на узких.</li></ul>'
      + '<b>Переиспользование:</b>'
      + '<ul><li>Kebab-меню — Popover + Context Menu;</li><li>Action Bar подключается через слот actionBar.</li></ul>'
    )),
    sections: [
      {
        title: sbT('Card Header', 'Шапка карточки'),
        desc: sbT(
          'The header alone, without a card around it. Two slots split by space-between. The left slot holds the lead — an icon, an avatar, a status dot or a checkbox — and the headline stack: a Headline H8 title with a Subscription line. The right slot holds an action: a kebab menu, a Text Badge, a button or a toggle. The title and subtitle truncate. The header is a part of Cards and has no page of its own.',
          'Шапка отдельно, без карточки вокруг. Два слота, разведённые space-between. Левый несёт лид — иконку, аватар, статус-точку или чекбокс — и стек заголовка: Headline H8 с подписью Subscription. Правый слот несёт действие: kebab-меню, Text Badge, кнопку или тогл. Заголовок и подпись сокращаются. Шапка входит в состав Cards и собственной страницы не имеет.'
        ),
        preview: HEADERS,
        html: `<!-- sbMkCardHeader({ lead, title, subtitle, right }) -->
<div class="sb-card-header">
  <span class="sb-card-header-left">
    <span class="sb-card-header-lead"><!-- иконка / аватар / статус / чекбокс --></span>
    <span class="sb-card-header-stack">
      <span class="sb-card-title sb-h8">Card Title</span>
      <span class="sb-card-subtitle sb-sub">Supporting Line</span>
    </span>
  </span>
  <span class="sb-card-header-right"><!-- kebab / кнопка / badge --></span>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Default Content Card', 'Карточка контента'),
        desc: sbT(
          'The base composition: the header, a content slot, an optional Action Bar. With Action Bar the card carries no bottom padding; without it the card closes with a 16px field. The content slot takes any DS component or plain text. The media option puts Placeholder or an image into the content slot: the media and the text split with a 16px gap. The media card carries the Title L and Subscription stack in the content slot above the text, with or without the header.',
          'Базовая композиция: шапка, слот контента, необязательный Action Bar. С Action Bar карточка не несёт нижнего поля; без него закрывается полем 16px. Слот контента принимает любой компонент DS или текст. Параметр media кладёт в слот контента Placeholder или изображение: медиа и текст разделены gap 16. Медиа-карточка несёт стек Title L и Subscription в слоте контента над текстом — и с шапкой, и без неё.'
        ),
        preview: DEFAULT_CONTENT,
        html: `<!-- sbMkCard({ header, body, actionBar }) -->
<div class="sb-card">
  <div class="sb-card-header"><!-- sbMkCardHeader({ lead, title, subtitle, right }) --></div>
  <div class="sb-card-body">
    <span class="sb-body-l">Please add your content here.</span>
  </div>
  <!-- sbMkActionBar({ align: 'center', buttons: [...] }) — прямой ребёнок карточки -->
</div>

<!-- sbMkCard({ header?, media, title, subtitle, body }) — медиа-вариант:
     стек Title L + Subscription живёт в контент-слоте над текстом -->
<div class="sb-card has-media">
  <div class="sb-card-header"><!-- sbMkCardHeader(...) — необязательна --></div>
  <div class="sb-card-body has-media">
    <!-- sbMkPlaceholder({ shape: 'landscape' }) или <img> -->
    <div class="sb-card-text">
      <div class="sb-card-text-stack">
        <span class="sb-card-text-title sb-title-l">Title</span>
        <span class="sb-card-subtitle sb-sub">Subscription</span>
      </div>
      <span class="sb-body-l">Please add your content here.</span>
    </div>
  </div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Stat and Metrics Card', 'Карточка метрики'),
        desc: sbT(
          'A metric. The header carries the caption in the content slot and Text Badge on the right. The value is Headline H4 in the is-stat content slot, a Subscription line goes below. The Status Bar variant waits for the Status Bar component.',
          'Метрика. Шапка несёт кэпшен в слоте content и Text Badge справа. Значение — Headline H4 в слоте контента is-stat, ниже — строка Subscription. Вариант со Status Bar ждёт компонент Status Bar.'
        ),
        preview: STATS,
        html: `<!-- sbMkCard({ header: sbMkCardHeader({ content, right }), bodyCls: 'is-stat', body }) -->
<div class="sb-card">
  <div class="sb-card-header">
    <span class="sb-card-header-left">
      <span class="sb-caption">Custom Info</span>
    </span>
    <span class="sb-card-header-right"><!-- sbMkBadgeText({ label: 'Default' }) --></span>
  </div>
  <div class="sb-card-body is-stat">
    <span class="sb-card-stat">
      <span class="sb-card-stat-value sb-h4">99.9 %</span>
    </span>
    <span class="sb-card-subtitle sb-sub">Subscription</span>
  </div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Alert Card', 'Карточка уведомления'),
        desc: sbT(
          'A name, a status, data and actions — fits hardware entities. The header carries the Headline and, on the right, a Text Badge with the level and a notification icon. The content is Body L in text-secondary; a date goes inline in text-tertiary.',
          'Имя, статус, данные и действия — подходит для железа. Шапка несёт Headline и справа Text Badge с уровнем и иконку уведомления. Контент — Body L цветом text-secondary; дата — вставка цветом text-tertiary.'
        ),
        preview: ALERTS,
        html: `<!-- sbMkCard({ header: sbMkCardHeader({ title, right }), bodyCls: 'is-alert', body }) -->
<div class="sb-card">
  <div class="sb-card-header">
    <span class="sb-card-header-left">
      <span class="sb-card-header-stack">
        <span class="sb-card-title sb-h8">Headline</span>
      </span>
    </span>
    <span class="sb-card-header-right">
      <!-- sbMkBadgeText({ label: 'Alert', variant: 'error' }) + sbIcon('notification-3-line', 'M') -->
    </span>
  </div>
  <div class="sb-card-body is-alert">
    <span class="sb-body-l" style="color:var(--text-secondary)">Please add your content here. Keep it short and simple <span style="color:var(--text-tertiary)">Jun 1, 2026</span></span>
  </div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Selectable Card', 'Выбираемая карточка'),
        desc: sbT(
          'Selection instead of a link. The lead slot takes Checkbox, the whole card is the click target. Hover and the selected state share one style: a primary border and the Hover-blue shadow, the background stays. The disabled state paints the header and content texts in the border color; the consumer sets the grey badge and the disabled checkbox.',
          'Выбор вместо перехода. В лид-слоте — Checkbox, кликабельна вся плашка. Ховер и выбранное состояние делят один стиль: рамка primary и тень Hover-blue, фон не меняется. Недоступное состояние красит тексты шапки и контента цветом border; серый бейдж и погашенный чекбокс ставит потребитель.'
        ),
        preview: SELECTABLE,
        html: `<div class="sb-card is-interactive is-selected" role="button" tabindex="0">
  <div class="sb-card-header">
    <span class="sb-card-header-left">
      <span class="sb-card-header-lead"><!-- sbMkCheckbox({ checked: true }) --></span>
      <span class="sb-card-header-stack">
        <span class="sb-card-title sb-h8">Headline</span>
        <span class="sb-card-subtitle sb-sub">Subscription</span>
      </span>
    </span>
    <span class="sb-card-header-right"><!-- sbMkBadgeText({ label: 'Default' }) --></span>
  </div>
  <div class="sb-card-body"><span class="sb-body-l">Please add your content here.</span></div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Bordered Card', 'Карточка с рамкой'),
        desc: sbT(
          'A border instead of a shadow — for dense card stacks, where shadows blur together. The base border takes the border-soft color, the resting state carries no shadow. On an interactive card hover and selection use the Selectable style: a primary border and the Hover-blue shadow.',
          'Рамка вместо тени — для плотных стопок карточек, где тени сливаются. Базовая рамка — цветом border-soft, в покое тени нет. У кликабельной карточки ховер и выбор — стиль Selectable: рамка primary и тень Hover-blue.'
        ),
        preview: BORDERED,
        html: `<!-- sbMkCard({ border: true, header, body }) -->
<div class="sb-card bordered">
  <div class="sb-card-header"><!-- sbMkCardHeader({ title, subtitle, right }) --></div>
  <div class="sb-card-body"><span class="sb-body-l">Please add your content here.</span></div>
</div>

<!-- sbMkCard({ border: true, interactive: true, header, body }) -->
<div class="sb-card bordered is-interactive" role="button" tabindex="0">
  <div class="sb-card-header"><!-- sbMkCardHeader({ title, subtitle, right }) --></div>
  <div class="sb-card-body"><span class="sb-body-l">Please add your content here.</span></div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('Notification Card', 'Карточка уведомления об обновлении'),
        desc: sbT(
          'A release announcement: a name, a date, a status badge and component links. Use to describe updates shortly. The container is the Bordered card; the header carries a Mark in the lead slot (an unread signal), a Title M headline, a Subscription date and a Text Badge; the content slot (is-alert) holds Body L text and a row of Link buttons. The buttons lead to component pages.',
          'Анонс релиза: имя, дата, статус-бейдж и ссылки на компоненты. Служит короткому описанию обновлений. Контейнер — Bordered-карточка; шапка несёт Mark в лид-слоте (сигнал непрочитанного), заголовок Title M, дату Subscription и Text Badge; слот контента (is-alert) — текст Body L и ряд Link-кнопок. Кнопки ведут на страницы компонентов.'
        ),
        preview: NOTIFICATION,
        html: `<!-- sbMkCard({ border: true, interactive: true,
     header: sbMkCardHeader({ lead: sbMkMark({ variant: 'success' }), titleCls: 'sb-title-m', title, subtitle, right: sbMkBadgeText({ label: 'New', variant: 'success' }) }),
     bodyCls: 'is-alert', body }) -->
<div class="sb-card bordered is-interactive" role="button" tabindex="0">
  <div class="sb-card-header">
    <span class="sb-card-header-left">
      <span class="sb-card-header-lead"><span class="sb-mark success"></span></span>
      <span class="sb-card-header-stack">
        <span class="sb-card-title sb-title-m">New 1.14.0 Version Updates</span>
        <span class="sb-card-subtitle sb-sub">September 3, 2026</span>
      </span>
    </span>
    <span class="sb-card-header-right"><span class="sb-badge sb-badge-success">New</span></span>
  </div>
  <div class="sb-card-body is-alert">
    <span class="sb-body-l">Discover the latest updates in our design system.</span>
    <!-- sbMkFlex({ gapX: 's', wrap: true, content: sbMkButton({ label, variant: 'link', href }) + ... }) -->
    <div>${sbMkButton({ label: 'Cards', variant: 'link', href: '#cards' })} ${sbMkButton({ label: 'Table', variant: 'link', href: '#table' })}</div>
  </div>
</div>`,
        css: COMP_CSS.cards,
      },
      {
        title: sbT('List Card', 'Карточка списка'),
        desc: sbT(
          'A wide card with lists — Property List first of all. The content slot (is-list) holds a Head cell, a plain list and a Framed list, split by an 8px gap. With Action Bar the slot closes with a 16px field, so the frame does not touch the bar.',
          'Широкая карточка со списками — прежде всего Property List. Слот контента (is-list) несёт Head-ячейку, обычный список и Framed-список с интервалом 8. С Action Bar слот закрывается полем 16 — рама не касается бара.'
        ),
        preview: LISTS,
        html: `<!-- sbMkCard({ header, bodyCls: 'is-list', body, actionBar }) -->
<div class="sb-card">
  <div class="sb-card-header">
    <span class="sb-card-header-left">
      <span class="sb-card-header-stack">
        <span class="sb-card-title sb-h8">Property List</span>
      </span>
    </span>
    <span class="sb-card-header-right"><!-- sbMkBadgeText({ label: 'Default' }) --></span>
  </div>
  <div class="sb-card-body is-list">
    <!-- sbMkPropertyCell({ head: true, icon, label: 'Time', value: '…' }) -->
    <!-- sbMkPropertyList({ items: [...] }) -->
    <!-- sbMkPropertyList({ framed: true, items: [...] }) -->
  </div>
  <!-- sbMkActionBar({ align: 'center', buttons: [...] }) — необязателен -->
</div>`,
        css: COMP_CSS.cards,
      },
    ],
  });
})();
