// admin.js import { getFirestore, collection, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"; import { app } from './firebase-config.js';

const db = getFirestore(app);

const addBtn = document.getElementById("add-product"); const removeBtn = document.getElementById("remove-product");

addBtn.addEventListener("click", async () => { const name = document.getElementById("product-name").value; const price = document.getElementById("product-price").value; const img = document.getElementById("product-img").value; const desc = document.getElementById("product-desc").value;

try { const docRef = await addDoc(collection(db, "products"), { name, price, img, desc }); alert("✅ Product Added: " + docRef.id); } catch (e) { alert("❌ Error: " + e); } });

removeBtn.addEventListener("click", async () => { const id = document.getElementById("remove-id").value; try { await deleteDoc(doc(db, "products", id)); alert("🗑️ Product Deleted: " + id); } catch (e) { alert("❌ Error: " + e); } });

