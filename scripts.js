(() => {
  const root = document.getElementById('nav');
  if (!root) return;
  const bar = root.querySelector('.nav__bar');
  const toggle = root.querySelector('.nav__toggle');
  const menu = root.querySelector('.menu');
  const close = root.querySelector('.menu__close');
  window.measureNav = () => {
    document.documentElement.style.setProperty('--page-nav-h', `${Math.ceil(bar.getBoundingClientRect().bottom + 12)}px`);
  };
  window.measureNav();
  addEventListener('resize', window.measureNav);
  let lastY = window.scrollY;
  addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 100) root.style.transform = 'translateY(-100%)';
    else if (y < lastY) root.style.transform = 'translateY(0)';
    lastY = y;
  }, { passive: true });
  if (!toggle || !menu || !close) return;
   const open = () => {
     menu.hidden = false;
    root.classList.add('menu-open');
     toggle.setAttribute('aria-expanded', 'true');
    window.lenis?.stop();
    close.focus();
  };
   const shut = (focusToggle = true) => {
     menu.hidden = true;
    root.classList.remove('menu-open');
     toggle.setAttribute('aria-expanded', 'false');
    window.lenis?.start();
    if (focusToggle) toggle.focus();
  };
  toggle.addEventListener('click', open);
  close.addEventListener('click', () => shut());
  menu.addEventListener('click', event => { if (event.target.closest('a')) shut(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) shut(); });
})();

(() => {
  const hero = document.getElementById('hero');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry]) => hero.classList.toggle('is-paused', !entry.isIntersecting)).observe(hero);
})();

(() => {
  'use strict';
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const parsed = document.readyState === 'loading' ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  const ready = () => Promise.all([fonts, parsed]).then(() => firsts);
  const nextTask = () => window.scheduler?.yield?.() ?? new Promise(resolve => setTimeout(resolve));
  const refresh = () => {
    if (typeof window.refreshScroll === 'function') return window.refreshScroll();
    window.ScrollTrigger?.sort(); window.ScrollTrigger?.refresh();
  };
  const run = (setup, name) => {
    for (const trigger of window.ScrollTrigger?.getAll() || []) if (!trigger.end && window.ScrollTrigger.getAll().includes(trigger)) trigger.refresh(0, 1);
    const context = window.gsap.context(() => {});
    const log = new MutationObserver(() => {});
    log.observe(document.documentElement, { attributes: true, attributeOldValue: true, subtree: true });
    let failure = null, records;
    try { context.add(() => { try { setup(); } catch (error) { failure = error; } }); }
    finally { records = log.takeRecords(); log.disconnect(); }
    if (!failure) return true;
    try { context.revert(); } catch (error) { console.error(name, 'revert failed', error); }
    for (const { target, attributeName, oldValue } of records.reverse()) {
      const now = target.getAttribute(attributeName);
      if (oldValue == null) { if (now != null) target.removeAttribute(attributeName); }
      else if (now !== oldValue) target.setAttribute(attributeName, oldValue);
    }
    console.error(name, failure);
    return false;
  };
  let firsts = Promise.resolve(), tail = null, pending = 0, lazy = null, building = 0;
  window.queueMotion = (setup, { first = false, near, id } = {}) => {
    if (!window.gsap || typeof setup !== 'function') return;
    const name = id || document.currentScript?.getAttribute('data-8b-part') || 'motion';
    if (near instanceof Element && window.IntersectionObserver) {
      const watch = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        watch.disconnect();
        building++;
        lazy = (lazy || ready()).then(nextTask).then(() => run(setup, name)).finally(() => { if (!--building) refresh(); });
      }, { rootMargin: '100% 0px' });
      watch.observe(near);
      return;
    }
    if (first) firsts = firsts.then(() => fonts).then(() => { if (!run(setup, name)) refresh(); });
    else {
      pending++;
      tail = (tail || ready()).then(nextTask).then(() => run(setup, name))
        .finally(() => { if (!--pending) refresh(); });
    }
    window.motionReady = Promise.all([firsts, tail]);
  };
  window.adjacent = (a, b) => {
    const order = [...document.querySelectorAll('[data-8b-section]')].filter(section => section.getAttribute('data-8b-section') !== 'navigation').map(section => section.id);
    return order.indexOf(a) >= 0 && order[order.indexOf(a) + 1] === b;
  };
})();

