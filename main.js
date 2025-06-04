// main.js
import { db } from './firebaseConfig.js';
import { collection, getDocs, query, where } from "firebase/firestore";

const productsContainer = document.getElementById('productsContainer');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

async function fetchProducts(searchTerm = '') {
  productsContainer.innerHTML = '<p>Loading products...</p>';
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(lowerSearch));
    }

    if (products.length === 0) {
      productsContainer.innerHTML = '<p>No products found.</p>';
      return;
    }

    productsContainer.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.imageURL}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-price">₹${product.price}</div>
          <button class="btn-add" onclick="alert('Add to cart feature coming soon!')">Add to Cart</button>
        </div>
      `;
      productsContainer.appendChild(card);
    });
  } catch (error) {
    productsContainer.innerHTML = `<p>Error loading products: ${error.message}</p>`;
  }
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  fetchProducts(searchInput.value.trim());
});

fetchProducts(); // initial load
