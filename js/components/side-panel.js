// ═══════════════════════════════════════════════════════════════════════════
//  SIDE PANEL
//  CSS в css/components/side-panel.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Плавающая панель «хедер + скролл-зона» — дом ленты обновлений DS
//  (открывается колокольчиком в Nav Bar). Своего контента нет: хедер —
//  готовый Header S (заголовок + close, Search Bar в суб-слоте), контент —
//  стопка Notification Card.
//
//  Зависимости (все грузятся раньше в index.html):
//    Header S, Search Bar, Buttons, Cards, Badge, Status (Mark).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS['side-panel'] = `.sb-side-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: var(--side-nav-min-max-width);
  min-width: var(--side-nav-min-max-width);
  max-width: var(--side-nav-min-max-width);
  min-height: var(--side-nav-min-height);
  max-height: var(--side-nav-max-height);
  gap: var(--gap-vert-m);
  border-radius: var(--radius-16);
  background: var(--background);
  box-shadow: 0 10px 20px 0 var(--shadow-overlay);
}
.sb-side-panel > .sb-header-s { flex-shrink: 0; border-radius: var(--radius-16) var(--radius-16) var(--radius-0) var(--radius-0); min-width: 0; }
.sb-side-panel > .sb-header-s .sb-header-s-tabs { min-width: 0; }
.sb-side-panel > .sb-header-s .sb-header-s-tabs .sb-search { width: 100%; }
.sb-side-panel-content { display: flex; flex-direction: column; align-items: flex-start; align-self: stretch; gap: var(--gap-vert-s); padding: var(--pad-vert-0) var(--pad-horiz-16) var(--pad-vert-16); border-radius: var(--radius-0); flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.sb-overlay.sb-updates-overlay { justify-content: flex-end; align-items: flex-start; }
.sb-overlay.sb-updates-overlay .sb-side-panel { min-height: min(var(--side-nav-min-height), calc(100vh - 32px)); max-height: calc(100vh - 32px); transform: translateX(calc(100% + 32px)); transition: transform 0.2s ease; }
.sb-overlay.sb-updates-overlay.is-open .sb-side-panel { transform: translateX(0); }`;

// --- SIDE PANEL ---
(() => {
  /**
   * sbMkSidePanel(opts) — панель «хедер + скролл-зона».
   *   header  — готовый sbMkHeaderS; не скроллится, контент уходит под него
   *   content — наполнение скролл-зоны (стопка Notification Card)
   *   cls / attrs — доп. классы и сырые атрибуты потребителя
   */
  function mkSidePanel(opts = {}) {
    const { header = '', content = '', cls = '', attrs = '' } = opts;
    let c = 'sb-side-panel';
    if (cls) c += ' ' + cls;
    return `<div class="${c}"${attrs ? ' ' + attrs : ''}>`
      + header
      + `<div class="sb-side-panel-content">${content}</div>`
      + `</div>`;
  }
  window.sbMkSidePanel = mkSidePanel;

  // ── Демо: лента уведомлений со скриншота 04.09 ────────────────────────
  function noteCard({ mark, title, date, badge, badgeVariant, text, links = [] }) {
    return sbMkCard({
      border: true,
      interactive: true,
      header: sbMkCardHeader({
        lead: mark ? sbMkMark({ variant: mark }) : '',
        titleCls: 'sb-title-m',
        title,
        subtitle: date,
        right: badge ? sbMkBadgeText({ label: badge, variant: badgeVariant }) : '',
      }),
      bodyCls: 'is-alert',
      body: `<span class="sb-body-l">${text}</span>`
        + (links.length
          ? sbMkFlex({ gapX: 's', gapY: 's', wrap: true, content:
              links.map(l => sbMkButton({ label: l.label, variant: 'link', href: '#' + l.id })).join('') })
          : ''),
    });
  }

  function demoHeader() {
    return sbMkHeaderS({
      title: 'Notifications',
      topRight: true,
      slotRight: sbMkButton({ icon: 'close-line', iconSize: 'S', size: 's', attrs: ' aria-label="Close"' }),
      tabs: sbMkSearch({}),
    });
  }

  function demoPanel() {
    return mkSidePanel({
      header: demoHeader(),
      // Витринная фиксация высоты — чтобы скролл был виден на странице.
      attrs: ' style="height: var(--side-nav-min-height)"',
      content: [
        noteCard({
          mark: 'success', title: 'New 1.14.0 Version Updates', date: 'September 4, 2026',
          badge: 'New', badgeVariant: 'success',
          text: 'Discover the latest updates in our design system, featuring enhanced components and improved accessibility.',
          links: [{ label: 'Cards', id: 'cards' }, { label: 'Table', id: 'table' }, { label: 'Context Menu', id: 'context-menu' }],
        }),
        noteCard({
          mark: 'success', title: 'Side Bar Updates', date: 'September 3, 2026',
          badge: 'New', badgeVariant: 'success',
          text: 'The Side Bar component has been updated with new features. These improvements enhance usability and functionality.',
          links: [{ label: 'Side Bar', id: 'side-navigation' }],
        }),
        noteCard({
          mark: 'error', title: 'Server Failed', date: 'September 2, 2026',
          badge: 'Alarm', badgeVariant: 'error',
          text: 'The server experienced a failure this morning.',
        }),
        noteCard({
          title: 'Pagination', date: 'September 1, 2026',
          text: 'We’ve introduced a new Pagination component that simplifies navigation through large sets of data.',
          links: [{ label: 'Pagination', id: 'pagination' }],
        }),
      ].join(''),
    });
  }

  sbRegister({
    name: 'side-panel',
    title: 'Side Panel',
    description: sbT(
      'A floating panel: a fixed header and a scrollable content zone. Hosts the DS update feed opened by the Nav Bar bell. The header is Header S with a close button and Search Bar in the sub slot; the content is a stack of Notification Cards that scrolls under the header. Width is fixed at 320 (the Side Navigation token), height runs 720 to 2000.',
      'Плавающая панель: неподвижный хедер и скроллящаяся зона контента. Дом ленты обновлений DS, открывается колокольчиком в Nav Bar. Хедер — Header S с кнопкой close и Search Bar в суб-слоте; контент — стопка Notification Card, уходит под хедер при скролле. Ширина фиксирована — 320 (токен Side Navigation), высота — от 720 до 2000.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Container</b>'
      + '<ul><li>Width: side-nav-min-max-width (320), fixed;</li><li>Height: side-nav-min-height (720) to side-nav-max-height (2000);</li><li>Radius: 16;</li><li>Background: background;</li><li>Shadow: Shadow-L (0 10 20 shadow-overlay);</li><li>Gap between the header and the content: 16.</li></ul>'
      + '<b>Slots</b>'
      + '<ul><li>Header: Header S, does not scroll, repeats the top radius 16 16 0 0;</li><li>Content zone: padding 0/16/16, gap 8, overflow-y auto, min-height 0.</li></ul>'
      + '<b>API</b>'
      + '<ul><li><code>sbMkSidePanel({ header, content, cls, attrs })</code>.</li></ul>',
      '<b>Контейнер</b>'
      + '<ul><li>Ширина: side-nav-min-max-width (320), фиксирована;</li><li>Высота: от side-nav-min-height (720) до side-nav-max-height (2000);</li><li>Radius: 16;</li><li>Фон: background;</li><li>Тень: Shadow-L (0 10 20 shadow-overlay);</li><li>Gap между хедером и контентом: 16.</li></ul>'
      + '<b>Слоты</b>'
      + '<ul><li>Хедер: Header S, не скроллится, повторяет верхний радиус 16 16 0 0;</li><li>Зона контента: padding 0/16/16, gap 8, overflow-y auto, min-height 0.</li></ul>'
      + '<b>API</b>'
      + '<ul><li><code>sbMkSidePanel({ header, content, cls, attrs })</code>.</li></ul>'
    )),
    sections: [
      {
        title: sbT('Notifications Panel', 'Панель уведомлений'),
        desc: sbT(
          'The full composition: Header S with a close button and Search Bar, a stack of Notification Cards in the scroll zone. The Mark in the card lead slot signals an unread entry: success for a release, error for an alarm; a read entry carries no Mark. The content scrolls under the header.',
          'Полная композиция: Header S с кнопкой close и Search Bar, стопка Notification Card в скролл-зоне. Mark в лид-слоте карточки означает непрочитанную запись: success у релиза, error у аларма; прочитанная запись Mark не несёт. Контент скроллится под хедером.'
        ),
        get preview() { return demoPanel(); },
        html: `<!-- sbMkSidePanel({
     header: sbMkHeaderS({ title: 'Notifications', slotRight: closeButton, tabs: sbMkSearch({}) }),
     content: notificationCards }) -->
<div class="sb-side-panel">
  <div class="sb-header-s"><!-- sbMkHeaderS(...) --></div>
  <div class="sb-side-panel-content">
    <!-- sbMkCard({ border: true, interactive: true,
         header: sbMkCardHeader({ lead: sbMkMark({ variant: 'success' }), titleCls: 'sb-title-m', title, subtitle, right }),
         bodyCls: 'is-alert', body }) -->
  </div>
</div>`,
        css: COMP_CSS['side-panel'],
      },
    ],
  });
})();
