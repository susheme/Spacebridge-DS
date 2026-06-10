// ═══════════════════════════════════════════════════════════════════════════
//  CORE — NAV, icons, helpers, sidebar/theme/routing, registry, SB_PG
//  Загружается первым. Глобалы видны остальным скриптам через shared scope.
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════
//  ZONE A: CORE (NAV, Icons, Sidebar, Theme, Routing)
// ═══════════════════════════════════════
const NAV = [
  { category: null, items: [
    { id: 'getting-started', label: 'Getting Started', inProgress: true },
  ]},
  { category: 'Layout', items: [
    { id: 'grid-system', label: 'Grid System' },
    { id: 'separators', label: 'Separators', ready: true },
    { id: 'tool-bar', label: 'Tool Bar', inProgress: true },
  ]},
  { category: 'Navigation', items: [
    { id: 'section-header', label: 'Header Section', ready: true },
    { id: 'header-xs', label: 'Header XS', ready: true },
    { id: 'header-s', label: 'Header S', incomplete: true },
    { id: 'header-m', label: 'Header M', incomplete: true },
    { id: 'header-l', label: 'Header L', incomplete: true },
    { id: 'side-navigation', label: 'Side Navigation' },
    { id: 'breadcrumbs', label: 'Breadcrumbs', ready: true },
    { id: 'tab-bar', label: 'Tab Bar', inProgress: true },
    { id: 'segment-menu', label: 'Segment Menu', inProgress: true },
    { id: 'toc', label: 'Sticky Table of Contents', ready: true },
    { id: 'pagination', label: 'Pagination', inProgress: true },
    { id: 'bottom-bars', label: 'Bottom Bars' },
    { id: 'nav-bar', label: 'Nav Bar', ready: true },
    { id: 'sub-nav', label: 'Sub Nav', inProgress: true },
  ]},
  { category: 'Data Display', items: [
    { id: 'table', label: 'Table', inProgress: true },
    { id: 'table-footer', label: 'Table Footer', inProgress: true },
    { id: 'list', label: 'List', ready: true },
    { id: 'context-menu', label: 'Context Menu', incomplete: true },
    { id: 'cards', label: 'Cards' },
    { id: 'badge', label: 'Badge', ready: true },
    { id: 'avatar', label: 'Avatar', ready: true },
    { id: 'status', label: 'Status', ready: true },
    { id: 'led-panel', label: 'LED Panel', inProgress: true },
    { id: 'counters', label: 'Counters', ready: true },
    { id: 'tags', label: 'Tags', ready: true },
  ]},
  { category: 'Forms', items: [
    { id: 'buttons', label: 'Buttons', ready: true },
    { id: 'chevron', label: 'Chevron Button', ready: true },
    { id: 'input', label: 'Input', ready: true },
    { id: 'textarea', label: 'Textarea', ready: true },
    { id: 'password', label: 'Password Input', ready: true },
    { id: 'search-bar', label: 'Search Bar', ready: true, done: true },
    { id: 'selectors', label: 'Selectors / Dropdowns', ready: true },
    { id: 'chips', label: 'Chips' },
    { id: 'toggles', label: 'Toggles', ready: true },
    { id: 'checkbox', label: 'Checkbox', ready: true },
    { id: 'radio', label: 'Radio', ready: true, done: true },
    { id: 'sliders', label: 'Sliders' },
    { id: 'file-uploader', label: 'File Uploader' },
  ]},
  { category: 'Feedback', items: [
    { id: 'notifications', label: 'Notifications', inProgress: true },
    { id: 'toast', label: 'Toast' },
    { id: 'dialogues', label: 'Dialogues / Modals' },
    { id: 'loaders', label: 'Loaders' },
    { id: 'pop-ups', label: 'Pop-Ups' },
  ]},
  { category: 'Utility', items: [
    { id: 'icons', label: 'Icons' },
    { id: 'tooltips', label: 'Tooltips' },
    { id: 'kbd', label: 'Keyboard Shortcut', ready: true },
  ]},
];

