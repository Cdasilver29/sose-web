// SOSE site behaviour. Vanilla, no dependencies, loaded with defer on every page.

// ---- the scroll driver ------------------------------------------------
// One scroll listener and one requestAnimationFrame callback for every
// scroll-linked effect on the site: the nav's compressed state, the nav hiding
// on the way down, and both parallax layers. Nothing else in the project
// listens on scroll. A listener per effect is how a page ends up doing three
// layout reads and three style writes per frame, all of them fighting.
//
// The reads are hoisted out entirely. Element positions are measured once, on
// load and on resize, so the frame itself only reads scrollY and only writes
// transforms — no interleaving, no forced synchronous layout.
const nav = document.getElementById('nav');
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Only the home page has a hero to sit transparently over. Everywhere else the
// header is permanently in its compressed state. Toggling on scroll *and*
// force-adding the class, as this did before it was a class on <html>, meant
// any scroll back to the top removed it again; that was invisible when the
// class only changed a background, but it now drives --nav-h, and the
// breadcrumb bar would jump 12px.
const hasHero = !!document.querySelector('.hero');
if (!hasHero) root.classList.add('scrolled');

let menuIsOpen = false; // owned by the mobile menu block below
let layers = [];
let lastY = scrollY;
let queued = false;

const clamp = (n, min, max) => (n < min ? min : n > max ? max : n);

// Measured with the drift cleared, so a re-measure never compounds the offset
// it is currently applying.
function measureLayers() {
  layers = [...document.querySelectorAll('[data-parallax]')].map((el) => {
    el.style.transform = '';
    const box = el.getBoundingClientRect();
    return {
      el,
      rate: parseFloat(el.dataset.parallax) || 0,
      centre: box.top + scrollY + box.height / 2,
    };
  });
}

