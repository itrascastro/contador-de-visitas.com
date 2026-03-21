import {
  COUNTER_STYLES,
  STYLE_THEME_DEFAULTS,
  buildCounterSnippet,
  normalizeCounterOptions,
  renderCounterSvg,
  slugifyCounterId,
  svgToDataUri
} from './modern-counter-styles.js';

const COUNTER_BASE_URL = 'https://contador-de-visitas.com';

const siteUrlInput = document.getElementById('counter-site-url');
const styleInput = document.getElementById('counter-style');
const digitsInput = document.getElementById('counter-digits');
const startInput = document.getElementById('counter-start');
const themeInput = document.getElementById('counter-theme');
const bgInput = document.getElementById('counter-bg');
const colorInput = document.getElementById('counter-color');
const radiusInput = document.getElementById('counter-radius');
const radiusValue = document.getElementById('counter-radius-value');
const previewImage = document.getElementById('counter-preview-image');
const snippetOutput = document.getElementById('counter-snippet');
const copyButton = document.getElementById('copy-counter-snippet');
const styleGallery = document.getElementById('style-gallery');
const selectedStyleLabel = document.getElementById('selected-style-label');

const form = document.getElementById('counter-generator-form');

let selectedStyle = COUNTER_STYLES[0].id;

function getPreviewCount(startValue) {
  return Math.max(startValue + 1, 128734);
}

function getSelectedStyleMeta() {
  return COUNTER_STYLES.find((s) => s.id === selectedStyle) || COUNTER_STYLES[0];
}

function populateStyleSelect() {
  if (!styleInput) {
    return;
  }

  styleInput.innerHTML = COUNTER_STYLES.map(function (style) {
    return `<option value="${style.id}">${style.name}</option>`;
  }).join('');
  styleInput.value = selectedStyle;
}

function getCounterSlugFromSiteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.replace(/^www\./i, '');
    const path = parsed.pathname.replace(/\/+$/g, '').replace(/^\/+/g, '');
    const query = parsed.search ? parsed.search.slice(1) : '';
    const idSource = [host, path, query].filter(Boolean).join('-');
    return slugifyCounterId(idSource);
  } catch (error) {
    return slugifyCounterId(raw);
  }
}

function normalizeSiteUrlInput() {
  if (!siteUrlInput) {
    return;
  }

  const raw = siteUrlInput.value.trim();
  if (!raw) {
    siteUrlInput.value = '';
    return;
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) {
    siteUrlInput.value = raw;
    return;
  }

  siteUrlInput.value = `https://${raw}`;
}

function getOptions() {
  return normalizeCounterOptions({
    slug: getCounterSlugFromSiteUrl(siteUrlInput ? siteUrlInput.value : ''),
    digits: digitsInput ? digitsInput.value : '',
    start: startInput ? startInput.value : '',
    count: getPreviewCount(Number.parseInt(startInput ? startInput.value : '0', 10) || 0),
    theme: themeInput ? themeInput.value : '',
    style: selectedStyle,
    bg: (bgInput && bgInput.dataset.userSet) ? bgInput.value : '',
    color: (colorInput && colorInput.dataset.userSet) ? colorInput.value : '',
    radius: (radiusInput && radiusInput.dataset.userSet) ? radiusInput.value : ''
  });
}

function syncColorDefaults() {
  const meta = getSelectedStyleMeta();
  const dark = themeInput ? themeInput.value === 'dark' : meta.defaultTheme === 'dark';
  const theme = dark ? 'dark' : 'light';
  const defaults = (STYLE_THEME_DEFAULTS[selectedStyle] || STYLE_THEME_DEFAULTS.split)[theme];

  if (bgInput && !bgInput.dataset.userSet) {
    bgInput.value = defaults.bg;
  }
  if (colorInput && !colorInput.dataset.userSet) {
    colorInput.value = defaults.color;
  }
  if (radiusInput && !radiusInput.dataset.userSet) {
    radiusInput.value = meta.defaults.radius || 22;
    if (radiusValue) {
      radiusValue.textContent = radiusInput.value + 'px';
    }
  }

  syncStyleDefaultSwatches();
}

