import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  // 🔑 Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById("productList");

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  productList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      ${data.offer ? `<div class="offer-badge">${data.offer}</div>` : ""}
      <img src="${data.image}" alt="${data.name}" />
      <h3>${data.name}</h3>
      <p>₹${data.price}</p>
    `;

    productList.appendChild(productCard);
  });
}

loadProducts();
