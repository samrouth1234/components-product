'use strict';
// Include navbar and footer in every page
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');

// API URL

const apiUrl = 'https://api.escuelajs.co/api/v1/products?limit=0&offset=21';

// Load navbar and footer HTML
fetch('navbar.html')
  .then(response => response.text())
  .then(html => navbar.innerHTML = html);

fetch('footer.html')
  .then(response => response.text())
  .then(html => footer.innerHTML = html);


// Initialize cart array
let cart = [];

// Function to add item to cart
function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  
  updateCartCount();
}

// Function to update cart count
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.innerText = totalCount;
}

// Function to show cart items in dropdown
function showCartItems() {
  const cartDropdown = document.getElementById('cart-dropdown');
  const cartItemsList = document.getElementById('cart-items');
  
  // Clear previous items
  cartItemsList.innerHTML = '';

  // Populate dropdown with current cart items
  if (cart.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.innerText = 'Your cart is empty.';
      cartItemsList.appendChild(emptyMessage);
  } else {
      cart.forEach(item => {
          const listItem = document.createElement('li');
          listItem.innerText = `${item.title} - Quantity: ${item.quantity}, Price: $${item.price}`;
          listItem.addEventListener('click', () => {
              // Handle item click (e.g., remove from cart, view details)
              removeItemFromCart(item);
          });
          cartItemsList.appendChild(listItem);
      });
  }
  
  // Toggle dropdown visibility
  cartDropdown.style.display = cart.length > 0 ? 'block' : 'none';
}

// Function to remove item from cart
function removeItemFromCart(item) {
  const index = cart.findIndex(cartItem => cartItem.id === item.id);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCartCount();
    showCartItems();
  }
}

// Fetch products data
fetch(apiUrl)
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
    const productList = document.getElementById('product-list');
    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        // Create HTML structure for the product
        productDiv.innerHTML = `
            <img class="product-image" src="${product.images[0] ? product.images[0] : '../images/placeholder.png'}" alt="${product.title}">
            <h5 class="product-title">${product.title}</h5>
            <span class="price">$${product.price}</span>
            <button class="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add to Cart</button>
        `;

        const addButton = productDiv.querySelector('.bg-blue-700');
        addButton.addEventListener('click', () => {
          addToCart(product);
          // window.location.href = 'cart.html';
        });

        const imgElement = productDiv.querySelector('.product-image');
        imgElement.addEventListener('click', (event) => {
            event.stopPropagation(); 
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product-detail.html';
        });

        const titleElement = productDiv.querySelector('.product-title');
        titleElement.addEventListener('click', (event) => {
            event.stopPropagation();
            localStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product-detail.html';
        });

        productList.appendChild(productDiv);
    });
  })
  .catch(error => console.error('Fetch error:', error));

