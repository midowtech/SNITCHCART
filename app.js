// app.js
import { db, auth } from './firebaseConfig.js';
import { collection, getDocs, query, where } from "firebase/firestore";

const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('searchInput');
const adminLink = document.getElementById('adminLink');

let productsData = [];

async function fetchProducts() {
  const productsCol = collection(db, "products");
  const productsSnapshot = await getDocs(productsCol);
  productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  displayProducts(productsData);
}

function displayProducts(products) {
  productsContainer.innerHTML = '';
  if(products.length === 0) {
    productsContainer.innerHTML = '<p>No products found</p>';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.imageURL}" alt="${product.name}" />
      <div class="product-title">${product.name}</div>
      <div class="product-price">₹${product.price}</div>
    `;

    productsContainer.appendChild(card);
  });
}

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = productsData.filter(p => p.name.toLowerCase().includes(searchTerm));
  displayProducts(filtered);
});

fetchProducts();

// Show admin link only if logged in as admin
auth.onAuthStateChanged(user => {
  if(user && user.email === 'snitchmart44@gmail.com'){
    adminLink.style.display = 'inline-block';
  } else {
    adminLink.style.display = 'none';
  }
});
