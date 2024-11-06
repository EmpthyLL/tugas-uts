const profilePicInput = document.getElementById("profile_pic");
const profilePicture = document.getElementById("profilePicture");

profilePicInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePicture.src = e.target.result; // Update the image source
    };
    reader.readAsDataURL(file); // Convert the file to base64 URL
  }
});