function syncStyleDefaultSwatches() {
  const meta = getSelectedStyleMeta();
  const dark = themeInput ? themeInput.value === 'dark' : meta.defaultTheme === 'dark';
  const theme = dark ? 'dark' : 'light';
  const defaults = (STYLE_THEME_DEFAULTS[selectedStyle] || STYLE_THEME_DEFAULTS.split)[theme];

  // Only inject native swatches for text color (bg uses two-tone
  // card+background that a single bg override can't reproduce)
  var defaultMap = {
    'counter-color': defaults.color
  };

  document.querySelectorAll('.swatch-grid').forEach(function (grid) {
    var targetId = grid.dataset.target;
    var nativeColor = defaultMap[targetId];
    if (!nativeColor) return;

    // Remove any previous native swatches
    grid.querySelectorAll('.swatch--native').forEach(function (el) { el.remove(); });

    // Check if this color already exists as a preset swatch
    var exists = grid.querySelector('[data-color="' + nativeColor.toLowerCase() + '"]');
    if (exists) return;

    // Create native default swatch and insert after the Default reset button
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch swatch--native';
    btn.style.background = nativeColor;
    btn.dataset.color = nativeColor;
    btn.title = 'Default del estilo';
    btn.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,165,0,0.3)';

    var resetBtn = grid.querySelector('[data-action="reset"]');
    if (resetBtn && resetBtn.nextSibling) {
      grid.insertBefore(btn, resetBtn.nextSibling);
    } else {
      grid.prepend(btn);
    }
  });
}

function renderStyleGallery() {
  if (!styleGallery) {
    return;
  }

  styleGallery.innerHTML = COUNTER_STYLES.map((style) => {
    const svg = renderCounterSvg({
      style: style.id,
      theme: style.defaultTheme,
      digits: 6,
      count: style.sampleCount
    });
    const isActive = style.id === selectedStyle;
    return `<button type="button" class="style-card${isActive ? ' active' : ''}" data-style="${style.id}" aria-pressed="${isActive ? 'true' : 'false'}">
  <img src="${svgToDataUri(svg)}" alt="${style.name}" class="style-card__preview">
  <span class="style-card__name">${style.name}</span>
  <span class="style-card__description">${style.description}</span>
</button>`;
  }).join('');
}

function resetStyleCustomization() {
  if (bgInput) delete bgInput.dataset.userSet;
  if (colorInput) delete colorInput.dataset.userSet;
  if (radiusInput) delete radiusInput.dataset.userSet;

  document.querySelectorAll('.swatch-grid').forEach(function (grid) {
    grid.querySelectorAll('.swatch').forEach(function (swatch) {
      swatch.classList.remove('active');
    });
    var defaultSwatch = grid.querySelector('[data-action="reset"]');
    if (defaultSwatch) {
      defaultSwatch.classList.add('active');
    }
  });
}

function setSelectedStyle(styleId) {
  var nextStyle = COUNTER_STYLES.find(function (style) {
    return style.id === styleId;
  });

  selectedStyle = nextStyle ? nextStyle.id : COUNTER_STYLES[0].id;

  if (styleInput) {
    styleInput.value = selectedStyle;
  }

  resetStyleCustomization();
  syncColorDefaults();
  updateOutputs();
}

function updateOutputs() {
  const options = getOptions();
  const previewSvg = renderCounterSvg(options);
  const hasSiteUrl = !!(siteUrlInput && siteUrlInput.value.trim());

  if (previewImage) {
    previewImage.src = svgToDataUri(previewSvg);
    previewImage.alt = `Vista previa ${options.style}`;
    previewImage.style.width = '100%';
    previewImage.style.height = 'auto';
  }

  if (snippetOutput) {
    snippetOutput.placeholder = 'Pega primero la URL donde vas a poner el contador.';
    snippetOutput.value = hasSiteUrl
      ? buildCounterSnippet(COUNTER_BASE_URL, {
          slug: options.slug,
          digits: options.digits,
          start: options.start,
          theme: options.theme,
          style: options.style,
          bg: options.bg,
          color: options.color,
          radius: options.radius
        })
      : '';
  }



  if (selectedStyleLabel) {
    const currentStyle = COUNTER_STYLES.find((style) => style.id === options.style);
    selectedStyleLabel.textContent = currentStyle ? `${currentStyle.name}. ${currentStyle.description}` : '';
  }

  if (radiusValue && radiusInput) {
    radiusValue.textContent = radiusInput.value + 'px';
  }

  if (copyButton) {
    copyButton.disabled = !hasSiteUrl;
  }

  renderStyleGallery();
}

