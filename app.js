// Sample product data, add more or fetch from Firebase later
const products = [
  {
    id: "p1",
    name: "Snitch Sneakers",
    price: 2999,
    image: "product1.jpg",
  },
  {
    id: "p2",
    name: "Snitch Hoodie",
    price: 1999,
    image: "product2.jpg",
  },
  {
    id: "p3",
    name: "Snitch Watch",
    price: 4999,
    image: "product3.jpg",
  },
  {
    id: "p4",
    name: "Snitch Backpack",
    price: 1499,
    image: "product4.jpg",
  },
];

function loadProducts() {
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">₹${product.price}</p>
      <button onclick="alert('Added ${product.name} to cart!')" class="btn-primary">Add to Cart</button>
    `;

    productList.appendChild(card);
  });
}

// Call the function after DOM loads
document.addEventListener("DOMContentLoaded", loadProducts);
