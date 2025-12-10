/* ==========================
    Lazy load section scripts
========================== */
const sectionScripts = [
    "./src/js/hero.js",
];

// MODAL ELEMENTS
const modal = document.getElementById("formModal");
const modalContainer = document.getElementById("modalFormContainer");
const closeModal = document.getElementById("closeModal");

window.openFormModal = function () {
    const form = document.getElementById("leadForm");
    if (!form || !modalContainer) return;

    modalContainer.innerHTML = "";
    modalContainer.appendChild(form);
    form.classList.remove("hidden");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};

function closeFormModalFunc() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

if (closeModal) closeModal.addEventListener("click", closeFormModalFunc);

// Close when clicking outside
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeFormModalFunc();
    });
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFormModalFunc();
});


function loadSectionScripts(list) {
    for (const path of list) {
        const script = document.createElement("script");
        script.src = path;
        script.type = "module";
        document.body.appendChild(script);
    }
}


/* ==========================
    Cached DOM references
========================== */
const scrollBtn = document.getElementById("scrollTopBtn");
const progressBar = document.getElementById("scroll-progress");
const bulbs = document.querySelectorAll(".nav-bulbs span");
const garlandPath = document.querySelector(".nav-garland-line path");

let garlandLength = 0;


/* ==========================
    Optimized Garland Position
========================== */
function calcGarland() {
    if (!garlandPath) return;

    // Cache heavy operation
    garlandLength = garlandPath.getTotalLength();

    bulbs.forEach((bulb, i) => {
        const progress = i / (bulbs.length - 1);
        const point = garlandPath.getPointAtLength(progress * garlandLength);

        bulb.style.left = `${point.x}px`;
        bulb.style.top = `${point.y}px`;
    });
}

window.addEventListener("resize", () => {
    requestAnimationFrame(calcGarland);
});

document.addEventListener("DOMContentLoaded", calcGarland);


/* ==========================
    Throttle helper
========================== */
function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
        const now = performance.now();
        if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
        }
    };
}


/* ==========================
    Scroll Progress + ScrollTop visibility
========================== */
const handleScroll = throttle(() => {
    const scrollTop = window.scrollY;
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;

    // scrollTop button
    if (scrollBtn) {
        scrollBtn.classList.toggle("visible", scrollTop > 400);
    }

    // progress bar
    if (progressBar) {
        const percent = (scrollTop / maxHeight) * 100;
        progressBar.style.width = percent + "%";
    }

}, 50); // runs every ~50ms instead of every scroll tick


window.addEventListener("scroll", handleScroll);


/* ==========================
    Smooth scrollTop
========================== */
scrollBtn?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* ==========================
    Intersection Observer — Fade-in Animations
========================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        }
    });
}, {
    threshold: 0.15
});

/* Apply observer to all fade items */
document.querySelectorAll(".fade-section").forEach(el => observer.observe(el));

/* ===== SNOW CANVAS ===== */
function startSnow() {
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const flakes = Array.from({length: 100}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random()*2 + 1,
    d: Math.random()*40 + 10
  }));

  function update() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#00ff88';
    flakes.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();

      f.y += Math.sqrt(f.d) * 0.5;
      if (f.y > h) {
        f.y = -f.r;
        f.x = Math.random() * w;
      }
    });
    requestAnimationFrame(update);
  }

  update();

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

document.addEventListener('DOMContentLoaded', startSnow);

function adjustHeroOffset() {
    const nav = document.getElementById("nav");
    const hero = document.getElementById("hero");

    if (nav && hero) {
        const navHeight = nav.offsetHeight;
        hero.style.paddingTop = navHeight + 20 + "px"; // 20px доп. пространства
    }
}

window.addEventListener("load", adjustHeroOffset);
window.addEventListener("resize", adjustHeroOffset);


/* ==========================
    Start dynamic scripts
========================== */
loadSectionScripts(sectionScripts);
document.addEventListener("click", e => {
    if (e.target.matches("[data-open-modal]")) openFormModal();
});
console.log("Optimized main.js loaded.");
