/* ============================================================
   theme.js — dark/light toggle (default: dark)
   Runs first so the theme applies before anything paints.
   ============================================================ */
(function () {
  const root = document.documentElement;
  const KEY = "atik-theme";

  // Restore saved preference (dark is the default in the HTML attribute)
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  function applyButtonLabel(btn) {
    const isDark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    applyButtonLabel(btn);

    btn.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode — ignore */ }
      applyButtonLabel(btn);
      // Let the canvas re-read its colors
      window.dispatchEvent(new CustomEvent("themechange"));
    });
  });
})();
