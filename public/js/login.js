import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);

const form = document.querySelector('#login-form');
const nameInput = document.querySelector('#nome');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#senha');
const message = document.querySelector('#auth-error');

function showError(text) {
  message.textContent = text;
  message.hidden = false;
}

function errorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Digite um e-mail válido.',
    'auth/popup-closed-by-user': 'A janela do Google foi fechada.',
  };

  return messages[error.code] || 'Não foi possível fazer o login.';
}

// Envia o token do Firebase para o servidor criar a sessão.
async function startServerSession(user) {
  const token = await user.getIdToken(true);
  const response = await fetch('/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });

  if (!response.ok) {
    throw new Error('Não foi possível iniciar a sessão no servidor.');
  }

  window.location.href = window.authNext || '/';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    await startServerSession(result.user);
  } catch (error) {
    showError(errorMessage(error));
  }
});

document.querySelector('#signup-submit').addEventListener('click', async () => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    if (nameInput.value.trim()) {
      await updateProfile(result.user, { displayName: nameInput.value.trim() });
    }

    await startServerSession(result.user);
  } catch (error) {
    showError(errorMessage(error));
  }
});

document.querySelector('#google-submit').addEventListener('click', async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await startServerSession(result.user);
  } catch (error) {
    showError(errorMessage(error));
  }
});

// Se o usuário já estiver autenticado, continua para a aplicação.
onAuthStateChanged(auth, (user) => {
  if (user && !document.cookie.includes('firebase_token=')) {
    startServerSession(user).catch((error) => showError(error.message));
  }
});
