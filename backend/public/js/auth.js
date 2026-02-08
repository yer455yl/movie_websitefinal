function bindAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const status = document.getElementById("status");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "Logging in...");
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      try {
        const data = await apiRequest("/auth/login", "POST", { email, password });
        setToken(data.token);
        setStatus(status, "Welcome back!", "success");
        window.location.href = "profile.html";
      } catch (err) {
        setStatus(status, err.message, "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus(status, "Creating your account...");
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();

      try {
        const data = await apiRequest("/auth/register", "POST", { email, password });
        if (data.token) {
          setToken(data.token);
        }
        setStatus(status, "Account ready!", "success");
        window.location.href = "profile.html";
      } catch (err) {
        setStatus(status, err.message, "error");
      }
    });
  }
}

function bindLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    clearToken();
    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "../index.html" : "index.html";
  });
}

bindAuthForms();
bindLogout();
