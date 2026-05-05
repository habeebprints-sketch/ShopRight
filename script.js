// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;
let allProducts = [];
let cart = [];
let wishlist = [];

/* ---------------- SPLASH ---------------- */
window.onload = function () {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 10000); // 10 seconds
};

/* ---------------- LOGIN ---------------- */
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(res => {
    currentUser = res.user;
    alert("Welcome " + currentUser.email);
  });
}

/* ---------------- ADD PRODUCT ---------------- */
function addProduct() {
  if (!currentUser) return alert("Login first");

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

/* ---------------- LOAD ---------------- */
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

    allProducts = [];

    snapshot.forEach(doc => {
      const p = doc.data();
      allProducts.push(p);
      renderProduct(p);
    });
  });
}

/* ---------------- RENDER ---------------- */
function renderProduct(p) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${p.image}">
    <h3>${p.name}</h3>
    <p>₦${p.price}</p>

    <button onclick="addToCart('${p.name}')">🛒 Add to Cart</button>
    <button onclick="addToWishlist('${p.name}')">❤️ Wishlist</button>
    <button onclick="chat('${p.user}')">💬 Chat</button>
  `;

  document.getElementById("products").appendChild(div);
}

/* ---------------- SEARCH ---------------- */
function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  document.getElementById("products").innerHTML = "";
  filtered.forEach(renderProduct);
}

/* ---------------- CART ---------------- */
function addToCart(name) {
  cart.push(name);
  alert("Added to cart 🛒");
}

/* ---------------- WISHLIST ---------------- */
function addToWishlist(name) {
  wishlist.push(name);
  alert("Saved ❤️");
}

/* ---------------- CHAT ---------------- */
function chat(user) {
  const msg = prompt("Message seller:");

  db.collection("chats").add({
    from: currentUser.email,
    to: user,
    message: msg
  });

  alert("Sent 💬");
}

/* INIT */
loadProducts();
