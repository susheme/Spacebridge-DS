// ═══════════════════════════════════════════════════════════════════════════
//  INIT — renderPage(id) + init()
//  Загружается последним, после всех компонентов.
// ═══════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════
//  ZONE F: RENDER & INIT
// ═══════════════════════════════════════
function renderPage(id) {
  _exBoxId = 0;
  Object.keys(_exBoxInitial).forEach(k => delete _exBoxInitial[k]);
  const content = document.getElementById('content');
  try {
    if (SB_REGISTRY[id]) {
      content.innerHTML = renderComponentPage(id);
      if (SB_REGISTRY[id].playground) SB_PG.render(id);
      if (SB_REGISTRY[id].onMount) SB_REGISTRY[id].onMount();
    } else {
      let label = id;
      NAV.forEach(g => g.items.forEach(i => { if (i.id === id) label = i.label; }));
      content.innerHTML = comingSoonPage(label);
    }
  } catch(e) {
    console.error(`renderPage("${id}") failed:`, e);
    content.innerHTML = `<div class="page fade-in"><p class="sb-mono" style="color:var(--error);padding:24px">${e.message}</p></div>`;
  }
  content.scrollTop = 0;
  setupToc();
}

// Настраивает sticky Table of Contents для текущей страницы. Вызывается
// каждый renderPage. Cleanup'ит старые listener'ы/observer'ы (старые
// DOM-узлы уже стёрлись через innerHTML), пересоздаёт под новые элементы.
//   - scroll listener (rAF-throttled) — active state с edge cases:
//     scrollTop=0 → первая, скролл в самый низ → последняя.
//   - ResizeObserver — show/hide TOC по факту наличия скролла.
//   - click handler — scrollTo(target.offsetTop - 24) для отступа от верха.
const TOC_CLICK_OFFSET = 24;
function setupToc() {
  const content = document.getElementById('content');
  if (!content) return;

  // Cleanup предыдущих привязок (страница переключилась).
  if (window.__tocOnScroll) {
    content.removeEventListener('scroll', window.__tocOnScroll);
    window.__tocOnScroll = null;
  }
  if (window.__tocRo) { window.__tocRo.disconnect(); window.__tocRo = null; }

  const toc = content.querySelector('.page-toc');
  if (!toc) return;

  const tocLinks = Array.from(toc.querySelectorAll('.sb-toc-item'));
  const sections = Array.from(content.querySelectorAll('.comp-section[id]'));
  if (!sections.length) return;

  // 1) Active state — rAF-throttled scroll listener.
  // Trigger-line: 32px от верха .content + 25% высоты viewport'а.
  // Активной считается ПОСЛЕДНЯЯ секция, чей top уже выше этой линии.
  // На edge'ах (самый верх / самый низ) — первая / последняя принудительно,
  // т.к. в этих позициях секция может физически не доходить до trigger-line.
  const setActive = (id) => {
    tocLinks.forEach(a =>
      a.classList.toggle('is-active', a.dataset.tocTarget === id)
    );
  };
  const updateActive = () => {
    const scrollTop = content.scrollTop;
    const ch = content.clientHeight;
    const sh = content.scrollHeight;
    if (scrollTop + ch >= sh - 4) {
      setActive(sections[sections.length - 1].id);
      return;
    }
    if (scrollTop <= 4) {
      setActive(sections[0].id);
      return;
    }
    const cr = content.getBoundingClientRect();
    const trigger = 32 + ch * 0.25;
    let active = sections[0];
    for (const sec of sections) {
      const secTop = sec.getBoundingClientRect().top - cr.top;
      if (secTop <= trigger) active = sec;
      else break;
    }
    setActive(active.id);
  };
  let rafPending = false;
  window.__tocOnScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      updateActive();
    });
  };
  content.addEventListener('scroll', window.__tocOnScroll, { passive: true });
  updateActive();

  // 2) Click — smooth scroll с отступом 24px от верха .content.
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('.sb-toc-item');
    if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.dataset.tocTarget);
    if (!target) return;
    const cr = content.getBoundingClientRect();
    const targetTop = target.getBoundingClientRect().top - cr.top + content.scrollTop - TOC_CLICK_OFFSET;
    content.scrollTo({ top: targetTop, behavior: 'smooth' });
  });

  // 3) Visibility — TOC скрывается, если страница не скроллится.
  const updateVis = () => {
    const hasScroll = content.scrollHeight > content.clientHeight + 1;
    toc.style.display = hasScroll ? '' : 'none';
  };
  window.__tocRo = new ResizeObserver(updateVis);
  window.__tocRo.observe(content);
  const page = content.querySelector('.page');
  if (page) window.__tocRo.observe(page);
  updateVis();
}

function init() {
  renderSidebar();
  const id = location.hash.slice(1) || 'getting-started';
  renderPage(id);
}

init();
