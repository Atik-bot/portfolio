/* ============================================================
   scroll-animations.js — IntersectionObserver scroll reveals
   Elements with .reveal fade-up when they enter the viewport.
   ============================================================ */
(function () {
  const reveals = document.querySelectorAll(".reveal");

  // Fallback: if IO is unsupported, show everything immediately
  if (!("IntersectionObserver" in window)) {
    document.documentElement.classList.add("no-observer");
    return;
  }

  // Honour reduced-motion: show without animating
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.setAttribute("data-motion", "reduced");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );

  // Stagger hero and contact children with CSS variables; observe the rest
  let heroIndex = 0;
  let contactIndex = 0;
  reveals.forEach((el) => {
    if (el.closest(".hero")) {
      el.style.setProperty("--stagger", heroIndex++);
    } else if (el.closest(".contact")) {
      el.style.setProperty("--stagger-c", contactIndex++);
    }
    observer.observe(el);
  });
})();
