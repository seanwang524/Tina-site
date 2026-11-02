/* Tina 的小小世界 — 交互脚本（很短的，看得懂） */
(function () {
  "use strict";

  /* 1. 页脚年份自动更新 */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* 2. 元素滚进屏幕时淡入 */
  var revealTargets = document.querySelectorAll(
    ".section-title, .section-sub, .about-copy > p, .facts, .card, .tile, .timeline li, .wish, .gallery-note"
  );

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 6) * 55 + "ms";
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* 3. 导航高亮当前所在区块 */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* 4. 点击作品放大查看 */
  var box = document.getElementById("lightbox");
  var stage = document.getElementById("lightbox-stage");
  var cap = document.getElementById("lightbox-cap");
  var closeBtn = document.getElementById("lightbox-close");
  var lastFocused = null;

  function openLightbox(tile) {
    if (!box || !stage || !cap) return;
    lastFocused = document.activeElement;
    stage.innerHTML = "";

    var img = tile.querySelector("img");
    if (img) {
      var big = document.createElement("img");
      big.src = img.getAttribute("src");
      big.alt = img.getAttribute("alt") || "";
      stage.appendChild(big);
    } else {
      var span = document.createElement("span");
      span.className = "tile-emoji";
      span.setAttribute("aria-hidden", "true");
      span.textContent = (tile.querySelector(".tile-emoji") || {}).textContent || "🎨";
      stage.appendChild(span);
      stage.style.background = "linear-gradient(150deg, " +
        (tile.style.getPropertyValue("--tint1") || "#ffe9d6") + ", " +
        (tile.style.getPropertyValue("--tint2") || "#fff6ee") + ")";
    }

    cap.textContent = tile.getAttribute("data-title") || "";
    box.hidden = false;
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!box) return;
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll(".tile").forEach(function (tile) {
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("role", "button");
    tile.addEventListener("click", function () { openLightbox(tile); });
    tile.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(tile);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (box) {
    box.addEventListener("click", function (e) {
      if (e.target === box) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box && !box.hidden) closeLightbox();
  });
})();
