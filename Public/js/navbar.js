let input = document.querySelector("input[type='search']");
let form = document.getElementById("searchForm");
input.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    if (!input.value) {
      event.preventDefault();
    }
  }
});
input.addEventListener("input", function () {
  const trimmedValue = this.value.trim();
  if (trimmedValue === "") {
    form.onsubmit();
  }
});