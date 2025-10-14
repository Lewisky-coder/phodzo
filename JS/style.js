/* js/main.js
   EchoFresh - site JS
   - hamburger nav (site-wide)
   - FAQ accordion (index only)
   - dynamic products and search
   - gallery lightbox
   - contact/enquiry form validation and modals
   - reveal animations
*/

document.addEventListener("DOMContentLoaded", () => {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /* ---------- 1. Hamburger nav (site-wide) ---------- */
    (function navToggle() {
        const hamburger = $(".hamburger");
        const nav = document.querySelector(".site-nav");
        if (!hamburger || !nav) return;
        hamburger.addEventListener("click", () => {
            nav.classList.toggle("show");
            hamburger.classList.toggle("open");
            const expanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", String(!expanded));
        });
        // Close on nav link click (mobile)
        $$("a", nav).forEach(a => a.addEventListener("click", () => {
            if (nav.classList.contains("show")) { nav.classList.remove("show"); hamburger.classList.remove("open"); hamburger.setAttribute("aria-expanded", "false"); }
        }));
    })();

    /* ---------- 2. FAQ accordion (single open) ---------- */
    (function faqAccordion() {
        const faqWrap = $(".faq");
        if (!faqWrap) return;
        const items = $$(".faq-item", faqWrap);
        items.forEach(it => {
            it.addEventListener("click", () => {
                items.forEach(i => { if (i !== it) i.classList.remove("active"); });
                it.classList.toggle("active");
            });
        });
    })();

    /* ---------- 3. Dynamic products + search ---------- */
    (function productsInit() {
        const container = $("#products-container");
        const search = $("#product-search");
        // product data array (modify/add images in images/bottles/)
        const products = [

            { id: 'kids', name: 'Kids 350 ml', price: 149, img: '../Assets/Kids.jpeg', tags: 'kids colorful leakproof' },
            { id: 'travel', name: 'Travel 1 L', price: 349, img: '../Assets/travel1.jpeg', tags: 'travel wide-mouth durable' },
            { id: 'everyday', name: 'Everyday 500 ml', price: 189, img: '../Assets/600ml.jpeg', tags: 'everyday lightweight' },
            { id: 'custom', name: 'Custom Branded', price: 250, img: '../Assets/300ml.jpeg', tags: 'custom branded bulk' },
            { id: 'kids', name: 'all kind', price: 449, img: '../Assets/sport.jpeg', tags: 'kids colorful leakproof' },
            { id: 'kids', name: '650 ml', price: 450, img: '../Assets/1000.jpg', tags: 'kids colorful leakproof' },
            { id: 'stainless', name: 'stainless', price: 450, img: '../Assets/stainless.jpg', tags: 'stainless colorful leakproof' },
            { id: 'Custom', name: 'Anime', price: 329, img: '../Assets/animated.jpg', tags: 'Anime wide-mouth durable' },
            { id: 'everyday', name: 'Vacations', price: 339, img: '../Assets/everyday.jpg', tags: 'everyday lightweight' },
            { id: 'Bulk', name: 'Bulk', price: 550, img: '../Assets/bulk.jpg', tags: 'custom branded bulk' },
            { id: 'Companies', name: 'Company', price: 459, img: '../Assets/Company.png', tags: 'business colorful leakproof' },
            { id: 'plastic', name: 'recyclable', price: 650, img: '../Assets/recycle.jpg', tags: ' colorless leakproof' },
        ];

        if (!container) return;

        function render(list) {
            container.innerHTML = '';
            list.forEach(p => {
                const article = document.createElement('article');
                article.className = 'card product-item';
                article.dataset.name = p.name;
                article.dataset.tags = p.tags;
                article.innerHTML = `
          <img src="${p.img}" alt="EcoFresh ${p.name}" loading="lazy">
          <h3>${p.name}</h3>
          <p class="muted">R${p.price > 0 ? p.price : 'Price on request'}</p>
          <div style="margin-top:.6rem"><a class="btn btn-secondary" href="./enquery.html">enquire / Buy</a></div>
        `;
                container.appendChild(article);
            });
        }

        render(products);

        if (!search) return;
        search.addEventListener('input', (e) => {
            const q = (e.target.value || '').toLowerCase().trim();
            const filtered = products.filter(p => (p.name + ' ' + p.tags).toLowerCase().includes(q));
            render(filtered);
        });
    })();

    /* ---------- 4. Gallery lightbox ---------- */
    (function galleryLightbox() {
        const imgs = $$("main .gallery-grid img, .gallery-grid img");
        if (!imgs.length) return;
        const lb = document.createElement('div');
        lb.className = 'ef-lightbox';
        lb.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);z-index:9999;visibility:hidden;opacity:0;transition:opacity .2s';
        lb.innerHTML = `<button class="ef-close" aria-label="Close" style="position:absolute;right:1rem;top:1rem;background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">×</button>
      <button class="ef-prev" aria-label="Prev" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">‹</button>
      <img class="ef-img" src="" alt="" style="max-width:92%;max-height:82%;border-radius:.5rem">
      <button class="ef-next" aria-label="Next" style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#fff;font-size:2rem;cursor:pointer">›</button>`;
        document.body.appendChild(lb);
        const imgEls = imgs;
        const srcs = imgEls.map(i => ({ src: i.src, alt: i.alt || '' }));
        let idx = 0;
        function show(i) { const img = lb.querySelector('.ef-img'); img.src = srcs[i].src; img.alt = srcs[i].alt; lb.style.visibility = 'visible'; lb.style.opacity = 1; idx = i; }
        function hide() { lb.style.opacity = 0; setTimeout(() => lb.style.visibility = 'hidden', 220); }
        imgEls.forEach((el, i) => el.addEventListener('click', e => { e.preventDefault(); show(i); }));
        lb.querySelector('.ef-close').addEventListener('click', hide);
        lb.querySelector('.ef-next').addEventListener('click', () => show((idx + 1) % srcs.length));
        lb.querySelector('.ef-prev').addEventListener('click', () => show((idx - 1 + srcs.length) % srcs.length));
        lb.addEventListener('click', (ev) => { if (ev.target === lb) hide(); });
        document.addEventListener('keydown', (ev) => {
            if (lb.style.visibility === 'visible') {
                if (ev.key === 'Escape') hide();
                if (ev.key === 'ArrowRight') lb.querySelector('.ef-next').click();
                if (ev.key === 'ArrowLeft') lb.querySelector('.ef-prev').click();
            }
        });
    })();

    /* ---------- 5. Contact form validation & submission (mailto fallback) ---------- */
    (function contactForm() {
        const form = $("#contact-form");
        if (!form) return;

        function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
        function isPhone(v) { return /^\+?\d[\d\s-]{6,}$/.test(v); }

        function showModal(title, msg) {
            const overlay = document.createElement('div');
            overlay.className = 'ef-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);z-index:9999';
            overlay.innerHTML = `<div style="background:#fff;padding:1.4rem;border-radius:.6rem;max-width:28rem;text-align:center">
        <h2 style="margin:0 0 .6rem">${title}</h2>
        <p style="margin:0 0 1rem">${msg}</p>
        <button id="ef-close" style="padding:.5rem 1rem;border-radius:.4rem;border:0;background:var(--primary);color:#fff;cursor:pointer">Close</button>
      </div>`;
            document.body.appendChild(overlay);
            $("#ef-close", overlay).addEventListener('click', () => overlay.remove());
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = Object.fromEntries(new FormData(form).entries());
            let ok = true;
            // clear previous errors
            form.querySelectorAll('.ef-error').forEach(n => n.remove());

            if (!fd.name || fd.name.trim().length < 2) { const el = $('#name'); const err = document.createElement('div'); err.className = 'ef-error'; err.style.color = 'crimson'; err.textContent = 'Please enter your name'; el.insertAdjacentElement('afterend', err); ok = false; }
            if (!fd.email || !isEmail(fd.email)) { const el = $('#email'); const err = document.createElement('div'); err.className = 'ef-error'; err.style.color = 'crimson'; err.textContent = 'Please enter a valid email'; el.insertAdjacentElement('afterend', err); ok = false; }
            if (!fd.message || fd.message.trim().length < 6) { const el = $('#message'); const err = document.createElement('div'); err.className = 'ef-error'; err.style.color = 'crimson'; err.textContent = 'Please enter a message'; el.insertAdjacentElement('afterend', err); ok = false; }
            if (fd.phone && !isPhone(fd.phone)) { const el = $('#phone'); const err = document.createElement('div'); err.className = 'ef-error'; err.style.color = 'crimson'; err.textContent = 'Please enter a valid phone number'; el.insertAdjacentElement('afterend', err); ok = false; }

            if (!ok) return;

            // mailto fallback
            const recipient = 'info@ecofresh.co.za';
            const subject = encodeURIComponent('Contact form: ' + (fd.subject || 'General enquiry'));
            const body = encodeURIComponent(`Name: ${fd.name}\nSurname: ${fd.surname || ''}\nPhone: ${fd.phone || ''}\nEmail: ${fd.email}\n\nMessage:\n${fd.message}`);
            const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

            // simulate AJAX sending
            setTimeout(() => {
                showModal('Thank you!', 'We received your message and will be in touch. You can also send via your email client.');
                // optionally provide mailto link in modal
                const link = document.createElement('a');
                link.href = mailto; link.textContent = 'Send via email client';
                link.style.display = 'inline-block'; link.style.marginTop = '.6rem'; link.style.color = 'var(--primary)';
                document.querySelector('.ef-overlay div').appendChild(link);
                form.reset();
            }, 450);
        });
    })();

    /* ---------- 6. Enquiry form logic ---------- */
    (function enquiryLogic() {
        const ef = $('#enquiry-form');
        if (!ef) return;
        ef.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = Object.fromEntries(new FormData(ef).entries());
            if (!fd.name || fd.name.trim().length < 2) { alert('Please enter your name'); return; }
            if (!fd.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) { alert('Please enter a valid email'); return; }
            const qty = parseInt(fd.quantity) || 1;
            const base = fd.product === 'sport' ? 299 : fd.product === 'kids' ? 149 : fd.product === 'travel' ? 349 : 199;
            const discount = qty >= 50 ? 0.18 : qty >= 20 ? 0.10 : qty >= 10 ? 0.05 : 0;
            const subtotal = base * qty;
            const total = Math.round(subtotal * (1 - discount));
            const available = qty <= 100 ? 'Available from stock' : 'Large order — 7–14 days lead time';
            // modal
            const modal = document.createElement('div');
            modal.className = 'ef-overlay';
            modal.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);z-index:9999';
            modal.innerHTML = `<div style="background:#fff;padding:1.4rem;border-radius:.6rem;max-width:34rem">
        <h2>Enquiry Summary</h2>
        <p><strong>Product:</strong> ${fd.product}</p>
        <p><strong>Quantity:</strong> ${qty}</p>
        <p><strong>Estimate:</strong> R${total}</p>
        <p><strong>Availability:</strong> ${available}</p>
        <div style="margin-top:.8rem;text-align:right">
          <button id="ef-close-enquiry" style="padding:.5rem .9rem;border-radius:.4rem;border:0;background:var(--primary);color:#fff;cursor:pointer">Close</button>
          <button id="ef-email-enquiry" style="padding:.5rem .9rem;border-radius:.4rem;border:0;background:var(--accent);color:#fff;margin-left:.6rem;cursor:pointer">Email Quote</button>
        </div></div>`;
            document.body.appendChild(modal);
            $('#ef-close-enquiry', modal).addEventListener('click', () => modal.remove());
            $('#ef-email-enquiry', modal).addEventListener('click', () => {
                const body = encodeURIComponent(`Enquiry from ${fd.name}\nCompany: ${fd.company || ''}\nEmail: ${fd.email}\nProduct: ${fd.product}\nQuantity: ${qty}\nEstimate: R${total}\n\nMessage:\n${fd.message || ''}`);
                window.location.href = `mailto:info@ecofresh.co.za?subject=${encodeURIComponent('Enquiry: ' + fd.product)}&body=${body}`;
            });
        });
    })();

    /* ---------- 7. Simple reveal animation ---------- */
    (function reveal() {
        const els = document.querySelectorAll('main section, .card, .product-item, .feature');
        els.forEach((el, i) => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(10px)';
            setTimeout(() => {
                el.style.transition = 'all .6s ease';
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
            }, 120 + i * 40);
        });
    })();

});
