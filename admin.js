// admin.js
import { db, auth } from './firebaseConfig.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const adminEmails = ['snitchmart44@gmail.com'];

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const adminContent = document.getElementById('adminContent');
const productForm = document.getElementById
