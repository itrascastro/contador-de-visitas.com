import {
  COUNTER_STYLES,
  buildCounterSnippet,
  normalizeCounterOptions,
  renderCounterSvg,
  slugifyCounterId,
  svgToDataUri
} from './modern-counter-styles.js';

const COUNTER_BASE_URL = 'https://contador-de-visitas.com';

const slugInput = document.getElementById('counter-slug');
const labelInput = document.getElementById('counter-label');
const digitsInput = document.getElementById('counter-digits');
const startInput = document.getElementById('counter-start');
const themeInput = document.getElementById('counter-theme');
const previewImage = document.getElementById('counter-preview-image');
const snippetOutput = document.getElementById('counter-snippet');
const copyButton = document.getElementById('copy-counter-snippet');
const styleGallery = document.getElementById('style-gallery');
const selectedStyleLabel = document.getElementById('selected-style-label');
const previewUrlOutput = document.getElementById('counter-preview-url');
const form = document.getElementById('counter-generator-form');

let selectedStyle = COUNTER_STYLES[0].id;

function getPreviewCount(startValue) {
  return Math.max(startValue + 1, 128734);
}

function getOptions() {
  return normalizeCounterOptions({
    slug: slugInput ? slugInput.value : '',
    label: labelInput ? labelInput.value : '',
    digits: digitsInput ? digitsInput.value : '',
    start: startInput ? startInput.value : '',
    count: getPreviewCount(Number.parseInt(startInput ? startInput.value : '0', 10) || 0),
    theme: themeInput ? themeInput.value : '',
    style: selectedStyle
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
      count: style.sampleCount,
      label: style.sampleLabel
    });
    const isActive = style.id === selectedStyle;
    return `<button type="button" class="style-card${isActive ? ' active' : ''}" data-style="${style.id}" aria-pressed="${isActive ? 'true' : 'false'}">
  <img src="${svgToDataUri(svg)}" alt="${style.name}" class="style-card__preview">
  <span class="style-card__name">${style.name}</span>
  <span class="style-card__description">${style.description}</span>
</button>`;
  }).join('');
}

function updateOutputs() {
  const options = getOptions();
  const previewSvg = renderCounterSvg(options);

  if (previewImage) {
    previewImage.src = svgToDataUri(previewSvg);
    previewImage.alt = `Vista previa ${options.style}`;
  }

  if (snippetOutput) {
    snippetOutput.value = buildCounterSnippet(COUNTER_BASE_URL, {
      slug: options.slug,
      label: options.label,
      digits: options.digits,
      start: options.start,
      theme: options.theme,
      style: options.style
    });
  }

  if (previewUrlOutput) {
    previewUrlOutput.textContent = `https://contador-de-visitas.com/c/${options.slug}.svg?style=${options.style}&digits=${options.digits}&theme=${options.theme}${options.label ? `&label=${encodeURIComponent(options.label)}` : ''}${options.start > 0 ? `&start=${options.start}` : ''}`;
  }

  if (selectedStyleLabel) {
    const currentStyle = COUNTER_STYLES.find((style) => style.id === options.style);
    selectedStyleLabel.textContent = currentStyle ? `${currentStyle.name}. ${currentStyle.description}` : '';
  }

  renderStyleGallery();
}

if (slugInput) {
  slugInput.addEventListener('blur', function () {
    slugInput.value = slugifyCounterId(slugInput.value);
    updateOutputs();
  });
}

if (form) {
  form.addEventListener('input', updateOutputs);
}

if (styleGallery) {
  styleGallery.addEventListener('click', function (event) {
    const button = event.target.closest('[data-style]');
    if (!button) {
      return;
    }

    selectedStyle = button.getAttribute('data-style') || COUNTER_STYLES[0].id;
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

updateOutputs();