(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.contact__status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const valid = form.checkValidity();
    status.textContent = valid ? form.dataset.msgOk : form.dataset.msgError;
    if (valid) form.reset();
    else form.querySelector(':invalid')?.focus();
  });
})();

gsap.registerPlugin(ScrollTrigger, SplitText);
function refreshScroll() {
  window.measureNav?.();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const bar = document.querySelector('#nav .nav__bar');
  const lenis = window.lenis = new Lenis({ lerp: 0.085, anchors: { offset: -(bar ? Math.ceil(bar.getBoundingClientRect().bottom) : 0) } });
  const tick = time => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.destroy(); window.lenis = null; };
});

function restRadius(element) {
  return parseFloat((getComputedStyle(element).clipPath.match(/round\s+([\d.]+)px/) || [])[1]) || 0;
}
function transcribe(element, wordsClass) {
  const split = SplitText.create(element, { type: 'words', wordsClass });
  return gsap.fromTo(split.words, { '--bar': 1 }, { '--bar': 0, ease: 'none', stagger: 0.16, duration: 0.5 });
}
const captionPlayed = new WeakSet();
const effects = {
  captionIn(element, vars = {}) {
    const split = SplitText.create(element, { type: 'lines', mask: 'lines' });
    return gsap.timeline({ ...vars, onComplete: () => split.revert() })
      .from(split.lines, { yPercent: 108, duration: 1, ease: 'expo.out', stagger: 0.09 });
  },
  readAlong(element, vars = {}) {
    const split = SplitText.create(element, { type: 'words' });
    const ink = getComputedStyle(element).color;
    const faint = ink.replace(/^rgb\((.+)\)$/, 'rgba($1, 0.22)');
    return gsap.fromTo(split.words, { color: faint }, { color: ink, ease: 'none', stagger: 0.12, duration: 0.6, ...vars });
  },
  bandRise(sheet, vars = {}) {
    const radius = restRadius(sheet);
    const side = innerWidth < 768 ? 2.5 : 4;
    const big = Math.round(radius * 2.6);
    return gsap.fromTo(sheet,
      { clipPath: `inset(0% ${side}% 0% ${side}% round ${big}px ${big}px 0px 0px)` },
      { clipPath: `inset(0% 0% 0% 0% round ${radius}px ${radius}px 0px 0px)`, ease: 'none', ...vars });
  }
};
document.querySelectorAll('[data-8b-section]').forEach(section => {
  const first = () => section.getBoundingClientRect().top < innerHeight;
  const timing = id => (first() ? { first: true, id } : { near: section, id });
  const headings = section.querySelectorAll('[data-8b-motion~="captionIn"]');
  if (headings.length) {
    const id = `effect:captionIn:${section.id}`;
    queueMotion(() => gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, () => {
      headings.forEach((heading, index) => {
        if (captionPlayed.has(heading)) return;
        const timeline = effects.captionIn(heading, { paused: true });
        ScrollTrigger.create({ id: `${id}:${index}`, trigger: heading, start: 'top 88%', once: true, onEnter: () => { captionPlayed.add(heading); timeline.play(); } });
      });
    }), timing(id));
  }
  const reads = section.querySelectorAll('[data-8b-motion~="readAlong"]');
  if (reads.length) {
    const id = `effect:readAlong:${section.id}`;
    queueMotion(() => gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, () => {
      reads.forEach((element, index) => ScrollTrigger.create({ id: `${id}:${index}`, trigger: element, start: 'top 88%', end: 'bottom 60%', scrub: true, animation: effects.readAlong(element) }));
    }), timing(id));
  }
  const bands = section.querySelectorAll('[data-8b-motion~="bandRise"]');
  if (bands.length) {
    const id = `effect:bandRise:${section.id}`;
    queueMotion(() => gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, () => {
      bands.forEach((sheet, index) => ScrollTrigger.create({ id: `${id}:${index}`, trigger: section, start: 'top bottom', end: 'top 25%', scrub: true, animation: effects.bandRise(sheet) }));
    }), timing(id));
  }
});

