// index.js
import { db } from './firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';

const productsDiv = document.getElementById('products');

function loadProducts() {
  const productsRef = collection(db, 'products');
  onSnapshot(productsRef, (snapshot) => {
    productsDiv.innerHTML = '';
    snapshot.forEach(docSnap => {
      const product = docSnap.data();
      const productElem = document.createElement('div');
      productElem.className = 'product';
      productElem.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}" />
        <p>Price: ₹${product.price}</p>
      `;
      productsDiv.appendChild(productElem);
    });
  });
}

loadProducts();
