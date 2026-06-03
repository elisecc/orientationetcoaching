/* ============================================
   ORIENTATION & COACHING — SCRIPTS
   ============================================ */

// NAV — scroll shadow
const navHeader = document.querySelector('.nav-header');
window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// NAV — mobile toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// REVEAL — intersection observer
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// FAQ — accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen   = btn.getAttribute('aria-expanded') === 'true';
    const answer   = btn.nextElementSibling;
    const inner    = answer.querySelector('div') || answer;

    // close all
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const a = b.nextElementSibling;
      a.classList.remove('open');
    });

    // open clicked (if it was closed)
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// Wrap FAQ answer content in a div for CSS grid animation
document.querySelectorAll('.faq-answer').forEach(answer => {
  if (!answer.querySelector('div')) {
    const p = answer.querySelector('p');
    if (p) {
      const wrapper = document.createElement('div');
      answer.insertBefore(wrapper, p);
      wrapper.appendChild(p);
    }
  }
});
