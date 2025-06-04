// Firebase config file import
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

// Fetch and display products
async function loadProducts() {
  const productContainer = document.getElementById("products");
  productContainer.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      productContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    productContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${data.image}" alt="${data.name}">
        <h3>${data.name}</h3>
        <p>₹${data.price}</p>
        <button>Buy Now</button>
      `;
      productContainer.appendChild(card);
    });
  } catch (error) {
    productContainer.innerHTML = "<p>Error loading products.</p>";
    console.error("Error fetching products: ", error);
  }
}

// Call the function when page loads
document.addEventListener("DOMContentLoaded", loadProducts);
