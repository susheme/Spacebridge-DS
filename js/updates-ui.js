// ═══════════════════════════════════════════════════════════════════════════
//  UPDATES UI — рендер ленты обновлений
//  Документационный слой (не DS-компонент), пара к js/updates.js (данные).
//  Колокольчик в Nav Bar открывает Side Panel в Overlay; карточки ленты —
//  Notification Card из SB_UPDATES. Всё собирается фабриками DS в рантайме,
//  поэтому load order не важен — файл лишь должен грузиться после updates.js.
//
//  Правила прочитанности (js/updates.js):
//    открытие панели  → MarkSeen  → колокольчик line, попап не показывается;
//    клик по ссылке   → MarkRead  → Mark и бейдж New у записи гаснут.
// ═══════════════════════════════════════════════════════════════════════════

(() => {
  const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTHS_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  // '2026-08-04' → sbT('August 4, 2026', '4 августа 2026')
  function fmtDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return sbT(`${MONTHS_EN[m - 1]} ${d}, ${y}`, `${d} ${MONTHS_RU[m - 1]} ${y}`);
  }

  // Лейбл ссылки — из NAV: единственное место, где живут человеческие имена
  // компонентов. Записи с id вне NAV показывают сам id.
  function navLabel(id) {
    const item = NAV.flatMap(sbNavItems).find(i => i.id === id);
    return item ? item.label : id;
  }

  function updateCard(u) {
    const unread = !sbUpdatesIsRead(u.id);
    const links = u.components.map(id => sbMkButton({
      label: navLabel(id), variant: 'link', href: '#' + id,
      attrs: ` onclick="sbUpdatesLinkClick('${u.id}')"`,
    })).join('');
    return sbMkCard({
      border: true,
      interactive: true,
      header: sbMkCardHeader({
        lead: unread ? sbMkMark({ variant: 'success' }) : '',
        titleCls: 'sb-title-m',
        title: sbT(u.title.en, u.title.ru),
        subtitle: fmtDate(u.date),
        right: unread ? sbMkBadgeText({ label: 'New', variant: 'success' }) : '',
      }),
      bodyCls: 'is-alert',
      body: `<span class="sb-body-l">${sbT(u.text.en, u.text.ru)}</span>`
        + (links ? sbMkFlex({ gapX: 's', gapY: 's', wrap: true, content: links }) : ''),
      attrs: ` data-update-id="${u.id}"`,
    });
  }

  function feedHtml() {
    return SB_UPDATES.map(updateCard).join('');
  }

  function panelHtml() {
    return sbMkOverlay({
      id: 'updatesOverlay',
      cls: 'sb-updates-overlay',
      content: sbMkSidePanel({
        header: sbMkHeaderS({
          title: 'Notifications',
          topRight: true,
          slotRight: sbMkButton({ icon: 'close-line', iconSize: 'S', size: 's',
            attrs: ' aria-label="Close" onclick="sbUpdatesClose()"' }),
          tabs: sbMkSearch({ inputId: 'updatesSearchInput' }),
        }),
        content: feedHtml(),
      }),
    });
  }

  // Поиск — фильтр карточек по видимому тексту (заголовок, дата, текст,
  // ссылки обоих языков).
  function bindSearch(ov) {
    const input = ov.querySelector('#updatesSearchInput');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      ov.querySelectorAll('[data-update-id]').forEach(card => {
        card.style.display = !q || card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  window.sbUpdatesOpen = function () {
    let ov = document.getElementById('updatesOverlay');
    if (!ov) {
      const tmp = document.createElement('div');
      tmp.innerHTML = panelHtml();
      ov = tmp.firstElementChild;
      document.body.appendChild(ov);
      bindSearch(ov);
      // Форс-рефлоу: is-open ставится синхронно, и без фиксации стартового
      // transform первый показ прошёл бы без въезда справа.
      void ov.offsetWidth;
    } else {
      // Read-статусы могли измениться — пересобираем ленту.
      ov.querySelector('.sb-side-panel-content').innerHTML = feedHtml();
    }
    sbOverlayOpen(ov);
    sbUpdatesMarkSeen();
    sbUpdatesBellRefresh();
  };

  window.sbUpdatesClose = function () {
    const ov = document.getElementById('updatesOverlay');
    if (ov) sbOverlayClose(ov);
  };

  // Переход по ссылке: запись прочитана, панель закрывается — иначе она
  // накрывает открытую страницу компонента.
  window.sbUpdatesLinkClick = function (id) {
    sbUpdatesMarkRead(id);
    sbUpdatesClose();
  };

  // Колокольчик: fill при непросмотренном, line после открытия панели.
  // Пересобирает кнопку фабрикой — так иконка и атрибуты не расходятся
  // с инжектом в index.html.
  window.sbUpdatesBellRefresh = function () {
    const btn = document.getElementById('updatesBellBtn');
    if (!btn) return;
    const unseen = sbUpdatesHasUnseen();
    const tmp = document.createElement('div');
    tmp.innerHTML = sbMkButton({
      icon: unseen ? 'notification-3-fill' : 'notification-3-line',
      attrs: ' id="updatesBellBtn" title="Updates" onclick="sbUpdatesOpen()"',
    });
    btn.replaceWith(tmp.firstElementChild);
  };
})();
