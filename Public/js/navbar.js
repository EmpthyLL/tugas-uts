let input = document.querySelector("input[type='search']");
input.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    if (!input.value) {
      event.preventDefault();
    }
  }
});
