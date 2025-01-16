function startCountdown(button) {
  let countdown = 300;
  button.disabled = true;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  button.textContent = `Resend OTP in ${formatTime(countdown)}`;

  countdownInterval = setInterval(() => {
    countdown--;
    button.textContent = `Resend OTP in ${formatTime(countdown)}`;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      button.disabled = false;
      button.textContent = "Resend OTP";
    }
  }, 1000);
}

async function generateOtp() {
  const time = Math.floor(3000 + Math.random() * 3001).toString();
  const button = document.getElementById("resendButton");
  const res = await axios.get("/api/auth/sendOTP");
  const { otp } = res.data;
  startCountdown(button);
  setTimeout(() => {
    alert(`Your OTP is: ${otp}`);
  }, time);
}

function resendOtp(e) {
  generateOtp();
  let inputs = document.querySelectorAll(".otp-input");
  inputs.forEach((input) => {
    input.classList.remove(
      "border-red-500",
      "bg-red-50",
      "placeholder-red-500"
    );
  });
  document.getElementById("invalidOtpMessage").classList.add("hidden");
}

async function handleSubmit(event) {
  event.preventDefault();
  let inputs = document.querySelectorAll(".otp-input");
  const submitButton = document.getElementById("submitButton");
  let isFormValid = true;
  let otpValue = "";
  inputs.forEach((input) => {
    if (!input.value) {
      isFormValid = false;
      input.classList.add("border-red-500", "bg-red-50", "placeholder-red-500");
      document.getElementById("invalidOtpMessage").classList.add("hidden");
    } else {
      input.classList.remove(
        "border-red-500",
        "bg-red-50",
        "placeholder-red-500"
      );
      otpValue += input.value;
    }
  });
  if (otpValue.length == 0 || otpValue.length <= 5) {
    isFormValid = false;
    inputs.forEach((input) => {
      input.classList.add("border-red-500", "bg-red-50", "placeholder-red-500");
    });
    if (otpValue.length == 0) {
      document.getElementById("invalidOtpMessage").classList.remove("hidden");
      document.getElementById("invalidOtpMessage").innerHTML =
        "OTP has not been filled!";
    } else if (otpValue.length <= 5) {
      document.getElementById("invalidOtpMessage").classList.remove("hidden");
      document.getElementById("invalidOtpMessage").innerHTML =
        "OTP is not complete!";
    }
  }

  try {
    await axios.post("/api/auth/verifyOTP", { otp: otpValue });
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 400)
    ) {
      inputs.forEach((input) => {
        input.classList.add(
          "border-red-500",
          "bg-red-50",
          "placeholder-red-500"
        );
      });
      const invalidOtpMessageElement =
        document.getElementById("invalidOtpMessage");
      invalidOtpMessageElement.classList.remove("hidden");
      invalidOtpMessageElement.innerHTML =
        error.response.data.message || "An error occurred. Please try again.";
      isFormValid = false;
    } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  }

  if (isFormValid) {
    const form = document.getElementById("verifyForm");
    const invalidOtpMessageElement =
      document.getElementById("invalidOtpMessage");
    invalidOtpMessageElement.classList.add("hidden");
    form.submit();
    const html = `<div class="flex items-center justify-center space-x-2">
          <div class="h-6 w-6 animate-spin rounded-full border-4 border-lime-300 border-t-transparent"> </div>
          <span>Verifying OTP...</span>
        </div>`;
    submitButton.innerHTML = html;
    submitButton.disabled = true;
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateOtp();
});
