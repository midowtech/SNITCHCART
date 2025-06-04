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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const adminPanel = document.getElementById('admin-panel');
const adminToggleBtn = document.getElementById('admin-toggle-btn');
const addProductBtn = document.getElementById('add-product-btn');

adminToggleBtn.addEventListener('click', () => {
  adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
});

async function loadProducts(filter = "") {
  productGrid.innerHTML = "<p>Loading products...</p>";
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  let products = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (filter.trim() !== "") {
    products = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  }

  if (products.length === 0) {
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
}

searchInput.addEventListener('input', (e) => {
  loadProducts(e.target.value);
});

addProductBtn.addEventListener('click', async () => {
  const nameInput = document.getElementById('admin-product-name');
  const priceInput = document.getElementById('admin-product-price');
  const imageInput = document.getElementById('admin-product-image');

  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const image = imageInput.value.trim();

  if (!name || isNaN(price) || !image) {
    alert("Please fill all product fields correctly.");
    return;
  }

  try {
    await addDoc(collection(db, 'products'), { name, price, image });
    alert("Product added successfully!");
    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    loadProducts();
  } catch (error) {
    console.error("Error adding product: ", error);
    alert("Failed to add product. Try again.");
  }
});

// Dummy add to cart function
window.addToCart = function(productId) {
  alert("Product added to cart! (ID: " + productId + ")");
};

window.onload = () => {
  loadProducts();
};
