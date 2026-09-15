const config = window.NO_RING_CONFIG || {};

function setAction(link, href, text) {
  link.href = href;
  link.textContent = text;
}

let contact = '';
let contactLabel = '';
try {
  const booking = new URL(config.bookingUrl);
  if (booking.protocol === 'https:' && !booking.username && !booking.password) {
    contact = booking.href;
    contactLabel = 'Book a setup call';
  }
} catch {}

if (!contact && typeof config.contactEmail === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail)) {
  contact = `mailto:${config.contactEmail}?subject=${encodeURIComponent('NO RING AI — setup for my business')}`;
  contactLabel = 'Ask about your setup';
}

if (contact) {
  document.querySelectorAll('[data-contact-link]').forEach(link => setAction(link, contact, contactLabel));
  const panel = document.getElementById('contact-panel');
  const action = document.getElementById('contact-action');
  const footer = document.getElementById('footer-contact');
  if (panel && action) {
    panel.hidden = false;
    setAction(action, contact, contactLabel);
  }
  if (footer) {
    footer.hidden = false;
    footer.href = contact;
    footer.textContent = 'Contact';
  }
}

const pricing = config.pricing;
if (pricing && [pricing.monthly, pricing.minutes, pricing.overage].every(value => Number.isFinite(value) && value >= 0) && pricing.currency === 'USD') {
  const heading = document.getElementById('price-heading');
  const detail = document.getElementById('price-detail');
  const list = document.getElementById('price-list');
  if (heading && detail && list) {
    const amount = document.createElement('span');
    amount.className = 'price-amount';
    amount.textContent = `$${pricing.monthly}`;
    const period = document.createElement('span');
    period.className = 'price-period';
    period.textContent = ' / month';
    heading.replaceChildren(amount, period);
    detail.textContent = `${pricing.minutes} minutes included. $${pricing.overage.toFixed(2)} per additional minute.`;
    list.replaceChildren();
    for (const text of ['Inbound missed-call coverage', 'Business-specific greeting and call flow', 'Caller details and call summaries', 'Standard setup and forwarding assistance', 'Ongoing call-flow reviews']) {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    }
  }
}

document.querySelectorAll('.wave').forEach(wave => {
  for (let index = 0; index < 55; index += 1) {
    const bar = document.createElement('i');
    bar.style.height = `${5 + Math.abs(Math.sin(index * 1.8) * Math.cos(index * 0.17)) * 42}px`;
    wave.append(bar);
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.steps article, .bento article, .section-heading, .closing, .faq-section, .phone-demo-card').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

document.querySelectorAll('.call-panel, .bento article, .phone-demo-card').forEach(panel => {
  panel.addEventListener('pointermove', event => {
    const bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    panel.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  });
});
