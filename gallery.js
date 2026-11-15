const artworks = [
{ id: 1, price: 15000 },
{ id: 2, price: 18000 },
{ id: 3, price: 20000 },
{ id: 4, price: 22000 },
{ id: 5, price: 25000 },
{ id: 6, price: 28000 },
{ id: 7, price: 30000 },
{ id: 8, price: 32000 },
{ id: 9, price: 35000 },
{ id: 10, price: 40000 },
{ id: 11, price: 45000 }
];

let cart = [];

const artGrid = document.getElementById("artGrid");

// إنشاء السلة
const cartSection = document.createElement("section");
cartSection.id = "cartSection";
cartSection.style.display = "none";

cartSection.innerHTML = `<h2>MY SHOPPING CART</h2><div id="cartItems"></div><h3 id="cartTotal">Total: 0 IQD</h3>`;

document.querySelector(".gallery-container").appendChild(cartSection);

// إنشاء نموذج معلومات الزبون
const customerForm = document.createElement("div");
customerForm.id = "customerForm";

customerForm.innerHTML = `
<h3>DELIVERY INFORMATION</h3>

<input id="customerName" type="text"
    placeholder="Your Full Name">

<input id="customerPhone" type="tel"
    placeholder="Phone Number">

<input id="customerCity" type="text"
    placeholder="City / Governorate">

<textarea id="customerAddress"
    placeholder="Full Delivery Address"></textarea>
`;

cartSection.appendChild(customerForm);

// زر إتمام الطلب
const checkoutButton = document.createElement("button");
checkoutButton.textContent = "COMPLETE YOUR ORDER";
checkoutButton.className = "checkout-button";
checkoutButton.onclick = checkout;

cartSection.appendChild(checkoutButton);

// عرض اللوحات
artworks.forEach((art) => {
const card = document.createElement("article");
card.className = "art-card";

const image = document.createElement("img");
image.src = `images/artwork-${String(art.id).padStart(2, "0")}.jpg`;
image.alt = `ELORA Artwork ${art.id}`;

const title = document.createElement("h2");
title.textContent = `Artwork ${String(art.id).padStart(2, "0")}`;

const price = document.createElement("p");
price.className = "art-price";
price.textContent = `${art.price.toLocaleString("en-US")} IQD`;

const button = document.createElement("button");
button.textContent = "ADD TO CART";
button.className = "view-button";

button.addEventListener("click", () => {
    addToCart(art);
});

card.append(image, title, price, button);
artGrid.appendChild(card);
});

// إضافة لوحة أو زيادة كميتها
function addToCart(art) {
const existing = cart.find(item => item.id === art.id);

if (existing) {
    existing.quantity++;
} else {
    cart.push({
        id: art.id,
        price: art.price,
        quantity: 1
    });
}

updateCart();
}

// تحديث السلة
function updateCart() {
document.getElementById("cartCount").textContent =
cart.reduce((sum, item) => sum + item.quantity, 0);

const cartItems = document.getElementById("cartItems");
cartItems.innerHTML = "";

cart.forEach((art) => {
    const item = document.createElement("div");
    item.className = "cart-item";

    const title = document.createElement("p");
     title.textContent = `Artwork ${String(art.id).padStart(2, "0")}`;

    const price = document.createElement("p");
    price.textContent =
        `${(art.price * art.quantity).toLocaleString("en-US")} IQD`;

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.onclick = () => {
        art.quantity--;

        if (art.quantity <= 0) {
            cart = cart.filter(item => item.id !== art.id);
        }

        updateCart();
    };

    const quantity = document.createElement("span");
    quantity.textContent = art.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => {
        art.quantity++;
        updateCart();
    };

    const remove = document.createElement("button");
    remove.textContent = "REMOVE";
    remove.onclick = () => {
        cart = cart.filter(item => item.id !== art.id);
        updateCart();
    };

    controls.append(minus, quantity, plus, remove);

    item.append(title, price, controls);
    cartItems.appendChild(item);
});

const total = cart.reduce(
    (sum, art) => sum + art.price * art.quantity,
    0
);

document.getElementById("cartTotal").textContent =
    `Total: ${total.toLocaleString("en-US")} IQD`;
}

// فتح وإغلاق السلة
function toggleCart() {
const section = document.getElementById("cartSection");

if (section.style.display === "none") {
    section.style.display = "block";
} else {
    section.style.display = "none";
}

section.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}

// إرسال الطلب
function checkout() {
if (cart.length === 0) {
alert("Your cart is empty!");
return;
}

const name = document.getElementById("customerName").value.trim();
const phoneNumber = document.getElementById("customerPhone").value.trim();
const city = document.getElementById("customerCity").value.trim();
const address = document.getElementById("customerAddress").value.trim();

if (!name || !phoneNumber || !city || !address) {
    alert("Please complete all delivery information.");
    return;
}

const total = cart.reduce(
    (sum, art) => sum + art.price * art.quantity,
    0
);

const details = cart.map(art =>
    `Artwork ${String(art.id).padStart(2, "0")} | Quantity: ${art.quantity} | ${(art.price * art.quantity).toLocaleString("en-US")} IQD`
).join("\n");

const message = `
ELORA - NEW ORDER

Customer: ${name}
Phone: ${phoneNumber}
City: ${city}
Address: ${address}

ORDER DETAILS:
${details}

Total: ${total.toLocaleString("en-US")} IQD
`;

const fakeNumber = "9647700000000";

const url =
    `https://wa.me/${fakeNumber}?text=${encodeURIComponent(message)}`;

window.open(url, "_blank");
}

updateCart();