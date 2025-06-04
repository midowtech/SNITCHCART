// script.js

document.addEventListener("DOMContentLoaded", function () { const productCards = document.querySelectorAll(".product-card");

productCards.forEach((card) => { card.addEventListener("click", () => { const productId = card.getAttribute("data-id") || "1"; window.location.href = product.html?id=${productId}; }); }); });