const ICON_PATHS = {
  'code-s-slash-line': 'M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12ZM9.78845 21H7.66009L14.2116 3H16.3399L9.78845 21Z',
  'file-copy-line': 'M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z',
  'loop-left-line': 'M12 4C9.25144 4 6.82508 5.38626 5.38443 7.5H8V9.5H2V3.5H4V5.99936C5.82381 3.57166 8.72764 2 12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4ZM4 12C4 16.4183 7.58172 20 12 20C14.7486 20 17.1749 18.6137 18.6156 16.5H16V14.5H22V20.5H20V18.0006C18.1762 20.4283 15.2724 22 12 22C6.47715 22 2 17.5228 2 12H4Z',
  'radar-line': 'M12.5065 3.6232L11.4835 5.39495C8.57378 4.51623 5.96968 4.94525 5.07207 6.49995C3.89477 8.53909 5.86239 12.1523 9.75027 14.397C13.6382 16.6417 17.7512 16.5391 18.9285 14.4999C19.8261 12.9452 18.8956 10.4755 16.6797 8.39495L17.7026 6.6232C20.7847 9.33189 22.1654 12.8933 20.6605 15.4999C18.8003 18.722 13.4717 18.855 8.75027 16.1291C4.0289 13.4032 1.47976 8.72202 3.34002 5.49995C4.84492 2.89338 8.61964 2.30843 12.5065 3.6232ZM15.8842 1.77271L17.6163 2.7727L12.6163 11.4329L10.8842 10.4329L15.8842 1.77271ZM6.73233 19.9999H17.0003V21.9999H5.01761C4.94008 22.0013 4.86194 21.9937 4.78481 21.9767C4.77025 21.9734 4.7558 21.9699 4.74147 21.9661C4.6589 21.9439 4.57784 21.9107 4.50028 21.8659C4.47106 21.8491 4.44301 21.8309 4.41616 21.8117C4.30161 21.7291 4.20524 21.6229 4.1342 21.5002C4.06328 21.3771 4.01939 21.2403 4.00518 21.0996C4.00446 21.0923 4.00381 21.0849 4.00325 21.0776C3.98786 20.8829 4.02924 20.6818 4.13425 20.4999L6.38425 16.6028L8.1163 17.6028L6.73233 19.9999Z',
  'arrow-drop-down-line': 'M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z',
  'add-line': 'M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z',
  'sun-line': 'M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z',
  'moon-fill': 'M11.3807 2.01904C9.91573 3.38786 9 5.33708 9 7.50017C9 11.6423 12.3579 15.0002 16.5 15.0002C18.6631 15.0002 20.6123 14.0845 21.9811 12.6195C21.6613 17.8539 17.3149 22.0002 12 22.0002C6.47715 22.0002 2 17.523 2 12.0002C2 6.68532 6.14629 2.33887 11.3807 2.01904Z',
  'download-2-line': 'M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z',
  'user-line': 'M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z',
  'building-2-line': 'M3 19V5.70046C3 5.27995 3.26307 4.90437 3.65826 4.76067L13.3291 1.24398C13.5886 1.14961 13.8755 1.28349 13.9699 1.54301C13.9898 1.59778 14 1.65561 14 1.71388V6.6667L20.3162 8.77211C20.7246 8.90822 21 9.29036 21 9.72079V19H23V21H1V19H3ZM5 19H12V3.85543L5 6.40089V19ZM19 19V10.4416L14 8.77488V19H19Z',
  'arrow-down-s-line':  'M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z',
  'arrow-drop-left-line':  'M9 12L13.2426 7.75732L14.6569 9.17154L11.8284 12L14.6569 14.8284L13.2426 16.2426L9 12Z',
  'arrow-drop-right-line': 'M15 12L10.7574 16.2426L9.34315 14.8284L12.1716 12L9.34315 9.17157L10.7574 7.75736L15 12Z',
  'arrow-up-s-fill':       'M12 8L18 14H6L12 8Z',
  'arrow-down-s-fill':     'M12 16L6 10H18L12 16Z',
  'gemini-fill': 'M12 2C17.5222 2 22 5.97778 22 10.8889C22 13.9556 19.5111 16.4444 16.4444 16.4444H14.4778C13.5556 16.4444 12.8111 17.1889 12.8111 18.1111C12.8111 18.5333 12.9778 18.9222 13.2333 19.2111C13.5 19.5111 13.6667 19.9 13.6667 20.3333C13.6667 21.2556 12.9 22 12 22C6.47778 22 2 17.5222 2 12C2 6.47778 6.47778 2 12 2ZM10.8111 18.1111C10.8111 16.0843 12.451 14.4444 14.4778 14.4444H16.4444C18.4065 14.4444 20 12.851 20 10.8889C20 7.1392 16.4677 4 12 4C7.58235 4 4 7.58235 4 12C4 16.19 7.2226 19.6285 11.324 19.9718C10.9948 19.4168 10.8111 18.7761 10.8111 18.1111ZM7.5 12C6.67157 12 6 11.3284 6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12ZM16.5 12C15.6716 12 15 11.3284 15 10.5C15 9.67157 15.6716 9 16.5 9C17.3284 9 18 9.67157 18 10.5C18 11.3284 17.3284 12 16.5 12ZM12 9C11.1716 9 10.5 8.32843 10.5 7.5C10.5 6.67157 11.1716 6 12 6C12.8284 6 13.5 6.67157 13.5 7.5C13.5 8.32843 12.8284 9 12 9Z',
  'lock-2-line': 'M6 8V7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7V8H20C20.5523 8 21 8.44772 21 9V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V9C3 8.44772 3.44772 8 4 8H6ZM19 10H5V20H19V10ZM11 15.7324C10.4022 15.3866 10 14.7403 10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 14.7403 13.5978 15.3866 13 15.7324V18H11V15.7324ZM8 8H16V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V8Z',
  'arrow-up-s-line':    'M11.9999 9.8284L7.0502 14.7782L5.63599 13.364L11.9999 7L18.3639 13.364L16.9497 14.7782L11.9999 9.8284Z',
  'arrow-left-s-line':  'M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z',
  'arrow-right-s-line': 'M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z',
  'notification-3-line': 'M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z',
  'notification-3-fill': 'M20 17H22V19H2V17H4V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V17ZM9 21H15V23H9V21Z',
  'menu-line': 'M3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15Z',
  'side-bar-line': 'M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM8 5H4V19H8V5ZM10 5V19H20V5H10Z',
  'search-line': 'M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z',
  'eye-line': 'M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z',
  'eye-close-line': 'M9.34268 18.7819L7.41083 18.2642L8.1983 15.3254C7.00919 14.8874 5.91661 14.2498 4.96116 13.4534L2.80783 15.6067L1.39362 14.1925L3.54695 12.0392C2.35581 10.6103 1.52014 8.87466 1.17578 6.96818L3.14386 6.61035C3.90289 10.8126 7.57931 14.0001 12.0002 14.0001C16.4211 14.0001 20.0976 10.8126 20.8566 6.61035L22.8247 6.96818C22.4803 8.87466 21.6446 10.6103 20.4535 12.0392L22.6068 14.1925L21.1926 15.6067L19.0393 13.4534C18.0838 14.2498 16.9912 14.8874 15.8021 15.3254L16.5896 18.2642L14.6578 18.7819L13.87 15.8418C13.2623 15.9459 12.6376 16.0001 12.0002 16.0001C11.3629 16.0001 10.7381 15.9459 10.1305 15.8418L9.34268 18.7819Z',
  'close-circle-fill': 'M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 7.29289C17.0976 7.68342 17.0976 8.31658 16.7071 8.70711L13.4142 12L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12 13.4142L8.70711 16.7071C8.31658 17.0976 7.68342 17.0976 7.29289 16.7071C6.90237 16.3166 6.90237 15.6834 7.29289 15.2929L10.5858 12L7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289C7.68342 6.90237 8.31658 6.90237 8.70711 7.29289L12 10.5858L15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289Z',
  'close-line': 'M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z',
  'more-2-line': 'M12 3C13.1046 3 14 3.89543 14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3ZM12 17C13.1046 17 14 17.8954 14 19C14 20.1046 13.1046 21 12 21C10.8954 21 10 20.1046 10 19C10 17.8954 10.8954 17 12 17ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z',
  'check-line': 'M10 15.172L19.192 5.98L20.607 7.394L10 18L3.636 11.636L5.05 10.222L10 15.172Z',
  'mail-line': 'M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z',
  'phone-line': 'M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z',
};