queueMotion(() => {
  const hero = document.getElementById('hero');
  const copy = hero.querySelector('.hero__copy');
  const talk = hero.querySelector('.hero__talk');
  const media = hero.querySelector('.hero__media');
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    if (!adjacent('hero', 'listen')) return;
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'hero:exit', trigger: hero, start: 'bottom bottom', end: 'bottom 20%', scrub: true, invalidateOnRefresh: true } })
      .to(media, { scale: 1.1, transformOrigin: wide ? '100% 30%' : '62% 30%' }, 0)
      .to(copy, { y: () => -innerHeight * (wide ? 0.26 : 0.16) }, 0)
      .to(talk, { y: () => -innerHeight * (wide ? 0.14 : 0.1) }, 0);
  });
}, { first: true, id: 'hero' });

queueMotion(() => {
  const root = document.getElementById('listen');
  const sheet = root.querySelector('.listen__sheet');
  const title = root.querySelector('.listen__title');
  const hold = root.querySelector('.listen__hold');
  const voice = root.querySelector('.listen__panel--voice');
  const read = root.querySelector('.listen__panel--read');
  const product = root.querySelector('.listen__photo');
  const prompt = root.querySelector('.listen__prompt');
  const poster = root.querySelector('.listen__poster');
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    if (adjacent('hero', 'listen')) {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'listen:entry', trigger: root, start: 'top bottom', end: 'top 20%', scrub: true, invalidateOnRefresh: true } })
        .add(effects.bandRise(sheet), 0)
        .fromTo(title, wide ? { y: () => innerHeight * 0.22 } : { x: () => innerWidth * 0.22 }, wide ? { y: 0 } : { x: 0 }, 0);
    }
    root.classList.add('is-staged');
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'listen:join', trigger: hold, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } })
      .fromTo(voice, { x: () => -innerWidth * (wide ? 0.08 : 0.07) }, { x: 0 }, 0)
      .fromTo(read, { x: () => innerWidth * (wide ? 0.08 : 0.07) }, { x: 0 }, 0);
    const cross = gsap.timeline({ defaults: { ease: 'power1.inOut' }, scrollTrigger: {
      id: 'listen', trigger: hold, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
    } });
    cross.fromTo(product, { autoAlpha: 0, scale: .3, transformOrigin: '100% 100%' }, { autoAlpha: 1, scale: 1, duration: .3 }, 0)
      .fromTo(prompt, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .18 }, .2)
      .to(product, { xPercent: 110, scale: .9, autoAlpha: 0, duration: .4 }, .5)
      .to(prompt, { autoAlpha: 0, y: -16, duration: .2 }, .5)
      .fromTo(poster, { xPercent: -100, autoAlpha: 0, scale: .88 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: .5 }, .65);
    return () => {
      root.classList.remove('is-staged');
    };
  });
}, { first: true, id: 'listen' });

