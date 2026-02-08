async function loadProfile() {
  const status = document.getElementById("status");
  const form = document.getElementById("profileForm");

  if (!requireAuth("login.html")) return;

  try {
    const user = await apiRequest("/users/profile");
    form.name.value = user.name || "";
    form.email.value = user.email || "";
    setStatus(status, "Profile loaded", "success");
  } catch (err) {
    setStatus(status, err.message, "error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "Updating profile...");
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
    };

    try {
      const data = await apiRequest("/users/profile", "PUT", payload);
      setStatus(status, data.message || "Updated", "success");
    } catch (err) {
      setStatus(status, err.message, "error");
    }
  });
}

loadProfile();