// Не-иконочные SVG-глифы компонентов (stroke-based, специфичные пути).
// Используются где sbIcon() не подходит (stroke vs fill).
const SB_GLYPHS = {
  check:        `<svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  checkDisabled:`<svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="var(--text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  minus:        `<svg width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M1 1H9" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  search:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  clear:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

function boolAttr(name, cond) { return cond ? ` ${name}` : ''; }
function mlBoolAttr(name, cond) { return cond ? `\n    ${name}` : ''; }

// Размеры: 'L' → 24, 'M'/'S' → 16, либо любое число (px)
function iconPx(size) { return typeof size === 'number' ? size : (size === 'L' ? 24 : 16); }
function sbIcon(name, size = 'L') {
  const d = ICON_PATHS[name];
  const s = iconPx(size);
  if (!d) return `<span class="sb-icon-wrap" style="width:${s}px;height:${s}px;display:inline-block;"></span>`;
  return `<span class="sb-icon-wrap"><svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" style="display:block;"><path d="${d}"/></svg></span>`;
}

// Bare SVG без sb-icon-wrap обёртки — для genCode (копируемые примеры без sb-* CSS)
function sbIconRaw(name, size = 'L') {
  const d = ICON_PATHS[name];
  const s = iconPx(size);
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor"><path d="${d}"/></svg>`;
}

function esc(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// Slugify для якорей секций. Латиница + кириллица → kebab-case.
// Используется в renderComponentPage для генерации id="sec-..." на .comp-section.
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function renderSidebar() {
  const sb = document.getElementById('sidebar');

  // Сохраняем текущий search-query, чтобы при re-render (по navigate)
  // не потерять введённое.
  const prevInput = document.getElementById('navSearchInput');
  const prevQuery = prevInput ? prevInput.value : '';

  // Sticky search-плашка наверху сайдбара. Использует наш .sb-search
  // в icon-left варианте + KBS-подсказку ⌘+K в right-slot. Никаких
  // ручных полу-разметок — всё через sbMkSearch / sbMkKbdGroup.
  let html = `<div class="sidebar-search">
    ${sbMkSearch({
      iconLeft: true,
      placeholder: 'Search components',
      inputId: 'navSearchInput',
      rightSlot: sbMkKbdGroup(['⌘','K']),
    })}
  </div>
  <div class="sidebar-empty"><span class="sb-body-m">Nothing found</span></div>`;

  NAV.forEach(group => {
    html += `<div class="sidebar-section" data-category="${group.category || ''}">`;
    if (group.category) {
      html += sbMkSectionHeader({
        slotLeft: `<span class="sb-caption">${group.category}</span>`,
        slotRight: false,
      });
    }
    group.items.forEach(item => {
      const active = (location.hash === '#' + item.id) || (!location.hash && item.id === 'getting-started');
      const dotCls = item.ready ? '' : item.inProgress ? 'in-progress' : item.incomplete ? 'incomplete' : 'coming';
      const badge = item.inProgress
        ? ' <span class="sb-badge sb-badge-alert">In Progress</span>'
        : item.incomplete
          ? ' <span class="sb-badge sb-badge-primary">Incomplete</span>'
          : '';
      html += `<div class="sidebar-item sb-title-s${active ? ' active' : ''}" data-page="${item.id}" data-search="${item.label.toLowerCase()}" onclick="navigate('${item.id}')">
        <span class="dot ${dotCls}"></span>
        <span class="sidebar-item-label" data-label="${item.label}">${item.label}</span>${badge}
      </div>`;
    });
    html += '</div>';
  });
  sb.innerHTML = html;

  // Восстанавливаем search-state и подключаем live-фильтр.
  const input = document.getElementById('navSearchInput');
  if (input) {
    input.value = prevQuery;
    input.addEventListener('input', e => filterNav(e.target.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        input.value = '';
        filterNav('');
        input.blur();
      }
    });
    if (prevQuery) filterNav(prevQuery);
  }
}

// Live-фильтр пунктов NAV. Категория без матчей скрывается целиком.
// Подсветка совпавшей подстроки — bold через <mark class="nav-hl">.
function filterNav(query) {
  const q = (query || '').trim().toLowerCase();
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  let anyMatch = false;

  sb.querySelectorAll('.sidebar-section').forEach(sec => {
    let sectionMatch = false;
    sec.querySelectorAll('.sidebar-item').forEach(item => {
      const haystack = item.dataset.search || '';
      const match = !q || haystack.includes(q);
      item.style.display = match ? '' : 'none';
      if (match) { sectionMatch = true; anyMatch = true; }

      // Highlight matched substring в лейбле.
      const labelEl = item.querySelector('.sidebar-item-label');
      if (labelEl) {
        const orig = labelEl.dataset.label || '';
        if (q && orig.toLowerCase().includes(q)) {
          const i = orig.toLowerCase().indexOf(q);
          labelEl.innerHTML = esc(orig.slice(0, i))
            + '<mark class="nav-hl">' + esc(orig.slice(i, i + q.length)) + '</mark>'
            + esc(orig.slice(i + q.length));
        } else {
          labelEl.textContent = orig;
        }
      }
    });
    sec.style.display = sectionMatch ? '' : 'none';
  });

  const empty = sb.querySelector('.sidebar-empty');
  if (empty) empty.classList.toggle('visible', q && !anyMatch);
}

// Глобальные хоткеи: «/» и «cmd/ctrl+K» фокусят NAV-поиск.
// Биндимся один раз глобально (renderSidebar вызывается многократно).
if (!window.__navHotkeyBound) {
  window.__navHotkeyBound = true;
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const isTyping = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    const isCmdK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
    const isSlash = e.key === '/' && !isTyping;
    if (isCmdK || isSlash) {
      e.preventDefault();
      const i = document.getElementById('navSearchInput');
      if (i) { i.focus(); i.select(); }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const t = document.documentElement.getAttribute('data-theme');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = sbIcon(t === 'dark' ? 'moon-fill' : 'sun-line');
});

function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  const nextIcon = isDark ? 'sun-line' : 'moon-fill';
  const inClass  = isDark ? 'anim-sun' : 'anim-moon';

  const outClass = isDark ? 'anim-out-moon' : 'anim-out-sun';
  btn.classList.remove('anim-sun', 'anim-moon', 'anim-out-sun', 'anim-out-moon');
  btn.classList.add(outClass);

  setTimeout(() => {
    const nextTheme = isDark ? 'light' : 'dark';
    // Вырубаем transition у всего на момент переключения, чтобы не было мигания
    html.classList.add('theme-switching');
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('sb-theme', nextTheme);
    btn.innerHTML = sbIcon(nextIcon);
    btn.classList.remove(outClass);
    btn.classList.add(inClass);
    // Снимаем блокировку transition после того как браузер применил новые цвета
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('theme-switching')));
    setTimeout(() => btn.classList.remove(inClass), 400);
  }, 200);
}