queueMotion(() => {
  const root = document.getElementById('calls');
  const list = root.querySelector('.calls__list');
  const items = [...list.children];
  const device = root.querySelector('.calls__device');
  const log = root.querySelector('.phone__log');
  const steps = items.map((item, index) => [...root.querySelectorAll(`.phone [data-step="${index + 1}"]`)]);
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    const line = wide ? '58%' : '52%';
    const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'calls', trigger: items[0], start: `top ${line}`, endTrigger: items[items.length - 1], end: `bottom ${line}`, scrub: true } });
    items.forEach((item, index) => {
      if (index > 0) timeline.fromTo(item, { opacity: 0.32 }, { opacity: 1, duration: 0.25 }, index - 0.1);
       if (index < items.length - 1) timeline.to(item, { opacity: 0.32, duration: 0.25 }, index + 0.9);
       if (steps[index].length) timeline.from(steps[index], { opacity: 0, y: 14, scale: 0.94, transformOrigin: '50% 100%', duration: 0.3, stagger: 0.18, ease: 'power2.out' }, index + 0.05);
       const visibleStep = steps[index].find(element => element.closest('.phone__log'));
       if (visibleStep) {
         timeline.to(log, { scrollTop: () => Math.min(log.scrollHeight - log.clientHeight, Math.max(0, visibleStep.offsetTop - log.clientHeight * 0.28)), duration: 0.35, ease: 'power2.out' }, index + 0.22);
       }
     });
    timeline.to(items.slice(0, -1), { opacity: 1, duration: 0.3 }, items.length - 0.1);
    if (adjacent('calls', 'tune')) {
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'calls:exit', trigger: root, start: 'bottom bottom', end: 'bottom 30%', scrub: true, invalidateOnRefresh: true } })
        .to(device, { scale: 0.8, rotation: -7, y: () => -innerHeight * (wide ? 0.12 : 0.08) }, 0);
    }
  });
}, { near: document.getElementById('calls'), id: 'calls' });

queueMotion(() => {
  const root = document.getElementById('tune');
  const stage = root.querySelector('.tune__stage');
  const lines = [...root.querySelectorAll('.tune__line')];
  const sizeFill = root.querySelector('[data-ctl="size"] .tune__fill');
  const sizeThumb = root.querySelector('[data-ctl="size"] .tune__thumb');
  const weightFill = root.querySelector('[data-ctl="weight"] .tune__fill');
  const weightThumb = root.querySelector('[data-ctl="weight"] .tune__thumb');
  const pill = root.querySelector('[data-ctl="contrast"] .tune__pill');
  const poster = root.querySelector('.tune__poster');
  const tokens = getComputedStyle(document.documentElement);
  const paper = tokens.getPropertyValue('--color-2').trim();
  const ink = tokens.getPropertyValue('--color-1').trim();
  const offset = (element, stop) => {
    let x = 0, y = 0;
    for (let node = element; node && node !== stop; node = node.offsetParent) { x += node.offsetLeft; y += node.offsetTop; }
    return { x, y };
  };
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, () => {
    if (adjacent('calls', 'tune')) {
      const calls = document.getElementById('calls');
      const aside = calls.querySelector('.calls__aside');
      const sticky = calls.querySelector('.calls__sticky');
      const screen = calls.querySelector('.phone__screen');
      let geometry;
      const measure = () => {
        const startScroll = offset(root).y - innerHeight;
        const asideAt = offset(aside);
        const style = getComputedStyle(sticky);
        const released = asideAt.y + aside.offsetHeight - sticky.offsetHeight - startScroll;
        const fromBottom = style.top === 'auto' && style.bottom !== 'auto';
        const stickyY = fromBottom
          ? Math.min(released, innerHeight - (parseFloat(style.bottom) || 0) - sticky.offsetHeight)
          : Math.min(Math.max(asideAt.y - startScroll, parseFloat(style.top) || 0), released);
        const inner = offset(screen, sticky);
        const screenX = asideAt.x + inner.x + screen.offsetWidth / 2;
        const screenY = stickyY + inner.y + screen.offsetHeight / 2;
        const stageAt = offset(stage);
        geometry = {
          x: screenX - (stageAt.x + stage.offsetWidth / 2),
          y: screenY - (stageAt.y - startScroll + stage.offsetHeight / 2),
          scale: innerWidth < 768 ? 0.12 : Math.max(0.16, screen.offsetWidth / stage.offsetWidth)
        };
        return geometry.x;
      };
      gsap.timeline({ scrollTrigger: { id: 'tune:entry', trigger: root, start: 'top bottom', end: 'top 30%', scrub: true, invalidateOnRefresh: true } })
        .fromTo(stage, { scale: 0 }, { scale: () => (measure(), geometry.scale), ease: 'none', duration: 0.02, immediateRender: false }, 0)
        .fromTo(stage, { x: measure, y: () => geometry.y, scale: () => geometry.scale }, { x: 0, y: 0, scale: 1, ease: 'power1.inOut', duration: 0.98, immediateRender: false }, 0.02)
        .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.1, immediateRender: false }, 0);
    }
    const track = element => element.parentElement.offsetWidth;
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'tune', trigger: root, start: 'top 30%', end: 'top -45%', scrub: true, invalidateOnRefresh: true } })
      .fromTo(lines, { fontVariationSettings: '"wght" 300', scale: 0.8 }, { fontVariationSettings: '"wght" 800', scale: 1, duration: 1 }, 0)
      .fromTo(sizeFill, { scaleX: 0.3 }, { scaleX: 0.75, duration: 1 }, 0)
      .fromTo(sizeThumb, { x: () => -0.45 * track(sizeThumb) }, { x: 0, duration: 1 }, 0)
      .fromTo(weightFill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
      .fromTo(weightThumb, { x: () => -0.6 * track(weightThumb) }, { x: () => 0.4 * track(weightThumb), duration: 1 }, 0)
      .fromTo(poster, { xPercent: -100, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.08)
      .fromTo(stage, { backgroundColor: paper, color: ink }, { backgroundColor: ink, color: paper, duration: 0.3 }, 1.05)
      .fromTo(pill, { xPercent: -100 }, { xPercent: 0, duration: 0.3 }, 1.05)
      .to(lines, { fontVariationSettings: '"wght" 600', duration: 0.8 }, 1.45)
      .to(weightFill, { scaleX: 0.6, duration: 0.8 }, 1.45)
      .to(weightThumb, { x: 0, duration: 0.8 }, 1.45);
  });
}, { near: document.getElementById('tune'), id: 'tune' });

