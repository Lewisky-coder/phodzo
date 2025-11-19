/* JS/script.js - Combined site behaviour
   - hamburger (works on all pages)
   - FAQ accordion (index)
   - tabs
   - product & employee search
   - gallery lightbox
   - contact + enquiry validation & response
   - enquiry price calculation
*/

document.addEventListener("DOMContentLoaded", () => {
    /* ---------- helpers ---------- */
    const $ = (sel, root = document) => (root || document).querySelector(sel);
    const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

    /* ---------- HAMBURGER (universal) ---------- */
    (function hamburger() {
        const ham = $(".hamburger");
        const nav = document.querySelector(".site-nav");
        if (!ham || !nav) return;
        ham.addEventListener("click", () => {
            ham.classList.toggle("open");
            nav.classList.toggle("active"); // CSS shows/hides menu
            // set aria-expanded
            const expanded = ham.getAttribute("aria-expanded") === "true";
            ham.setAttribute("aria-expanded", String(!expanded));
        });
        // close on nav link click (mobile)
        $$("a", nav).forEach(a => a.addEventListener("click", () => {
            nav.classList.remove("active");
            ham.classList.remove("open");
            ham.setAttribute("aria-expanded", "false");
        }));
    })();

    /* ---------- REVEAL ANIM (simple) ---------- */
    (function reveal() {
        const els = $$("main section, .card, .product-card, .feature");
        els.forEach((el, i) => {
            el.style.opacity = 0;
            el.style.transform = "translateY(8px)";
            setTimeout(() => {
                el.style.transition = "all .45s ease";
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }, 90 + i * 25);
        });
    })();

    /* ---------- FAQ ACCORDION (index only) ---------- */
    (function faq() {
        const faqs = $$(".faq-item .faq-q");
        if (!faqs.length) return;
        faqs.forEach(q => {
            q.addEventListener("click", () => {
                const item = q.closest(".faq-item");
                // close others
                $$(".faq-item").forEach(i => {
                    if (i !== item) {
                        i.classList.remove("active");
                        const p = i.querySelector(".faq-a");
                        if (p) p.style.maxHeight = null;
                    }
                });
                item.classList.toggle("active");
                const panel = item.querySelector(".faq-a");
                if (panel.style.maxHeight) panel.style.maxHeight = null;
                else panel.style.maxHeight = panel.scrollHeight + "px";
            });
        });
    })();

    /* ---------- TABS (generic) ---------- */
    (function tabs() {
        const buttons = $$("[data-tab]");
        if (!buttons.length) return;
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.tab;
                buttons.forEach(b => b.classList.remove("active"));
                $$(".tab-panel").forEach(p => p.classList.remove("active"));
                btn.classList.add("active");
                const panel = document.getElementById(target);
                if (panel) panel.classList.add("active");
            });
        });
    })();

    /* ---------- GALLERY LIGHTBOX (images & videos) ---------- */
    (function lightbox() {
        const media = $$(".gallery-grid img, .gallery-grid video");
        if (!media.length) return;

        const lb = document.createElement("div");
        lb.className = "ef-lightbox";
        lb.innerHTML = `
      <div class="ef-inner">
        <button class="ef-close" aria-label="Close">✕</button>
        <div class="ef-media-wrap"></div>
        <div class="ef-caption"></div>
      </div>
    `;
        document.body.appendChild(lb);
        const wrap = $(".ef-media-wrap", lb);
        const caption = $(".ef-caption", lb);
        function showMedia(node) {
            wrap.innerHTML = "";
            caption.textContent = node.alt || node.dataset.caption || "";
            if (node.tagName.toLowerCase() === "img") {
                const img = document.createElement("img");
                img.src = node.src;
                img.alt = node.alt || "";
                img.loading = "eager";
                wrap.appendChild(img);
            } else if (node.tagName.toLowerCase() === "video") {
                const vid = document.createElement("video");
                vid.controls = true;
                vid.src = node.querySelector("source") ? node.querySelector("source").src : node.currentSrc;
                wrap.appendChild(vid);
                vid.play().catch(() => { /* autoplay might be blocked */ });
            }
            lb.classList.add("visible");
            document.body.style.overflow = "hidden";
        }
        media.forEach(m => m.addEventListener("click", () => showMedia(m)));
        $(".ef-close", lb).addEventListener("click", () => {
            lb.classList.remove("visible");
            document.body.style.overflow = "";
            wrap.innerHTML = "";
        });
        lb.addEventListener("click", e => { if (e.target === lb) { $(".ef-close", lb).click(); } });
    })();

    /* ---------- PRODUCTS (product page) - search + dynamic populate ---------- */
    (function products() {
        const container = $("#products-container");
        const search = $("#product-search") || $("#searchProducts");
        if (!container) return;

        // Product data — use the images you have in /Assets
        const products = [
            { id: 'kids350', title: 'Kids 350 ml', price: 149, img: '../Assets/Kids.jpeg', desc: 'Lightweight, bite-safe spout.' },
            { id: 'sport750', title: 'Stainless Pro 750 ml', price: 299, img: '../Assets/sport.jpeg', desc: 'Double-wall insulated.' },
            { id: 'travel1l', title: 'Travel 1 L', price: 349, img: '../Assets/travel1.jpeg', desc: 'Wide mouth, carry loop.' },
            { id: '100ml', title: 'Pocket 100 ml', price: 89, img: '../Assets/special.jpg', desc: 'Compact and light.' },
            { id: 'luxury', title: 'BottleZ Luxury', price: 599, img: '../Assets/all pair.jpeg', desc: 'Premium finish.' }
        ];

        function render(list) {
            container.innerHTML = '';
            list.forEach(p => {
                const article = document.createElement('article');
                article.className = 'product-card card';
                article.innerHTML = `
          <img src="${p.img}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p class="muted">${p.desc}</p>
          <p><strong>R${p.price}</strong></p>
          <a class="btn btn-outline" href="./contact.html">Enquire</a>
        `;
                container.appendChild(article);
            });
        }

        render(products);

        if (search) {
            search.addEventListener('input', (e) => {
                const q = e.target.value.trim().toLowerCase();
                const filtered = products.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q));
                render(filtered);
            });
        }
    })();

    /* ---------- ABOUT (employee search + flip cards) ---------- */
    (function employees() {
        const list = $("#employeeList");
        const search = $("#employeeSearch");
        if (!list) return;

        // Ten example employees (use your images in Assets, update filenames if needed)
        const employees = [
            { name: "Phodzo Kevin", role: "Founder & CEO", img: "../Assets/Phodzo.jpg", bio: "Founder - product design & operations. Awarded local entrepreneur of the year." },
            { name: "Molatelo M.", role: "Managing Director", img: "../Assets/Mbofho.jpeg", bio: "Head of quality and logistics." },
            { name: "Rofhiwa R.", role: "Head of Production", img: "../Assets/Employee 1.jpeg", bio: "Oversees manufacturing & QA." },
            { name: "Masekgwari S.", role: "Sales Lead", img: "../Assets/Employee 2.jpeg", bio: "Leads retail & wholesale partnerships." },
            { name: "Lerato P.", role: "Customer Service", img: "../Assets/Employee 5.jpeg", bio: "Customer relations & after-sales support." },
            { name: "Thabo N.", role: "Marketing", img: "../Assets/employee 6.jpeg", bio: "Digital marketing and campaigns." },
            { name: "Sarah M.", role: "Design", img: "../Assets/billie.jpeg", bio: "Product & packaging designer." },
            { name: "John D.", role: "Engineer", img: "../Assets/john.jpeg", bio: "R&D and material sourcing." },
            { name: "Anele K.", role: "Finance", img: "../Assets/manage.jpg", bio: "Manages budgets & forecasting." },
            { name: "Zinhle Z.", role: "Logistics", img: "../Assets/Messi", bio: "Coordinates deliveries & warehouse." }
        ];

        function buildCards(listEl) {
            listEl.innerHTML = '';
            employees.forEach(emp => {
                const card = document.createElement('div');
                card.className = 'team-card employee-card';
                card.innerHTML = `
          <div class="card-inner">
            <div class="card-front card">
              <img src="${emp.img}" alt="${emp.name}">
              <h3>${emp.name}</h3>
              <p>${emp.role}</p>
            </div>
            <div class="card-back card">
              <h3>${emp.name}</h3>
              <p><strong>Role:</strong> ${emp.role}</p>
              <p>${emp.bio}</p>
            </div>
          </div>
        `;
                // flip on click
                card.addEventListener('click', () => card.classList.toggle('flipped'));
                listEl.appendChild(card);
            });
        }

        buildCards(list);

        if (search) {
            search.addEventListener('input', (e) => {
                const q = e.target.value.trim().toLowerCase();
                $$("#employeeList .team-card").forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(q) ? '' : 'none';
                });
            });
        }
    })();

    /* ---------- ENQUIRY page: calculation & validation ---------- */
    (function enquiry() {
        const form = document.getElementById("enquiryForm");
        if (!form) return;
        const productSelect = $("#productSelect");
        const qty = $("#qty");
        const totalBox = $("#enquiryTotal");
        const priceMap = {
            'kids350': 149,
            'sport750': 299,
            'travel1l': 349,
            '100ml': 89,
            'luxury': 599
        };

        function calc() {
            const p = productSelect.value;
            const q = parseInt(qty.value) || 0;
            const price = priceMap[p] || 0;
            const total = price * q;
            totalBox.textContent = total > 0 ? `R${total.toFixed(2)}` : 'R0.00';
        }

        productSelect.addEventListener('change', calc);
        qty.addEventListener('input', calc);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // basic validation
            const name = $("#enqName");
            const product = productSelect;
            const quantity = qty;
            let ok = true;
            [name, product, quantity].forEach(f => {
                if (!f.value || f.value.trim() === "" || f.value === "none") {
                    f.style.border = "2px solid red";
                    ok = false;
                } else {
                    f.style.border = "2px solid #00c853";
                }
            });
            if (!ok) {
                showResponseOverlay('Please complete required fields', false);
                return;
            }

            // success: show overlay (and keep data)
            showResponseOverlay('Enquiry received — we will contact you within 24 hours.', true);
            form.reset();
            calc();
        });
    })();

    /* ---------- CONTACT FORM: validation + mailto + overlay ---------- */
    (function contact() {
        const form = document.getElementById("contactForm");
        if (!form) return;
        const overlayRoot = document.createElement('div');
        overlayRoot.id = 'ef-response-overlay';
        document.body.appendChild(overlayRoot);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = $("#fullname");
            const email = $("#email");
            const phone = $("#phone");
            const message = $("#message");

            let ok = true;
            [fullname, email, phone, message].forEach(f => {
                if (!f.value || f.value.trim() === "") {
                    f.style.border = "2px solid red";
                    ok = false;
                } else {
                    f.style.border = "2px solid #00c853";
                }
            });
            if (!ok) {
                showResponseOverlay('Please fill in all required fields', false);
                return;
            }

            // build mailto to your provided email
            const mailto = `mailto:phodzomainganye17@gmail.com` +
                `?subject=${encodeURIComponent('EcoFresh Contact from ' + fullname.value)}` +
                `&body=${encodeURIComponent('Name: ' + fullname.value + '\\nPhone: ' + phone.value + '\\nEmail: ' + email.value + '\\n\\nMessage:\\n' + message.value)}`;

            // show overlay and redirect to mailto
            showResponseOverlay('Thanks — message prepared. Your email client will open now.', true);
            setTimeout(() => {
                window.location.href = mailto;
                form.reset();
            }, 900);
        });

        // overlay helper (shared with enquiry)
        function showResponseOverlay(msg, success = true) {
            const overlay = document.createElement('div');
            overlay.className = 'response-overlay';
            overlay.innerHTML = `
        <div class="response-box">
          <button class="response-close" aria-label="close">✕</button>
          <h2>${success ? 'Thank you!' : 'Oops...'}</h2>
          <p>${msg}</p>
          <div class="timestamp">${new Date().toLocaleString()}</div>
          <div class="response-actions"><button class="response-ok">Close</button></div>
        </div>
      `;
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            overlay.querySelector('.response-close').addEventListener('click', () => closeOverlay());
            overlay.querySelector('.response-ok').addEventListener('click', () => closeOverlay());
            function closeOverlay() {
                overlay.remove();
                document.body.style.overflow = '';
            }
        }

        // expose globally for enquiry usage
        window.showResponseOverlay = showResponseOverlay;
    })();

}); // DOMContentLoaded


