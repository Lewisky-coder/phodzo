// JS/product.js - simple search filter for static product cards
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("product-search");
    if (!searchBox) return;
    const products = Array.from(document.querySelectorAll(".product-card"));
    searchBox.addEventListener("input", (e) => {
        const q = (e.target.value || "").toLowerCase().trim();
        let visible = 0;
        products.forEach(card => {
            const text = (card.innerText || "").toLowerCase();
            const match = q === "" || text.includes(q);
            card.style.display = match ? "" : "none";
            if (match) visible++;
        });
        let noEl = document.getElementById("no-results");
        if (!noEl) {
            noEl = document.createElement("div");
            noEl.id = "no-results";
            noEl.style.textAlign = "center";
            noEl.style.marginTop = "1rem";
            noEl.style.color = "#666";
            document.getElementById("products-container").insertAdjacentElement('afterend', noEl);
        }
        noEl.textContent = visible === 0 ? "No products found — try another term." : "";
    });
});

