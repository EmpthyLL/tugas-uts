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
  const { otp } = setTimeout(() => {
    alert(`Your OTP is: ${otp}`);
  }, 5000);
}

function resendOtp(e) {
  generateOtp();
  startCountdown(e.target);
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

function handleSubmit(event) {
  let inputs = document.querySelectorAll(".otp-input");
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
  if (otpValue.length == 0 || otpValue.length <= 5 || otpValue !== otp) {
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
    } else if (otpValue !== otp) {
      document.getElementById("invalidOtpMessage").classList.remove("hidden");
      document.getElementById("invalidOtpMessage").innerHTML =
        "Invalid OTP. Please try again.";
    }
  }

  if (!isFormValid) {
    event.preventDefault(); // Prevent form submission if invalid
  }
}

// Start OTP generation on load
document.addEventListener("DOMContentLoaded", () => {
  generateOtp();
});
