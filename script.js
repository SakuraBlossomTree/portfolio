import { animate } from "https://cdn.jsdelivr.net/npm/motion@12.34.0/+esm"

// ===================== THEME TOGGLE =====================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

const savedTheme = localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ===================== STARFIELD BACKGROUND =====================
const bgCanvas = document.getElementById("bgCanvas");

if (bgCanvas) {
  const ctx = bgCanvas.getContext("2d");
  let width, height, stars, mouseX = 0, mouseY = 0;

  const STAR_COUNT_DENSITY = 9000; // one star per N px^2
  const MAX_LINK_DIST = 130;

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    return isDark
      ? { star: "252, 163, 17", link: "252, 163, 17", bg: "11, 17, 32" }
      : { star: "20, 33, 61", link: "20, 33, 61", bg: "255, 255, 255" };
  }

  function resize() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor((width * height) / STAR_COUNT_DENSITY));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.4 + Math.random() * 0.8
    }));
  }

  function draw(time) {
    const { star, link } = getThemeColors();
    ctx.clearRect(0, 0, width, height);

    const parallaxX = (mouseX / width - 0.5) * 12;
    const parallaxY = (mouseY / height - 0.5) * 12;

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -10) s.x = width + 10;
      if (s.x > width + 10) s.x = -10;
      if (s.y < -10) s.y = height + 10;
      if (s.y > height + 10) s.y = -10;

      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 * s.twinkleSpeed + s.twinklePhase);
      const alpha = 0.15 + twinkle * 0.45;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${star}, ${alpha})`;
      ctx.arc(s.x + parallaxX, s.y + parallaxY, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // faint connecting lines between nearby stars for a constellation feel
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_LINK_DIST) {
          const lineAlpha = (1 - dist / MAX_LINK_DIST) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${link}, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(stars[i].x + parallaxX, stars[i].y + parallaxY);
          ctx.lineTo(stars[j].x + parallaxX, stars[j].y + parallaxY);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  resize();
  requestAnimationFrame(draw);
}

const nameEl = document.getElementById("name");

if (nameEl) {

  const txt = "Yohib Hussain";
  let i = 0;
  const speed = 50;

  function typeWriter() {
    
    if (i < txt.length) {
      const char = txt[i];
      const span = document.createElement("span");

      span.textContent = char === " " ? "\u00A0" : char;

      span.style.opacity = 0;
      span.style.transform = "translateY(20px)";
      span.style.fontVariationSettings = '"wght" 200';

      nameEl.appendChild(span);

      animate(
        span,
        {
          opacity: [0, 1],
          y: [20, 0],
          fontVariationSettings: ['"wght" 200', '"wght" 400']
        },
        {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }
      );

      i++;

      const randomDelay = 40 + Math.random() * 40;
      setTimeout(typeWriter, randomDelay);
    } else {
      cacheLetters();
    }
  }

 const baseWeight = 300;
const maxWeight = 900;
let fontSize = parseFloat(getComputedStyle(nameEl).fontSize);
let maxDistance = fontSize * 2.5;
let letters = [];

function cacheLetters() {
  letters = [...nameEl.querySelectorAll("span")];
}

window.addEventListener("resize", () => {
  fontSize = parseFloat(getComputedStyle(nameEl).fontSize);
  maxDistance = fontSize * 2.5;
});

document.addEventListener("mousemove", (e) => {
  if (!letters.length) return;
  
  letters.forEach(letter => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / maxDistance);
    const eased = influence * influence;
    const targetWeight = baseWeight + eased * (maxWeight - baseWeight);
    
    animate(
      letter,
      { fontVariationSettings: `"wght" ${targetWeight}` },
      { duration: 0.2, ease: [0.4, 0, 0.2, 1],
        type: "spring"
       }
    );
  });
});

  window.addEventListener("load", () => {
    typeWriter();
  });
}

const projects = document.querySelectorAll('.project-item');

projects.forEach(project => {
  project.addEventListener('click', () => {
    projects.forEach(p => p.classList.remove('selected'));
    project.classList.add('selected');
  });
});

function getContrastColor(r, g, b) {
  // convert RGB → luminance (human perception)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // return mode, not color
  return luminance > 0.5 ? "dark" : "light";
}

function extractColors(imageUrl) {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    let data;
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (e) {
      console.error("Canvas blocked:", e);
      return;
    }

    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 40) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    // � apply contrast (your existing logic)
    applyContrast(r, g, b);

    // 🔥 NEW: apply background
    applyBackground(r, g, b);
  };

  img.src = imageUrl;
}

function applyContrast(r, g, b) {
  const mode = getContrastColor(r, g, b);

  const trackEl = document.getElementById("coverTrack");
  const artistEl = document.getElementById("coverArtist");

  if (!trackEl || !artistEl) return;

  // 🔄 NORMAL LOGIC (recommended)
  if (mode === "dark") {
    trackEl.style.color = "#000";
    artistEl.style.color = "#000";

    trackEl.style.textShadow = "0 0 6px rgba(255,255,255,0.6)";
    artistEl.style.textShadow = "0 0 6px rgba(255,255,255,0.6)";
  } else {
    trackEl.style.color = "#fff";
    artistEl.style.color = "#fff";

    trackEl.style.textShadow = "0 0 6px rgba(0,0,0,0.8)";
    artistEl.style.textShadow = "0 0 6px rgba(0,0,0,0.8)";
  }
}

function applyBackground(r, g, b) {
  const container = document.querySelector(".now-playing-widget");
  if (!container) return;

  // 🔥 slightly boost color (makes it less dull)
  const boost = 1.2;
  r = Math.min(255, Math.floor(r * boost));
  g = Math.min(255, Math.floor(g * boost));
  b = Math.min(255, Math.floor(b * boost));

  const color = `rgb(${r}, ${g}, ${b})`;

  // 🔥 set CSS variable
  container.style.setProperty("--reddish-brown", color);
}

animate(
  ".vinyl-inner",
  { rotate: 360 },
  {
    duration: 5,
    ease: "linear",
    repeat: Infinity
  }
);

const nowPlayingWidget = document.getElementById('nowPlayingWidget');
const widgetClose = document.getElementById('widgetClose');
let shooting = false;
let bgLines = null;

if (nowPlayingWidget && widgetClose) {
nowPlayingWidget.addEventListener("click", (e) => {
  if (e.target.closest(".widget-close")) return;
  if (nowPlayingWidget.classList.contains("fullscreen")) return;

  const album = document.querySelector(".widget-album-art");
  const vinyl = document.querySelector(".vinyl");
  const closeBtn = document.querySelector(".widget-close");
  const coverTrack = document.querySelector(".cover-track");
  const coverArtist = document.querySelector(".cover-artist");

  if (!album || !vinyl || !closeBtn) return; // Safety check

  // Initial states for entrance
  album.style.opacity = 0;
  vinyl.style.opacity = 0;
  closeBtn.style.opacity = 0;

  nowPlayingWidget.classList.add("fullscreen");

  coverTrack.style.opacity = 1;
  coverArtist.style.opacity = 1;

  shooting = true;

  bgLines = document.createElement("div");
  bgLines.className = "fullscreen-lines";
  nowPlayingWidget.prepend(bgLines);

  function spawnShot() {
    if (!shooting || !bgLines) return;
    if (bgLines.children.length >= 20) {
      setTimeout(spawnShot, 200 + Math.random() * 500);
      return;
    }

    const line = document.createElement("div");
    line.className = "shot-line";

    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 40;

    line.style.left = startX + "px";
    line.style.top = startY + "px";

    line.style.width = `${300 + Math.random() * 200}px`;

    bgLines.appendChild(line);

    const distance = window.innerHeight + 600;
    const horizMultiplier = 0.4 + Math.random() * 0.4;

    const travelX = distance * horizMultiplier; // right movement
    const travelY = -distance;       // upward movement

    const duration = 1.6 + Math.random() * 1.2;

    const angle = Math.atan2(travelY, travelX) * (180 / Math.PI); // Negative angle for upwards-right
    line.style.rotate = `${angle}deg`;

    animate(
      line,
      {
        x: [0, travelX],
        y: [0, travelY],
        opacity: [0, 1, 1, 0]
      },
      {
        duration,
        ease: "linear"
      }
    ).finished.then(() => {
      line.remove();
    });

    // Keep spawning
    setTimeout(spawnShot, 200 + Math.random() * 500);
  }

  // spawnShot();

  const entranceSequence = [
    // Expand widget
    [nowPlayingWidget, {opacity: [0.8, 1] }, { duration: 0.5, ease: "easeInOut" }],
    // Album slide in
    [album, { x: [-100, 0], opacity: [0, 1] }, { duration: 0.6, at: 0.2 , ease: [0.28, 0.55, 0.67, 0.84]}],
    // Vinyl fade + scale
    [vinyl, { opacity: [0, 1], x: [-100, 0] }, { duration: 0.7, at: 0.8, ease: [0.28, 0.55, 0.67, 0.84]}],
    // Close button pop
    [closeBtn, { opacity: [0, 1]}, { duration: 0.4, at: 0.4 }],

    [coverTrack, {opacity: [0, 1]}, { duration: 0.7, at: 0.9, ease: [0.28, 0.55, 0.67, 0.84]}],

    [coverArtist, {opacity: [0, 1]}, { duration: 0.7, at: 1.0, ease: [0.28, 0.55, 0.67, 0.84]}]
  ];
  

  animate(entranceSequence);
});
}

async function closeWidget(withAnimation = true) {
  const nowPlayingWidget = document.getElementById('nowPlayingWidget');
  const album = document.querySelector(".widget-album-art");
  const vinyl = document.querySelector(".vinyl");
  const closeBtn = document.querySelector(".widget-close");
  const coverTrack = document.querySelector(".cover-track");
  const coverArtist = document.querySelector(".cover-artist");

  if (!nowPlayingWidget) return;
  if (!nowPlayingWidget.classList.contains("fullscreen")) return;

  const existingLines = nowPlayingWidget.querySelector(".fullscreen-lines");
  if (existingLines) {
    existingLines.remove();
  }
  shooting = false;

  if (withAnimation) {
    const exitSequence = [
      // Expand widget
      [nowPlayingWidget, {opacity: [1, 0.8] }, { duration: 0.5, ease: "circIn" }],
      // Album slide in
      [album, {}, { duration: 0.6, at: 1 , ease: [0.28, 0.55, 0.67, 0.84]}],
      // Vinyl fade + scale
      [vinyl, { opacity: [1, 0], x: [0, -100] }, { duration: 0.7, at: 0.2, ease: [0.28, 0.55, 0.67, 0.84]}],
      // Close button pop
      [closeBtn, { opacity: [1, 0]}, { duration: 0.4, at: 0.4 }],

      [coverTrack, {opacity: [1, 0]}, { duration: 0.7, at: 0.9, ease: [0.28, 0.55, 0.67, 0.84]}],

      [coverArtist, {opacity: [1, 0]}, { duration: 0.7, at: 1.0, ease: [0.28, 0.55, 0.67, 0.84]}]
    ];

    await animate(exitSequence);
  }

  nowPlayingWidget.classList.remove('fullscreen');
}

if (widgetClose) {
  widgetClose.addEventListener('click', async (e) => {
    e.stopPropagation();
    await closeWidget(true);
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWidget(true); // Now with animation for consistency
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = document.getElementById("mainNav")?.offsetHeight || 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  });
});

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}