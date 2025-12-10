// ===============================
//   Lead Form Logic (Modal Form)
// ===============================

export function initLeadForm() {
  const touched = {
    name: false,
    email: false,
    phone: false,
    comment: false,
    consentRequired: false
  };

  const form = document.getElementById('leadForm');
  if (!form) return;

  const el = (id) => document.getElementById(id);
  const endpoint = 'https://services-webinar-pentest-170325.codeby.school/send_lead_extended.php';

  const state = { submitting: false };
  const show = (elem, on) => elem.classList.toggle('hidden', !on);

  // ---------- Toast ----------
  function ensureToastRoot() {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className = 'fixed inset-0 pointer-events-none z-[9999]';
      document.body.appendChild(root);
    }
    return root;
  }

  function showToast(message = 'Готово! Заявка отправлена.', opts = {}) {
    const { duration = 4000, icon = '✓', sub = 'Мы свяжемся с вами в ближайшее время.' } = opts;
    const root = ensureToastRoot();

    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    wrap.className = `
      pointer-events-auto
      fixed right-6 bottom-6 max-w-sm
      bg-[#222f3a]/95 border border-[#15e6cb]/20 rounded-xl shadow-2xl
      px-4 py-3 text-gray-100
      translate-y-3 opacity-0 transition-all duration-200 ease-out
    `;

    wrap.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-gradient-to-r from-[#21d4fd] to-[#13e0ba] grid place-items-center text-[#131a22] font-bold">${icon}</div>
        <div class="flex-1">
          <div class="text-sm font-semibold">${message}</div>
          <div class="text-xs text-gray-300 mt-0.5">${sub}</div>
        </div>
        <button type="button" aria-label="Закрыть уведомление"
                class="ml-2 text-gray-400 hover:text-white transition">×</button>
      </div>
    `;

    requestAnimationFrame(() => {
      root.appendChild(wrap);
      requestAnimationFrame(() => {
        wrap.classList.remove('translate-y-3', 'opacity-0');
      });
    });

    let hideTimer = setTimeout(close, duration);

    function close() {
      wrap.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => wrap.remove(), 180);
    }

    wrap.querySelector('button')?.addEventListener('click', () => {
      clearTimeout(hideTimer);
      close();
    });

    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey, { once: true });
  }

  // ---------- Validators ----------
  const validators = {
    name(v) { return /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/.test(v.trim()); },
    email(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    phone(v) {
      const digits = v.replace(/\D+/g, '');
      if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return true;
      if (digits.length === 12 && v.trim().startsWith('+7')) return true;
      return false;
    },
    comment(v) { return v.length <= 1000; },
    consentRequired(on) { return !!on; }
  };

  function setError(input, errEl, hasError, field) {
    if (!input || !errEl) return;

    const shouldShow = touched[field] && hasError;

    input.classList.toggle('border-red-500', shouldShow);
    input.classList.toggle('focus:ring-red-400', shouldShow);
    show(errEl, shouldShow);
  }

  function isFormValid() {
    return (
      validators.name(el('name')?.value || '') &&
      validators.email(el('email')?.value || '') &&
      validators.phone(el('phone')?.value || '') &&
      validators.comment(el('comment')?.value || '') &&
      validators.consentRequired(el('consentRequired')?.checked)
    );
  }

  const submitBtn = el('submitBtn');
  const hint = el('formHint');

  function updateSubmitState() {
    submitBtn.disabled = !(isFormValid() && !state.submitting);
  }

  // ---------- Live validation ----------
  const map = [
    ['name', 'nameErr', validators.name],
    ['email', 'emailErr', validators.email],
    ['phone', 'phoneErr', validators.phone],
    ['comment', 'commentErr', validators.comment],
  ];

  map.forEach(([id, errId, check]) => {
    const input = el(id);
    const errEl = el(errId);
    if (!input) return;

    input.addEventListener('blur', () => {
      touched[id] = true;
      setError(input, errEl, !check(input.value), id);
      updateSubmitState();
    });

    input.addEventListener('input', () => {
      setError(input, errEl, !check(input.value), id);
      updateSubmitState();
    });

    setError(input, errEl, false, id);
  });

  // чекбокс согласия
  const consent = el('consentRequired');
  const consentErr = el('consentReqErr');

  if (consent) {
    consent.addEventListener('change', () => {
      touched.consentRequired = true;
      const valid = validators.consentRequired(consent.checked);
      setError(consent, consentErr, !valid, 'consentRequired');
      updateSubmitState();
    });
  }

  updateSubmitState();

  // ---------- Success Modal ----------
  function showModalSuccess() {
    try {
      const prev = document.getElementById('success-overlay');
      if (prev) prev.remove();

      const prevActive = document.activeElement;

      const overlay = document.createElement('div');
      overlay.id = 'success-overlay';
      overlay.className = 'fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm';

      const modal = document.createElement('div');
      modal.className = 'bg-[#222f3a] text-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl opacity-0 scale-95 transition-all duration-200';
      modal.setAttribute('role', 'dialog');
      modal.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">Заявка отправлена!</h2>
        <p class="text-gray-300 mb-6">Мы свяжемся с вами в ближайшее время.</p>
        <button id="successCloseBtn"
                class="px-6 py-3 bg-gradient-to-r from-[#21d4fd] to-[#13e0ba] text-black font-semibold rounded-lg">
          Хорошо
        </button>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        modal.classList.remove('opacity-0', 'scale-95');
      });

      const close = () => {
        modal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
          prevActive?.focus();
        }, 180);
      };

      document.getElementById('successCloseBtn').onclick = close;
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      document.addEventListener('keydown', (e) => e.key === 'Escape' && close(), { once: true });

    } catch {
      alert('Заявка отправлена!');
    }
  }

  // ---------- Submit ----------
  async function submit(e) {
    e.preventDefault();
    if (state.submitting) return;

    if (el('website')?.value) return; // honeypot

    const payload = {
      form_name: 'Лид с сайта GiftCertificate',
      site: location.hostname,
      name: el('name').value,
      email: el('email').value,
      phone: el('phone').value,
      comment: el('comment').value,
      consentOptional: el('consentOptional')?.checked ?? false,
      consentRequired: el('consentRequired').checked,
    };

    if (!isFormValid()) return;

    try {
      state.submitting = true;
      updateSubmitState();
      hint.textContent = 'Отправляем… Это займёт несколько секунд.';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message);

      hint.textContent = 'Заявка отправлена!';
      showModalSuccess();
      form.reset();

      el('consentRequired').checked = true;

    } catch {
      hint.textContent = 'Ошибка. Попробуйте ещё раз.';
    } finally {
      state.submitting = false;
      updateSubmitState();
    }
  }

  form.addEventListener('submit', submit);
}
