/* JS/style.js - site-wide behaviour (hamburger, FAQ, gallery lightbox, forms, reveal) */
document.addEventListener("DOMContentLoaded", () => {
    const $ = (sel, root = document) => (root || document).querySelector(sel);
    const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

    /* hamburger */
    (function navToggle() {
        const ham = $(".hamburger");
        const nav = document.querySelector(".site-nav");
        if (!ham || !nav) return;
        ham.addEventListener("click", () => {
            nav.classList.toggle("show");
            ham.classList.toggle("open");
            ham.setAttribute("aria-expanded", String(nav.classList.contains("show")));
        });
        $$("a", nav).forEach(a => a.addEventListener("click", () => {
            if (nav.classList.contains("show")) {
                nav.classList.remove("show");
                ham.classList.remove("open");
                ham.setAttribute("aria-expanded", "false");
            }
        }));
    })();

    /* FAQ accordion (index only) */
    (function faq() {
        const faq = $(".faq");
        if (!faq) return;
        const items = $$(".faq-item", faq);
        items.forEach(item => item.addEventListener("click", () => {
            items.forEach(i => { if (i !== item) i.classList.remove("active"); });
            item.classList.toggle("active");
        }));
    })();

    /* gallery lightbox (any page with .gallery-grid img) */
    (function lightbox() {
        const imgs = $$("main .gallery-grid img, .gallery-grid img");
        if (!imgs.length) return;
        const lb = document.createElement("div");
        lb.className = "ef-lightbox";
        lb.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.86);z-index:9999;visibility:hidden;opacity:0;transition:opacity .2s";
        lb.innerHTML = `
      <button class="ef-close" aria-label="Close" style="position:absolute;right:1rem;top:1rem;background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">×</button>
      <button class="ef-prev" aria-label="Prev" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">‹</button>
      <img class="ef-img" src="" alt="" style="max-width:92%;max-height:82%;border-radius:.5rem;box-shadow:0 12px 40px rgba(0,0,0,.6)">
      <button class="ef-next" aria-label="Next" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">›</button>
    `;
        document.body.appendChild(lb);
        const srcs = imgs.map(i => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt") || "" }));
        let current = 0;
        function show(i) {
            const img = $(".ef-img", lb);
            img.src = srcs[i].src;
            img.alt = srcs[i].alt;
            lb.style.visibility = "visible";
            lb.style.opacity = 1;
            current = i;
        }
        function hide() { lb.style.opacity = 0; setTimeout(() => lb.style.visibility = "hidden", 220); }

        imgs.forEach((imgEl, i) => imgEl.addEventListener("click", e => { e.preventDefault(); show(i); }));
        $(".ef-close", lb).addEventListener("click", hide);
        $(".ef-next", lb).addEventListener("click", () => show((current + 1) % srcs.length));
        $(".ef-prev", lb).addEventListener("click", () => show((current - 1 + srcs.length) % srcs.length));
        lb.addEventListener("click", e => { if (e.target === lb) hide(); });
        document.addEventListener("keydown", e => {
            if (lb.style.visibility === "visible") {
                if (e.key === "Escape") hide();
                if (e.key === "ArrowRight") $(".ef-next", lb).click();
                if (e.key === "ArrowLeft") $(".ef-prev", lb).click();
            }
        });
    })();

    /* contact form validation + simulated submit */
    (function contactForm() {
        const form = $("#contact-form");
        if (!form) return;
        function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
        function showModal(title, msg, mailto) {
            const overlay = document.createElement("div");
            overlay.className = "ef-overlay";
            overlay.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);z-index:9999";
            overlay.innerHTML = `<div style="background:#fff;padding:1.2rem;border-radius:.6rem;max-width:28rem;text-align:center"><h2>${title}</h2><p style="margin:.5rem 0 1rem">${msg}</p><button id="ef-close" style="padding:.5rem 1rem;border:0;border-radius:.4rem;background:var(--primary);color:#fff;cursor:pointer">Close</button></div>`;
            document.body.appendChild(overlay);
            $("#ef-close", overlay).addEventListener("click", () => overlay.remove());
            if (mailto) {
                const link = document.createElement("a");
                link.href = mailto; link.textContent = "Open email client"; link.style.display = "inline-block"; link.style.marginTop = ".6rem"; overlay.querySelector("div").appendChild(link);
            }
        }

        form.addEventListener("submit", e => {
            e.preventDefault();
            form.querySelectorAll(".ef-error").forEach(n => n.remove());
            const fd = Object.fromEntries(new FormData(form).entries());
            let ok = true;
            if (!fd.name || fd.name.trim().length < 2) { const el = $("#name"); const err = document.createElement("div"); err.className = "ef-error"; err.style.color = "crimson"; err.textContent = "Enter your name"; el.insertAdjacentElement("afterend", err); ok = false; }
            if (!fd.email || !isEmail(fd.email)) { const el = $("#email"); const err = document.createElement("div"); err.className = "ef-error"; err.style.color = "crimson"; err.textContent = "Enter a valid email"; el.insertAdjacentElement("afterend", err); ok = false; }
            if (!fd.message || fd.message.trim().length < 6) { const el = $("#message"); const err = document.createElement("div"); err.className = "ef-error"; err.style.color = "crimson"; err.textContent = "Please enter a message"; el.insertAdjacentElement("afterend", err); ok = false; }
            if (!ok) return;
            const mailto = `mailto:info@ecofresh.co.za?subject=${encodeURIComponent("Contact form")}&body=${encodeURIComponent(fd.message)}`;
            setTimeout(() => { showModal("Thanks — message received", "We will reply within 24 hours.", mailto); form.reset(); }, 300);
        });
    })();

    /* reveal animation */
    (function reveal() {
        const els = document.querySelectorAll("main section, .card, .product-card, .feature");
        els.forEach((el, i) => {
            el.style.opacity = 0;
            el.style.transform = "translateY(10px)";
            setTimeout(() => { el.style.transition = "all .6s ease"; el.style.opacity = 1; el.style.transform = "translateY(0)"; }, 120 + i * 30);
        });
    })();
});
// JS/style.js — Unified Navigation + Hamburger Toggle

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".site-nav");

    if (!hamburger || !nav) {
        console.warn("[style.js] Missing hamburger or navigation elements.");
        return;
    }

    hamburger.addEventListener("click", () => {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("active");
    });

    // Optional: Close menu when clicking a link (for mobile UX)
    nav.querySelectorAll("a").forEach((link) =>
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        })
    );

    console.log("[style.js] Hamburger navigation initialized.");
});
// main.js

document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });
});
// Auth Tab Toggle
document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });
});
