// script.js
import { db, auth } from './firebase-config.js';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminToggleBtn = document.getElementById('admin-toggle-btn');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');

const loginModal = document.getElementById('login-modal');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const signupSubmitBtn = document.getElementById('signup-submit-btn');
const loginCloseBtn = document.getElementById('login-close-btn');

const adminPanel = document.getElementById('admin-panel');
const adminProductName = document.getElementById('admin-product-name');
const adminProductPrice = document.getElementById('admin-product-price');
const adminProductImage = document.getElementById('admin-product-image');
const addProductBtn = document.getElementById('add-product-btn');

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Show/hide modals
function openModal(modal) { modal.style.display = 'block'; }
function closeModal(modal) { modal.style.display = 'none'; }

// Load products from Firestore
async function loadProducts(searchTerm = '') {
  productGrid.innerHTML = 'Loading products...';

  try {
    const productsRef = collection(db, "products");
    const q = searchTerm
      ? query(productsRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'))
      : query(productsRef, orderBy('name'));

    const querySnapshot = await getDocs(q);
    productGrid.innerHTML = '';

    if (querySnapshot.empty) {
      productGrid.innerHTML = '<p>No products found.</p>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const productCard = document.createElement('div');
      productCard.classList.add('product');

      productCard.innerHTML = `
        <img src="${data.image}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p>₹${data.price}</p>
        <button data-id="${doc.id}" data-name="${data.name}" data-price="${data.price}">Add to Cart</button>
      `;

      const addToCartBtn = productCard.querySelector('button');
      addToCartBtn.addEventListener('click', () => addToCart({
        id: doc.id,
        name: data.name,
        price: data.price,
        image: data.image
      }));

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    productGrid.innerHTML = `<p>Error loading products: ${error.message}</p>`;
  }
}

// Add item to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart.`);
}

// Update cart count display
function updateCartCount() {
  let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  cartCount.textContent = totalQty;
}

// Show cart modal content
function showCart() {
  cartItemsContainer.innerHTML = '';
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.style.marginBottom = '15px';
    itemDiv.innerHTML = `
      <strong>${item.name}</strong> <br />
      Price: ₹${item.price} <br />
      Quantity: ${item.qty} <br />
      <button data-id="${item.id}">Remove</button>
    `;
    const removeBtn = itemDiv.querySelector('button');
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    cartItemsContainer.appendChild(itemDiv);
  });
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
  updateCartCount();
}

// Checkout action
function checkout() {
  alert('Checkout feature coming soon!');
  // Here you can add payment gateway or order confirmation logic
}

// Authentication - signup
signupSubmitBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Please enter email and password.');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Signup successful!');
    closeModal(loginModal);
  } catch (error) {
    alert('Signup error: ' + error.message);
  }
});

// Authentication - login
loginSubmitBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Please enter email and password.');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Login successful!');
    closeModal(loginModal);
  } catch (error) {
    alert('Login error: ' + error.message);
  }
});

// Authentication - logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

// Toggle login modal
loginBtn.addEventListener('click', () => openModal(loginModal));
loginCloseBtn.addEventListener('click', () => closeModal(loginModal));

// Cart modal toggle
cartBtn.addEventListener('click', () => {
  showCart();
  openModal(cartModal);
});
cartCloseBtn.addEventListener('click', () => closeModal(cartModal));
checkoutBtn.addEventListener('click', checkout);

// Admin panel toggle
adminToggleBtn.addEventListener('click', () => {
  if (adminPanel.style.display === 'none' || adminPanel.style.display === '') {
    adminPanel.style.display = 'block';
  } else {
    adminPanel.style.display = 'none';
  }
});

// Add product via admin panel
addProductBtn.addEventListener('click', async () => {
  const name = adminProductName.value.trim();
  const price = Number(adminProductPrice.value);
  const image = adminProductImage.value.trim();

  if (!name || !price || !image) {
    alert('Fill all product details.');
    return;
  }

  try {
    await addDoc(collection(db, 'products'), { name, price, image });
    alert('Product added!');
    adminProductName.value = '';
    adminProductPrice.value = '';
    adminProductImage.value = '';
    loadProducts();
  } catch (error) {
    alert('Error adding product: ' + error.message);
  }
});

// Search input event
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim();
  loadProducts(term);
});

// Auth state change - update UI and role check
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    
    // Show admin panel button only if user email is admin@example.com
    // Change this to your admin email
    if (user.email === 'admin@example.com') {
      adminToggleBtn.style.display = 'inline-block';
    } else {
      adminToggleBtn.style.display = 'none';
      adminPanel.style.display = 'none';
    }
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminToggleBtn.style.display = 'none';
    adminPanel.style.display = 'none';
  }
  loadProducts();
});

// Initial load
loadProducts();
