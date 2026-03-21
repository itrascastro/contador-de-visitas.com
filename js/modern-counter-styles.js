export const COUNTER_STYLES = [
  {
    id: 'split',
    name: 'Split',
    description: 'Flip counter contemporaneo con cajas por digito.',
    defaultTheme: 'light',
    sampleCount: 42019,
    defaults: { bg: null, color: null, radius: 22 }
  },
  {
    id: 'score',
    name: 'Score',
    description: 'Marcador potente pensado para destacar.',
    defaultTheme: 'dark',
    sampleCount: 90812,
    defaults: { bg: null, color: null, radius: 18 }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Estetica consola con glow digital.',
    defaultTheme: 'dark',
    sampleCount: 31337,
    defaults: { bg: null, color: null, radius: 18 }
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Digitos con resplandor neon luminoso.',
    defaultTheme: 'dark',
    sampleCount: 77777,
    defaults: { bg: null, color: null, radius: 16 }
  },
  {
    id: 'lcd',
    name: 'LCD',
    description: 'Display de 7 segmentos estilo calculadora.',
    defaultTheme: 'dark',
    sampleCount: 12345,
    defaults: { bg: null, color: null, radius: 8 }
  },
  {
    id: 'nixie',
    name: 'Nixie',
    description: 'Tubos luminosos anaranjados con aire retro.',
    defaultTheme: 'dark',
    sampleCount: 86031,
    defaults: { bg: null, color: null, radius: 20 }
  },
  {
    id: 'odometer',
    name: 'Odometer',
    description: 'Cuentakilometros mecanico con efecto rodillo.',
    defaultTheme: 'dark',
    sampleCount: 88042,
    defaults: { bg: null, color: null, radius: 20 }
  },
  {
    id: 'dots',
    name: 'Dot Matrix',
    description: 'Display LED de puntos estilo aeropuerto.',
    defaultTheme: 'dark',
    sampleCount: 60210,
    defaults: { bg: null, color: null, radius: 10 }
  },
  {
    id: 'badge',
    name: 'Badge',
    description: 'Escudo compacto estilo GitHub.',
    defaultTheme: 'light',
    sampleCount: 128734,
    defaults: { bg: null, color: null, radius: 6 }
  },
  {
    id: 'pixel',
    name: 'Pixel',
    description: 'Retro 8-bit con digitos pixelados.',
    defaultTheme: 'dark',
    sampleCount: 99999,
    defaults: { bg: null, color: null, radius: 0 }
  },
  {
    id: 'chalk',
    name: 'Chalk',
    description: 'Pizarra con digitos escritos a tiza.',
    defaultTheme: 'dark',
    sampleCount: 71502,
    defaults: { bg: null, color: null, radius: 4 }
  }
];

const STYLE_MAP = Object.fromEntries(COUNTER_STYLES.map((style) => [style.id, style]));
const DEFAULT_STYLE = COUNTER_STYLES[0].id;
const DEFAULT_THEME = 'light';

// Native default colors per style/theme (from render functions)
export const STYLE_THEME_DEFAULTS = {
  split: {
    dark:  { bg: '#10161f', color: '#f8f1e4' },
    light: { bg: '#ffffff', color: '#34291f' }
  },
  score: {
    dark:  { bg: '#0d2117', color: '#71f39f' },
    light: { bg: '#ffffff', color: '#0c7a43' }
  },
  terminal: {
    dark:  { bg: '#050b08', color: '#83ff9d' },
    light: { bg: '#141d18', color: '#b5ff8f' }
  },
  neon: {
    dark:  { bg: '#0a0014', color: '#ff2cf1' },
    light: { bg: '#1a0a2e', color: '#00e5ff' }
  },
  lcd: {
    dark:  { bg: '#1a2a1a', color: '#33ff33' },
    light: { bg: '#c8d0b0', color: '#2a3a2a' }
  },
  nixie: {
    dark:  { bg: '#1b1008', color: '#ff8a00' },
    light: { bg: '#fff5e8', color: '#a94e00' }
  },
  odometer: {
    dark:  { bg: '#111111', color: '#ffffff' },
    light: { bg: '#f0f0f0', color: '#111111' }
  },
  dots: {
    dark:  { bg: '#0c0c0c', color: '#ff6600' },
    light: { bg: '#2a2a2a', color: '#ffcc00' }
  },
  badge: {
    dark:  { bg: '#30363d', color: '#e6edf3' },
    light: { bg: '#e1e4e8', color: '#24292e' }
  },
  pixel: {
    dark:  { bg: '#1a1a2e', color: '#00ff41' },
    light: { bg: '#d4d4d8', color: '#18181b' }
  },
  chalk: {
    dark:  { bg: '#2d4a3e', color: '#e8e0c8' },
    light: { bg: '#1a3a2a', color: '#f5eedd' }
  }
};
const DEFAULT_DIGITS = 6;

function clampInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

function normalizeText(value, fallback = '') {
  if (value === undefined || value === null) {
    return fallback;
  }

  return String(value).trim();
}



export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function slugifyCounterId(value) {
  const normalized = normalizeText(value, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 64);

  return normalized || 'mi-web';
}

export function formatCounterValue(count, digits = DEFAULT_DIGITS) {
  const safeCount = Math.max(0, clampInt(count, 0, 0, 999999999999));
  const minDigits = clampInt(digits, DEFAULT_DIGITS, 1, 12);
  const value = String(safeCount);

  return value.length >= minDigits ? value : value.padStart(minDigits, '0');
}

const HEX_RE = /^[0-9a-fA-F]{3,8}$/;

function normalizeHex(value) {
  if (!value) {
    return null;
  }

  const clean = String(value).replace(/^#/, '').trim();
  if (!HEX_RE.test(clean)) {
    return null;
  }

  return '#' + clean;
}

export function normalizeCounterOptions(raw = {}) {
  const requestedStyle = normalizeText(raw.style, DEFAULT_STYLE).toLowerCase();
  const style = STYLE_MAP[requestedStyle] ? requestedStyle : DEFAULT_STYLE;
  const styleMeta = STYLE_MAP[style];
  const theme = normalizeText(raw.theme, styleMeta.defaultTheme || DEFAULT_THEME).toLowerCase() === 'dark'
    ? 'dark'
    : 'light';
  const digits = clampInt(raw.digits, DEFAULT_DIGITS, 4, 10);
  const count = clampInt(raw.count, 0, 0, 999999999999);
  const start = clampInt(raw.start, 0, 0, 999999999999);
  const slug = slugifyCounterId(raw.slug || raw.id || '');

  const bg = normalizeHex(raw.bg);
  const color = normalizeHex(raw.color);
  const radius = raw.radius !== undefined && raw.radius !== null && raw.radius !== ''
    ? clampInt(raw.radius, styleMeta.defaults.radius, 0, 32)
    : null;

  return {
    style,
    theme,
    digits,
    count,
    start,
    slug,
    bg,
    color,
    radius,
    value: formatCounterValue(count, digits)
  };
}

function renderSplit(value, theme, custom) {
  const dark = theme === 'dark';
  const card = custom.bg || (dark ? '#10161f' : '#ffffff');
  const background = custom.bg || (dark ? '#0b1017' : '#eef2f7');
  const boxTop = dark ? '#2a3340' : '#faf5ec';
  const boxBottom = dark ? '#1b2330' : '#f1e8dc';
  const border = dark ? '#465062' : '#d5c7b1';
  const text = custom.color || (dark ? '#f8f1e4' : '#34291f');
  const radius = custom.radius != null ? custom.radius : 22;
  const innerRadius = Math.max(0, Math.min(radius - 2, 10));
  const boxWidth = 40;
  const boxGap = 8;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const width = Math.max(200, digitsWidth + 36);
  const boxes = value
    .split('')
    .map((digit, index) => {
      const x = 18 + index * (boxWidth + boxGap);
      return `<g transform="translate(${x} 12)">
  <rect width="${boxWidth}" height="56" rx="${innerRadius}" fill="${boxBottom}" stroke="${border}" />
  <rect width="${boxWidth}" height="28" rx="${innerRadius}" fill="${boxTop}" />
  <line x1="0" y1="28" x2="${boxWidth}" y2="28" stroke="${border}" />
  <text x="${boxWidth / 2}" y="39" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="30" font-weight="700" fill="${text}">${escapeXml(digit)}</text>
</g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="80" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="78" rx="${Math.max(0, radius - 1)}" fill="${card}" stroke="${dark ? '#252f3d' : '#d7deea'}" />
  ${boxes}
</svg>`;
}

function renderScore(value, theme, custom) {
  const dark = theme === 'dark';
  const panel = custom.bg || (dark ? '#0d2117' : '#ffffff');
  const background = custom.bg || (dark ? '#07150d' : '#edf7ef');
  const border = dark ? '#1f4a32' : '#cfe2d4';
  const text = custom.color || (dark ? '#71f39f' : '#0c7a43');
  const radius = custom.radius != null ? custom.radius : 18;
  const innerRadius = Math.max(0, Math.min(radius - 2, 8));
  const boxWidth = 42;
  const boxGap = 6;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const width = Math.max(200, digitsWidth + 36);
  const startX = 18;
  const digits = value
    .split('')
    .map((digit, index) => {
      const x = startX + index * (boxWidth + boxGap);
      return `<g transform="translate(${x} 12)">
  <rect width="${boxWidth}" height="56" rx="${innerRadius}" fill="${dark ? '#09120d' : '#0d2117'}" stroke="${border}" />
  <text x="${boxWidth / 2}" y="38" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="30" font-weight="700" fill="${text}">${escapeXml(digit)}</text>
</g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="80" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="78" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${border}" />
  ${digits}
</svg>`;
}

function renderTerminal(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#050b08' : '#141d18');
  const panel = custom.bg || (dark ? '#06110d' : '#1a2520');
  const border = dark ? '#0f2b20' : '#325243';
  const text = custom.color || (dark ? '#83ff9d' : '#b5ff8f');
  const radius = custom.radius != null ? custom.radius : 18;
  const width = Math.max(200, value.length * 28 + 44);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 70" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <pattern id="terminal-scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="rgba(131,255,157,0.05)" />
    </pattern>
  </defs>
  <rect width="${width}" height="70" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="68" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${border}" />
  <rect x="1" y="1" width="${width - 2}" height="68" rx="${Math.max(0, radius - 1)}" fill="url(#terminal-scan)" />
  <text x="${width / 2}" y="46" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="38" font-weight="700" fill="${text}" letter-spacing="2">${escapeXml(value)}</text>
</svg>`;
}

function renderNeon(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#0a0014' : '#1a0a2e');
  const panel = custom.bg || (dark ? '#0e0020' : '#1f0f38');
  const text = custom.color || (dark ? '#ff2cf1' : '#00e5ff');
  const radius = custom.radius != null ? custom.radius : 16;
  const width = Math.max(200, value.length * 36 + 48);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 76" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="76" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="74" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${dark ? '#1a0030' : '#2a1050'}" />
  <text filter="url(#neon-glow)" x="${width / 2}" y="50" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="40" font-weight="700" fill="${text}" letter-spacing="6">${escapeXml(value)}</text>
</svg>`;
}

function renderNixie(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#1b1008' : '#fff5e8');
  const panel = custom.bg || (dark ? '#120a05' : '#f7ead8');
  const text = custom.color || (dark ? '#ff8a00' : '#a94e00');
  const radius = custom.radius != null ? custom.radius : 20;
  const boxWidth = 40;
  const boxGap = 8;
  const height = 82;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const width = Math.max(220, digitsWidth + 40);
  const tubes = value.split('').map((digit, index) => {
    const x = 20 + index * (boxWidth + boxGap);
    return `<g transform="translate(${x} 10)">
  <rect width="${boxWidth}" height="62" rx="18" fill="${dark ? '#2a1608' : '#fffaf2'}" stroke="${dark ? '#6a3d0a' : '#d8b28e'}" />
  <rect x="4" y="4" width="${boxWidth - 8}" height="54" rx="15" fill="none" stroke="${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)'}" />
  <line x1="10" y1="7" x2="10" y2="55" stroke="${dark ? '#53300d' : '#c89a6d'}" stroke-width="1" />
  <line x1="${boxWidth - 10}" y1="7" x2="${boxWidth - 10}" y2="55" stroke="${dark ? '#53300d' : '#c89a6d'}" stroke-width="1" />
  <text x="${boxWidth / 2}" y="43" text-anchor="middle" font-family="'Georgia', 'Times New Roman', serif" font-size="34" fill="${text}">${escapeXml(digit)}</text>
  <text x="${boxWidth / 2}" y="43" text-anchor="middle" font-family="'Georgia', 'Times New Roman', serif" font-size="34" fill="${text}" opacity="0.35" filter="url(#nixie-glow)">${escapeXml(digit)}</text>
</g>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <filter id="nixie-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${dark ? '#3a2411' : '#d9b68e'}" />
  ${tubes}
</svg>`;
}

// Seven-segment digit paths (relative, 20x32 viewBox)
const LCD_SEGMENTS = {
  '0': [1,1,1,0,1,1,1], '1': [0,0,1,0,0,1,0], '2': [1,0,1,1,1,0,1],
  '3': [1,0,1,1,0,1,1], '4': [0,1,1,1,0,1,0], '5': [1,1,0,1,0,1,1],
  '6': [1,1,0,1,1,1,1], '7': [1,0,1,0,0,1,0], '8': [1,1,1,1,1,1,1],
  '9': [1,1,1,1,0,1,1]
};

function renderLcdDigit(digit, x, y, size, onColor, offColor) {
  const segs = LCD_SEGMENTS[digit] || LCD_SEGMENTS['0'];
  const w = size * 0.6;
  const h = size;
  const t = Math.max(2, size * 0.08);
  const g = size * 0.03;
  const hw = w - 2 * t - 2 * g;
  const hh = (h - 3 * t - 4 * g) / 2;
  // Segment positions: [top, top-left, top-right, middle, bottom-left, bottom-right, bottom]
  const positions = [
    { x: t + g, y: g, w: hw, h: t },
    { x: g, y: t + 2 * g, w: t, h: hh },
    { x: w - t - g, y: t + 2 * g, w: t, h: hh },
    { x: t + g, y: t + hh + 3 * g, w: hw, h: t },
    { x: g, y: 2 * t + hh + 4 * g, w: t, h: hh },
    { x: w - t - g, y: 2 * t + hh + 4 * g, w: t, h: hh },
    { x: t + g, y: 2 * t + 2 * hh + 5 * g, w: hw, h: t }
  ];
  return positions.map((p, i) =>
    `<rect x="${x + p.x}" y="${y + p.y}" width="${p.w}" height="${p.h}" rx="1" fill="${segs[i] ? onColor : offColor}" />`
  ).join('');
}

function renderLcd(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#1a2a1a' : '#c8d0b0');
  const panel = custom.bg || (dark ? '#1e301e' : '#bcc4a0');
  const border = dark ? '#2a402a' : '#a0a880';
  const onColor = custom.color || (dark ? '#33ff33' : '#2a3a2a');
  const offColor = dark ? 'rgba(51,255,51,0.08)' : 'rgba(42,58,42,0.08)';
  const radius = custom.radius != null ? custom.radius : 8;
  const digitSize = 44;
  const digitW = digitSize * 0.6;
  const digitGap = 6;
  const padX = 18;
  const digitsWidth = value.length * digitW + Math.max(0, value.length - 1) * digitGap;
  const width = Math.max(200, digitsWidth + padX * 2);
  const height = 70;
  const digitY = (height - digitSize) / 2;

  const digits = value.split('').map((d, i) => {
    const dx = padX + i * (digitW + digitGap);
    return renderLcdDigit(d, dx, digitY, digitSize, onColor, offColor);
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${border}" />
  ${digits}
</svg>`;
}

function renderOdometer(value, theme, custom) {
  const dark = theme === 'dark';
  const card = custom.bg || (dark ? '#111111' : '#f0f0f0');
  const background = custom.bg || (dark ? '#0a0a0a' : '#e0e0e0');
  const text = custom.color || (dark ? '#ffffff' : '#111111');
  const radius = custom.radius != null ? custom.radius : 20;
  const boxWidth = 38;
  const boxGap = 4;
  const boxHeight = 56;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const width = Math.max(200, digitsWidth + 36);

  const rollers = value.split('').map((digit, index) => {
    const x = 18 + index * (boxWidth + boxGap);
    const innerR = Math.max(0, Math.min(8, radius - 4));
    return `<g transform="translate(${x} 12)">
  <defs>
    <linearGradient id="odo-grad-${index}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${dark ? '#333' : '#ccc'}" />
      <stop offset="15%" stop-color="${dark ? '#222' : '#ddd'}" />
      <stop offset="50%" stop-color="${dark ? '#1a1a1a' : '#eee'}" />
      <stop offset="85%" stop-color="${dark ? '#222' : '#ddd'}" />
      <stop offset="100%" stop-color="${dark ? '#333' : '#ccc'}" />
    </linearGradient>
  </defs>
  <rect width="${boxWidth}" height="${boxHeight}" rx="${innerR}" fill="url(#odo-grad-${index})" stroke="${dark ? '#444' : '#bbb'}" />
  <text x="${boxWidth / 2}" y="38" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="32" font-weight="700" fill="${text}">${escapeXml(digit)}</text>
  <rect width="${boxWidth}" height="2" y="${boxHeight / 2 - 1}" rx="1" fill="${dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}" />
</g>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="80" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="78" rx="${Math.max(0, radius - 1)}" fill="${card}" stroke="${dark ? '#2a2a2a' : '#c0c0c0'}" />
  ${rollers}
</svg>`;
}

// 3x5 dot patterns for digits 0-9
const DOT_PATTERNS = {
  '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
  '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  '7': [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]]
};

function renderDots(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#0c0c0c' : '#2a2a2a');
  const panel = custom.bg || (dark ? '#111' : '#333');
  const onColor = custom.color || (dark ? '#ff6600' : '#ffcc00');
  const offColor = dark ? 'rgba(255,102,0,0.08)' : 'rgba(255,204,0,0.08)';
  const radius = custom.radius != null ? custom.radius : 10;
  const dotR = 3;
  const dotGap = 8.5;
  const digitCols = 3;
  const digitRows = 5;
  const digitW = digitCols * dotGap;
  const digitGap = 10;
  const padX = 18;
  const padY = 14;
  const digitsWidth = value.length * digitW + Math.max(0, value.length - 1) * digitGap;
  const width = Math.max(200, digitsWidth + padX * 2);
  const height = digitRows * dotGap + padY * 2;

  const dots = value.split('').map((char, di) => {
    const pattern = DOT_PATTERNS[char] || DOT_PATTERNS['0'];
    const offsetX = padX + di * (digitW + digitGap);
    return pattern.map((row, ri) =>
      row.map((on, ci) =>
        `<circle cx="${offsetX + ci * dotGap + dotR + 0.5}" cy="${padY + ri * dotGap + dotR + 0.5}" r="${dotR}" fill="${on ? onColor : offColor}" />`
      ).join('')
    ).join('');
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${dark ? '#222' : '#444'}" />
  ${dots}
</svg>`;
}

function renderBadge(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#30363d' : '#e1e4e8');
  const panel = custom.bg || (dark ? '#373e47' : '#eff2f5');
  const text = custom.color || (dark ? '#e6edf3' : '#24292e');
  const radius = custom.radius != null ? custom.radius : 6;
  const width = Math.max(80, value.length * 10 + 24);
  const height = 28;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${dark ? '#444d56' : '#d1d5da'}" />
  <text x="${width / 2}" y="19" text-anchor="middle" font-family="'Verdana', 'DejaVu Sans', sans-serif" font-size="14" font-weight="700" fill="${text}" letter-spacing="1">${escapeXml(value)}</text>
</svg>`;
}

// 5x7 pixel grid patterns for digits 0-9
const PIXEL_PATTERNS = {
  '0': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0]
  ],
  '2': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  '3': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '4': [
    [0,0,0,1,0],
    [0,0,1,1,0],
    [0,1,0,1,0],
    [1,0,0,1,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0]
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '6': [
    [0,1,1,1,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  '8': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '9': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,1,1,1,0]
  ]
};

function renderPixel(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#1a1a2e' : '#d4d4d8');
  const panel = custom.bg || (dark ? '#16162a' : '#e4e4e8');
  const onColor = custom.color || (dark ? '#00ff41' : '#18181b');
  const offColor = dark ? 'rgba(0,255,65,0.06)' : 'rgba(24,24,27,0.06)';
  const radius = custom.radius != null ? custom.radius : 0;
  const px = 5;
  const cols = 5;
  const rows = 7;
  const digitW = cols * px;
  const digitH = rows * px;
  const digitGap = 6;
  const padX = 14;
  const padY = 12;
  const digitsWidth = value.length * digitW + Math.max(0, value.length - 1) * digitGap;
  const width = Math.max(160, digitsWidth + padX * 2);
  const height = digitH + padY * 2;

  const pixels = value.split('').map((char, di) => {
    const pattern = PIXEL_PATTERNS[char] || PIXEL_PATTERNS['0'];
    const offsetX = padX + di * (digitW + digitGap);
    return pattern.map((row, ri) =>
      row.map((on, ci) =>
        `<rect x="${offsetX + ci * px}" y="${padY + ri * px}" width="${px - 0.5}" height="${px - 0.5}" fill="${on ? onColor : offColor}" />`
      ).join('')
    ).join('');
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${dark ? '#2a2a4a' : '#c0c0c8'}" />
  ${pixels}
</svg>`;
}


function renderChalk(value, theme, custom) {
  const dark = theme === 'dark';
  const background = custom.bg || (dark ? '#2d4a3e' : '#1a3a2a');
  const panel = custom.bg || (dark ? '#264438' : '#163224');
  const border = dark ? '#3d6050' : '#2a5438';
  const text = custom.color || (dark ? '#e8e0c8' : '#f5eedd');
  const radius = custom.radius != null ? custom.radius : 4;
  const width = Math.max(200, value.length * 34 + 44);
  const height = 76;

  // Chalk dust speckles for texture
  const speckles = Array.from({ length: 18 }, (_, i) => {
    const sx = 10 + ((i * 37 + 13) % (width - 20));
    const sy = 8 + ((i * 23 + 7) % (height - 16));
    const r = 0.4 + (i % 3) * 0.3;
    return `<circle cx="${sx}" cy="${sy}" r="${r}" fill="${text}" opacity="0.12" />`;
  }).join('');

  const trayY = height - 8;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <filter id="chalk-rough" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" rx="${radius}" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${Math.max(0, radius - 1)}" fill="${panel}" stroke="${border}" />
  <line x1="8" y1="${trayY}" x2="${width - 8}" y2="${trayY}" stroke="${dark ? '#5a7a6a' : '#4a6a58'}" stroke-width="2" stroke-linecap="round" />
  ${speckles}
  <text filter="url(#chalk-rough)" x="${width / 2}" y="48" text-anchor="middle" font-family="'Georgia', 'Times New Roman', serif" font-size="38" font-weight="700" fill="${text}" letter-spacing="4" opacity="0.92">${escapeXml(value)}</text>
</svg>`;
}

export function renderCounterSvg(raw = {}) {
  const options = normalizeCounterOptions(raw);
  const { style, value, theme, bg, color, radius } = options;
  const custom = { bg, color, radius };

  switch (style) {
    case 'score':
      return renderScore(value, theme, custom);
    case 'terminal':
      return renderTerminal(value, theme, custom);
    case 'neon':
      return renderNeon(value, theme, custom);
    case 'nixie':
      return renderNixie(value, theme, custom);
    case 'lcd':
      return renderLcd(value, theme, custom);
    case 'odometer':
      return renderOdometer(value, theme, custom);
    case 'dots':
      return renderDots(value, theme, custom);
    case 'badge':
      return renderBadge(value, theme, custom);
    case 'pixel':
      return renderPixel(value, theme, custom);
    case 'chalk':
      return renderChalk(value, theme, custom);
    case 'split':
    default:
      return renderSplit(value, theme, custom);
  }
}

export function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function buildCounterUrl(baseUrl, raw = {}) {
  const options = normalizeCounterOptions(raw);
  const url = new URL(`/c/${options.slug}.svg`, baseUrl);

  url.searchParams.set('style', options.style);
  url.searchParams.set('digits', String(options.digits));
  url.searchParams.set('theme', options.theme);
  if (options.start > 0) {
    url.searchParams.set('start', String(options.start));
  }
  if (options.bg) {
    url.searchParams.set('bg', options.bg.replace('#', ''));
  }
  if (options.color) {
    url.searchParams.set('color', options.color.replace('#', ''));
  }
  if (options.radius != null) {
    url.searchParams.set('radius', String(options.radius));
  }

  return url.toString();
}

export function buildPreviewUrl(baseUrl, raw = {}) {
  const options = normalizeCounterOptions(raw);
  const url = new URL('/preview.svg', baseUrl);

  url.searchParams.set('style', options.style);
  url.searchParams.set('digits', String(options.digits));
  url.searchParams.set('theme', options.theme);
  url.searchParams.set('value', String(options.count));
  if (options.bg) {
    url.searchParams.set('bg', options.bg.replace('#', ''));
  }
  if (options.color) {
    url.searchParams.set('color', options.color.replace('#', ''));
  }
  if (options.radius != null) {
    url.searchParams.set('radius', String(options.radius));
  }

  return url.toString();
}

export function buildCounterSnippet(baseUrl, raw = {}) {
  const options = normalizeCounterOptions(raw);
  const url = buildCounterUrl(baseUrl, options).replace(/&/g, '&amp;');

  return `<img src="${url}" alt="contador de visitas" style="width:100%;height:auto">`;
}
