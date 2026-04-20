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
}

function init() {
  renderSidebar();
  const id = location.hash.slice(1) || 'getting-started';
  renderPage(id);
}

init();