function navigate(id) {
  location.hash = id;
  renderSidebar();
  renderPage(id);
}

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1) || 'getting-started';
  renderSidebar();
  renderPage(id);
});



// ═══════════════════════════════════════
//  ZONE C: COMPONENT REGISTRY
// ═══════════════════════════════════════
const SB_REGISTRY = {};

/**
 * sbRegister(config) — регистрация компонента дизайн-системы.
 *
 * Обязательные:
 *   name        — уникальный id (совпадает с NAV id)
 *   title       — отображаемое название
 *   description — описание компонента
 *   sections    — массив секций [{ title, desc?, preview, html, css, col?, interactive? }]
 *
 * Опциональные:
 *   playground  — { title, state, controls(api), render(state,api), genCode(state),
 *                   extraPreview?(state,api), onControlChange?(key,val,state),
 *                   syncControls?(state,container) }
 *   renderPage  — function(), полностью кастомный рендер страницы
 *   onMount     — function(), вызывается после вставки HTML в DOM
 */
function sbRegister(config) {
  const required = ['name', 'title', 'description'];
  for (const key of required) {
    if (!config[key]) console.error(`SBComponent "${config.name || '?'}": missing "${key}"`);
  }
  if (!config.sections && !config.playground && !config.renderPage) {
    console.error(`SBComponent "${config.name}": needs sections, playground, or renderPage`);
  }
  if (config.sections) {
    config.sections.forEach((sec, i) => {
      if (!sec.html) console.warn(`SBComponent "${config.name}" section[${i}] "${sec.title}": missing html`);
      if (!sec.css)  console.warn(`SBComponent "${config.name}" section[${i}] "${sec.title}": missing css`);
    });
  }
  if (config.playground) {
    SB_PG.register(config.name, config.playground);
  }
  SB_REGISTRY[config.name] = config;
}

