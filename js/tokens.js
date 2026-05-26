// ═══════════════════════════════════════════════════════════════════════════
//  COLOR TOKENS — SINGLE SOURCE OF TRUTH
//
//  Меняй значения цветов только здесь. При загрузке автоматически
//  инжектится <style id="sb-color-vars"> с переменными для dark/light темы.
//  Этот же массив используется на странице Getting Started для отрисовки палитры.
//
//  Загружается В <head> САМЫМ ПЕРВЫМ (после скрипта темы) — до всех CSS <link>,
//  чтобы к моменту первого paint переменные уже были определены.
// ═══════════════════════════════════════════════════════════════════════════

window.COLOR_TOKENS = [
  { label: 'Brand', tokens: [
    { name: '--primary',       light: '#017BFF',             dark: '#0A84FF' },
    { name: '--secondary',     light: '#295AA3',             dark: '#4A9EFF' },
    { name: '--tertiary',      light: '#13273F',             dark: '#1C3A5C' },
  ]},
  { label: 'Background', tokens: [
    { name: '--background',   light: '#FFFFFF',             dark: '#0D1117' },
    { name: '--surface-1',    light: '#F5F6F7',             dark: '#141C29' },
    { name: '--surface-2',       light: '#E7EAEF',             dark: '#0F151E' },
  ]},
  { label: 'Text', tokens: [
    { name: '--text-primary',   light: '#1F222C',  dark: '#F0F2F5' },
    { name: '--text-secondary', light: '#8798AD',  dark: '#8899AA' },
    { name: '--text-muted',     light: '#556579',  dark: '#5A6B7F' },
    { name: '--text-tertiary',  light: '#313D53',  dark: '#6885AA' },
  ]},
  { label: 'Border', tokens: [
    { name: '--border',        light: '#BFC5D2',             dark: '#2A3545' },
    { name: '--border-soft',   light: '#E7EBF1',             dark: '#263141' },
  ]},
  { label: 'Status', tokens: [
    { name: '--error',  light: '#EF0C0F',             dark: '#E5484D' },
    { name: '--warning',light: '#FFC107',             dark: '#FFC107' },
    { name: '--alert',  light: '#FF7300',             dark: '#FF8B3E' },
    { name: '--success',light: '#04C40C',             dark: '#3FC241' },
    { name: '--info',   light: '#017BFF',             dark: '#2B8FFF' },
  ]},
  { label: 'Hover', tokens: [
    { name: '--primary-hover', light: 'rgba(1,123,245,0.1)', dark: 'rgba(10,132,255,0.1)' },
    { name: '--error-hover',   light: 'rgba(239,11,16,0.1)', dark: 'rgba(229,72,77,0.05)' },
    { name: '--success-hover', light: 'rgba(4,196,12,0.1)',  dark: 'rgba(63,194,65,0.25)' },
    { name: '--alert-hover',   light: 'rgba(255,115,0,0.1)', dark: 'rgba(255,139,62,0.1)' },
    { name: '--warning-hover', light: 'rgba(255,193,7,0.1)', dark: 'rgba(255,193,7,0.1)' },
  ]},
  { label: 'Shadows', tokens: [
    { name: '--shadow-sm',     light: 'rgba(0,0,0,0.08)',          dark: 'rgba(0,0,0,0.2)' },
    { name: '--shadow-md',     light: 'rgba(0,0,0,0.16)',          dark: 'rgba(0,0,0,0.35)' },
    { name: '--shadow-lg',     light: 'rgba(255,255,255,0.55)',    dark: 'rgba(20,28,41,0.25)' },
    { name: '--shadow-overlay',light: 'rgba(135,152,173,0.3)',     dark: 'rgba(20,28,41,0.5)' },
  ]},
];

// Inject CSS variables into <head> — runs once on load
(function() {
  var dark = '[data-theme="dark"] {\n', light = '[data-theme="light"] {\n';
  window.COLOR_TOKENS.forEach(function(g) {
    g.tokens.forEach(function(t) {
      dark  += '  ' + t.name + ': ' + t.dark  + ';\n';
      light += '  ' + t.name + ': ' + t.light + ';\n';
    });
  });
  var el = document.createElement('style');
  el.id = 'sb-color-vars';
  el.textContent = dark + '}\n' + light + '}\n';
  document.head.appendChild(el);
})();
