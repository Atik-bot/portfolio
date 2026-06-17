/* ============================================================
   graph-canvas.js — animated node-graph hero background
   A nod to Graph Convolutional Networks: drifting nodes that
   connect to near neighbours. Pure Canvas 2D, no libraries.
   Respects prefers-reduced-motion (draws a single static frame).
   ============================================================ */
(function () {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let nodes = [];
  let width = 0;
  let height = 0;
  let rafId = null;
  let nodeColor = "rgba(45,212,191,0.55)";
  let edgeColor = "rgba(139,147,167,0.16)";

  const LINK_DIST = 150;   // max px distance for drawing an edge
  const SPEED = 0.22;      // node drift speed

  /* Read theme-aware colors from CSS custom properties */
  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    nodeColor = styles.getPropertyValue("--graph-node").trim() || nodeColor;
    edgeColor = styles.getPropertyValue("--graph-edge").trim() || edgeColor;
  }

  /* Size canvas to its element, accounting for devicePixelRatio */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedNodes();
  }

  /* Node count scales with area, capped for performance */
  function seedNodes() {
    const count = Math.min(70, Math.floor((width * height) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * SPEED * 2,
      vy: (Math.random() - 0.5) * SPEED * 2,
      r: 1.4 + Math.random() * 1.8,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Move nodes; bounce softly off edges
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    // Edges between near neighbours, faded by distance
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.globalAlpha = 1 - dist / LINK_DIST;
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Nodes
    ctx.fillStyle = nodeColor;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    step();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    readColors();
    resize();
    if (reduceMotion) {
      step(); // single static frame
    } else {
      cancelAnimationFrame(rafId);
      loop();
    }
  }

  /* Pause the animation when the hero is off-screen (saves battery) */
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            cancelAnimationFrame(rafId);
            loop();
          } else {
            cancelAnimationFrame(rafId);
          }
        });
      },
      { threshold: 0 }
    ).observe(canvas);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduceMotion) step();
    }, 150);
  });

  // Re-read colors when the theme toggles
  window.addEventListener("themechange", function () {
    readColors();
    if (reduceMotion) step();
  });

  start();
})();
