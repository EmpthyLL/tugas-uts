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
    let formattedValue = originalValue.replace(/\D/g, "");

    formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    input.value = formattedValue;

    let newCursorPosition = cursorPosition;

    if (formattedValue !== originalValue) {
      const numCommasBefore = (
        originalValue.slice(0, cursorPosition).match(/,/g) || []
      ).length;
      const numCommasAfter = (
        formattedValue.slice(0, cursorPosition).match(/,/g) || []
      ).length;
      newCursorPosition += numCommasAfter - numCommasBefore;
    }

    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  function updateAmount() {
    const amount = amountInput.value.replace(/\D/g, ""); // Remove non-numeric characters
    selectedAmount = amount;
    amountValue.value = amount;
    validateConfirmButton();
  }

  function formatAmount(value) {
    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Add commas for thousands
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  amountInput.addEventListener("input", function (e) {
    const cursorPos = amountInput.selectionStart; // Get current cursor position
    const oldValue = amountInput.value;

    // Format the value
    const formattedValue = formatAmount(amountInput.value);

    // Set the formatted value back to the input
    amountInput.value = formattedValue;

    // Calculate the new cursor position after formatting
    let newCursorPos = cursorPos;
    if (formattedValue.length > oldValue.length) {
      // If we're adding digits (inserting a comma), adjust the cursor position
      newCursorPos += formattedValue.length - oldValue.length;
    }

    // Set the cursor position back to where it was before formatting
    amountInput.setSelectionRange(newCursorPos, newCursorPos);

    // Also update the amountValue input
    amountValue.value = formattedValue;

    // Call updateAmount function
    updateAmount();
  });

  // Button handlers
  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      amountInput.value = button.textContent.replace(".5k", ",500").trim();
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
