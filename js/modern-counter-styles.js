export const COUNTER_STYLES = [
  {
    id: 'mono',
    name: 'Mono',
    description: 'Panel oscuro, limpio y preciso.',
    defaultTheme: 'dark',
    sampleCount: 128734,
    sampleLabel: 'visitas'
  },
  {
    id: 'split',
    name: 'Split',
    description: 'Flip counter contemporaneo con cajas por digito.',
    defaultTheme: 'light',
    sampleCount: 42019,
    sampleLabel: 'contador'
  },
  {
    id: 'score',
    name: 'Score',
    description: 'Marcador potente pensado para destacar.',
    defaultTheme: 'dark',
    sampleCount: 90812,
    sampleLabel: 'hits'
  },
  {
    id: 'signal',
    name: 'Signal',
    description: 'Look editorial, nitido y tecnico.',
    defaultTheme: 'light',
    sampleCount: 55321,
    sampleLabel: 'trafico'
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Cristal suave con acabado moderno.',
    defaultTheme: 'light',
    sampleCount: 76543,
    sampleLabel: 'visitas'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Estetica consola con glow digital.',
    defaultTheme: 'dark',
    sampleCount: 31337,
    sampleLabel: 'logs'
  }
];

const STYLE_MAP = Object.fromEntries(COUNTER_STYLES.map((style) => [style.id, style]));
const DEFAULT_STYLE = COUNTER_STYLES[0].id;
const DEFAULT_THEME = 'light';
const DEFAULT_LABEL = 'visitas';
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

function measureLabelWidth(label, multiplier) {
  if (!label) {
    return 0;
  }

  return Math.max(64, label.length * multiplier + 24);
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
  const labelInput = raw.label === '' ? '' : normalizeText(raw.label, DEFAULT_LABEL);
  const label = labelInput.slice(0, 28);
  const slug = slugifyCounterId(raw.slug || raw.id || '');

  return {
    style,
    theme,
    digits,
    count,
    start,
    label,
    slug,
    value: formatCounterValue(count, digits)
  };
}