function frame() {
  queued = false;
  const y = scrollY;

  if (hasHero) root.classList.toggle('scrolled', y > 40);

  if (!reduceMotion.matches) {
    // Hidden on the way down, back on the way up. Never while the overlay is
    // open, because closing it hands focus to the burger and the burger has to
    // be on screen to receive it. Never in the first 200px either: a header
    // that vanishes the moment you nudge the page reads as a glitch.
    // The 4px deadband keeps trackpad jitter from flickering it.
    if (menuIsOpen || y < 200) root.classList.remove('nav-hidden');
    else if (y > lastY + 4) root.classList.add('nav-hidden');
    else if (y < lastY - 4) root.classList.remove('nav-hidden');

    // Offset is zero when a layer's centre sits on the viewport's centre, so
    // the drift passes through neutral as the band goes by rather than
    // starting from wherever the page happened to load. Clamped to 60px, which
    // is well inside the 80px of bleed each layer carries.
    for (const layer of layers) {
      const offset = clamp((y + innerHeight / 2 - layer.centre) * layer.rate, -60, 60);
      layer.el.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`;
    }
  }

  lastY = y;
}

const requestFrame = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(frame);
};

addEventListener('scroll', requestFrame, { passive: true });
addEventListener(
  'resize',
  () => {
    measureLayers();
    requestFrame();
  },
  { passive: true }
);

measureLayers();
frame();

// ---- active route -----------------------------------------------------
// Marks the current section in both navs. A page under /services/ marks the
// Services item, so deep pages still show where you are.
(() => {
  const path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav-links a, .mobile-menu a, .drop a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    const isHome = href === '/';
    const match = isHome ? path === '/' : path.startsWith(href);
    if (match) a.setAttribute('aria-current', 'page');
  });
})();

// ---- services dropdown, keyboard accessible ---------------------------
(() => {
  const trigger = document.getElementById('svcTrigger');
  const drop = trigger && trigger.parentElement.querySelector('.drop');
  if (!trigger || !drop) return;

  const open = (state) => {
    drop.classList.toggle('open', state);
    trigger.setAttribute('aria-expanded', String(state));
  };

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open(true);
      drop.querySelector('a').focus();
    }
  });
  trigger.parentElement.addEventListener('focusout', (e) => {
    if (!trigger.parentElement.contains(e.relatedTarget)) open(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drop.classList.contains('open')) {
      open(false);
      trigger.focus();
    }
  });
})();

// ---- mobile menu ------------------------------------------------------
const burger = document.getElementById('burger');
const menu = document.getElementById('mobileMenu');
const menuClose = document.getElementById('menuClose');
if (burger && menu) {
  // The breadcrumb bar is hidden under 820px, so the overlay carries the trail
  // instead. Cloned as plain text, not links: in a fullscreen menu it is there
  // to say where you are, and everything around it is already navigation.
  const crumbBar = document.querySelector('.crumb-bar');

  const setMenu = (isOpen) => {
    menuIsOpen = isOpen;
    // The header cannot be parked off-screen while the overlay is up: closing
    // returns focus to the burger, and the burger has to be somewhere to go.
    if (isOpen) root.classList.remove('nav-hidden');
    menu.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Always clear first, so repeated opens cannot stack duplicates.
    const previous = menu.querySelector('.menu-crumb');
    if (previous) previous.remove();
    if (isOpen && crumbBar) {
      const trail = document.createElement('p');
      trail.className = 'menu-crumb';
      // Built from the steps, not from textContent: the separators are
      // aria-hidden spans with no whitespace around them, so the raw text
      // would read "Home/ Services/ Structural Audits".
      trail.textContent = [...crumbBar.querySelectorAll('a, span:not([aria-hidden])')]
        .map((el) => el.textContent.trim())
        .filter(Boolean)
        .join(' / ');
      menu.prepend(trail);
    }
  };

  // Every way out of the menu ends the same way: close, then hand focus back
  // to the control that opened it. The burger is behind the overlay and
  // visibility:hidden while it is open, so the X in the corner is the only
  // close control on screen — but it is not the only one, and none of them
  // should leave focus stranded on a element that has just gone away.
  const closeMenu = () => {
    setMenu(false);
    burger.focus();
  };

  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Escape closes it and hands focus back, so the menu is not a trap for
  // anyone driving this from the keyboard.
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

// ---- reveal on scroll, once -------------------------------------------
// .rv and its variants are observed directly. A .wipe cannot be: it parks
// itself a full width outside the frame until it reveals, so its own box never
// intersects anything and it would sit there forever. Its static parent is
// watched instead, and the class is redirected onto the wipe.
const revealTarget = new Map();
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      (revealTarget.get(e.target) || e.target).classList.add('in');
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.rv').forEach((el) => io.observe(el));
document.querySelectorAll('.wipe').forEach((el) => {
  const host = el.parentElement;
  if (!host) return;
  revealTarget.set(host, el);
  io.observe(host);
});

// ---- inquiry form, mailto based (only present on /contact/) -----------
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const msg = document.getElementById('msg');
    let firstBad = null;
    const check = (wrapId, field, valid) => {
      document.getElementById(wrapId).classList.toggle('bad', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid && !firstBad) firstBad = field;
    };
    check('fName', name, name.value.trim().length > 1);
    check('fEmail', email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
    check('fMsg', msg, msg.value.trim().length > 5);
    // Send focus to the first problem rather than leaving the reader to hunt
    // for a red border they may not be able to see.
    if (firstBad) {
      firstBad.focus();
      return;
    }
    // The form lives on /contact/ only. Phone, project type and location are
    // each included only when present and filled.
    const optional = (id, label) => {
      const el = document.getElementById(id);
      const value = el && el.value.trim();
      return value ? `${label}: ${value}\n` : '';
    };
    const subject = encodeURIComponent('Project inquiry, ' + name.value.trim());
    const body = encodeURIComponent(
      `Name: ${name.value.trim()}\n` +
        `Email: ${email.value.trim()}\n` +
        optional('phone', 'Phone') +
        optional('ptype', 'Project type') +
        optional('county', 'Location') +
        `\n${msg.value.trim()}`
    );
    document.getElementById('formOk').style.display = 'block';
    location.href = `mailto:info@sosengineeringke.com?subject=${subject}&body=${body}`;
  });
}

// ---- year ------------------------------------------------------------
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
