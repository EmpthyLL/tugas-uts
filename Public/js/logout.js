async function handleLogout() {
  await axios.post("api/auth/logout");
  window.location.reload();
}