function renderMono(value, label, theme) {
  const dark = theme === 'dark';
  const backgroundStart = dark ? '#0a1220' : '#f7fafc';
  const backgroundEnd = dark ? '#162338' : '#ffffff';
  const text = dark ? '#f8fbff' : '#102033';
  const border = dark ? 'rgba(255,255,255,0.12)' : '#d6e0ea';
  const accent = dark ? '#55a4ff' : '#0b63f6';
  const labelWidth = measureLabelWidth(label, 8);
  const digitsWidth = value.length * 28 + Math.max(0, value.length - 1) * 4;
  const width = Math.max(280, 36 + labelWidth + (labelWidth ? 20 : 0) + digitsWidth + 24);
  const labelText = label ? escapeXml(label.toUpperCase()) : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="96" viewBox="0 0 ${width} 96" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <linearGradient id="mono-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${backgroundStart}" />
      <stop offset="100%" stop-color="${backgroundEnd}" />
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="94" rx="22" fill="url(#mono-bg)" stroke="${border}" />
  ${label ? `<rect x="16" y="16" width="${labelWidth}" height="24" rx="12" fill="${accent}" />
  <text x="${16 + labelWidth / 2}" y="32" text-anchor="middle" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="1">${labelText}</text>` : ''}
  <text x="${width - 18}" y="63" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="40" font-weight="700" fill="${text}" letter-spacing="2">${escapeXml(value)}</text>
</svg>`;
}

function renderSplit(value, label, theme) {
  const dark = theme === 'dark';
  const card = dark ? '#10161f' : '#ffffff';
  const background = dark ? '#0b1017' : '#eef2f7';
  const boxTop = dark ? '#2a3340' : '#faf5ec';
  const boxBottom = dark ? '#1b2330' : '#f1e8dc';
  const border = dark ? '#465062' : '#d5c7b1';
  const text = dark ? '#f8f1e4' : '#34291f';
  const accent = dark ? '#ffb56a' : '#b65d1a';
  const boxWidth = 40;
  const boxGap = 8;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const width = Math.max(300, digitsWidth + 36);
  const boxes = value
    .split('')
    .map((digit, index) => {
      const x = 18 + index * (boxWidth + boxGap);
      return `<g transform="translate(${x} 36)">
  <rect width="${boxWidth}" height="56" rx="10" fill="${boxBottom}" stroke="${border}" />
  <rect width="${boxWidth}" height="28" rx="10" fill="${boxTop}" />
  <line x1="0" y1="28" x2="${boxWidth}" y2="28" stroke="${border}" />
  <text x="${boxWidth / 2}" y="39" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="30" font-weight="700" fill="${text}">${escapeXml(digit)}</text>
</g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="110" viewBox="0 0 ${width} 110" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="110" rx="24" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="108" rx="23" fill="${card}" stroke="${dark ? '#252f3d' : '#d7deea'}" />
  <text x="18" y="22" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" letter-spacing="1" fill="${accent}">${escapeXml((label || 'contador').toUpperCase())}</text>
  ${boxes}
</svg>`;
}

function renderScore(value, label, theme) {
  const dark = theme === 'dark';
  const background = dark ? '#07150d' : '#edf7ef';
  const panel = dark ? '#0d2117' : '#ffffff';
  const border = dark ? '#1f4a32' : '#cfe2d4';
  const accent = dark ? '#71f39f' : '#0c7a43';
  const dim = dark ? '#9bd6ad' : '#416753';
  const boxWidth = 42;
  const boxGap = 6;
  const digitsWidth = value.length * boxWidth + Math.max(0, value.length - 1) * boxGap;
  const labelWidth = measureLabelWidth(label || 'visitas', 7);
  const width = Math.max(320, labelWidth + digitsWidth + 54);
  const startX = width - digitsWidth - 18;
  const digits = value
    .split('')
    .map((digit, index) => {
      const x = startX + index * (boxWidth + boxGap);
      return `<g transform="translate(${x} 24)">
  <rect width="${boxWidth}" height="56" rx="8" fill="${dark ? '#09120d' : '#0d2117'}" stroke="${border}" />
  <text x="${boxWidth / 2}" y="38" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="30" font-weight="700" fill="${accent}">${escapeXml(digit)}</text>
</g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="104" viewBox="0 0 ${width} 104" role="img" aria-label="Contador ${escapeXml(value)}">
  <rect width="${width}" height="104" rx="22" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="102" rx="21" fill="${panel}" stroke="${border}" />
  <text x="22" y="34" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="700" letter-spacing="1.4" fill="${dim}">${escapeXml((label || 'visitas').toUpperCase())}</text>
  <text x="22" y="63" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="22" font-weight="700" fill="${accent}">LIVE</text>
  ${digits}
</svg>`;
}

function renderSignal(value, label, theme) {
  const dark = theme === 'dark';
  const background = dark ? '#0f1728' : '#f4f7fb';
  const panel = dark ? '#152239' : '#ffffff';
  const border = dark ? '#263a5a' : '#d8e0ec';
  const accent = dark ? '#8fd0ff' : '#0b63f6';
  const text = dark ? '#eff6ff' : '#102033';
  const dim = dark ? '#a7bdd8' : '#5f7083';
  const labelWidth = measureLabelWidth(label || 'trafico', 7);
  const digitsWidth = value.length * 26 + Math.max(0, value.length - 1) * 3;
  const width = Math.max(320, 34 + labelWidth + 22 + digitsWidth + 28);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="92" viewBox="0 0 ${width} 92" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <linearGradient id="signal-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${dark ? '#6de7d8' : '#7dc0ff'}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="92" rx="24" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="90" rx="23" fill="${panel}" stroke="${border}" />
  <rect x="18" y="18" width="${Math.max(120, labelWidth + 34)}" height="8" rx="4" fill="url(#signal-line)" />
  <text x="18" y="48" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" letter-spacing="1.2" fill="${dim}">${escapeXml((label || 'trafico').toUpperCase())}</text>
  <text x="18" y="68" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="600" fill="${text}">contador-de-visitas.com</text>
  <text x="${width - 18}" y="61" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="36" font-weight="700" letter-spacing="2" fill="${text}">${escapeXml(value)}</text>
</svg>`;
}

