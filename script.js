// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD-QxJDh8QU2aI8c2kpfTZBNemyvmjq1LE",
  authDomain: "snitchmart-a8073.firebaseapp.com",
  projectId: "snitchmart-a8073",
  storageBucket: "snitchmart-a8073.appspot.com",
  messagingSenderId: "381112072944",
  appId: "1:381112072944:web:36f7e3269a847a942da035",
  measurementId: "G-Y4LS8V8SLL"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const adminPanel = document.getElementById('admin-panel');
const adminToggleBtn = document.getElementById('admin-toggle-btn');
const addProductBtn = document.getElementById('add-product-btn');

// Toggle admin panel
adminToggleBtn.addEventListener('click', () => {
  adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
});

// Load products
async function loadProducts(filter = "") {
  productGrid.innerHTML = "<p>Loading...</p>";
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if(filter.trim() !== ""){
      products = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    }

    if(products.length === 0){
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    productGrid.innerHTML = "";
    products.forEach(product => {
      productGrid.innerHTML += `
        <div class="product">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>₹${product.price.toFixed(2)}</p>
          <button onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
      `;
    });
  } catch (err) {
    productGrid.innerHTML = "<p>Error loading products.</p>";
    console.error(err);
  }
}

// Search input
searchInput.addEventListener('input', (e) => {
  loadProducts(e.target.value);
});

// Add product (admin)
addProductBtn.addEventListener('click', async () => {
  const name = document.getElementById('admin-product-name').value.trim();
  const price = parseFloat(document.getElementById('admin-product-price').value);
  const image = document.getElementById('admin-product-image').value.trim();

  if(!name || isNaN(price) || !image){
    alert("Fill all fields correctly!");
    return;
  }

  try {
    await addDoc(collection(db, 'products'), { name, price, image });
    alert("Product added!");
    loadProducts();
  } catch (err) {
    alert("Error adding product.");
    console.error(err);
  }
});

// Dummy cart
window.addToCart = function(id){
  alert("Product added to cart: " + id);
};

// Init
window.onload = () => {
  loadProducts();
};
