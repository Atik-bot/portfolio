/* ============================================================
   main.js — contact form handling + small utilities
   ============================================================ */
(function () {
  /* ----- Auto-update copyright year ----- */
  const yearEl = document.getElementById("copy-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Contact form -----
     Two modes:
     1. If the Formspree action still contains the YOUR_FORM_ID placeholder
        (or we're on file:// / localhost without it configured), fall back
        to opening the visitor's email client with a pre-filled message.
     2. Once a real Formspree ID is set, submit via fetch and show a
        success/error note without leaving the page.                    */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  const action = form.getAttribute("action") || "";
  const usingPlaceholder = action.includes("YOUR_FORM_ID");
  const mailto = form.dataset.mailtoFallback;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const subject = (data.get("subject") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (usingPlaceholder) {
      // --- mailto fallback ---
      const body = encodeURIComponent(
        message + "\n\n— " + name + " (" + email + ")"
      );
      window.location.href =
        "mailto:" + mailto +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + body;
      setNote("Opening your email app… If nothing happens, email " + mailto + " directly.", false);
      return;
    }

    // --- Formspree AJAX submit ---
    setNote("Sending…", false);
    fetch(action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          setNote("Message sent. Thanks — I'll reply soon.", false, true);
        } else {
          throw new Error("Form service returned " + res.status);
        }
      })
      .catch(function () {
        setNote("Couldn't send right now. Email " + mailto + " instead.", true);
      });
  });

  function setNote(text, isError, isSuccess) {
    if (!note) return;
    note.textContent = text;
    note.classList.toggle("is-error", Boolean(isError));
    note.classList.toggle("is-success", Boolean(isSuccess));
  }
})();
