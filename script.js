// Firebase imports (make sure firebase is imported in index.html or setup with npm)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase config - tera Firebase project config yahan hai
const firebaseConfig = {
  apiKey: "AIzaSyD-QxJDh8QU2aI8c2kpfTZBNemyvmjq1LE",
  authDomain: "snitchmart-a8073.firebaseapp.com",
  projectId: "snitchmart-a8073",
  storageBucket: "snitchmart-a8073.firebasestorage.app",
  messagingSenderId: "381112072944",
  appId: "1:381112072944:web:36f7e3269a847a942da035",
  measurementId: "G-Y4LS8V8SLL"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const adminPanel = document.getElementById('admin-panel');
const adminToggleBtn = document.getElementById('admin-toggle-btn');
const addProductBtn = document.getElementById('add-product-btn');

// Show/hide admin panel
adminToggleBtn.addEventListener('click', () => {
  if(adminPanel.style.display === 'block'){
    adminPanel.style.display = 'none';
  } else {
    adminPanel.style.display = 'block';
  }
});

// Load products from Firestore and display
async function loadProducts() {
  productGrid.innerHTML = 'Loading products...';
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    displayProducts(products);
  } catch (error) {
    productGrid.innerHTML = 'Failed to load products. Try again later.';
    console.error("Error loading products:", error);
  }
}

// Display products filtered by search
function displayProducts(products) {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    productGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#777;">No products found.</p>';
    return;
  }

  productGrid.innerHTML = '';
  filtered.forEach(product => {
    const productElem = document.createElement('div');
    productElem.className = 'product';
    productElem.innerHTML = `
      <img src="${product.image || 'images/placeholder.png'}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price.toFixed(2)}</p>
      <button onclick="addToCart('${product.id}', '${product.name}')">Add to Cart</button>
    `;
    productGrid.appendChild(productElem);
  });
}

// Add product to cart (basic alert for demo)
window.addToCart = function(id, name) {
  alert(`Added "${name}" to cart! (Feature coming soon)`);
}

// Add new product (Admin panel)
addProductBtn.addEventListener('click', async () => {
  const name = document.getElementById('admin-product-name').value.trim();
  const price = parseFloat(document.getElementById('admin-product-price').value);
  const image = document.getElementById('admin-product-image').value.trim();

  if (!name || isNaN(price) || price <= 0) {
    alert('Please enter valid product name and price.');
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      image: image || ''
    });
    alert('Product added successfully!');
    // Clear inputs
    document.getElementById('admin-product-name').value = '';
    document.getElementById('admin-product-price').value = '';
    document.getElementById('admin-product-image').value = '';
    loadProducts();
  } catch (error) {
    alert('Failed to add product. Try again.');
    console.error("Add product error:", error);
  }
});

// Search products live
searchInput.addEventListener('input', () => {
  loadProducts();
});

// Initial load
loadProducts();
