
const hero = document.getElementById("hero");

function smallSnow() {
    const snow = document.createElement("div");
    snow.classList.add("snowflake");

    const size = Math.random() * 3 + 2;
    snow.style.width = snow.style.height = size + "px";
    snow.style.left = Math.random() * 100 + "%";

    hero.appendChild(snow);

    let y = -10;
    const interval = setInterval(() => {
        y += 2;
        snow.style.top = y + "px";

        const garlandY = 150;

        if (y >= garlandY - 3 && y <= garlandY + 3) {
            clearInterval(interval);
            snow.classList.add("snow-stick");

            setTimeout(() => {
                const down = setInterval(() => {
                    y += 3;
                    snow.style.top = y + "px";
                    if (y > window.innerHeight) {
                        clearInterval(down);
                        snow.remove();
                    }
                }, 20);
            }, 600 + Math.random() * 800);
        }

        if (y > window.innerHeight) {
            clearInterval(interval);
            snow.remove();
        }
    }, 20);
}

setInterval(smallSnow, 300);


