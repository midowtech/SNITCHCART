import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("search");

async function loadProducts(filter = "") {
  productsDiv.innerHTML = "<p>Loading products...</p>";

  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    let filteredProducts = products;
    if (filter) {
      filteredProducts = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    }

    if (filteredProducts.length === 0) {
      productsDiv.innerHTML = "<p>No products found.</p>";
      return;
    }

    productsDiv.innerHTML = "";
    filteredProducts.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="window.open('https://wa.me/918000000000?text=Hi%2C%20I%20want%20to%20buy%20${encodeURIComponent(p.name)}', '_blank')">Buy Now</button>
      `;
      productsDiv.appendChild(card);
    });
  } catch (error) {
    productsDiv.innerHTML = "<p>Error loading products.</p>";
    console.error(error);
  }
}

// Initial load
loadProducts();

// Search event
searchInput.addEventListener("input", (e) => {
  loadProducts(e.target.value);
});
