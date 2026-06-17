/* ============================================================
   navbar.js — sticky blur on scroll, mobile menu, scroll spy
   ============================================================ */
(function () {
  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  const navLinks = Array.from(document.querySelectorAll(".navbar__link"));

  /* ----- Blur backdrop once the page is scrolled ----- */
  function onScroll() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Mobile burger menu ----- */
  function closeMenu() {
    links.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", function () {
    const open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after picking a link, or when pressing Escape
  navLinks.forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ----- Scroll spy: highlight the section in view ----- */
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((a) =>
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id)
    );
  }

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        // Pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
