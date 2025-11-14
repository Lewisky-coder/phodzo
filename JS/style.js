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
/* Simple front-end auth (localStorage demo) */
function setupAuth() {
    const regForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    if (regForm) {
        regForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = regForm.querySelector('[name="reg-name"]').value.trim();
            const email = regForm.querySelector('[name="reg-email"]').value.trim();
            const pwd = regForm.querySelector('[name="reg-password"]').value;
            if (!name || !email || !pwd) { showToast('Please complete all fields'); return; }
            const users = JSON.parse(localStorage.getItem('murn_users') || '[]');
            if (users.find(u => u.email === email)) { showToast('Email already registered'); return; }
            users.push({ name, email, password: pwd });
            localStorage.setItem('murn_users', JSON.stringify(users));
            showToast('Registration successful — you can now log in');
            regForm.reset();
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = loginForm.querySelector('[name="login-email"]').value.trim();
            const pwd = loginForm.querySelector('[name="login-password"]').value;
            const users = JSON.parse(localStorage.getItem('murn_users') || '[]');
            const found = users.find(u => u.email === email && u.password === pwd);
            if (found) {
                localStorage.setItem('murn_current', JSON.stringify({ name: found.name, email: found.email }));
                showToast(`Welcome back, ${found.name}`);
                loginForm.reset();
            } else {
                showToast('Invalid credentials');
            }
        });
    }
}
// JS/formResponse.js — shared validation + full-screen popup with date/time
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form.enquiry-form, form.contact-form");
    if (!forms.length) return;

    forms.forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();

            // Remove old error messages
            form.querySelectorAll(".error-msg").forEach(el => el.remove());

            let valid = true;

            form.querySelectorAll("input[required], textarea[required], select[required]").forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    const error = document.createElement("div");
                    error.className = "error-msg";
                    error.textContent = `⚠️ Please fill in the ${input.name || "required"} field.`;
                    input.insertAdjacentElement("afterend", error);
                }
            });

            if (!valid) return;

            // If form is valid → show response popup
            showResponsePopup();
            form.reset();
        });
    });

    function showResponsePopup() {
        const now = new Date();
        const formattedDate = now.toLocaleString("en-ZA", {
            dateStyle: "full",
            timeStyle: "short"
        });

        const overlay = document.createElement("div");
        overlay.className = "response-overlay";
        overlay.innerHTML = `
      <div class="response-box">
        <h2>✅ Thank You!</h2>
        <p>Your message has been received successfully.<br>
        We’ll get back to you within 24 hours.</p>
        <p class="timestamp">📅 Received on: <strong>${formattedDate}</strong></p>
        <button id="closePopup">Close</button>
      </div>
    `;

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";

        document.getElementById("closePopup").addEventListener("click", () => {
            overlay.remove();
            document.body.style.overflow = "auto";
        });
    }
});
// JS/forms.js — unified form validation + full-screen response popup (with timestamp)
// Place this at ../JS/forms.js and include as: <script src="../JS/forms.js" defer></script>