function renderComponentPage(name) {
  const comp = SB_REGISTRY[name];
  if (!comp) return comingSoonPage(name);

  // Полностью кастомная страница (например table)
  if (comp.renderPage) return comp.renderPage();

  // Якоря секций для TOC. Каждый .comp-section получает id, по которому:
  //   1) IntersectionObserver в init.js trackает active state;
  //   2) клик по TOC-ссылке скроллит к ней через scrollIntoView.
  const tocItems = [];

  // Page-level breadcrumbs: Design System › Category › Component.
  // sbBuildPageBreadcrumbs живёт в breadcrumbs.js; ' ' fallback если
  // компонент ещё не загружен. inline margin-bottom — page-context spacing.
  const bcHtml = (typeof sbBuildPageBreadcrumbs === 'function') ? sbBuildPageBreadcrumbs(name) : '';
  const bcBlock = bcHtml ? `<div style="margin-bottom: var(--pad-vert-16)">${bcHtml}</div>` : '';

  // Стандартная сборка: breadcrumbs + заголовок + playground? + sections
  let pageHTML = `<div class="page fade-in">
    ${bcBlock}
    <h1 class="page-title sb-h4">${comp.title}</h1>
    <p class="page-desc sb-body-l">${comp.description}</p>`;

  if (comp.playground) {
    const id = 'sec-playground';
    tocItems.push({ id, label: 'Playground' });
    pageHTML += `<div class="comp-section" id="${id}">${SB_PG.buildHTML(name)}</div>`;
  }

  (comp.sections || []).forEach((sec, i) => {
    const baseId = `sec-${slugify(sec.title) || `${i}`}`;
    // Защита от коллизий: если slug уже занят (повторяющиеся title) — суффикс.
    let id = baseId;
    let n = 1;
    while (tocItems.some(t => t.id === id)) id = `${baseId}-${++n}`;
    tocItems.push({ id, label: sec.title });
    pageHTML += `<div class="comp-section" id="${id}">
      <h2 class="comp-title sb-title-l">${sec.title}</h2>
      ${sec.desc ? `<p class="comp-desc sb-body-m">${sec.desc}</p>` : ''}
      ${exampleBox(sec.preview, sec.html, sec.css, { col: sec.col, interactive: sec.interactive, footer: sec.footer })}
    </div>`;
  });

  pageHTML += '</div>';

  // TOC показываем только на страницах с 3+ якорями. Opt-out флаг noToc:true
  // в sbRegister — для широких компонентов (Nav Bar / Top Bar / Side Nav),
  // где TOC съедает ~260px ширины и playground не помещается в реальных размерах.
  // Остальные рендерим как раньше, без .page-shell обёртки.
  const showToc = !comp.noToc && tocItems.length >= 3 && typeof sbMkToc === 'function';
  if (showToc) {
    return `<div class="page-shell">${pageHTML}<aside class="page-toc">${sbMkToc(tocItems)}</aside></div>`;
  }
  return pageHTML;
}

