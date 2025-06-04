// products.js
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from './firebase-config.js';

const db = getFirestore(app);
const productList = document.getElementById('product-list');

async function loadProducts() {
  productList.innerHTML = '<p>Loading products...</p>';
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      productList.innerHTML = '<p>No products found.</p>';
      return;
    }
    productList.innerHTML = '';
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${data.img}" alt="${data.name}" />
        <div class="product-name">${data.name}</div>
        <div class="product-price">₹${data.price}</div>
        <div class="product-desc">${data.desc}</div>
      `;
      productList.appendChild(card);
    });
  } catch (error) {
    productList.innerHTML = `<p>Error loading products: ${error.message}</p>`;
  }
}

loadProducts();
