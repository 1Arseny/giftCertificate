
const sectionScripts = [
    "./src/js/hero.js",

];

function loadSectionScripts(list) {
    list.forEach(path => {
        const script = document.createElement("script");
        script.src = path;
        script.type = "module"; 
        document.body.appendChild(script);
    });
}
function positionNavbarBulbs() {
    const path = document.querySelector(".nav-garland-line path");
    const bulbs = document.querySelectorAll(".nav-bulbs span");
    const length = path.getTotalLength();

    bulbs.forEach((bulb, i) => {
        const progress = i / (bulbs.length - 1);
        const point = path.getPointAtLength(progress * length);
        bulb.style.left = point.x + "px";
        bulb.style.top = point.y + "px";
    });
}

document.addEventListener("DOMContentLoaded", positionNavbarBulbs);
window.addEventListener("resize", positionNavbarBulbs);

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollBtn.classList.add("visible");
    } else {
        scrollBtn.classList.remove("visible");
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function updateScrollProgress() {
    const progressBar = document.getElementById("scroll-progress");

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const scrolled = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrolled + "%";
}

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("load", updateScrollProgress);


loadSectionScripts(sectionScripts);

console.log("Main.js loaded — scripts attached via DOM.");