function renderGlass(value, label, theme) {
  const dark = theme === 'dark';
  const backgroundStart = dark ? '#151b31' : '#dff4ff';
  const backgroundEnd = dark ? '#232b52' : '#fdf5ff';
  const glass = dark ? 'rgba(12, 19, 32, 0.36)' : 'rgba(255, 255, 255, 0.62)';
  const border = dark ? 'rgba(167, 186, 255, 0.22)' : 'rgba(95, 112, 131, 0.18)';
  const text = dark ? '#f7fbff' : '#102033';
  const accent = dark ? '#7fd7ff' : '#0068df';
  const digitsWidth = value.length * 28 + Math.max(0, value.length - 1) * 4;
  const labelWidth = measureLabelWidth(label, 8);
  const width = Math.max(300, 36 + labelWidth + (labelWidth ? 14 : 0) + digitsWidth + 32);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="98" viewBox="0 0 ${width} 98" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <linearGradient id="glass-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${backgroundStart}" />
      <stop offset="100%" stop-color="${backgroundEnd}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="98" rx="24" fill="url(#glass-bg)" />
  <rect x="10" y="10" width="${width - 20}" height="78" rx="18" fill="${glass}" stroke="${border}" />
  ${label ? `<text x="26" y="38" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="700" letter-spacing="1.1" fill="${accent}">${escapeXml(label.toUpperCase())}</text>` : ''}
  <text x="${width - 24}" y="62" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="38" font-weight="700" letter-spacing="2" fill="${text}">${escapeXml(value)}</text>
</svg>`;
}

function renderTerminal(value, label, theme) {
  const dark = theme === 'dark';
  const background = dark ? '#050b08' : '#141d18';
  const panel = dark ? '#06110d' : '#1a2520';
  const border = dark ? '#0f2b20' : '#325243';
  const accent = dark ? '#83ff9d' : '#b5ff8f';
  const dim = dark ? '#4fb76a' : '#9fd58c';
  const width = Math.max(320, value.length * 28 + 150);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="94" viewBox="0 0 ${width} 94" role="img" aria-label="Contador ${escapeXml(value)}">
  <defs>
    <pattern id="terminal-scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="rgba(131,255,157,0.05)" />
    </pattern>
  </defs>
  <rect width="${width}" height="94" rx="22" fill="${background}" />
  <rect x="1" y="1" width="${width - 2}" height="92" rx="21" fill="${panel}" stroke="${border}" />
  <rect x="1" y="1" width="${width - 2}" height="92" rx="21" fill="url(#terminal-scan)" />
  <circle cx="22" cy="22" r="5" fill="${accent}" />
  <text x="38" y="27" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="12" font-weight="700" fill="${dim}">${escapeXml(label || 'visitas')}</text>
  <text x="22" y="67" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="38" font-weight="700" fill="${accent}" letter-spacing="2">${escapeXml(value)}</text>
</svg>`;
}

export function renderCounterSvg(raw = {}) {
  const options = normalizeCounterOptions(raw);
  const { style, value, label, theme } = options;

  switch (style) {
    case 'split':
      return renderSplit(value, label, theme);
    case 'score':
      return renderScore(value, label, theme);
    case 'signal':
      return renderSignal(value, label, theme);
    case 'glass':
      return renderGlass(value, label, theme);
    case 'terminal':
      return renderTerminal(value, label, theme);
    case 'mono':
    default:
      return renderMono(value, label, theme);
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
  if (options.label) {
    url.searchParams.set('label', options.label);
  }
  if (options.start > 0) {
    url.searchParams.set('start', String(options.start));
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
  if (options.label) {
    url.searchParams.set('label', options.label);
  }

  return url.toString();
}

export function buildCounterSnippet(baseUrl, raw = {}) {
  const options = normalizeCounterOptions(raw);
  const url = buildCounterUrl(baseUrl, options).replace(/&/g, '&amp;');

  return `<img src="${url}" alt="contador de visitas">`;
}
