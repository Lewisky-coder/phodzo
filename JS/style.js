document.addEventListener("DOMContentLoaded", () => {
    /* ==============================================
       Homepage Cards Tilt & Floating
    =============================================== */
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        // Apply Vanilla Tilt
        VanillaTilt.init(card, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });

        // Floating effect
        const img = card.querySelector('img');
        if (img) {
            let pos = 0, direction = 1;
            setInterval(() => {
                if (pos > 10 || pos < -10) direction *= -1;
                pos += direction;
                img.style.transform = `translateY(${pos}px)`;
            }, 60);
        }
    });

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
