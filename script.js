/**
 * Eddy-Path Academy - Shared JavaScript
 * - Responsive mobile navigation
 * - Active page link indicator
 * - Netlify Form submission status (?sent=true)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightActiveNav();
  handleContactFormStatus();
});

/**
 * Mobile Navigation Toggle (Clean hamburger menu)
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (!toggleBtn || !siteNav) return;

  function toggleMenu(forceState) {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = forceState !== undefined ? forceState : !isExpanded;

    toggleBtn.setAttribute('aria-expanded', String(newState));
    if (newState) {
      siteNav.classList.add('open');
      document.body.style.overflow = window.innerWidth <= 768 ? 'hidden' : '';
    } else {
      siteNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking nav links
  const links = siteNav.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('open') && !siteNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Reset on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && siteNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/**
 * Highlight active page nav link
 */
function highlightActiveNav() {
  const path = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const target = href.toLowerCase();
    const isHome = (path === '/' || path.endsWith('/index.html') || path === '') &&
                   (target === 'index.html' || target === './index.html' || target === '/');
    const isAbout = path.endsWith('about.html') && target.includes('about.html');
    const isContact = path.endsWith('contact.html') && target.includes('contact.html');

    if (isHome || isAbout || isContact) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Handle Netlify Form submission ?sent=true
 * In script.js, if the URL contains ?sent=true, hide the form and show a clear green message:
 * "Thank you, your message has been sent. We will reply within one working day."
 */
function handleContactFormStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const isSent = urlParams.get('sent') === 'true' || window.location.search.includes('sent=true');

  const contactForm = document.getElementById('contact-form');
  const successAlert = document.getElementById('form-success-message');

  if (isSent) {
    if (contactForm) {
      contactForm.style.display = 'none';
    }
    if (successAlert) {
      successAlert.classList.add('show');
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Graceful fallback for preview / development environment without Netlify server
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const isNetlify = window.location.hostname.includes('netlify.app');
      if (!isNetlify) {
        e.preventDefault();
        const actionUrl = contactForm.getAttribute('action') || 'contact.html?sent=true';
        const url = new URL(actionUrl, window.location.origin);
        url.searchParams.set('sent', 'true');
        window.location.href = url.toString();
      }
    });
  }
}
