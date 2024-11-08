document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");
  const amountValue = document.getElementById("amount-value");
  const amountButtons = document.querySelectorAll(".amount-button");
  const confirmButton = document.getElementById("confirm-button");
  const dropdownLabel = document.getElementById("dropdown-label");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const storeOptions = document.querySelectorAll(".store-option");
  const confirmModal = document.getElementById("confirm-payment");
  const clearDropdown = document.getElementById("clear-dropdown");

  let selectedAmount = "";
  let selectedStore = "";

  function formatAmount(value) {
    return value
      .replace(/\D/g, "") // Remove non-numeric characters
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"); // Add commas for thousands
  }

  function updateAmount() {
    const amount = amountInput.value.replace(/\D/g, ""); // Remove non-numeric characters
    selectedAmount = amount;
    amountValue.value = amount;
    validateConfirmButton();
  }

  amountInput.addEventListener("input", function () {
    amountInput.value = formatAmount(amountInput.value);
    amountValue.value = formatAmount(amountInput.value);
    updateAmount();
  });

  // Button handlers
  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      amountInput.value = button.textContent.replace(".5k", ",500");
      amountValue.value = button.textContent.replace("00");
      updateAmount();
    });
  });

  // Store selection handling
  storeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectedStore = option.dataset.store;
      dropdownLabel.textContent = selectedStore;
      dropdownMenu.classList.add("hidden");
      validateConfirmButton();
    });
  });

  // Handle dropdown toggle
  document.getElementById("hs-dropdown").addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  // Clear selection
  clearDropdown.addEventListener("click", () => {
    selectedStore = "";
    dropdownLabel.textContent = "Choose your top up method";
    validateConfirmButton();
  });

  // Validate the confirm button's state
  function validateConfirmButton() {
    if (selectedAmount && selectedStore) {
      confirmButton.disabled = false;
      confirmButton.classList.remove("opacity-50", "cursor-not-allowed");
      confirmButton.classList.add("opacity-100", "cursor-pointer");
    } else {
      confirmButton.disabled = true;
      confirmButton.classList.add("opacity-50", "cursor-not-allowed");
      confirmButton.classList.remove("opacity-100", "cursor-pointer");
    }
  }

  // Show confirmation modal
  confirmButton.addEventListener("click", () => {
    const topupMessage = `You are about to top up Rp${selectedAmount} using ${selectedStore}.`;
    document.getElementById("topup-message").textContent = topupMessage;
    confirmModal.classList.remove("hidden");
  });
});
