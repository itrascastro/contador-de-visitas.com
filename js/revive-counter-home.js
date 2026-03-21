import { renderCounterSvg, svgToDataUri } from './modern-counter-styles.js';

const preview = document.getElementById('home-counter-preview');

if (preview) {
  const svg = renderCounterSvg({
    style: 'split',
    theme: 'dark',
    digits: 6,
    count: 128734
  });

  preview.src = svgToDataUri(svg);
  preview.style.width = '100%';
  preview.style.height = 'auto';
}
