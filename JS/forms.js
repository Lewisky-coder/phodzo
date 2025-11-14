// JS/forms.js — robust, defensive, and verbose for debugging
document.addEventListener("DOMContentLoaded", () => {
    const log = (...args) => { try { console.log("[forms.js]", ...args); } catch (e) { } };

    // Helper to find element by multiple possible ids (defensive)
    function findByIds(ids = []) {
        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) return el;
        }
        return null;
    }

    // --- Selectors (support common spelling variants)
    const enquiryForm = findByIds(["enquiry-form", "enquery-form", "enquire-form", "enquiryform"]);
    const enquiryResponse = findByIds(["enquiry-response", "enquery-response", "enquire-response"]);

    const contactForm = findByIds(["contact-form", "contactform", "contactform"]);
    const contactResponse = findByIds(["contact-response", "contact-response", "contact-response"]);
    const dateDiv = findByIds(["current-datetime", "datetime", "date-display"]);

    log("DOM ready. Found elements:",
        {
            enquiryForm: Boolean(enquiryForm), enquiryResponse: Boolean(enquiryResponse),
            contactForm: Boolean(contactForm), contactResponse: Boolean(contactResponse), dateDiv: Boolean(dateDiv)
        });

    // --- Enquiry form handler
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            try {
                // remove previous message
                if (enquiryResponse) {
                    enquiryResponse.textContent = "✅ Thank you! Your enquiry has been received. We'll contact you soon.";
                    enquiryResponse.style.display = "block";
                } else {
                    alert("✅ Thank you! Your enquiry has been received. We'll contact you soon.");
                }
                enquiryForm.reset();
                log("Enquiry form submitted.");
            } catch (err) {
                console.error("[forms.js] Enquiry submission error:", err);
            }
        });
    } else {
        log("No enquiry form found on this page.");
    }

    // --- Contact form handler & live date/time
    if (dateDiv) {
        function updateDateTime() {
            try {
                const now = new Date();
                // Use en-ZA locale (your timezone) but allow fallback
                dateDiv.textContent = now.toLocaleString('en-ZA', { dateStyle: 'full', timeStyle: 'medium' });
            } catch (err) {
                dateDiv.textContent = new Date().toString();
            }
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);
        log("Date/time updater running.");
    } else {
        log("No date/time element found on this page.");
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            try {
                if (contactResponse) {
                    contactResponse.textContent = "✅ Message sent successfully! We'll get back to you soon.";
                    contactResponse.style.display = "block";
                } else {
                    alert("✅ Message sent successfully! We'll get back to you soon.");
                }
                contactForm.reset();
                log("Contact form submitted.");
            } catch (err) {
                console.error("[forms.js] Contact submission error:", err);
            }
        });
    } else {
        log("No contact form found on this page.");
    }
});
document.getElementById('enquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = ['fullname', 'email', 'phone', 'topic', 'message'];
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

    response.textContent = '✅ Your enquiry has been sent successfully!';
    response.className = 'response success';
    this.reset();
});
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
    // ENQUIRY FORM
    const enquiryForm = document.querySelector(".enquiry-form");
    const contactForm = document.querySelector(".contact-form");

    if (enquiryForm) setupForm(enquiryForm);
    if (contactForm) {
        setupForm(contactForm);
        const timeBox = document.getElementById("current-time");
        if (timeBox) {
            const updateTime = () => {
                const now = new Date();
                timeBox.textContent = now.toLocaleString();
            };
            updateTime();
            setInterval(updateTime, 1000);
        }
    }

    function setupForm(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const inputs = Array.from(form.querySelectorAll("input, textarea, select"));
            const allFilled = inputs.every(i => i.value.trim() !== "");

            if (!allFilled) return showResponse(form, "⚠️ Please fill in all required fields.", "error");

            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value))
                return showResponse(form, "⚠️ Please enter a valid email address.", "error");

            showResponse(form, "✅ Thank you! Your message was sent successfully.", "success");
            form.reset();
        });
    }

    function showResponse(form, message, type) {
        let box = form.nextElementSibling;
        if (!box || !box.classList.contains("response-box")) {
            box = document.createElement("div");
            box.className = "response-box";
            form.insertAdjacentElement("afterend", box);
        }
        box.textContent = message;
        box.className = `response-box ${type}`;
        setTimeout(() => {
            box.textContent = "";
            box.className = "response-box";
        }, 4000);
    }
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