document.addEventListener("DOMContentLoaded", () => {
    console.log("[forms.js] loaded");

    // Select both enquiry and contact forms (by class)
    const forms = document.querySelectorAll("form.enquiry-form, form.contact-form");
    if (!forms || forms.length === 0) {
        console.log("[forms.js] no forms found with class 'enquiry-form' or 'contact-form'");
    }

    forms.forEach(form => {
        // make sure required attributes exist on inputs (just safety)
        form.querySelectorAll("input, textarea, select").forEach(field => {
            if (!field.hasAttribute("name")) {
                // don't break; just add a name for error messages if needed
                field.setAttribute("name", field.id || "field");
            }
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("[forms.js] submit triggered for", form);

            // remove previous error messages
            form.querySelectorAll(".error-msg").forEach(n => n.remove());

            const requiredFields = Array.from(form.querySelectorAll("[required]"));
            let valid = true;

            requiredFields.forEach(input => {
                // trim value for text-like inputs
                const value = (input.value || "").toString().trim();
                if (!value) {
                    valid = false;
                    showFieldError(input, `Please fill in the ${input.name || "required"} field.`);
                } else {
                    // remove any inline error if present
                    const next = input.nextElementSibling;
                    if (next && next.classList && next.classList.contains("error-msg")) next.remove();
                }
            });

            // Basic email format check if there's an email field
            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailVal = emailField.value.trim();
                const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRe.test(emailVal)) {
                    valid = false;
                    showFieldError(emailField, "Please enter a valid email address.");
                }
            }

            if (!valid) {
                // focus first invalid field
                const firstInvalid = form.querySelector(".error-msg");
                if (firstInvalid) {
                    const el = firstInvalid.previousElementSibling;
                    if (el && typeof el.focus === "function") el.focus();
                }
                return;
            }

            // Valid -> show popup
            showResponsePopup(form);
            form.reset();
        });
    });

    // helper: show small inline error under an input
    function showFieldError(input, message) {
        // avoid duplicate error nodes
        const next = input.nextElementSibling;
        if (next && next.classList && next.classList.contains("error-msg")) {
            next.textContent = message;
            return;
        }
        const err = document.createElement("div");
        err.className = "error-msg";
        err.textContent = message;
        input.insertAdjacentElement("afterend", err);
    }

    // popup builder
    function showResponsePopup(form) {
        // remove any existing overlay first
        document.querySelectorAll(".response-overlay").forEach(n => n.remove());

        const now = new Date();
        // South Africa locale; you can change locale code if needed
        const formattedDate = now.toLocaleString("en-ZA", {
            dateStyle: "full",
            timeStyle: "short"
        });

        const overlay = document.createElement("div");
        overlay.className = "response-overlay";
        overlay.innerHTML = `
      <div class="response-box" role="dialog" aria-modal="true" aria-label="Form submission response">
        <button class="response-close" aria-label="Close response">&times;</button>
        <div class="response-content">
          <h2>✅ Thank you!</h2>
          <p>Your message has been received. We'll reply within 24 hours.</p>
          <p class="timestamp">Received on: <strong>${formattedDate}</strong></p>
        </div>
        <div class="response-actions">
          <button class="response-ok">Close</button>
        </div>
      </div>
    `;

        // append overlay
        document.body.appendChild(overlay);
        // prevent background scroll
        document.body.style.overflow = "hidden";

        // focus management
        const btnClose = overlay.querySelector(".response-close");
        const btnOk = overlay.querySelector(".response-ok");
        btnOk.focus();

        function closeOverlay() {
            overlay.remove();
            document.body.style.overflow = "";
        }

        btnClose.addEventListener("click", closeOverlay);
        btnOk.addEventListener("click", closeOverlay);

        overlay.addEventListener("click", (ev) => {
            if (ev.target === overlay) closeOverlay();
        });

        // keyboard escape
        document.addEventListener("keydown", function onKey(e) {
            if (e.key === "Escape") {
                closeOverlay();
                document.removeEventListener("keydown", onKey);
            }
        });
    }

});
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".site-nav");

    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            nav.classList.toggle("show");
            hamburger.classList.toggle("active");
        });
    }

    // Flip cards on About Us
    const cards = document.querySelectorAll(".team-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
        });
    });
});
// JS for EcoFresh enquiry + contact forms + popup feedback

document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");
    const popup = document.getElementById("popupMessage");
    const closePopup = document.getElementById("closePopup");

    forms.forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();

            // Simple validation
            const valid = [...form.elements].every(el => {
                if (el.required && !el.value.trim()) {
                    el.style.borderColor = "red";
                    return false;
                }
                el.style.borderColor = "#ccc";
                return true;
            });

            if (!valid) return;

            // Simulate form submission
            popup.classList.remove("hidden");
            setTimeout(() => {
                popup.classList.add("fade-in");
            }, 50);

            // Clear the form
            form.reset();
        });
    });

    closePopup.addEventListener("click", () => {
        popup.classList.remove("fade-in");
        setTimeout(() => popup.classList.add("hidden"), 400);
    });
});
