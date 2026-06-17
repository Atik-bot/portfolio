/* ============================================================
   project-gallery.js — screenshot carousel inside each project
   card. Works with any number of images: arrows cycle, thumbnails
   jump. Galleries with a single image hide their arrows.

   To add more screenshots later: drop extra <img> tags into
   .pcard__stage (before the arrows) and matching .pcard__thumb
   buttons with data-thumb="1", "2", … — no JS changes needed.
   ============================================================ */
(function () {
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    const slides = Array.from(gallery.querySelectorAll(".pcard__stage > img"));
    const thumbs = Array.from(gallery.querySelectorAll(".pcard__thumb"));
    const prev = gallery.querySelector("[data-prev]");
    const next = gallery.querySelector("[data-next]");
    let index = Math.max(0, slides.findIndex((s) => s.classList.contains("is-active")));

    // One image only → no arrows needed
    if (slides.length <= 1) {
      gallery.classList.add("is-single");
      return;
    }

    function show(i) {
      index = (i + slides.length) % slides.length; // wrap around
      slides.forEach((img, n) => img.classList.toggle("is-active", n === index));
      thumbs.forEach((t, n) => {
        const active = n === index;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
    }

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));
    thumbs.forEach((t, n) => t.addEventListener("click", () => show(n)));

    // Left/right arrow keys while the gallery has focus
    gallery.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  });
})();
