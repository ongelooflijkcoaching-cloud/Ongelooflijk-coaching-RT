(() => {
  const panels = new Map(
    [...document.querySelectorAll('[data-panel]')].map((panel) => [panel.dataset.panel, panel])
  );
  const panelTitles = {
    start: 'Home',
    keuzehulp: 'Keuzehulp',
    aanpak: 'Werkwijze',
    traject: 'Traject',
    voorbeelden: 'Voorbeelden',
    'over-mij': 'Wie ben ik',
    downloads: 'Downloads',
    contact: 'Contact'
  };
  const baseTitle = 'Ongelooflijk Coaching & RT';
  const homeTitle = 'Begeleiding slimme basisschoolleerlingen Tilburg | Ongelooflijk Coaching & RT';

  function closeMenu() {
    const menuButton = document.querySelector('[data-menu-button]');
    const nav = document.querySelector('[data-nav]');
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  function showPanel(panelId, { focus = false } = {}) {
    const activeId = panels.has(panelId) ? panelId : 'start';
    panels.forEach((panel, id) => {
      const isActive = id === activeId;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
      if (isActive) panel.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
    });

    document.querySelectorAll('.main-nav a[href^="#"]').forEach((link) => {
      const navPanelId = ['traject', 'voorbeelden'].includes(activeId) ? 'aanpak' : activeId;
      const isCurrent = link.getAttribute('href') === `#${navPanelId}`;
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    document.title = activeId === 'start' ? homeTitle : `${panelTitles[activeId]} | ${baseTitle}`;
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (focus) {
      const heading = panels.get(activeId).querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const panelId = link.getAttribute('href').slice(1);
    if (!panels.has(panelId)) return;
    event.preventDefault();
    if (window.location.hash !== `#${panelId}`) history.pushState({ panelId }, '', `#${panelId}`);
    const exampleTarget = link.dataset.exampleTarget;
    showPanel(panelId, { focus: !exampleTarget });
    if (exampleTarget) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(exampleTarget);
        if (!target) return;
        target.setAttribute('tabindex', '-1');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      });
    }
  });

  window.addEventListener('popstate', () => {
    showPanel(window.location.hash.slice(1) || 'start');
  });

  showPanel(window.location.hash.slice(1) || 'start');

  const caseList = document.querySelector('.case-list');
  if (caseList) {
    ['rekenen-title', 'lezen-title', 'spelling-title'].forEach((headingId) => {
      const article = document.getElementById(headingId)?.closest('.case-study');
      if (article) caseList.append(article);
    });
  }

  const heroSteps = document.querySelector('[data-hero-steps]');

  if (heroSteps) {
    heroSteps.addEventListener('click', (event) => {
      const button = event.target.closest('[data-hero-step]');
      if (!button) return;
      heroSteps.querySelectorAll('[data-hero-step]').forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-expanded', String(isActive));
        item.querySelector('.visual-card-copy')?.setAttribute('aria-hidden', String(!isActive));
      });
    });
  }

  const guide = document.querySelector('[data-guide]');
  const stepOne = document.querySelector('[data-step="1"]');
  const stepTwo = document.querySelector('[data-step="2"]');
  const stepThree = document.querySelector('[data-step="3"]');
  const result = document.querySelector('[data-result]');
  const resultTitle = document.querySelector('[data-result-title]');
  const resultText = document.querySelector('[data-result-text]');
  const progress = [...document.querySelectorAll('[data-progress]')];
  let evidence = '';
  let signal = '';

  const evidenceCopy = {
    onderzoek: 'Uit onderzoek is al bekend dat je kind bovengemiddeld intelligent is.',
    'school-potentieel': 'School ziet dat er meer in je kind zit dan er nu uitkomt.',
    'school-strategie': 'School signaleert dat je kind nog niet altijd passende leerstrategieën gebruikt.',
    signalen: 'De kenmerken die je herkent kunnen passen bij bovengemiddelde intelligentie, maar stellen dit niet vast.',
    toetsverschil: 'Het verschil tussen methodegebonden en LOVS-toetsen is een goede aanleiding om te onderzoeken wat je kind belemmert.'
  };

  const signalCopy = {
    leren: 'Als prestaties niet laten zien wat je kind kan, helpt het om eerst nauwkeurig te kijken naar de gebruikte aanpak en waar het leerproces vastloopt.',
    plannen: 'Bij moeite met starten, plannen of volhouden kunnen concrete stappenplannen en inzicht in executieve functies snel meer overzicht geven.',
    vertrouwen: 'Wanneer onzekerheid overheerst, begin ik klein. Een eerste haalbare succeservaring maakt ruimte voor vertrouwen en nieuwsgierigheid.',
    motivatie: 'Achter afhaken zit vaak een reden. Ik onderzoek samen met je kind wat het nodig heeft om weer eigenaarschap, uitdaging en plezier te ervaren.'
  };

  const routeCopy = {
    kind: {
      title: 'Begin met een intake en talentinterview',
      text: 'Samen met jullie breng ik de hulpvraag, talenten en belemmeringen in beeld. Dat geeft een persoonlijk vertrekpunt voor doelen die je kind begrijpt en zelf kan dragen.'
    },
    strategie: {
      title: 'Start met individuele begeleiding',
      text: 'Na een korte intake oefen ik samen met jouw kind doelgericht met leerstrategieën, plannen, werkhouding en mindset. Niet als trucje, maar passend bij hoe jouw kind denkt en leert.'
    },
    samen: {
      title: 'Kies voor intake én afstemming',
      text: 'Ik start bij het kind en betrek ouders en, als dat helpend is, school. Zo kan dezelfde praktische aanpak op meerdere plekken worden ondersteund.'
    },
    twijfel: {
      title: 'Begin met een vrijblijvende kennismaking',
      text: 'Je hoeft nog niet precies te weten wat nodig is. In ongeveer 15 minuten orden ik samen met jullie de vraag en bespreek ik rustig of een intake of een andere vervolgstap past.'
    }
  };

  function setProgress(active) {
    progress.forEach((item, index) => item.classList.toggle('is-active', index < active));
  }

  function showStep(step) {
    stepOne.hidden = step !== 1;
    stepTwo.hidden = step !== 2;
    stepThree.hidden = step !== 3;
    result.hidden = step !== 4;
    stepOne.classList.toggle('is-active', step === 1);
    stepTwo.classList.toggle('is-active', step === 2);
    stepThree.classList.toggle('is-active', step === 3);
    setProgress(step);
  }

  if (guide) {
    guide.addEventListener('click', (event) => {
      const evidenceButton = event.target.closest('[data-evidence]');
      const signalButton = event.target.closest('[data-signal]');
      const supportButton = event.target.closest('[data-support]');

      if (evidenceButton) {
        evidence = evidenceButton.dataset.evidence;
        showStep(2);
        stepTwo.querySelector('.choice').focus();
      }

      if (signalButton) {
        signal = signalButton.dataset.signal;
        showStep(3);
        stepThree.querySelector('.choice').focus();
      }

      if (supportButton) {
        const route = routeCopy[supportButton.dataset.support];
        resultTitle.textContent = route.title;
        resultText.textContent = `${evidenceCopy[evidence]} ${signalCopy[signal]} ${route.text}`;
        showStep(4);
        result.focus({ preventScroll: true });
      }

      const backButton = event.target.closest('[data-back]');
      if (backButton) {
        const targetStep = Number(backButton.dataset.back);
        showStep(targetStep);
        const target = targetStep === 1 ? stepOne : stepTwo;
        target.querySelector('.choice').focus();
      }

      if (event.target.closest('[data-reset]')) {
        evidence = '';
        signal = '';
        showStep(1);
        stepOne.querySelector('.choice').focus();
      }
    });
  }

  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  const galleryDialog = document.querySelector('[data-gallery-dialog]');
  const galleryImage = document.querySelector('[data-gallery-image]');
  const galleryCaption = document.querySelector('[data-gallery-caption]');
  const galleryImageWrap = galleryDialog?.querySelector('.gallery-dialog-image-wrap');
  let galleryTrigger = null;

  if (galleryDialog && galleryImage && galleryCaption && galleryImageWrap) {
    document.querySelectorAll('[data-gallery-src]').forEach((button) => {
      button.addEventListener('click', () => {
        galleryTrigger = button;
        galleryImage.src = button.dataset.gallerySrc;
        galleryImage.alt = button.querySelector('img')?.alt || '';
        galleryCaption.textContent = button.dataset.galleryCaption || '';
        galleryImageWrap.classList.toggle('is-room', button.dataset.galleryCrop === 'room');
        galleryDialog.showModal();
      });
    });

    galleryDialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => galleryDialog.close());
    galleryDialog.addEventListener('click', (event) => {
      if (event.target === galleryDialog) galleryDialog.close();
    });
    galleryDialog.addEventListener('close', () => {
      galleryImage.removeAttribute('src');
      galleryImage.alt = '';
      galleryCaption.textContent = '';
      galleryImageWrap.classList.remove('is-room');
      galleryTrigger?.focus();
      galleryTrigger = null;
    });
  }

  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll('.reveal').forEach((item) => {
    if (observer) observer.observe(item);
    else item.classList.add('is-visible');
  });
})();