queueMotion(() => {
  const root = document.getElementById('rooms');
  const hold = root.querySelector('.rooms__hold');
  const track = root.querySelector('.rooms__track');
  const places = [...track.querySelectorAll('.rooms__place')];
  const lines = root.querySelectorAll('.rooms__line');
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    root.classList.add('is-track');
    const travel = () => Math.max(0, track.scrollWidth - innerWidth);
    const setTravel = () => gsap.set(root, { '--rooms-travel': `${travel()}px` });
    setTravel();
    ScrollTrigger.addEventListener('refreshInit', setTravel);
    const lead = () => Math.min(0.9, (innerWidth * 0.6) / track.scrollWidth);
    const main = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'rooms', trigger: hold, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true } });
    main.fromTo(track, { x: 0 }, { x: () => -travel(), duration: 1 }, 0)
      .fromTo(lines, { strokeDasharray: 1, strokeDashoffset: () => 1 - lead() }, { strokeDashoffset: 0, duration: 1 }, 0);
    places.forEach((place, index) => {
      const image = place.querySelector('img');
      const talk = place.querySelectorAll('.rooms__talk > *');
      gsap.fromTo(image, { xPercent: 7 }, { xPercent: 0, ease: 'none', scrollTrigger: { id: `rooms:photo-${index}`, trigger: place, containerAnimation: main, start: 'left right', end: wide ? 'left 66%' : 'left 40%', scrub: true } });
      gsap.fromTo(talk, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', stagger: 0.3, scrollTrigger: { id: `rooms:talk-${index}`, trigger: place, containerAnimation: main, start: wide ? 'left 100%' : 'left 100%', end: wide ? 'left 66%' : 'left 40%', scrub: true } });
    });
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setTravel);
      root.classList.remove('is-track');
    };
  });
}, { id: 'rooms' });

