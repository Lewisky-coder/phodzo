EcoFresh Bottles — Website


 EcoFresh Bottles
site map

    │__ Pages  
    |    ├── about_us.html          # About page  
    |    ├── contact_us.html        # Contact page  
    │    ├── Gallery.html           #Gallery page
         ├── Product.html           #product page
         ├── Reference.html         #Refences page
    ├── css/
    │   └── styles.css           # Main stylesheet   
    │└──js
    └── assets/
    |     ├── images             # Images used in the site  
    |     |__ Icons
    |
    |__ index.html               #Home page (entry point)
Overview
A professional, responsive website for EcoFresh Bottles (reusable bottle product line).  
Pages: Home, About, Products, Gallery, FAQ, Contact, References, Sitemap.

 Installation
Place files as follows:
- `index.html`
- `css/style.css`
- `js/script.js`
- `Pages/` -> contains secondary pages
- `Assets/` -> add `Logo.jpeg`, `Hero.jpg`, `favicon.png`, product images

Changelog (Part 1 → Part 2)
- 2025-09-22: Reworked CSS to use rem/em/% units and added a CSS reset.
- 2025-09-22: Implemented responsive hamburger navigation.
- 2025-09-22: Added FAQ accordion and contact thank-you overlay.
- 2025-09-22: Expanded About, Products, Gallery, Contact with richer content.
- 2025-09-22: Added sitemap and references pages.



Testing Checklist

- [ ] Desktop screenshot (Assets/Desktop).  
- [ ] Tablet screenshot (Assets/Tablet).  
- [ ] Mobile screenshot (Assets.Mobile).  
- [ ] Hamburger menu functions and links navigate correctly.  
- [ ] Contact form displays the thank-you overlay.  
- [ ] Sitemap page accessible.  
- [ ] CSS uses rem/em/% (no px for base layout).  
- [ ] Images tested with "srcset" (optional enhancement).

 Notes
- Replace the Font Awesome kit or use CDN if needed.
- For production, provide a real favicon and image credits.

*Part 2 → Part 3 changelog*
*2025-10-14 — Part 3 (POE) update*
- Fixed Part 2 feedback:
  - Documented changes in this changelog.
  - Unified navigation layout and header across all pages — hamburger works site-wide.
  - Fixed broken image paths on Home and Gallery; updated image filenames/alt-text guidance.
  - Ensured gallery images resize equally using `object-fit: cover`.
  - Added pseudo-selectors for hover/focus states across buttons and nav links.
  - Added screenshot placeholders and paths (add screenshots to `/screenshots/`).
  - [ ] Desktop screenshot (Assets/Desktop).  
- [ ] Tablet screenshot (Assets/Tablet).  
- [ ] Mobile screenshot (Assets.Mobile).

- Implemented Part 3 features:
  - FAQ accordion on the index page (single-open).
  - Gallery lightbox with keyboard support.
  - Dynamic product listing and live search filter.
  - Enquiry page with JS-driven cost estimate and email-quote option.
  - Contact form client-side validation and simulated AJAX submission with mailto fallback.
  - Real Google Maps embed on Contact page (Johannesburg).
  - SEO improvements: title tags, meta descriptions, meta keywords, image alt text guidance.
  - Added `robots.txt` and `sitemap.xml`in miscellaneous.
  - Added `enquery.html` on the pages and i removed references

## SEO & accessibility notes
- Use descriptive image file names (e.g., `sport-750ml-stainless.jpg`) and add `alt` attributes.
- Use `loading="lazy"` for non-critical images.
- Ensure site is served over HTTPS for security.

## How to run locally
1. Place all files into a folder (preserve folder structure).
2. Open `index.html` in a browser (Chrome/Edge/Firefox).
3. Test on mobile/responsive view using developer tools.

 References
- MDN Web Docs — HTML/CSS/JS documentation.

- Leaflet / Google Maps documentation (if using interactive map).

- W3C accessibility guidelines.

MDN Web Docs. (2025) CSS: Cascading Style Sheets. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS
 (Accessed: 22 September 2025).

W3Schools. (2025) Responsive Web Design. Available at: https://www.w3schools.com/css/css_rwd_intro.asp
 (Accessed: 22 September 2025).

GeeksforGeeks. (2025) How to create a responsive navigation bar with hamburger menu. Available at: https://www.geeksforgeeks.org/how-to-create-a-responsive-navigation-bar-with-hamburger-menu/
 (Accessed: 22 September 2025).

Smashing Magazine. (2025) Designing Effective FAQ Sections in Websites. Available at: https://www.smashingmagazine.com/
 (Accessed: 22 September 2025).
