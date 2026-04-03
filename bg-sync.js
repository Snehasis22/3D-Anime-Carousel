/**
 * bg-sync.js
 * ──────────────────────────────────────────────────────────────
 * Handles card-hover background transitions, UI content updates,
 * fan-comment rendering, accent-color sync, and image preloading.
 *
 * On load: auto-syncs to the FIRST card's background (no external
 * default image needed). Hovering any card switches to its bg.
 * Leaving the carousel resets back to the first card's bg.
 *
 * Compatible with GitHub Pages — all paths are URL-encoded before
 * being injected into CSS so spaces work on web servers.
 * ──────────────────────────────────────────────────────────────
 */

// ─── DOM References ───────────────────────────────────────────
const cards = document.querySelectorAll('.card');
const bgOverlays = [
  document.getElementById('bg-overlay-1'),
  document.getElementById('bg-overlay-2')
];
const animeTitle = document.getElementById('anime-title');
const animeDesc = document.getElementById('anime-description');
const animeRating = document.getElementById('anime-rating');
const commentList = document.getElementById('comment-list');
const buttons = document.querySelectorAll('.anime-btn');
const searchBtn = document.getElementById('main-search-btn');
const cylinder = document.querySelector('.cylinder');

// ─── State ────────────────────────────────────────────────────
let currentOverlayIndex = 0;

// ─── Fan Comments Database ────────────────────────────────────
const commentsData = {
  'NARUTO': [
    "Believe it! This show changed my life.",
    "The fight scenes are legendary.",
    "Dattebayo!",
    "Itachi's story always makes me cry."
  ],
  'JUJUTSU KAISEN': [
    "Mappa's animation is on another level.",
    "Gojo is literally the strongest.",
    "The Shibuya arc is gonna be insane.",
    "Domain Expansion: Infinite Aesthetics."
  ],
  'ONE PIECE': [
    "The world-building is unmatched.",
    "I've been watching for 10 years and still love it.",
    "Gomu Gomu no...",
    "The Gear 5 reveal was peak fiction!"
  ],
  'SOLO LEVELING': [
    "Arise! The hype is real.",
    "The art style is so clean.",
    "Sung Jin-Woo is a beast.",
    "Shadow Monarch power is just insane."
  ],
  'SPY X FAMILY': [
    "Waku Waku!",
    "Anya is the cutest character ever.",
    "Loid and Yor are the ultimate power couple.",
    "Best wholesome anime of the decade."
  ],
  'ATTACK ON TITAN': [
    "A masterpiece of storytelling.",
    "The twists kept me on the edge of my seat.",
    "Sasageyo!",
    "Eren did nothing wrong... or did he?"
  ],
  'CHAINSAW MAN': [
    "Chaos in its purest form.",
    "The opening theme is a banger.",
    "Pochita is the best boy.",
    "The cinematic direction is incredible."
  ],
  'DEATH NOTE': [
    "I'll take a potato chip... and EAT IT!",
    "A battle of wits like no other.",
    "L was right.",
    "Still the best psychological thriller."
  ],
  'DEMON SLAYER': [
    "The animation in episode 19 was legendary.",
    "Zenitsu's speed is incredible.",
    "Tanjiro's kindness is his greatest strength.",
    "Beautiful art style."
  ],
  'ONE PUNCH MAN': [
    "Saitama is too relatable.",
    "The comedy and action balance is perfect.",
    "OK.",
    "Genos deserves more wins."
  ]
};

// ─── Helpers ──────────────────────────────────────────────────

/**
 * URL-encodes each path segment so filenames with spaces work
 * correctly on GitHub Pages and all HTTP servers.
 * "Background/Naruto background.jpg" → "Background/Naruto%20background.jpg"
 */
function encodePath(rawPath) {
  if (!rawPath) return '';
  return rawPath.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

/**
 * Renders fan comments into the comment box.
 * @param {string[]} comments
 */
function renderComments(comments) {
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerText = `"${comment}"`;
    commentList.appendChild(div);
  });
}

// ─── Core: Background + UI Sync ──────────────────────────────

/**
 * Instantly swaps the background overlay without any content change.
 * Used for the very first render (no animation flash).
 */
function setBackgroundSilent(bgImg) {
  const encoded = encodePath(bgImg);
  bgOverlays[currentOverlayIndex].style.backgroundImage = `url('${encoded}')`;
  bgOverlays[currentOverlayIndex].classList.add('active');
}

