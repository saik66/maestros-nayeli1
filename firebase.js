// =====================================================
// FERRETERÍA NAYELI — CONEXIÓN A FIREBASE
// =====================================================

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


// =====================================================
// CONFIGURACIÓN DE TU PROYECTO
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyAstXdD3lKKzm0DOsZbojZN1E83y4Q0INU",
    authDomain: "ferreteria-nayeli.firebaseapp.com",
    projectId: "ferreteria-nayeli",
    storageBucket: "ferreteria-nayeli.firebasestorage.app",
    messagingSenderId: "395071484764",
    appId: "1:395071484764:web:4398e4539b1572be888799"
};


// =====================================================
// INICIALIZAR
// =====================================================

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Segunda instancia: se usa SOLO para crear cuentas de maestros
// desde el panel admin, sin cerrar la sesión del administrador.
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);

export {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    runTransaction,
    serverTimestamp
};


// =====================================================
// AYUDANTE: convertir el "código" de maestro en un correo
// falso, porque Firebase Auth necesita siempre un correo.
// =====================================================

export function codigoAEmail(codigo) {
    return `${String(codigo).trim().toLowerCase()}@maestros.nayeli.local`;
}
