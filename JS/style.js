document.addEventListener("DOMContentLoaded", () => {
    // Hamburger toggle
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector(".site-nav");
    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            nav.classList.toggle("show");
            const expanded = hamburger.getAttribute("aria-expanded") === "true";
            hamburger.setAttribute("aria-expanded", String(!expanded));
        });
    }

    // FAQ accordion (single open)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        item.addEventListener("click", () => {
            faqItems.forEach(i => { if (i !== item) i.classList.remove("active"); });
            item.classList.toggle("active");
        });
    });

    // Contact form submit -> overlay thank you
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.background = "rgba(13,91,63,0.92)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = 9999;

            overlay.innerHTML = `
        <div style="background:#fff;padding:1.8rem;max-width:28rem;border-radius:.6rem;text-align:center">
          <h2 style="color:${getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#0d5b3f'}">Thank you!</h2>
          <p style="margin:.6rem 0 1rem;color:#333;font-size:1rem">We received your message and will be in touch shortly.</p>
          <button id="closeOverlay" style="background:${getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#f2b705'}; color:#111; padding:.6rem 1rem; border:0; border-radius:.4rem; cursor:pointer">Close</button>
        </div>
      `;

            document.body.appendChild(overlay);
            document.getElementById("closeOverlay").addEventListener("click", () => {
                overlay.remove();
                contactForm.reset();
            });
        });
    }

    // Simple reveal animation
    const els = document.querySelectorAll("main section, .card");
    els.forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(12px)";
        setTimeout(() => {
            el.style.transition = "all .6s ease";
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        }, 120 + i * 60);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("open");
        });
    }
});

