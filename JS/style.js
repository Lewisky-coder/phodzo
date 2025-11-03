/* JS/style.js – Clean Unified Site Behaviour */
document.addEventListener("DOMContentLoaded", () => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /* 🌿 Hamburger Menu */
    (function hamburgerMenu() {
        const ham = $(".hamburger");
        const nav = $(".site-nav");
        if (!ham || !nav) return;

        ham.addEventListener("click", () => {
            const isActive = nav.classList.toggle("active");
            ham.classList.toggle("open");
            ham.setAttribute("aria-expanded", isActive);
        });

        // Close menu when link is clicked
        $$("a", nav).forEach((link) =>
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                ham.classList.remove("open");
                ham.setAttribute("aria-expanded", "false");
            })
        );
    })();

    /* 💬 FAQ Accordion */
    (function faqAccordion() {
        const faq = $(".faq");
        if (!faq) return;
        const items = $$(".faq-item", faq);
        items.forEach((item) =>
            item.addEventListener("click", () => {
                items.forEach((i) => i !== item && i.classList.remove("active"));
                item.classList.toggle("active");
            })
        );
    })();

    /* 🖼️ Gallery Lightbox */
    (function lightbox() {
        const imgs = $$("main .gallery-grid img, .gallery-grid img");
        if (!imgs.length) return;
        const lb = document.createElement("div");
        lb.className = "ef-lightbox";
        lb.style.cssText =
            "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.86);z-index:9999;visibility:hidden;opacity:0;transition:opacity .2s";
        lb.innerHTML = `
      <button class="ef-close" aria-label="Close" style="position:absolute;right:1rem;top:1rem;background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">×</button>
      <button class="ef-prev" aria-label="Prev" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">‹</button>
      <img class="ef-img" src="" alt="" style="max-width:92%;max-height:82%;border-radius:.5rem;box-shadow:0 12px 40px rgba(0,0,0,.6)">
      <button class="ef-next" aria-label="Next" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">›</button>
    `;
        document.body.appendChild(lb);

        const srcs = imgs.map((i) => ({
            src: i.getAttribute("src"),
            alt: i.getAttribute("alt") || "",
        }));
        let current = 0;
        function show(i) {
            const img = $(".ef-img", lb);
            img.src = srcs[i].src;
            img.alt = srcs[i].alt;
            lb.style.visibility = "visible";
            lb.style.opacity = 1;
            current = i;
        }
        function hide() {
            lb.style.opacity = 0;
            setTimeout(() => (lb.style.visibility = "hidden"), 220);
        }

        imgs.forEach((imgEl, i) =>
            imgEl.addEventListener("click", (e) => {
                e.preventDefault();
                show(i);
            })
        );
        $(".ef-close", lb).addEventListener("click", hide);
        $(".ef-next", lb).addEventListener("click", () =>
            show((current + 1) % srcs.length)
        );
        $(".ef-prev", lb).addEventListener("click", () =>
            show((current - 1 + srcs.length) % srcs.length)
        );
        lb.addEventListener("click", (e) => {
            if (e.target === lb) hide();
        });
        document.addEventListener("keydown", (e) => {
            if (lb.style.visibility === "visible") {
                if (e.key === "Escape") hide();
                if (e.key === "ArrowRight") $(".ef-next", lb).click();
                if (e.key === "ArrowLeft") $(".ef-prev", lb).click();
            }
        });
    })();

    /* 📩 Contact Form */
    (function contactForm() {
        const form = $("#contact-form");
        if (!form) return;
        function isEmail(v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            form.querySelectorAll(".ef-error").forEach((n) => n.remove());
            const fd = Object.fromEntries(new FormData(form).entries());
            let ok = true;

            if (!fd.name?.trim()) {
                showError("#name", "Enter your name");
                ok = false;
            }
            if (!isEmail(fd.email)) {
                showError("#email", "Enter a valid email");
                ok = false;
            }
            if (!fd.message?.trim()) {
                showError("#message", "Please enter a message");
                ok = false;
            }

            if (!ok) return;
            alert("✅ Thank you! Your message has been sent.");
            form.reset();
        });

        function showError(selector, msg) {
            const el = $(selector);
            const err = document.createElement("div");
            err.className = "ef-error";
            err.style.color = "crimson";
            err.textContent = msg;
            el.insertAdjacentElement("afterend", err);
        }
    })();

    /* 🧍 Employee Search */
    (function employeeSearch() {
        const searchInput = $("#employeeSearch");
        const employees = $$("#employeeList .team-card");
        if (!searchInput) return;

        searchInput.addEventListener("keyup", () => {
            const value = searchInput.value.toLowerCase();
            employees.forEach((card) => {
                const name = card.querySelector("h3").textContent.toLowerCase();
                const role = card.querySelector("p").textContent.toLowerCase();
                card.style.display =
                    name.includes(value) || role.includes(value) ? "" : "none";
            });
        });
    })();

    /* 🔁 Flip Card */
    (function flipCard() {
        const cards = $$(".team-card");
        cards.forEach((card) =>
            card.addEventListener("click", () => card.classList.toggle("flipped"))
        );
    })();

    /* 🌱 Reveal Animation */
    (function reveal() {
        const els = $$("main section, .card, .product-card, .feature");
        els.forEach((el, i) => {
            el.style.opacity = 0;
            el.style.transform = "translateY(10px)";
            setTimeout(() => {
                el.style.transition = "all .6s ease";
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }, 120 + i * 30);
        });
    })();
});
// Card flip on click
document.querySelectorAll(".employee-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("flipped");
    });
});

// Search bar filter
document.getElementById("employeeSearch").addEventListener("keyup", function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll(".employee-card").forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const role = card.dataset.role.toLowerCase();
        card.style.display = (name.includes(query) || role.includes(query)) ? "block" : "none";
    });
});
// ✅ HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.site-nav');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
});

// ✅ FORM VALIDATION
document.getElementById('enquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = ['fullname', 'email', 'phone', 'subject', 'message'];
    let valid = true;

    fields.forEach(id => {
        const input = document.getElementById(id);
        input.style.borderColor = '#ccc';
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        }
    });

    const response = document.getElementById('responseMsg');
    if (!valid) {
        response.textContent = '⚠️ Please fill in all required fields.';
        response.className = 'response error';
        return;
    }

    response.textContent = '✅ Enquiry sent successfully! We’ll get back to you soon.';
    response.className = 'response success';
    this.reset();
});
