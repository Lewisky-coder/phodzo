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

    const contactForm = findByIds(["contact-form", "contactform"]);
    const contactResponse = findByIds(["contact-response"]);
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
