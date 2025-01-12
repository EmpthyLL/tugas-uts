document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");
  const amountButtons = document.querySelectorAll(".amount-button");
  const confirmButton = document.getElementById("confirm-button");
  const dropdownLabel = document.getElementById("dropdown-label");
  const dropdownTrigger = document.getElementById("hs-dropdown");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const storeOptions = document.querySelectorAll(".store-option");
  const confirmModal = document.getElementById("confirm-payment");
  const paybutton = document.getElementById("payment");
  const clearDropdown = document.getElementById("clear-dropdown");

  let inputedAmount = "";
  let selectedMethod = "";

  document.addEventListener("click", (event) => {
    if (
      !dropdownMenu.contains(event.target) &&
      !dropdownTrigger.contains(event.target)
    ) {
      dropdownMenu.classList.add("hidden");
    }
  });

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
    const amount = amountInput.value.replace(/\D/g, "");
    inputedAmount = amount;
    validateConfirmButton();
  }

  function formatAmount(value) {
    value = value.replace(/\D/g, "");

    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  amountInput.addEventListener("input", function (e) {
    const cursorPos = amountInput.selectionStart;
    const oldValue = amountInput.value;

    const formattedValue = formatAmount(amountInput.value);

    let newCursorPos = cursorPos;
    if (formattedValue.length > oldValue.length) {
      newCursorPos += formattedValue.length - oldValue.length;
    }

    amountInput.setSelectionRange(newCursorPos, newCursorPos);

    updateAmount();
  });

  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      amountInput.value = button.textContent.replace(".5k", ",500").trim();
      updateAmount();
    });
  });

  storeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectedMethod = option.dataset.store;
      storeOptions.forEach((opt) =>
        opt.classList.remove("bg-lime-100", "ring-2", "ring-lime-500")
      );
      option.classList.add("bg-lime-100", "ring-2", "ring-lime-500");
      const label = `
          <img
            src="/img/topup/${selectedMethod.toLowerCase()}.png"
            alt="Indomaret"
            class="w-10 h-10 rounded-full object-contain"
          />
          <span>${selectedMethod}</span>`;
      dropdownLabel.innerHTML = label;
      dropdownMenu.classList.add("hidden");
      validateConfirmButton();
      clearDropdown.classList.remove("hidden");
    });
  });

  document.getElementById("hs-dropdown").addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("hidden");
  });

  clearDropdown.addEventListener("click", () => {
    selectedMethod = "";
    dropdownLabel.textContent = "Choose your top up method";
    validateConfirmButton();
    clearDropdown.classList.add("hidden");
    storeOptions.forEach((opt) =>
      opt.classList.remove("bg-lime-100", "ring-2", "ring-lime-500")
    );
  });

  function validateConfirmButton() {
    if (inputedAmount && selectedMethod) {
      confirmButton.disabled = false;
      confirmButton.classList.remove("opacity-50", "cursor-not-allowed");
      confirmButton.classList.add("opacity-100", "cursor-pointer");
    } else {
      confirmButton.disabled = true;
      confirmButton.classList.add("opacity-50", "cursor-not-allowed");
      confirmButton.classList.remove("opacity-100", "cursor-pointer");
    }
  }

  confirmButton.addEventListener("click", () => {
    const topupMessage = `You are about to top up Rp${inputedAmount} using ${selectedMethod}.`;
    document.getElementById("topup-message").textContent = topupMessage;
    confirmModal.classList.remove("hidden");
  });
  paybutton.addEventListener("click", async () => {
    const dopay = confirm("Lakukan Pembayaran");
    if (dopay) {
      const res = await axios.post("/api/purchase/topup", {
        amount: inputedAmount,
        method: selectedMethod,
      });
      if (res.status === 200) {
        window.location.href = "/";
      }
      if (res.status === 403) {
        window.location.href = "/sign-in";
      }
    }
  });
});
