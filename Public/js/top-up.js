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

  let inputedAmount = 0;
  let selectedMethod = 0;

  document.addEventListener("click", (event) => {
    if (
      !dropdownMenu.contains(event.target) &&
      !dropdownTrigger.contains(event.target)
    ) {
      dropdownMenu.classList.add("hidden");
    }
  });

  function formatAmount(value) {
    value = value.replace(/\D/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatAmount(value) {
    value = value.replace(/\D/g, "");

    if (/^0+$/.test(value)) return "0";

    value = value.replace(/^0+/, "");

    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  amountInput.addEventListener("input", function () {
    const cursorPos = amountInput.selectionStart;
    const rawValue = amountInput.value.replace(/,/g, "");
    const formattedValue = formatAmount(rawValue);

    inputedAmount = Number(rawValue);
    amountInput.value = formatAmount(formattedValue);

    const commasBeforeCursor = (
      amountInput.value.slice(0, cursorPos).match(/,/g) || []
    ).length;
    const rawCommasBefore = (rawValue.slice(0, cursorPos).match(/,/g) || [])
      .length;
    const adjustedCursorPos =
      cursorPos + (commasBeforeCursor - rawCommasBefore);

    amountInput.setSelectionRange(adjustedCursorPos, adjustedCursorPos);

    validateConfirmButton();
  });

  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const rawValue = button.textContent
        .replace(".5k", "500")
        .replace(/,/g, "")
        .trim();
      amountInput.value = formatAmount(rawValue);
      inputedAmount = rawValue;
      validateConfirmButton();
    });
  });

  storeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectedMethod = option.dataset.store;
      storeOptions.forEach((opt) =>
        opt.classList.remove("bg-lime-100", "ring-2", "ring-lime-500")
      );
      option.classList.add("bg-lime-100", "ring-2", "ring-lime-500");

      dropdownLabel.innerHTML = `
        <img
          src="/img/topup/${selectedMethod.toLowerCase()}.png"
          alt="${selectedMethod}"
          class="w-10 h-10 rounded-full object-contain"
        />
        <span>${selectedMethod}</span>`;
      dropdownMenu.classList.add("hidden");
      validateConfirmButton();
      clearDropdown.classList.remove("hidden");
    });
  });

  dropdownTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("hidden");
  });

  clearDropdown.addEventListener("click", () => {
    selectedMethod = "";
    dropdownLabel.textContent = "Choose your top-up method";
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
        window.location.href = `/top-up?success=${res.data.message}`;
      }
      if (res.status === 403) {
        window.location.href = "/sign-in";
      }
    }
  });
});