if (siteUrlInput) {
  siteUrlInput.addEventListener('blur', function () {
    normalizeSiteUrlInput();
    updateOutputs();
  });
}

if (form) {
  form.addEventListener('input', function () {
    updateOutputs();
  });
}

// Radius input lives outside the form, bind directly
if (radiusInput) {
  radiusInput.addEventListener('input', function () {
    radiusInput.dataset.userSet = '1';
    updateOutputs();
  });
}

// Swatch grid click handling
function highlightSwatch(grid, value) {
  grid.querySelectorAll('.swatch').forEach(function (s) {
    s.classList.remove('active');
    if (s.dataset.color && s.dataset.color.toLowerCase() === value.toLowerCase()) {
      s.classList.add('active');
    }
  });
}

document.querySelectorAll('.swatch-grid').forEach(function (grid) {
  var targetId = grid.dataset.target;
  var hiddenInput = document.getElementById(targetId);
  if (!hiddenInput) return;

  // Only highlight if user has already customized
  if (hiddenInput.dataset.userSet) {
    highlightSwatch(grid, hiddenInput.value);
  }

  grid.addEventListener('click', function (event) {
    var btn = event.target.closest('.swatch');
    if (!btn) return;

    if (btn.dataset.action === 'reset') {
      // Reset to default: clear user override
      delete hiddenInput.dataset.userSet;
      grid.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
      btn.classList.add('active');
      syncColorDefaults();
      updateOutputs();
      return;
    }

    if (btn.dataset.action === 'pick') {
      // Open native color picker
      hiddenInput.click();
      return;
    }

    if (btn.dataset.color) {
      hiddenInput.value = btn.dataset.color;
      hiddenInput.dataset.userSet = '1';
      grid.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
      btn.classList.add('active');
      updateOutputs();
    }
  });

  // When native picker changes, mark custom as active
  hiddenInput.addEventListener('input', function () {
    hiddenInput.dataset.userSet = '1';
    // Clear all preset actives, mark custom
    grid.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
    var customBtn = grid.querySelector('[data-action="pick"]');
    if (customBtn) {
      customBtn.classList.add('active');
      customBtn.style.background = hiddenInput.value;
    }
    updateOutputs();
  });
});

if (styleInput) {
  styleInput.addEventListener('change', function () {
    setSelectedStyle(styleInput.value);
  });
}

if (styleGallery) {
  styleGallery.addEventListener('click', function (event) {
    const button = event.target.closest('[data-style]');
    if (!button) {
      return;
    }
    setSelectedStyle(button.getAttribute('data-style') || COUNTER_STYLES[0].id);
  });
}

if (themeInput) {
  themeInput.addEventListener('change', function () {
    if (bgInput) delete bgInput.dataset.userSet;
    if (colorInput) delete colorInput.dataset.userSet;
    if (radiusInput) delete radiusInput.dataset.userSet;

    // Reset swatch grids to show Default active
    document.querySelectorAll('.swatch-grid').forEach(function (g) {
      g.querySelectorAll('.swatch').forEach(function (s) { s.classList.remove('active'); });
      var def = g.querySelector('[data-action="reset"]');
      if (def) def.classList.add('active');
    });

    syncColorDefaults();
    updateOutputs();
  });
}

if (copyButton && snippetOutput) {
  copyButton.addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(snippetOutput.value);
      copyButton.textContent = 'Codigo copiado';
    } catch (error) {
      snippetOutput.focus();
      snippetOutput.select();
      document.execCommand('copy');
      copyButton.textContent = 'Codigo copiado';
    }

    window.setTimeout(function () {
      copyButton.textContent = 'Copiar codigo';
    }, 1600);
  });
}

populateStyleSelect();
syncColorDefaults();
updateOutputs();
