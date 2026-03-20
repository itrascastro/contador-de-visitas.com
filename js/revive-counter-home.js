import { renderCounterSvg, svgToDataUri } from './modern-counter-styles.js';

const preview = document.getElementById('home-counter-preview');

if (preview) {
  const svg = renderCounterSvg({
    style: 'mono',
    theme: 'dark',
    digits: 6,
    count: 128734,
    label: 'visitas'
  });

  preview.src = svgToDataUri(svg);
}
