// Admin password
const ADMIN_PASSWORD = "Mishty.12";

// Sample offers data
const offers = [
  { id: 1, title: "50% OFF on Puma Shoes", desc: "Limited time offer", img: "offer1.jpg" },
  { id: 2, title: "Buy 1 Get 1 Free", desc: "Nike exclusive deal", img: "offer2.jpg" },
  { id: 3, title: "Free Shipping Over ₹999", desc: "On all products", img: "offer3.jpg" },
];

// Sample products data
const products = [
  { id: 1, name: "Puma Running Shoes", price: "₹2999", img: "prod1.jpg" },
  { id: 2, name: "Nike Sportswear", price: "₹3999", img: "prod2.jpg" },
  { id: 3, name: "Adidas Hoodie", price: "₹1999", img: "prod3.jpg" },
  { id: 4, name: "Reebok T-Shirt", price: "₹899", img: "prod4.jpg" },
];

// Load offers
function loadOffers() {
  const container = document.getElementById("offers-slider");
  offers.forEach(offer => {
    const div = document.createElement("div");
    div.className = "offer-card";
    div.innerHTML = `
      <img src="${offer.img}" alt="${offer.title}" />
      <h3>${offer.title}</h3>
      <p>${offer.desc}</p>
    `;
    container.appendChild(div);
  });
}

// Load products
function loadProducts() {
  const container = document.getElementById("product-list");
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price}</div>
      <button class="btn-primary">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

// Admin login check - shows Admin Panel link only if correct password entered
function checkAdmin() {
  const adminLink = document.getElementById("admin-link");
  let loggedIn = sessionStorage.getItem('adminLoggedIn');

  if (loggedIn === "true") {
    adminLink.style.display = "inline-block";
  } else {
    const password = prompt("Enter admin password to login:");

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      adminLink.style.display = "inline-block";
      alert("Welcome Admin!");
    } else {
      adminLink.style.display = "none";
      alert("Incorrect password. Admin panel hidden.");
    }
  }
}

window.onload = () => {
  loadOffers();
  loadProducts();
  checkAdmin();
};
