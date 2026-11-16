'use strict';

const films = {
  'exterior-orbit': { title: 'Architecture in motion', category: 'THE ARCHITECTURE', caption: 'A moving perspective on the development, its scale and waterfront setting.', duration: 12 },
  'waterfront-detail': { title: 'Closer to the water', category: 'THE ARCHITECTURE', caption: 'A closer view of the waterfront, terraces and marina.', duration: 6 },
  lounge: { title: 'Dining & lounge', category: 'THE SHARED SPACES', caption: 'Warm materials, intimate seating and a place for everyday conversations.', duration: 6 },
  yoga: { title: 'Yoga studio', category: 'THE SHARED SPACES', caption: 'Natural textures, open views and space to slow down.', duration: 9 },
  games: { title: 'Games room', category: 'THE SHARED SPACES', caption: 'An inviting setting for play, conversation and time together.', duration: 7 },
  'living-dining': { title: 'Living & dining', category: 'THE INTERIORS', caption: 'Follow the connection between the living area, dining space and staircase.', duration: 8 },
  'kitchen-living': { title: 'Kitchen & living', category: 'THE INTERIORS', caption: 'A closer look at the kitchen, island and adjoining living space.', duration: 8 },
  bedrooms: { title: 'The bedrooms', category: 'THE INTERIORS', caption: 'Explore the bedrooms through a sequence of quieter interior moments.', duration: 11 },
  lighting: { title: 'A change in atmosphere', category: 'LIGHT & ATMOSPHERE', caption: 'The development changes character as the light changes.', duration: 8 }
};
const galleries = {
  architecture: [
    ['aerial-morning','The wider setting'], ['street-arrival','The arrival'], ['waterfront-evening','Waterfront at dusk'], ['hero-evening','The evening aerial']
  ],
  amenities: [
    ['amenity-lounge','Dining & lounge'], ['amenity-yoga','Yoga studio'], ['amenity-games','Games room'], ['amenity-fitness','Fitness studio'], ['amenity-screening','Screening lounge'], ['amenity-court','Indoor court']
  ],
  interiors: [
    ['open-living','Open living & dining'], ['living-room','The living room'], ['dining-room','The dining room'], ['kitchen','The kitchen'], ['bedroom-primary','Primary bedroom'], ['bedroom-second','Second bedroom'], ['terrace-lounge','Terrace lounge'], ['terrace-view','A view from the terrace'], ['bedroom-detail','Bedroom detail']
  ]
};
const imagePath = name => `assets/images/${name}.webp`;
const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Open navigation'); }
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
const headerState = () => {
  header.classList.toggle('scrolled', window.scrollY > 35);
  if (window.scrollY < document.querySelector('#architecture').offsetTop - 150) {
    document.querySelectorAll('.desktop-nav a').forEach(link => link.removeAttribute('aria-current'));
  }
};
window.addEventListener('scroll', headerState, { passive:true }); headerState();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.desktop-nav a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin:'-15% 0px -55% 0px', threshold:0 });
  document.querySelectorAll('#architecture,#shared-spaces,#interiors,#atmosphere').forEach(section => observer.observe(section));
}

function connectTabs(selector, onSelect) {
  const list = document.querySelector(selector);
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    onSelect(tab.dataset.room, tab.id); if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  });
}
connectTabs('.room-tabs', (room, tabId) => {
  const info = films[room];
  document.querySelector('#amenity-panel').setAttribute('aria-labelledby',tabId);
  const image = document.querySelector('#amenity-image'); image.src = imagePath(`amenity-${room}`); image.alt = info.title;
  document.querySelector('#amenity-title').textContent = info.title;
  document.querySelector('#amenity-description').textContent = info.caption;
  document.querySelector('#amenity-duration').textContent = `${info.duration} SEC FILM`;
  const button = document.querySelector('#amenity-film'); button.dataset.film = room; button.setAttribute('aria-label',`Play ${info.title.toLowerCase()} film`);
});
const interiorScenes = {
  'living-dining': ['open-living','Room to come together.'],
  'kitchen-living': ['kitchen','Connected by design.'],
  bedrooms: ['bedroom-primary','A quieter place to return to.']
};
connectTabs('.interior-tabs', (room, tabId) => {
  const info = films[room], scene = interiorScenes[room];
  document.querySelector('#interior-panel').setAttribute('aria-labelledby',tabId);
  const image = document.querySelector('#interior-image'); image.src = imagePath(scene[0]); image.alt = info.title;
  document.querySelector('#interior-title').textContent = scene[1];
  document.querySelector('#interior-duration').textContent = `${info.duration} SEC FILM`;
  const button = document.querySelector('#interior-film'); button.dataset.film = room; button.setAttribute('aria-label',`Play ${info.title.toLowerCase()} film`);
});

