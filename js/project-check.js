// SOSE project readiness check. Vanilla, no dependencies, loaded only on
// /project-check/.
//
// Every answer lives in this closure and nowhere else. Nothing is written to
// storage, nothing is sent over the network, and the answers leave the page only
// when the reader presses send or copy. Copy is from content/copy/project-check.md.

(() => {
  const form = document.getElementById('checkForm');
  if (!form) return;

  const resultEl = document.getElementById('result');
  const errorEl = document.getElementById('checkError');

  // One line per question, shown only when that question came back no or not sure.
  const GAPS = {
    q1: {
      text: 'Title not confirmed. Everything above ground rests on that document, and an ownership or boundary problem found in month six is no longer a legal problem.',
      href: '/insights/before-you-break-ground/',
      label: 'Before you break ground',
    },
    q2: {
      text: 'You do not yet know what this plot allows. What you are permitted to build shapes the design, so find out before you pay anyone to draw it.',
      href: '/services/construction-consulting/',
      label: 'Construction consulting',
    },
    q3: {
      text: 'Approvals not mapped. Work that starts before the paperwork is in place is work that can be stopped.',
      href: '/services/construction-consulting/',
      label: 'Construction consulting',
    },
    q4: {
      text: 'Soil not investigated. A foundation designed on assumption is the most expensive guess in construction.',
      href: '/insights/before-you-break-ground/',
      label: 'Before you break ground',
    },
    q5: {
      text: 'Drawings are incomplete. A contractor who has to guess prices the guess, and you pay for it twice.',
      href: '/services/building-solutions/',
      label: 'Building solutions',
    },
    q6: {
      text: "Drainage is unresolved. Water with nowhere to go finds the foundations, and your neighbour's runoff becomes your problem the moment it arrives.",
      href: '/insights/building-green-without-the-premium/',
      label: 'Building green without the premium',
    },
    q7: {
      text: 'The budget is not grounded in current rates. A figure built on old prices, with a contingency already spent, is not a budget.',
      href: '/services/project-management/',
      label: 'Project management',
    },
    q8: {
      text: 'No written scope, no control on variations. Every change then becomes a negotiation you are having from the weaker position.',
      href: '/services/project-management/',
      label: 'Project management',
    },
  };

  // Ordered high to low, so the first band a score reaches is the right one.
  const BANDS = [
    {
      min: 7,
      title: 'Ready to move.',
      body: "You've done the work most projects skip. The remaining risk is in execution and control, not preparation.",
    },
    {
      min: 4,
      title: 'Nearly there.',
      body: 'There are gaps that get expensive once concrete is poured. Fix them while they are still paperwork.',
    },
    {
      min: 0,
      title: 'Stop and plan.',
      body: 'Starting here is how projects stall halfway. The good news is that everything on this list is cheaper to solve now.',
    },
  ];

  const ANSWER_LABEL = { yes: 'Yes', no: 'No', unsure: 'Not sure' };
  const FRAMING =
    'This is a prompt to think, not an engineering assessment. It cannot see your site, your drawings or your budget.';
  const UNSURE_NOTE =
    'Not sure counts as no. On a build, an answer nobody is certain of is a gap until someone checks it.';

  const questions = [...form.querySelectorAll('fieldset.q')];
  const text = (el) => el.textContent.trim().replace(/\s+/g, ' ');

  // ---- state, in memory only -------------------------------------------
  const answers = Object.create(null);

  form.addEventListener('change', (e) => {
    if (e.target.type !== 'radio') return;
    answers[e.target.name] = e.target.value;
    errorEl.textContent = '';
  });

  // ---- result ------------------------------------------------------------
  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let lastResult = null;

  const score = () => {
    const clear = questions.filter((q) => answers[q.dataset.q] === 'yes').length;
    return {
      clear,
      band: BANDS.find((b) => clear >= b.min),
      gaps: questions.map((q) => q.dataset.q).filter((id) => answers[id] !== 'yes'),
      anyUnsure: questions.some((q) => answers[q.dataset.q] === 'unsure'),
    };
  };

  const render = (r) => {
    const gapItems = r.gaps
      .map(
        (id) =>
          `<li>${esc(GAPS[id].text)} <a href="${GAPS[id].href}">See: ${esc(
            GAPS[id].label
          )}</a></li>`
      )
      .join('');

    resultEl.innerHTML = [
      '<span class="eyebrow">Your result</span>',
      `<p class="score">${r.clear} of ${questions.length} checks clear.</p>`,
      `<h2>${esc(r.band.title)}</h2>`,
      `<p>${esc(r.band.body)}</p>`,
      r.anyUnsure ? `<p>${esc(UNSURE_NOTE)}</p>` : '',
      gapItems
        ? `<h3>What to sort out</h3><ul class="hexlist">${gapItems}</ul>`
        : '',
      `<p class="result-frame">${esc(FRAMING)}</p>`,
      '<div class="check-actions">',
      '<button type="button" class="btn btn-gold" id="sendResult">Send my results to SOSE</button>',
      '<button type="button" class="btn btn-outline" id="copyResult">Copy results</button>',
      '<p class="copy-state" id="copyState" role="status" aria-live="polite"></p>',
      '</div>',
    ].join('');
  };

  // Plain text version, used for both the email body and the clipboard.
  const asText = (r) => {
    const lines = [`Project readiness check: ${r.clear} of ${questions.length} checks clear.`, ''];
    let group = '';
    questions.forEach((q, i) => {
      const heading = text(q.closest('.qgroup').querySelector('h2'));
      if (heading !== group) {
        group = heading;
        lines.push(group);
      }
      lines.push(`${i + 1}. ${text(q.querySelector('legend'))}`);
      lines.push(`   ${ANSWER_LABEL[answers[q.dataset.q]]}`);
    });
    lines.push('', `Result: ${r.band.title}`, r.band.body);
    if (r.anyUnsure) lines.push('', UNSURE_NOTE);
    lines.push('', FRAMING);
    return lines.join('\n');
  };

  // ---- actions on the result --------------------------------------------
  const setCopyState = (msg) => {
    const el = document.getElementById('copyState');
    if (el) el.textContent = msg;
  };

  const copyToClipboard = async (value) => {
    if (navigator.clipboard && isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        /* fall through to the textarea route */
      }
    }
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  };

  resultEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn || !lastResult) return;

    if (btn.id === 'sendResult') {
      const subject = encodeURIComponent(
        `Readiness check, ${lastResult.clear} of ${questions.length} clear`
      );
      const body = encodeURIComponent(asText(lastResult));
      location.href = `mailto:info@sosengineeringke.com?subject=${subject}&body=${body}`;
      return;
    }

    if (btn.id === 'copyResult') {
      const ok = await copyToClipboard(asText(lastResult));
      setCopyState(
        ok
          ? 'Copied to your clipboard.'
          : 'Could not copy. Select the result above and copy it manually.'
      );
    }
  });

  // ---- submit -------------------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const unanswered = questions.filter((q) => !answers[q.dataset.q]);
    if (unanswered.length) {
      resultEl.innerHTML = '';
      lastResult = null;
      errorEl.textContent = 'Answer all eight questions to see your result.';
      unanswered[0].querySelector('input').focus();
      return;
    }

    errorEl.textContent = '';
    lastResult = score();
    render(lastResult);
  });
})();
