// =====================================================
// FERRETERÍA NAYELI — LOGIN DE MAESTROS (FIREBASE)
// =====================================================

import {
    auth,
    db,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    doc,
    getDoc,
    codigoAEmail
} from "./firebase.js";


const formulario = document.getElementById("loginMaestroForm");
const codigoInput = document.getElementById("codigo");
const pinInput = document.getElementById("pin");
const mensaje = document.getElementById("mensajeLogin");
const botonIngresar = document.getElementById("btnIngresar");


// =====================================================
// SI YA HAY SESIÓN ACTIVA, ENTRAR DIRECTO (sin pedir ID/PIN)
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) return; // no hay sesión, se queda en el login normal

    try {
        const snapshot = await getDoc(doc(db, "maestros", user.uid));

        if (snapshot.exists() && snapshot.data().estado !== "bloqueado") {
            window.location.href = "maestro.html";
        }
        // si está bloqueado o no existe, se queda en el login
        // para que pueda ver el mensaje correspondiente si lo intenta

    } catch (error) {
        console.error("Error revisando sesión activa:", error);
    }
});


function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.style.color = "#c62828";
}


formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = codigoInput.value.trim().toUpperCase();
    const pin = pinInput.value.trim();

    if (!codigo) return mostrarError("Ingresa tu ID de maestro.");
    if (!pin) return mostrarError("Ingresa tu PIN.");

    botonIngresar.disabled = true;
    botonIngresar.textContent = "INGRESANDO...";
    mensaje.textContent = "Verificando tus datos...";
    mensaje.style.color = "#555";

    try {

        const email = codigoAEmail(codigo);

        // 1. Iniciar sesión en Firebase Auth (el PIN es la "contraseña")
        const credencial = await signInWithEmailAndPassword(auth, email, pin);
        const uid = credencial.user.uid;

        // 2. Buscar los datos del maestro en Firestore
        const referencia = doc(db, "maestros", uid);
        const snapshot = await getDoc(referencia);

        if (!snapshot.exists()) {
            mostrarError("No se encontró tu cuenta.");
            return;
        }

        const maestro = { id: uid, ...snapshot.data() };

        if (maestro.estado && maestro.estado !== "activo") {
            mostrarError("🚫 Tu cuenta está bloqueada.");
            return;
        }

        // 3. Guardar sesión local para el panel del maestro
        localStorage.setItem("maestroSesion", JSON.stringify({
            id: maestro.id,
            codigo: maestro.codigo,
            nombre: maestro.nombre,
            telefono: maestro.telefono,
            puntos: Number(maestro.puntos || 0),
            estado: maestro.estado
        }));

        mensaje.textContent = `✅ Bienvenido, ${maestro.nombre}`;
        mensaje.style.color = "#2e7d32";

        setTimeout(() => {
            window.location.href = "maestro.html";
        }, 500);

    } catch (error) {

        console.error("❌ ERROR LOGIN:", error);

        // Firebase Auth manda códigos de error específicos
        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            mostrarError("❌ ID de maestro o PIN incorrecto.");
        } else if (error.code === "auth/too-many-requests") {
            mostrarError("Demasiados intentos. Espera un momento e intenta de nuevo.");
        } else {
            mostrarError("Ocurrió un error al iniciar sesión.");
        }

    } finally {
        botonIngresar.disabled = false;
        botonIngresar.textContent = "INGRESAR";
    }
});


console.log("✅ Login de maestros (Firebase) cargado correctamente.");
