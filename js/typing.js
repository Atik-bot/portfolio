/* ============================================================
   typing.js — rotating typewriter line in the hero
   "I'm a Full-Stack Developer / an AI/ML Researcher / ..."
   Respects prefers-reduced-motion (shows static text).
   ============================================================ */
(function () {
  const el = document.getElementById("typed");
  const hero = document.querySelector(".hero");
  if (!el) return;

  // Kick off the headline line-rise animation
  if (hero) requestAnimationFrame(() => hero.classList.add("is-loaded"));

  const phrases = [
    "a Full-Stack Developer",
    "an AI/ML Researcher",
    "a Freelance Web Developer",
    "a CS Student at AIUB",
  ];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = phrases[0]; // static, no animation
    return;
  }

  const TYPE_MS = 55;     // per character while typing
  const DELETE_MS = 28;   // per character while deleting
  const HOLD_MS = 1800;   // pause when a phrase is complete

  let phrase = 0;
  let pos = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phrase];

    if (!deleting) {
      pos++;
      el.textContent = current.slice(0, pos);
      if (pos === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
        return;
      }
      setTimeout(tick, TYPE_MS);
    } else {
      pos--;
      el.textContent = current.slice(0, pos);
      if (pos === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
      }
      setTimeout(tick, DELETE_MS);
    }
  }

  // Start from the full first phrase already in the markup
  pos = phrases[0].length;
  deleting = true;
  setTimeout(tick, HOLD_MS);
})();
