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

if (!contact && typeof config.demoPhone === 'string') {
  const digits = config.demoPhone.replace(/\D/g, '');
  const normalized = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : '';
  if (normalized) {
    contact = `tel:${normalized}`;
    contactLabel = 'Build my backup line';
  }
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

const industryDemos = config.industryDemos || {};
document.querySelectorAll('[data-demo-key]').forEach(link => {
  const raw = industryDemos[link.dataset.demoKey];
  if (typeof raw !== 'string') return;
  const digits = raw.replace(/\D/g, '');
  const normalized = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : '';
  if (!normalized) return;
  link.href = `tel:${normalized}`;
  link.textContent = link.dataset.demoLabel || 'Call demo';
  link.hidden = false;
});

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

const calculator = {
  missed: document.getElementById('missed-calls'),
  value: document.getElementById('job-value'),
  close: document.getElementById('close-rate'),
  missedOutput: document.getElementById('missed-output'),
  valueOutput: document.getElementById('value-output'),
  closeOutput: document.getElementById('close-output'),
  opportunity: document.getElementById('monthly-opportunity'),
  jobs: document.getElementById('monthly-jobs'),
  calls: document.getElementById('monthly-calls'),
};

if (Object.values(calculator).every(Boolean)) {
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const updateCalculator = () => {
    const missed = Number(calculator.missed.value);
    const jobValue = Number(calculator.value.value);
    const closeRate = Number(calculator.close.value) / 100;
    const monthlyCalls = missed * 4.33;
    const monthlyJobs = monthlyCalls * closeRate;
    calculator.missedOutput.textContent = missed;
    calculator.valueOutput.textContent = money.format(jobValue);
    calculator.closeOutput.textContent = `${Math.round(closeRate * 100)}%`;
    calculator.opportunity.textContent = money.format(monthlyJobs * jobValue);
    calculator.jobs.textContent = Math.round(monthlyJobs);
    calculator.calls.textContent = Math.round(monthlyCalls);
  };
  [calculator.missed, calculator.value, calculator.close].forEach(input => input.addEventListener('input', updateCalculator));
  updateCalculator();
}

const mobileCallBar = document.querySelector('.mobile-call-bar');
if (mobileCallBar) {
  const updateMobileCallBar = () => mobileCallBar.classList.toggle('visible', window.scrollY > 520);
  window.addEventListener('scroll', updateMobileCallBar, { passive: true });
  updateMobileCallBar();
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
  document.querySelectorAll('.steps article, .bento article, .section-heading, .closing, .faq-section, .phone-demo-card, .calculator-card, .proof-grid article, .choice-cards article').forEach(element => {
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
