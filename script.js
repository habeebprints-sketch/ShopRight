// 🔥 Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;
let allProducts = [];

/* ---------------- FIX SPLASH ---------------- */
window.onload = function () {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 3000);
};

/* ---------------- LOGIN ---------------- */
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(res => {
      currentUser = res.user;
      alert("Welcome " + currentUser.email);
    });
}

/* ---------------- ADD PRODUCT ---------------- */
function addProduct() {
  if (!currentUser) {
    alert("Login first");
    return;
  }

  const name = prompt("Product name:");
  const price = prompt("Price:");
  const image = prompt("Image URL:");

  db.collection("products").add({
    name,
    price,
    image,
    user: currentUser.email
  });

  loadProducts();
}

/* ---------------- LOAD PRODUCTS ---------------- */
function loadProducts() {
  const container = document.getElementById("products");
  const status = document.getElementById("status");

  container.innerHTML = "";
  status.innerText = "Loading...";

  db.collection("products").get().then(snapshot => {

    if (snapshot.empty) {
      status.innerText = "No products yet";
      return;
    }

    status.innerText = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>₦${p.price}</p>
        <small>${p.user}</small>
      `;

      container.appendChild(div);
    });
  });
}

/* INIT */
loadProducts();
