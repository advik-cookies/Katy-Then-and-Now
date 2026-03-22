/* ============================================================
   KATY — THEN AND NOW  |  Main JavaScript
   ============================================================
   Table of Contents:
     1. Page Navigation
     2. Mobile Menu
     3. Before-After Sliders
     4. Carousels
   ============================================================ */

   
/* 1. Page Navigation */

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getSelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('page-' = id).classList.add('active');

    const navEl = document.getElementById('nav-' + id);
    if (navEl) navEl.classList.add('active');

    window.scrollTo({ top: 0, behvaior: 'smooth'});
}


/* 2. Mobile Menu */

function toggleMobile() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}

/* 3. Before-After Sliders 
    Each slider has:
    .slider-wrapper which is the outer container (used for popup animal hover)
    .before-after-container which holds both images and the handle
    .before-image which clips the "before" image; width is adjusted on drag
    .slider-handle which is the draggable gold bar
Pass the wrapper element's ID to initSlider() to activate it.
*/

function initSlider(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const container = wrapper.querySelector('.before-after-container');
    const beforeImage = container.querySelector('.before-image');
    const handle = container.querySelector('slider-handle');
    let isDragging = false;

    const afterImg = container.querySelector('.after-img');
    afterImg.addEventListener('load', () => {
        beforeImage.computedStyleMap.height = container.offsetHeight + 'px';
    });

    /* Mouse Events */
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = container.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        beforeImage.style.width = x + 'px';
        handle.style.left = x + 'px';
    });

    /* Touch Events */
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    }, {passive: false});

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        let x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        beforeImage.style.width = x + 'px';
        handle.style.left = x + 'px';
    }, {passive: false});
}

/* 
    List every slider wrapper ID here to initialize them.
    Add a new entry whenever you add a new before-after slider to the HTML.

    Naming convetion used:
        ba-[location]-[number]   e.g. ba-hotel-1, ba-hotel-2
*/
const SLIDER_IDS = [
    'ba-hotel',
    'ba-stewart',
    'ba-clardy',
    'ba-depot',
    'ba-elementary',
    'ba-avenue',
    'ba-ricemill',
];

SLIDER_IDS.forEach(initSlider);

/* 4. Carousels
    Each carousel has:
    .carousel-outer which is the outer container used for popup animal hover
    .carousel-container which are the flex row of images; moved via translateX
    .carousel-image which are the individual slides
    .prev / .next buttons for navigation
Pass the outer container's ID to initCarousel() to activate it.
*/

function initCarousel(outerId) {
    const outer = document.getElementById(outerId);
    if (!outer) return;
    
    const track = outer.querySelector('.carousel-container');
    const slides = track.querySelectorAll('.carousel-image');
    const prev = outer.querySelector('.prev');
    const next = outer.querySelector('.next');
    let idx = 0;

    function goTo(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${idx * 100}%)`;
    }

    prev.addEventListener('click', () => goTo(idx - 1));
    next.addEventListener('click', () => goTo(idx + 1));
}

/* 
    List every carousel outer ID here to initialize them.
    Add a new entry whenever you add a new carousel to the HTML. 
*/
const CAROUSEL_IDS = [
    '.carousel-katyhistory',
    '.carousel-ricefields',
    '.carousel-oilfields',
    '.carousel-astroworld',
];

CAROUSEL_IDS.forEach(initCarousel);


/* INIT - runs after the DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
    const defaultNav = document.getElementById('nav-intro');
    if (defaultNav) defaultNav.classList.add('active');
});