/**
 * Transitions the background and syncs all UI elements to a card.
 *
 * @param {string} bgImg     – relative path (spaces allowed, will be encoded)
 * @param {string} title     – anime title
 * @param {string} desc      – anime description
 * @param {string} rating    – numeric rating string
 * @param {string} accentCol – hex accent color
 */
function updateDisplay(bgImg, title, desc, rating, accentCol) {
  if (!bgImg) return;

  const encodedBg = encodePath(bgImg);

  // ── Cross-fade background overlays ───────────────────────
  const nextIndex = (currentOverlayIndex + 1) % 2;
  const nextOverlay = bgOverlays[nextIndex];
  const prevOverlay = bgOverlays[currentOverlayIndex];

  nextOverlay.style.backgroundImage = `url('${encodedBg}')`;
  nextOverlay.classList.add('active');
  prevOverlay.classList.remove('active');
  currentOverlayIndex = nextIndex;

  // ── Animate content out ───────────────────────────────────
  animeTitle.style.opacity = 0;
  animeDesc.style.opacity = 0;
  animeRating.style.opacity = 0;
  commentList.style.opacity = 0;
  animeTitle.style.transform = 'translateY(-20px)';

  // ── Update content after transition delay ─────────────────
  setTimeout(() => {
    animeTitle.innerText = title;
    animeDesc.innerText = desc;
    animeRating.innerText = `⭐ ${rating} / 10`;
    animeTitle.style.color = accentCol;
    animeRating.style.display = 'block';

    // Fan comments for this anime
    renderComments(commentsData[title] || ['No comments yet.']);

    // Accent color propagation
    buttons.forEach(btn => btn.style.setProperty('--primary-color', accentCol));
    searchBtn.style.background = `linear-gradient(90deg, ${accentCol}, #009EFD)`;
    searchBtn.style.boxShadow = `0 0 20px ${accentCol}60`;
    document.documentElement.style.setProperty('--accent-glow', accentCol);

    // ── Animate content in ────────────────────────────────
    animeTitle.style.opacity = 1;
    animeDesc.style.opacity = 1;
    animeRating.style.opacity = 1;
    commentList.style.opacity = 1;
    animeTitle.style.transform = 'translateY(0)';
  }, 350);
}

// ─── Card Hover Listeners ─────────────────────────────────────
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    updateDisplay(
      card.getAttribute('data-bg'),
      card.getAttribute('data-title'),
      card.getAttribute('data-desc'),
      card.getAttribute('data-rating'),
      card.getAttribute('data-color') || '#ffffff'
    );
  });
});

// ─── Reset on Mouse Leave — back to FIRST card ───────────────
cylinder.addEventListener('mouseleave', () => {
  setTimeout(() => {
    const stillHovering = Array.from(cards).some(c => c.matches(':hover'));
    if (!stillHovering && cards.length > 0) {
      const first = cards[0];
      updateDisplay(
        first.getAttribute('data-bg'),
        first.getAttribute('data-title'),
        first.getAttribute('data-desc'),
        first.getAttribute('data-rating'),
        first.getAttribute('data-color') || '#ffffff'
      );
    }
  }, 100);
});

// ─── Init: Load First Card + Preload All Backgrounds ─────────
window.onload = () => {
  window.scrollTo(0, 0);

  if (cards.length === 0) return;

  const firstCard = cards[0];
  const firstBg = firstCard.getAttribute('data-bg');

  // Silently set first card bg so page loads with a rich background
  setBackgroundSilent(firstBg);

  // Show first card's info without animation on load
  animeTitle.innerText = firstCard.getAttribute('data-title');
  animeDesc.innerText = firstCard.getAttribute('data-desc');
  const firstRating = firstCard.getAttribute('data-rating');
  animeRating.innerText = `⭐ ${firstRating} / 10`;
  animeRating.style.display = 'block';
  const firstColor = firstCard.getAttribute('data-color') || '#ffffff';
  animeTitle.style.color = firstColor;
  document.documentElement.style.setProperty('--accent-glow', firstColor);
  buttons.forEach(btn => btn.style.setProperty('--primary-color', firstColor));
  searchBtn.style.background = `linear-gradient(90deg, ${firstColor}, #009EFD)`;
  searchBtn.style.boxShadow = `0 0 20px ${firstColor}60`;

  // Show first card's comments
  renderComments(commentsData[firstCard.getAttribute('data-title')] || ['No comments yet.']);

  // Preload ALL card backgrounds for instant hover transitions
  Array.from(cards)
    .map(c => c.getAttribute('data-bg'))
    .filter(Boolean)
    .forEach(bg => {
      const img = new Image();
      img.src = encodePath(bg);
    });
};