function comingSoonPage(id) {
  // id может быть как реальным id из NAV, так и произвольной строкой.
  // Ищем NAV-label чтобы вывести человеческое имя вместо raw "side-navigation".
  let label = id;
  for (const sec of NAV) {
    const found = (sec.items || []).find(it => it.id === id);
    if (found) { label = found.label; break; }
  }
  const bcHtml = (typeof sbBuildPageBreadcrumbs === 'function') ? sbBuildPageBreadcrumbs(id) : '';
  const bcBlock = bcHtml ? `<div style="margin-bottom: var(--pad-vert-16)">${bcHtml}</div>` : '';
  return `<div class="page fade-in">
    ${bcBlock}
    <h1 class="page-title sb-h4">${label}</h1>
    <div class="coming-soon">
      <div class="coming-soon-icon">&#128752;</div>
      <h3 class="sb-title-l">Coming Soon</h3>
      <p class="sb-body-m">This component is being designed. Check back for updates.</p>
    </div>
  </div>`;
}


// ═══════════════════════════════════════
//  ZONE D: PLAYGROUND SYSTEM (SB_PG)
// ═══════════════════════════════════════
const SB_PG = {
  _states: {},
  _inits: {},
  _configs: {},
  _codeOpen: {},
  // Per-name ResizeObserver'ы для авто-детекта wide-mode (см. _autoDetectWide).
  _resizeObservers: {},

  register(name, pgConfig) {
    this._configs[name] = pgConfig;
    this._inits[name] = JSON.parse(JSON.stringify(pgConfig.state));
    this._states[name] = JSON.parse(JSON.stringify(pgConfig.state));
    this._codeOpen[name] = false;
  },

  state(name) { return this._states[name]; },

  set(name, key, value) {
    const s = this._states[name];
    const cfg = this._configs[name];
    s[key] = value;
    // Auto-reset keys that require this key when it's turned off
    if (!value) {
      const container = document.getElementById(`pg-${name}-controls`);
      if (container) {
        container.querySelectorAll(`[data-pg-requires="${key}"]`).forEach(wrap => {
          const depKey = wrap.getAttribute('data-pg-ctrl');
          if (depKey && depKey in s) s[depKey] = false;
        });
      }
    }
    if (cfg.onControlChange) cfg.onControlChange(key, value, s);
    this.render(name);
  },

  render(name) {
    const cfg = this._configs[name];
    const s = this._states[name];
    if (!cfg) return;

    const previewEl = document.getElementById(`pg-${name}-preview`);

    // Перед innerHTML-replace снимаем scrollLeft/Top у элементов с
    // [data-pg-preserve-scroll]. После replace'а восстанавливаем по индексу.
    // Нужно для playground'ов с горизонтальным/вертикальным скроллом превью
    // (Nav Bar wide stage), чтобы scroll не сбрасывался при каждом toggle.
    const scrollSnap = [];
    if (previewEl) {
      previewEl.querySelectorAll('[data-pg-preserve-scroll]').forEach(el => {
        scrollSnap.push({ left: el.scrollLeft, top: el.scrollTop });
      });
    }

    if (previewEl) previewEl.innerHTML = cfg.render(s, this._api(name));

    if (previewEl && scrollSnap.length) {
      previewEl.querySelectorAll('[data-pg-preserve-scroll]').forEach((el, i) => {
        if (scrollSnap[i]) {
          el.scrollLeft = scrollSnap[i].left;
          el.scrollTop  = scrollSnap[i].top;
        }
      });
    }

    const extrasEl = document.getElementById(`pg-${name}-extras`);
    if (extrasEl) extrasEl.innerHTML = cfg.extraPreview ? cfg.extraPreview(s, this._api(name)) : '';

    this._syncControls(name);
    if (this._codeOpen[name]) this._fillCode(name);

    // Авто-детект wide-mode: если контент превью переполняет preview-box
    // в narrow layout — переключаем .pg-card в wide. cfg.wide: true остаётся
    // force-флагом (всегда wide, observer не нужен).
    this._autoDetectWide(name);
  },

  // ResizeObserver-based авто wide-mode. Триггеры (любой):
  // 1) scrollWidth контента > clientWidth narrow preview-box'а → overflow.
  //    Ловит hard-width контейнеры (Header XS `width:360px` без max-width:100%).
  // 2) cfg.minPreview задан и clientWidth narrow preview-box'а < minPreview →
  //    компонент опт-инит «мне нужно минимум N px чтобы не выглядеть кримся».
  //    Используется для playground'ов с `max-width:100%` wrapper'ами
  //    (Tab Bar, Search Bar — там max-width маскирует overflow, контент
  //    схлопывается визуально, но scrollWidth ≈ clientWidth).
  // Anti-flap: при замере временно снимаем .wide-auto, читаем narrow-метрики,
  // решаем, ставить ли обратно. measuring-флаг защищает от RO-loop'а.
  // cfg.wide:true — force, observer не вешаем.
  _autoDetectWide(name) {
    const cfg = this._configs[name];
    if (!cfg || cfg.wide) return;
    const previewEl = document.getElementById(`pg-${name}-preview`);
    if (!previewEl) return;
    const cardEl = previewEl.closest('.pg-card');
    const previewBox = previewEl.parentElement;
    if (!cardEl || !previewBox) return;

    if (this._resizeObservers[name]) {
      this._resizeObservers[name].disconnect();
    }

    const minPreview = cfg.minPreview || 0;

    // В narrow-mode pg-controls фиксированный 320px + 2px separator +
    // 24px padding с каждой стороны pg-preview = 370px overhead. Остаток
    // от cardEl.clientWidth — реально доступная ширина preview-box'а.
    // previewBox.clientWidth НЕ подходит для замера: при overflow он
    // распирается контентом и показывает post-overflow размер, а не
    // реальное место.
    const NARROW_OVERHEAD = 320 + 2 + 24 + 24;
    let measuring = false;
    const measure = () => {
      if (measuring) return;
      measuring = true;
      const wasAuto = cardEl.classList.contains('wide-auto');
      if (wasAuto) cardEl.classList.remove('wide-auto');
      const cardW = cardEl.clientWidth;
      const narrowPreviewAvail = cardW - NARROW_OVERHEAD;
      const contentW = previewEl.scrollWidth;
      const overflow = contentW > narrowPreviewAvail + 1;
      const tooNarrow = minPreview > 0 && narrowPreviewAvail < minPreview;
      if (overflow || tooNarrow) cardEl.classList.add('wide-auto');
      requestAnimationFrame(() => { measuring = false; });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(previewBox);
    ro.observe(cardEl);
    this._resizeObservers[name] = ro;
    // Double-RAF: первый RAF гарантирует что innerHTML обработан, второй —
    // что layout settle'нулся. Single-RAF иногда возвращает clientWidth=0
    // на свежесмонтированном content'е.
    requestAnimationFrame(() => requestAnimationFrame(measure));
  },

  reset(name) {
    this._states[name] = JSON.parse(JSON.stringify(this._inits[name]));
    this._codeOpen[name] = false;
    const panel = document.getElementById(`pg-${name}-code-panel`);
    const btn = document.getElementById(`pg-${name}-showcode-btn`);
    if (panel) panel.classList.remove('open');
    if (btn) btn.classList.remove('is-active');
    this.render(name);
  },

  toggleCode(name) {
    this._codeOpen[name] = !this._codeOpen[name];
    const panel = document.getElementById(`pg-${name}-code-panel`);
    const btn = document.getElementById(`pg-${name}-showcode-btn`);
    if (panel) panel.classList.toggle('open', this._codeOpen[name]);
    if (btn) btn.classList.toggle('is-active', this._codeOpen[name]);
    if (this._codeOpen[name]) this._fillCode(name);
  },

  copySection(name, type) {
    const cfg = this._configs[name];
    const s = this._states[name];
    const { html, css } = cfg.genCode(s);
    const text = type === 'html' ? html : css;
    navigator.clipboard.writeText(text).then(() => {
      const idx = type === 'html' ? 'first-child' : 'last-child';
      const copyBtn = document.querySelector(`#pg-${name}-code-panel .pg-code-section:${idx} .pg-code-copy-btn`);
      if (copyBtn) { copyBtn.style.color = 'var(--success)'; setTimeout(() => copyBtn.style.color = '', 1200); }
    });
  },

  buildHTML(name) {
    const cfg = this._configs[name];
    const s = this._states[name];
    const api = this._api(name);
    return `<div class="pg-card${cfg.wide ? ' wide' : ''}">
      <div class="pg-header"><h2 class="pg-title sb-h7">${cfg.title}</h2></div>
      <div class="sb-sep sep-h sep-s"></div>
      <div class="pg-body">
        <div class="pg-controls" id="pg-${name}-controls">${cfg.controls(api)}</div>
        <div class="sb-sep sep-v sep-s pg-body-sep"></div>
        <div class="pg-preview">
          <div class="pg-preview-box">
            <div id="pg-${name}-preview">${cfg.render(s, api)}</div>
            <div id="pg-${name}-extras">${cfg.extraPreview ? cfg.extraPreview(s, api) : ''}</div>
          </div>
        </div>
      </div>
      <div class="sb-sep sep-h sep-s"></div>
      <div class="pg-footer">
        <button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm"
                onclick="SB_PG.reset('${name}')" title="Reset">${sbIcon('loop-left-line','L')}</button>
        <div class="pg-footer-right">
          <button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm"
                  id="pg-${name}-showcode-btn"
                  onclick="SB_PG.toggleCode('${name}')" title="Show/Hide Code">${sbIcon('code-s-slash-line','L')}</button>
        </div>
      </div>
      <div class="pg-code-panel" id="pg-${name}-code-panel">
        <div class="pg-code-grid">
          <div class="pg-code-section">
            <div class="pg-code-header">
              <span class="pg-code-label sb-caption">HTML</span>
              <button class="pg-code-copy-btn" onclick="SB_PG.copySection('${name}','html')" title="Copy HTML">${sbIcon('file-copy-line','L')}</button>
            </div>
            <div class="pg-code-scroll"><pre id="pg-${name}-code-html"></pre></div>
          </div>
          <div class="pg-code-section">
            <div class="pg-code-header">
              <span class="pg-code-label sb-caption">CSS</span>
              <button class="pg-code-copy-btn" onclick="SB_PG.copySection('${name}','css')" title="Copy CSS">${sbIcon('file-copy-line','L')}</button>
            </div>
            <div class="pg-code-scroll"><pre id="pg-${name}-code-css"></pre></div>
          </div>
        </div>
      </div>
    </div>`;
  },

  _api(name) {
    return {
      name,
      toggle: (key, label, opts = {}) => `<label class="sb-toggle-wrap tgl-ctrl-wrap" data-pg-ctrl="${key}"${opts.requires ? ` data-pg-requires="${opts.requires}"` : ''}>
        <span class="sb-toggle">
          <input type="checkbox" data-pg-key="${key}" onchange="SB_PG.set('${name}','${key}',this.checked)">
          <span class="sb-toggle-track"></span>
          <span class="sb-toggle-thumb"></span>
        </span>
        <span class="sb-toggle-label-text">${label}</span>
      </label>`,
      select: (key, options, opts2 = {}) => {
        const { label } = opts2;
        const state = SB_PG._states[name] || {};
        const currentVal = state[key];
        const currentOpt = options.find(o => o.value === currentVal) || options[0];
        const opts = options.map(o =>
          `<option value="${o.value}"${o.value === currentOpt?.value ? ' selected' : ''}>${o.label}</option>`
        ).join('');
        const selectMarkup = `<div class="pg-sel-wrap">
          <select class="pg-sel-native" data-pg-ctrl="${key}" onchange="SB_PG.set('${name}','${key}',this.value); this.closest('.pg-sel-wrap').querySelector('.sb-sel-val').textContent = this.options[this.selectedIndex].text;">
            ${opts}
          </select>
          <div class="sb-sel">
            <span class="sb-sel-val">${currentOpt?.label ?? ''}</span>
            <div class="sb-sel-right"><div class="sb-chevron">${sbIcon('arrow-down-s-line','L')}</div></div>
          </div>
        </div>`;
        if (label) {
          return `<div class="sb-field">
            <span class="sb-field-label">${label}</span>
            ${selectMarkup}
          </div>`;
        }
        return selectMarkup;
      },
    };
  },

  _syncControls(name) {
    const s = this._states[name];
    const container = document.getElementById(`pg-${name}-controls`);
    if (!container) return;
    container.querySelectorAll('[data-pg-key]').forEach(cb => {
      const key = cb.getAttribute('data-pg-key');
      if (key in s) cb.checked = !!s[key];
    });
    container.querySelectorAll('select[data-pg-ctrl]').forEach(sel => {
      const key = sel.getAttribute('data-pg-ctrl');
      if (key in s) sel.value = s[key];
      // Синхронизируем видимую DS-разметку (.sb-sel-val) с нативным select
      const wrap = sel.closest('.pg-sel-wrap');
      const val = wrap && wrap.querySelector('.sb-sel-val');
      if (val && sel.options[sel.selectedIndex]) val.textContent = sel.options[sel.selectedIndex].text;
    });
    container.querySelectorAll('[data-pg-requires]').forEach(wrap => {
      const req = wrap.getAttribute('data-pg-requires');
      const disabled = !s[req];
      const cb = wrap.querySelector('input[type="checkbox"]');
      if (cb) cb.disabled = disabled;
      wrap.style.opacity = disabled ? '0.35' : '';
      wrap.style.pointerEvents = disabled ? 'none' : '';
    });
    const cfg = this._configs[name];
    if (cfg.syncControls) cfg.syncControls(s, container);
  },

  _fillCode(name) {
    const cfg = this._configs[name];
    const s = this._states[name];
    const { html, css } = cfg.genCode(s);
    const preHtml = document.getElementById(`pg-${name}-code-html`);
    const preCss = document.getElementById(`pg-${name}-code-css`);
    if (preHtml) preHtml.textContent = html;
    if (preCss) preCss.textContent = css;
  },
};


// ═══════════════════════════════════════
//  COMP_CSS: CSS-snippets для code panels. Каждый компонент в components/*.js
//  сам добавляет свой ключ: window.COMP_CSS.<name> = '...';
//  Это зеркало css/components/<name>.css — обновлять оба места синхронно.
// ═══════════════════════════════════════
window.COMP_CSS = {};
