// Firebase config & initialization (YOUR API keys)
const firebaseConfig = {
  apiKey: "AIzaSyD-QxJDh8QU2aI8c2kpfTZBNemyvmjq1LE",
  authDomain: "snitchmart-a8073.firebaseapp.com",
  projectId: "snitchmart-a8073",
  storageBucket: "snitchmart-a8073.appspot.com",
  messagingSenderId: "381112072944",
  appId: "1:381112072944:web:36f7e3269a847a942da035",
  measurementId: "G-Y4LS8V8SLL"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('searchInput');
const adminPanel = document.getElementById('admin-panel');

let productsCache = []; // Cache to hold fetched products for filtering

// Load products from Firestore
function loadProducts() {
  db.collection("products").get()
    .then(snapshot => {
      productsCache = [];
      productGrid.innerHTML = "";
      snapshot.forEach(doc => {
        const product = doc.data();
        product.id = doc.id;
        productsCache.push(product);
      });
      displayProducts(productsCache);
    })
    .catch(err => {
      console.error("Error loading products:", err);
      productGrid.innerHTML = "<p>Error loading products. Please try again later.</p>";
    });
}

// Display products in grid
function displayProducts(products) {
  productGrid.innerHTML = "";
  if (products.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }
  products.forEach(product => {
    productGrid.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `;
  });
}

// Filter products on search
function filterProducts() {
  const query = searchInput.value.toLowerCase();
  const filtered = productsCache.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
}

// Toggle admin panel
function toggleAdminPanel() {
  if (adminPanel.style.display === "none" || adminPanel.style.display === "") {
    adminPanel.style.display = "block";
  } else {
    adminPanel.style.display =
