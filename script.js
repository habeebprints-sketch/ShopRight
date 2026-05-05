console.log("JS running safely");

window.onload = function () {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    if (splash) splash.style.display = "none";
  }, 10000);
};

/* TEMP SAFE DATA (NO FIREBASE YET) */
let allProducts = [
  {
    name: "Sample Phone",
    price: "50000",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Sample Shoe",
    price: "12000",
    image: "https://via.placeholder.com/150"
  }
];

/* RENDER */
function loadProducts() {
  const container = document.getElementById("products");
  const status = document.getElementById("status");

  container.innerHTML = "";
  status.innerText = "";

  allProducts.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>₦${p.price}</p>
    `;

    container.appendChild(div);
  });
}

loadProducts();