/* ----------------------------------
   UNIVERSAL FORM VALIDATION FUNCTION
-----------------------------------*/
function validateForm(formId, rules) {
    const form = document.getElementById(formId);

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;

        Object.keys(rules).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            const errorMsg = document.querySelector(`#${fieldId}-error`);

            if (input && errorMsg) {
                if (input.value.trim() === "") {
                    valid = false;
                    errorMsg.style.display = "block";
                    input.classList.add("input-error");
                } else {
                    errorMsg.style.display = "none";
                    input.classList.remove("input-error");
                }
            }
        });

        if (valid) {
            if (formId === "contactForm") {
                // OPEN EMAIL APP
                const emailBody = encodeURIComponent(
                    "Name: " + document.getElementById("fullname").value + "\n" +
                    "Phone: " + document.getElementById("phone").value + "\n" +
                    "Email: " + document.getElementById("email").value + "\n\n" +
                    document.getElementById("message").value
                );

                window.location.href =
                    `mailto:phodzomainganye17@gmail.com?subject=EcoFresh Contact Form&body=${emailBody}`;
            }

            form.reset();
        }
    });
}


/* ----------------------------------
   APPLY VALIDATION TO FORMS
-----------------------------------*/
validateForm("enquiryForm", {
    enquiryName: true,
    enquiryEmail: true,
    enquiryTopic: true,
    enquiryMessage: true
});