const comparison = document.querySelector('#comparison');
const lightSlider = document.querySelector('#light-slider');
function updateLight() { const value = Number(lightSlider.value); comparison.style.setProperty('--split',`${value}%`); lightSlider.setAttribute('aria-valuetext',`${value}% morning, ${100-value}% evening`); }
lightSlider.addEventListener('input',updateLight);
document.querySelectorAll('[data-light]').forEach(button => button.addEventListener('click', () => { lightSlider.value = button.dataset.light; updateLight(); }));

const dialog = document.querySelector('#media-dialog');
const videoView = document.querySelector('#video-view');
const imageView = document.querySelector('#image-view');
const video = document.querySelector('#showcase-video');
const playToggle = document.querySelector('#toggle-play');
const overlayPlay = document.querySelector('#overlay-play');
const progress = document.querySelector('#video-progress');
const time = document.querySelector('#video-time');
const playerMessage = document.querySelector('#player-message');
const retryVideo = document.querySelector('#retry-video');
let returnFocus = null, galleryName = '', galleryIndex = 0, currentFilm = '', currentMode = '';
const formatTime = value => { const seconds = Number.isFinite(value) ? Math.floor(value) : 0; return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`; };
function openDialog(mode) {
  returnFocus = document.activeElement; currentMode = mode;
  closeMenu(); videoView.hidden = mode !== 'video'; imageView.hidden = mode !== 'image';
  document.body.classList.add('modal-open');
  if (!dialog.open) dialog.showModal();
  document.querySelector('.close-dialog').focus({preventScroll:true});
}
function showPlayerMessage(message, canRetry = false) {
  playerMessage.querySelector('span').textContent = message;
  retryVideo.hidden = !canRetry; playerMessage.hidden = false;
}
function syncPlayButton() {
  const paused = video.paused || video.ended;
  playToggle.setAttribute('aria-label', paused ? 'Play film' : 'Pause film');
  playToggle.querySelector('use').setAttribute('href',paused ? '#i-play' : '#i-pause');
  overlayPlay.hidden = !paused;
}
async function playFilm() {
  playerMessage.hidden = true;
  if (video.ended) video.currentTime = 0;
  try { await video.play(); } catch (error) { if (error.name !== 'AbortError') { syncPlayButton(); if (error.name !== 'NotAllowedError') showPlayerMessage('The film could not be loaded. Please try again.',true); } }
}
function openFilm(key) {
  const film = films[key]; if (!film) return;
  currentFilm = key;
  document.querySelector('#media-title').textContent = film.title;
  document.querySelector('#media-category').textContent = `${film.category} / SHORT FILM`;
  document.querySelector('#video-caption').textContent = film.caption;
  openDialog('video');
  video.poster = `assets/posters/${key}.webp`;
  video.src = `assets/videos/${key}.mp4`;
  video.setAttribute('aria-label',film.title);
  progress.value = 0; time.textContent = `0:00 / ${formatTime(film.duration)}`;
  syncPlayButton(); playFilm();
}
function togglePlay() { if (video.paused || video.ended) playFilm(); else video.pause(); }
playToggle.addEventListener('click',togglePlay); overlayPlay.addEventListener('click',playFilm);
video.addEventListener('click',togglePlay);
video.addEventListener('contextmenu',event => event.preventDefault());
video.addEventListener('play',syncPlayButton); video.addEventListener('pause',syncPlayButton); video.addEventListener('ended',syncPlayButton);
video.addEventListener('waiting', () => { if (currentMode === 'video') showPlayerMessage('Loading film…'); });
video.addEventListener('playing', () => { playerMessage.hidden = true; });
video.addEventListener('canplay', () => { playerMessage.hidden = true; });
video.addEventListener('error', () => { if (currentMode === 'video' && video.getAttribute('src')) showPlayerMessage('The film could not be loaded. Please try again.',true); });
retryVideo.addEventListener('click', () => { video.load(); playFilm(); });
function updateTime() {
  const duration = Number.isFinite(video.duration) ? video.duration : (films[currentFilm]?.duration || 0);
  time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
  if (duration) progress.value = video.currentTime / duration * 100;
  progress.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} of ${formatTime(duration)}`);
}
video.addEventListener('timeupdate',updateTime); video.addEventListener('loadedmetadata',updateTime);
progress.addEventListener('input', () => { if (Number.isFinite(video.duration)) video.currentTime = Number(progress.value)/100*video.duration; });
const fullscreenButton = document.querySelector('#fullscreen-video');
const videoStage = document.querySelector('#video-stage');
if (!videoStage.requestFullscreen && !video.webkitEnterFullscreen) fullscreenButton.hidden = true;
fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (videoStage.requestFullscreen) await videoStage.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
  } catch { showPlayerMessage('Fullscreen is unavailable in this browser. You can continue watching here.'); }
});
document.addEventListener('fullscreenchange', () => fullscreenButton.setAttribute('aria-label',document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen'));

function renderImage() {
  const group = galleries[galleryName], [file,title] = group[galleryIndex];
  const img = document.querySelector('#viewer-image'); img.src = imagePath(file); img.alt = title;
  document.querySelector('#media-title').textContent = title;
  document.querySelector('#media-category').textContent = `${galleryName === 'amenities' ? 'SHARED SPACES' : galleryName.toUpperCase()} / STILL GALLERY`;
  document.querySelector('#image-caption').textContent = title;
  document.querySelector('#image-count').textContent = `${String(galleryIndex+1).padStart(2,'0')} / ${String(group.length).padStart(2,'0')}`;
  document.querySelectorAll('#image-thumbnails button').forEach((button,i) => button.setAttribute('aria-current',String(i === galleryIndex)));
}
function openGallery(name,index) {
  if (!galleries[name]) return;
  galleryName = name; galleryIndex = index;
  const thumbnails = document.querySelector('#image-thumbnails'); thumbnails.replaceChildren();
  galleries[name].forEach(([file,title],i) => {
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label',`View ${title.toLowerCase()}`);
    const img = document.createElement('img'); img.src = imagePath(file); img.alt = ''; img.loading = 'lazy';
    button.append(img); button.addEventListener('click', () => { galleryIndex = i; renderImage(); }); thumbnails.append(button);
  });
  renderImage(); openDialog('image');
}
function stepImage(direction) { galleryIndex = (galleryIndex+direction+galleries[galleryName].length)%galleries[galleryName].length; renderImage(); }
document.querySelector('#image-prev').addEventListener('click', () => stepImage(-1));
document.querySelector('#image-next').addEventListener('click', () => stepImage(1));
document.querySelector('#viewer-image').addEventListener('contextmenu',event => event.preventDefault());
document.addEventListener('click', event => {
  const filmButton = event.target.closest('[data-film]'); if (filmButton) openFilm(filmButton.dataset.film);
  const imageButton = event.target.closest('[data-gallery]'); if (imageButton) openGallery(imageButton.dataset.gallery,Number(imageButton.dataset.index)||0);
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  currentMode = ''; video.pause(); video.removeAttribute('src'); video.load(); playerMessage.hidden = true;
  document.body.classList.remove('modal-open'); returnFocus?.focus({preventScroll:true});
});
dialog.addEventListener('keydown', event => {
  if (currentMode === 'image' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); stepImage(event.key === 'ArrowLeft' ? -1 : 1); }
  if (currentMode === 'video' && event.target.tagName !== 'INPUT') {
    if (event.key.toLowerCase() === 'k') { event.preventDefault(); togglePlay(); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); if (Number.isFinite(video.duration)) video.currentTime = Math.max(0,Math.min(video.duration,video.currentTime+(event.key === 'ArrowLeft' ? -5 : 5))); }
  }
});
