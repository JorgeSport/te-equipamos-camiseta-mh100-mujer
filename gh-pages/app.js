const colors = {
  rojo: { name: 'Rojo rubí', images: ['p2643977/k$0f01fba00d839c4526837db1ed1a997c','p2643974/k$1a490abc8ace800624ca8a49ceffe767','p2643975/k$3f4e54c0f07a5b14b988673ba236e459','p2643976/k$a47c358c8c399e8100a1e24677ffd8d3','p2612391/k$d55d199949a198dc8415b7d03772787c'] },
  menta: { name: 'Verde menta pálido', images: ['p2276955/k$fb86b83f3b38a4be57929c27cf88221d','p2276956/k$fe234f36914a01e418e8e24b060f403d','p2276954/k$c3272daf00690f47eae879ea5343ebf4','p2276957/k$795358840a88297d9feb2cf35d80a5ca','p2248218/k$8dcc503588b40019dc1ed0322430c0ad'] }
};
const productPage = 'https://jorgesport.github.io/te-equipamos-camiseta-mh100-mujer/';
const imageUrl = path => `https://contents.mediadecathlon.com/${path}/picture.jpg?f=1600x0&format=auto`;
const requestedColor = new URLSearchParams(location.search).get('color');
let activeColor = colors[requestedColor] ? requestedColor : 'rojo';
let activeImage = 0;
let activeSize = 'M';
let touchStart = null;

const stageImage = document.querySelector('.zoom-image img');
const storyImage = document.querySelector('.story-image img');
const thumbnails = document.querySelector('.thumbnails');
const colorName = document.querySelector('.color-picker strong');
const colorButtons = [...document.querySelectorAll('.color-options button')];
const sizeButtons = [...document.querySelectorAll('.size-options button')];
const sizeName = document.querySelector('.size-picker>div:first-child strong');
const whatsappLinks = [...document.querySelectorAll('a[href*="wa.me"]')];

function selectedUrl() { return `${productPage}?color=${activeColor}#inicio`; }
function whatsappUrl() {
  const message = `Hola Te Equipamos, deseo consultar por la camiseta de montaña Quechua MH100 para mujer en color ${colors[activeColor].name}, talla ${activeSize}. Precio: S/75.00 por unidad o S/65.00 por unidad comprando 2 o más.\n\nEnlace del producto: ${selectedUrl()}`;
  return `https://wa.me/51920807184?text=${encodeURIComponent(message)}`;
}
function syncWhatsapp() { whatsappLinks.forEach(link => link.href = whatsappUrl()); }
function renderGallery() {
  const selected = colors[activeColor];
  const images = selected.images.map(imageUrl);
  stageImage.src = images[activeImage];
  stageImage.alt = `Camiseta Quechua MH100 ${selected.name}, vista ${activeImage + 1}`;
  storyImage.src = images[1];
  storyImage.alt = `Detalle de camiseta MH100 ${selected.name}`;
  colorName.textContent = selected.name;
  const selectedColorSpec = document.querySelector('.spec-list p:nth-child(7) strong');
  if (selectedColorSpec) selectedColorSpec.textContent = selected.name;
  thumbnails.innerHTML = '';
  images.forEach((src, index) => {
    const button = document.createElement('button');
    button.className = index === activeImage ? 'active' : '';
    button.setAttribute('aria-label', `Ver imagen ${index + 1}`);
    button.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
    button.addEventListener('click', () => { activeImage = index; renderGallery(); });
    thumbnails.appendChild(button);
  });
  colorButtons.forEach((button, index) => button.classList.toggle('active', Object.keys(colors)[index] === activeColor));
  syncWhatsapp();
}
function move(direction) { activeImage = (activeImage + direction + 5) % 5; renderGallery(); updateLightbox(); }

document.querySelector('.gallery-arrow.left').addEventListener('click', () => move(-1));
document.querySelector('.gallery-arrow.right').addEventListener('click', () => move(1));
colorButtons.forEach((button, index) => button.addEventListener('click', () => {
  activeColor = Object.keys(colors)[index]; activeImage = 0; renderGallery();
  history.replaceState(null, '', `?color=${activeColor}#inicio`);
  document.querySelector('.gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));
sizeButtons.forEach(button => button.addEventListener('click', () => {
  activeSize = button.textContent.trim();
  sizeButtons.forEach(item => item.classList.toggle('active', item === button));
  sizeName.textContent = activeSize;
  syncWhatsapp();
}));

const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-button');
menu.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Cerrar">×</button><button class="lightbox-arrow left" aria-label="Imagen anterior">‹</button><img alt="Imagen ampliada"><button class="lightbox-arrow right" aria-label="Imagen siguiente">›</button><p></p>';
function updateLightbox() { lightbox.querySelector('img').src = imageUrl(colors[activeColor].images[activeImage]); lightbox.querySelector('p').textContent = `${activeImage + 1} / 5 · ${colors[activeColor].name}`; }
function openLightbox() { updateLightbox(); document.body.appendChild(lightbox); }
function closeLightbox() { lightbox.remove(); }
document.querySelector('.zoom-image').addEventListener('click', openLightbox);
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-arrow.left').addEventListener('click', event => { event.stopPropagation(); move(-1); });
lightbox.querySelector('.lightbox-arrow.right').addEventListener('click', event => { event.stopPropagation(); move(1); });
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

const stage = document.querySelector('.gallery-stage');
stage.addEventListener('touchstart', event => touchStart = event.touches[0].clientX, { passive: true });
stage.addEventListener('touchend', event => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1); }, { passive: true });

const shareButtons = [...document.querySelectorAll('.share-row button:first-child, footer button')];
async function shareProduct() {
  const data = { title: 'Camiseta Quechua MH100 Mujer | Te Equipamos', text: `Camiseta de montaña MH100 desde S/65 por unidad. Color ${colors[activeColor].name}.`, url: selectedUrl() };
  try { if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(`${data.text} ${data.url}`); } catch {}
}
shareButtons.forEach(button => button.addEventListener('click', shareProduct));
const copyButton = document.querySelector('.share-row button[aria-label="Copiar enlace"]');
copyButton.addEventListener('click', () => navigator.clipboard.writeText(selectedUrl()));
renderGallery();
