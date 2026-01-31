document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor
    const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");

    // Check if cursor elements exist (they might be hidden on mobile)
    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with inertia (using animate for smoother performance)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effects
        const hoverTriggers = document.querySelectorAll("a, button, [data-hover-trigger]");
        hoverTriggers.forEach(trigger => {
            trigger.addEventListener("mouseenter", () => {
                document.body.classList.add("hovering");
            });
            trigger.addEventListener("mouseleave", () => {
                document.body.classList.remove("hovering");
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll("[data-reveal]");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");

                // If it's a stat number, start counting
                if (entry.target.classList.contains("stat-item")) {
                    const numElement = entry.target.querySelector(".stat-number");
                    if (numElement) startCount(numElement);
                }

                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Number Counter Animation
    function startCount(el) {
        const target = parseInt(el.getAttribute("data-count"));
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 16)); // 60fps approx
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = current.toLocaleString();
            }
        }, 16);
    }

    // Mockup Estimate Calculator
    const calcBtn = document.getElementById("calc-btn");
    const resultBox = document.getElementById("estimate-result");

    if (calcBtn && resultBox) {
        calcBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Simple mockup logic
            const inputs = document.querySelectorAll(".estimate-form-mockup input");
            let filled = true;
            inputs.forEach(input => {
                if (!input.value) filled = false;
            });

            if (!filled) {
                alert("Please fill in all fields (mockup).");
                return;
            }

            // Fake calculation effect
            calcBtn.innerText = "Calculating...";
            setTimeout(() => {
                calcBtn.innerText = "Calculate Estimate";
                resultBox.classList.remove("hidden");
                // Randomize slightly for fun
                const basePrice = 140 + Math.floor(Math.random() * 20);
                resultBox.querySelector(".price-tag").innerText = `€ ${basePrice}.00`;
            }, 800);
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Typing Effect
    initTypingEffect();
});

function initTypingEffect() {
    const titleEl = document.getElementById("hero-title");
    const subtitleEl = document.getElementById("hero-subtitle");
    const ctaEl = document.getElementById("hero-cta");

    const titleText = "Reliable Logistics in Ireland.";
    const subtitleText = "Connecting businesses with speed, precision, and trust across the Emerald Isle.";

    if (!titleEl || !subtitleEl) return;

    // Clear content
    titleEl.innerHTML = "";
    subtitleEl.innerHTML = "";

    // Create cursor
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    
    // Initial State: Cursor in title data, blinking, waiting.
    titleEl.appendChild(cursor);

    // Pause for 3 seconds before typing
    setTimeout(() => {
        typeText(titleEl, titleText, 50, () => {
            // After title done, move to subtitle
            setTimeout(() => {
                if (titleEl.contains(cursor)) titleEl.removeChild(cursor);
                subtitleEl.appendChild(cursor);

                typeText(subtitleEl, subtitleText, 30, () => {
                    // After subtitle done
                    // Stop blinking and fade out
                    cursor.style.animation = "none";
                    cursor.style.transition = "opacity 0.5s ease-out";
                    cursor.style.opacity = "0";

                    // Wait for fade out to complete
                    setTimeout(() => {
                        if (subtitleEl.contains(cursor)) subtitleEl.removeChild(cursor);
                        
                        // Reveal buttons smoothly
                        if (ctaEl) {
                            ctaEl.classList.add("reveal-active");
                        }

                        const brandEL = document.getElementById("hero-brand");
                        if (brandEL){
                            brandEL.classList.add("reveal-active");
                        }
                        setTimeout(() =>{
                            if (ctaEl){
                                ctaEl.classList.add("reveal-active");
                            }
                        },400);

                    }, 500); // 0.5s matches transition
                }, cursor);
            }, 300); // Short pause between title and subtitle
        }, cursor);
    }, 3000); // 3 seconds initial pause
}

function typeText(element, text, speed, callback, cursor) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            // Insert text before the cursor
            cursor.before(text.charAt(i));
            i++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type();
}
