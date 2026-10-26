(() => {
  const form = document.getElementById('application-form');
  if (!form) return;

  const successMessage = document.getElementById('success-message');
  const commentField = document.getElementById('comments');
  const commentCounter = document.getElementById('comments-counter');
  const volumeWarning = document.getElementById('volume-warning');
  const touched = new Set();
  let submitted = false;

  const errorIds = {
    company: 'company-error',
    contactName: 'contact-name-error',
    email: 'email-error',
    phone: 'phone-error',
    website: 'website-error',
    country: 'country-error',
    product: 'product-error',
    volume: 'volume-error',
    services: 'services-error',
    provider: 'provider-error',
    comments: 'comments-error',
    privacy: 'privacy-error'
  };

  function getValue(id) {
    return document.getElementById(id).value.trim();
  }

  function getError(key) {
    return document.getElementById(errorIds[key]);
  }

  function getControls(key) {
    if (key === 'services') return [...form.querySelectorAll('[name="services"]')];
    if (key === 'provider') return [...form.querySelectorAll('[name="provider"]')];
    if (key === 'privacy') return [document.getElementById('privacy')];
    if (key === 'comments') return [commentField];
    return [form.querySelector(`[data-validate="${key}"]`)];
  }

  function messageFor(key) {
    switch (key) {
      case 'company':
        return getValue('company').length < 2 ? 'El nombre de la empresa debe tener al menos 2 caracteres' : '';
      case 'contactName':
        return getValue('contact-name').split(/\s+/).filter(Boolean).length < 2 ? 'Ingresa nombre y apellido del contacto' : '';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(getValue('email')) ? '' : 'Ingresa un correo electrónico corporativo válido (ejemplo: nombre@empresa.com )';
      case 'phone':
        return /^\+\d{1,3}(?:[ -]?\d){7,14}$/.test(getValue('phone')) ? '' : 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)';
      case 'website': {
        const website = getValue('website');
        if (!website) return '';
        try {
          const url = new URL(website);
          return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) ? '' : 'Si incluye sitio web, debe ser una URL válida';
        } catch {
          return 'Si incluye sitio web, debe ser una URL válida';
        }
      }
      case 'country':
        return getValue('country') ? '' : 'Selecciona el país de operación principal';
      case 'product':
        return getValue('product') ? '' : 'Selecciona el tipo de producto que manejas';
      case 'volume':
        return getValue('volume') ? '' : 'Selecciona el volumen mensual estimado';
      case 'services':
        return form.querySelector('[name="services"]:checked') ? '' : 'Selecciona al menos un servicio de interés';
      case 'provider':
        return form.querySelector('[name="provider"]:checked') ? '' : 'Indica si actualmente trabajas con otro proveedor logístico';
      case 'comments':
        return commentField.value.length > 500 ? `Los comentarios no pueden exceder los 500 caracteres (quedan ${Math.max(0, 500 - commentField.value.length)})` : '';
      case 'privacy':
        return document.getElementById('privacy').checked ? '' : 'Debes aceptar la política de privacidad para continuar';
      default:
        return '';
    }
  }

  function validate(key) {
    const message = messageFor(key);
    getError(key).textContent = message;
    getControls(key).forEach((control) => {
      if (control) control.setAttribute('aria-invalid', String(Boolean(message)));
    });
    return !message;
  }

  function updateVolumeWarning() {
    const showWarning = getValue('volume') === '0-100' && Boolean(getValue('product'));
    volumeWarning.hidden = !showWarning;
  }

  function updateCommentCounter() {
    commentCounter.textContent = `${commentField.value.length} / 500 caracteres`;
  }

  form.querySelectorAll('[data-validate]').forEach((control) => {
    const key = control.dataset.validate;
    control.addEventListener('blur', () => {
      touched.add(key);
      validate(key);
    });
    control.addEventListener('input', () => {
      if (touched.has(key) || submitted) validate(key);
      if (key === 'comments') updateCommentCounter();
      if (key === 'volume' || key === 'product') updateVolumeWarning();
    });
    control.addEventListener('change', () => {
      if (touched.has(key) || submitted) validate(key);
      if (key === 'volume' || key === 'product') updateVolumeWarning();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;
    const keys = Object.keys(errorIds);
    const isValid = keys.map(validate).every(Boolean);
    updateVolumeWarning();
    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    form.hidden = true;
    successMessage.hidden = false;
    successMessage.focus();
  });

  updateCommentCounter();
  updateVolumeWarning();
})();