validateForm("contactForm", {
    fullname: true,
    phone: true,
    email: true,
    message: true
});


/* ----------------------------------
   LIVE DATE TIME (if exists)
-----------------------------------*/
const dateElement = document.getElementById("currentDateTime");
if (dateElement) {
    function updateDateTime() {
        const now = new Date();
        dateElement.textContent = now.toLocaleString();
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
}
/* ---------------------------
   GLOBAL FORM VALIDATION FUNCTION
----------------------------*/

// adds red borders + error messages
function validateField(input, message) {
    let error = input.nextElementSibling;

    if (!error || !error.classList.contains("error-msg")) {
        error = document.createElement("span");
        error.classList.add("error-msg");
        input.after(error);
    }

    if (input.value.trim() === "") {
        input.style.border = "2px solid red";
        error.style.color = "red";
        error.textContent = message;
        return false;
    } else {
        input.style.border = "2px solid green";
        error.textContent = "";
        return true;
    }
}

/* ---------------------------
   CONTACT FORM VALIDATION
----------------------------*/
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("cName");
        const email = document.getElementById("cEmail");
        const message = document.getElementById("cMessage");

        let valid = true;
        valid &= validateField(name, "Please enter your name");
        valid &= validateField(email, "Please enter your email");
        valid &= validateField(message, "Message cannot be empty");

        if (valid) {
            window.location.href =
                "mailto:phodzomainganye17@gmail.com?subject=Website Contact Message&body=" +
                encodeURIComponent(message.value);

            alert("Message sent successfully!");
            contactForm.reset();
        }
    });
}

/* ---------------------------
   ENQUIRE FORM VALIDATION
----------------------------*/
const enquireForm = document.getElementById("enquireForm");

if (enquireForm) {
    enquireForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("eName");
        const email = document.getElementById("eEmail");
        const product = document.getElementById("eProduct");
        const qty = document.getElementById("eQuantity");

        let valid = true;
        valid &= validateField(name, "Enter your full name");
        valid &= validateField(email, "Enter a valid email");
        valid &= validateField(product, "Choose a product");
        valid &= validateField(qty, "Enter quantity");

        if (valid) {
            alert("Your enquiry has been submitted — thank you!");
            enquireForm.reset();
        }
    });
}