queueMotion(() => {
  const root = document.getElementById('voices');
  const colsBox = root.querySelector('.voices__cols');
  const cols = [...root.querySelectorAll('.voices__col')];
  const cards = [...root.querySelectorAll('.voices__col > li')];
  const photo = root.querySelector('.voices__photo img');
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    if (wide) {
      cols.forEach((col, index) => gsap.fromTo(col, { y: () => innerHeight * (index ? 0.42 : 0.14) }, { y: 0, ease: 'none', scrollTrigger: { id: `voices:col-${index}`, trigger: colsBox, start: 'top bottom', end: 'top 18%', scrub: true, invalidateOnRefresh: true } }));
    } else {
      cards.forEach((card, index) => gsap.fromTo(card, { y: () => innerHeight * (index % 2 ? 0.16 : 0.06), x: index % 2 ? 28 : -28 }, { y: 0, x: 0, ease: 'none', scrollTrigger: { id: `voices:card-${index}`, trigger: card, start: 'top bottom', end: 'top 58%', scrub: true, invalidateOnRefresh: true } }));
    }
    gsap.fromTo(photo, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { id: 'voices:photo', trigger: photo.parentElement, start: 'top bottom', end: 'center 50%', scrub: true } });
  });
}, { near: document.getElementById('voices'), id: 'voices' });

queueMotion(() => {
  const root = document.getElementById('setup');
  const steps = root.querySelector('.setup__steps');
  const cards = [...steps.children];
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, () => {
    root.classList.add('is-stacked');
    const gap = () => parseFloat(getComputedStyle(steps).rowGap) || 0;
    const natural = index => cards.slice(0, index).reduce((sum, card) => sum + card.offsetHeight + gap(), 0);
    const stuck = index => parseFloat(getComputedStyle(cards[index]).top) || 0;
    cards.slice(0, -1).forEach((card, index) => {
      gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: 0.92, filter: 'brightness(0.68)', ease: 'none', scrollTrigger: { id: `setup:${index}`, trigger: steps, start: () => `top+=${natural(index + 1)} bottom`, end: () => `top+=${natural(index + 1)} ${stuck(index + 1)}px`, scrub: true, invalidateOnRefresh: true } });
    });
    return () => root.classList.remove('is-stacked');
  });
}, { id: 'setup' });

queueMotion(() => {
  const root = document.getElementById('start');
  const frame = root.querySelector('.start__window');
  const image = frame.querySelector('img');
  const heading = root.querySelector('.start__copy h2');
  gsap.matchMedia().add({ wide: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', narrow: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' }, context => {
    const { wide } = context.conditions;
    const radius = restRadius(frame);
    const sideX = wide ? 31 : 12;
    const sideY = wide ? 15 : 22;
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'start', trigger: frame, start: 'top 92%', end: 'top 10%', scrub: true } })
      .fromTo(frame, { clipPath: `inset(${sideY}% ${sideX}% ${sideY}% ${sideX}% round ${radius * 3}px)` }, { clipPath: `inset(0% 0% 0% 0% round ${radius}px)` }, 0)
      .fromTo(image, { scale: 1.32 }, { scale: 1 }, 0);
    root.classList.add('is-transcribing');
    ScrollTrigger.create({ id: 'start:words', trigger: heading, start: 'top 96%', end: 'bottom 64%', scrub: true, animation: transcribe(heading, 'start__word') });
    return () => root.classList.remove('is-transcribing');
  });
}, { near: document.getElementById('start'), id: 'start' });

queueMotion(() => {
  const root = document.getElementById('footer');
  const brand = root.querySelector('.footer__brand');
  const word = root.querySelector('.footer__word');
  const strokes = root.querySelectorAll('.footer__logo path');
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { id: 'footer', trigger: brand, start: 'top bottom', end: 'bottom bottom', scrub: true } })
      .fromTo(word, { yPercent: 70 }, { yPercent: 0 }, 0)
      .fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.15 }, 0);
  });
}, { near: document.getElementById('footer'), id: 'footer' });
