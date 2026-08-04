// SOSE site behaviour. Vanilla, no dependencies, loaded with defer on every page.

// ---- nav scroll state -------------------------------------------------
const nav = document.getElementById('nav');
const setNavState = () => nav.classList.toggle('scrolled', scrollY > 40);
addEventListener('scroll', setNavState, { passive: true });
setNavState();

// Interior pages have a solid header behind the nav, so keep the nav opaque.
if (!document.querySelector('.hero')) nav.classList.add('scrolled');

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
if (burger && menu) {
  const setMenu = (isOpen) => {
    menu.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Escape closes it and hands focus back, so the menu is not a trap for
  // anyone driving this from the keyboard.
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMenu(false);
      burger.focus();
    }
  });
}

// ---- reveal on scroll, once -------------------------------------------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.rv').forEach((el) => io.observe(el));

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
