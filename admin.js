// admin.js
import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanel = document.getElementById('adminPanel');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const prodName = document.getElementById('prodName');
const prodPrice = document.getElementById('prodPrice');
const prodImg = document.getElementById('prodImg');

const productList = document.getElementById('product-list');

const adminEmails = ['youradminemail@example.com'];  // <-- Apna admin email yahan daal!

loginBtn.onclick = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    const user = userCredential.user;
    if (!adminEmails.includes(user.email)) {
      alert('Access denied: Not an admin.');
      await signOut(auth);
      return;
    }
    alert('Logged in as Admin');
    showAdminPanel();
    loadProducts();
  } catch (e) {
    alert('Login failed: ' + e.message);
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  hideAdminPanel();
  alert('Logged out');
};

function showAdminPanel() {
  adminPanel.style.display = 'block';
  loginBtn.style.display = 'none';
  emailInput.style.display = 'none';
  passwordInput.style.display = 'none';
}

function hideAdminPanel() {
  adminPanel.style.display = 'none';
  loginBtn.style.display = 'block';
  emailInput.style.display = 'block';
  passwordInput.style.display = 'block';
}

document.getElementById('addProductBtn').onclick = async () => {
  const name = prodName.value.trim();
  const price = parseFloat(prodPrice.value);
  const image = prodImg.value.trim();

  if (!name || !price || !image) {
    alert('Please fill all fields');
    return;
  }

  try {
    await addDoc(collection(db, 'products'), { name, price, image });
    alert('Product added!');
    prodName.value = '';
    prodPrice.value = '';
    prodImg.value = '';
    loadProducts();
  } catch (e) {
    alert('Error adding product: ' + e.message);
  }
};

function loadProducts() {
  productList.innerHTML = '';
  const productsRef = collection(db, 'products');
  
  onSnapshot(productsRef, (snapshot) => {
    productList.innerHTML = '';
    snapshot.forEach(docSnap => {
      const product = docSnap.data();
      const id = docSnap.id;
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>${product.name}</strong><br/>
        Price: ₹${product.price}<br/>
        <img src="${product.image}" alt="${product.name}"/><br/>
        <button data-id="${id}" class="deleteBtn">Delete</button>
      `;
      productList.appendChild(div);
    });
    addDeleteEvents();
  });
}

function addDeleteEvents() {
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.getAttribute('data-id');
      if (confirm('Are you sure to delete this product?')) {
        await deleteDoc(doc(db, 'products', id));
      }
    };
  });
}
