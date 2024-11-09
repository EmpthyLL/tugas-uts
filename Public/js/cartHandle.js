const loadingStates = {};

async function addToCart(productId) {
  if (loadingStates[productId]) return; // Prevent double-clicks

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true); // Disable buttons

    const response = await axios.post("/cart/add", { productId });
    if (response.status === 200) {
      updateCartDisplay(response.data.item.id, response.data.item.quantity);
    } else if (response.status === 400) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false); // Enable buttons
  }
}

async function increment(productId) {
  if (loadingStates[productId]) return; // Prevent double-clicks

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true);

    const response = await axios.post("/cart/increment", { productId });
    if (response.status === 200) {
      updateCartDisplay(productId, response.data.quantity);
    } else if (response.status === 400) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error incrementing item:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false);
  }
}

async function decrement(productId) {
  if (loadingStates[productId]) return;

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true);

    const response = await axios.post("/cart/decrement", { productId });
    if (response.status === 200) {
      updateCartDisplay(productId, response.data.quantity);
    } else if (response.status === 400) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error decrementing item:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false);
  }
}

function updateCartDisplay(productId, quantity) {
  if (quantity === undefined) {
    window.location.replace = "/sign-in";
    return false;
  }
  const quantityDisplay = document.getElementById(
    `quantity-display-${productId}`
  );
  quantityDisplay.innerText = quantity;

  UpdateCart();
  // If quantity is zero, revert to add button
  if (quantity <= 0) {
    const container = document.getElementById(`quantity-${productId}`);
    container.innerHTML = `
        <button
          onclick="addQuantity(event, '${productId}')"
          class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-blue-600 shadow-md"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      `;
  }
}

function addQuantity(event, productId) {
  event.stopPropagation();
  addToCart(productId);
  UpdateCart();
  const container = document.getElementById(`quantity-${productId}`);
  container.innerHTML = `
      <div class="flex items-center space-x-2 bg-gray-100 p-1 rounded-full shadow-md">
        <button
          onclick="decreaseQuantity(event, '${productId}')"
          class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
        >
          <!-- Minus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <span id="quantity-display-${productId}" class="text-gray-800 font-semibold">1</span>
        <button
          onclick="increaseQuantity(event, '${productId}')"
          class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    `;
}

function increaseQuantity(event, productId) {
  event.stopPropagation();
  increment(productId);
  UpdateCart();
}

function decreaseQuantity(event, productId) {
  event.stopPropagation();
  decrement(productId);
  UpdateCart();
}

function toggleButtons(productId, disable) {
  const decrementButton = document.querySelector(
    `#quantity-${productId} button[onclick*="decreaseQuantity"]`
  );
  const incrementButton = document.querySelector(
    `#quantity-${productId} button[onclick*="increaseQuantity"]`
  );

  if (decrementButton) decrementButton.disabled = disable;
  if (incrementButton) incrementButton.disabled = disable;
}
async function UpdateCart() {
  try {
    const response = await axios("/cart/view");
    const CartPop = document.getElementById("Cart-Pop");
    if (!response.data.data || response.data.data.length === 0) {
      CartPop.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let html = "";
    response.data.data.items.forEach((item) => {
      html += ` <a
                    href="/product/${item.id}"
                    class="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src="${item.thumbnail}"
                      alt="Product Image"
                      class="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div class="flex-grow space-y-1">
                      <p
                        class="text-base font-semibold text-gray-900 dark:text-white"
                      >
                        ${item.title}
                      </p>
                      <p
                        class="text-xs text-gray-500 dark:text-gray-400 flex items-center"
                      >
                        <span
                          class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium mr-2"
                        >
                          Qty: ${item.quantity}
                        </span>
                      </p>
                      <p
                        class="text-gray-800 dark:text-gray-200 font-bold text-lg whitespace-nowrap"
                      >
                        Rp ${Math.floor(item.price * 15000).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                  </a>`;
    });

    CartPop.innerHTML = html;
  } catch (error) {
    console.error("Error updating cart:", error);
    // Optionally, show an error message to the user
    CartPop.innerHTML =
      "<p>Error loading cart items. Please try again later.</p>";
  }
}
