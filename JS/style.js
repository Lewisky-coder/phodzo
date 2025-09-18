document.addEventListener("DOMContentLoaded", () => {
    /* ==============================================
       Homepage Cards Tilt & Floating
    =============================================== */


    /* ==============================================
       Button Click Animation
    =============================================== */
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.add('clicked');
            setTimeout(() => btn.classList.remove('clicked'), 300);

            // If "Shop Now" button, redirect to products
            if (btn.textContent.toLowerCase().includes("shop")) {
                window.location.href = './Pages/product.html';
            }
        });
    });

    /* ==============================================
       Contact Form Submit & Thank You Overlay
    =============================================== */
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // prevent real submit

            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0,0,0,0.9)';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '2000';
            overlay.style.flexDirection = 'column';
            overlay.style.color = '#00ffe7';
            overlay.innerHTML = `
                <h1>Thank You for Your Support!</h1>
                <p>We received your message and will get back to you shortly.</p>
                <button id="closeOverlay">Close</button>
            `;
            document.body.appendChild(overlay);

            // Close overlay
            const closeBtn = document.getElementById('closeOverlay');
            closeBtn.addEventListener('click', () => {
                overlay.remove();
                contactForm.reset();
            });
        });
    }

    /* ==============================================
       Smooth Elements Animation on Page Load
    =============================================== */
    const fadeElements = document.querySelectorAll('main, .hero, footer, header');
    fadeElements.forEach((el, index) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(30px)";
        setTimeout(() => {
            el.style.transition = "all 0.8s ease";
            el.style.opacity = 1;
            el.style.transform = "translateY(0)";
        }, 100 * index);
    });
});
/* ==============================
   CONTACT FORM HANDLING
================================ */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // prevent page reload

            // Create thank you overlay
            const thankYou = document.createElement("div");
            thankYou.className = "thank-you-overlay";
            thankYou.innerHTML = `
        <div class="thank-you-box">
          <h2>✅ Thank You!</h2>
          <p>Your support means a lot to us at EcoFresh Bottles.</p>
          <button id="closeThankYou">Close</button>
        </div>
      `;
            document.body.appendChild(thankYou);

            // Close button
            document.getElementById("closeThankYou").addEventListener("click", () => {
                thankYou.remove();
                form.reset(); // clear form fields
            });
        });
    }
});

/* ==============================
   SCROLL ANIMATIONS
================================ */
const revealElements = document.querySelectorAll(
    "h1, h2, h3, p, li, img, .contact-card, .sitemap-list li"
);

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealPoint) {
            el.classList.add("reveal");
        }
    });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("✅ Thank you for your support! We will get back to you soon.");
        form.reset();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Handle contact form thank you
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("✅ Thank you for your support! We will get back to you soon.");
            form.reset();
        });
    }
});
