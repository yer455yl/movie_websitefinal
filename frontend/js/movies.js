let editingId = null;

function getMovieRatings() {
  const raw = localStorage.getItem("movieRatings");
  return raw ? JSON.parse(raw) : {};
}

function saveMovieRatings(ratings) {
  localStorage.setItem("movieRatings", JSON.stringify(ratings));
}

async function loadMovies() {
  const list = document.getElementById("movieList");
  const status = document.getElementById("status");

  if (!requireAuth("login.html")) return;

  try {
    const movies = await apiRequest("/movies");
    const ratings = getMovieRatings();

    list.innerHTML = movies
      .map((movie) => {
        const rate = ratings[movie._id] || 0;
        return `
          <div class="movie-card">
            <div>
              <h3>${escapeHtml(movie.title || "Без названия")}</h3>
            <div class="movie-meta">
              <span>${movie.year ? `Year: ${movie.year}` : ""}</span>
              <span>${movie.description ? "Has note" : ""}</span>
              <span class="rating-pill">Your rating: ${rate || "—"}</span>
            </div>
            </div>
            <p>${escapeHtml(movie.description || "Add a note to remember details.")}</p>
            <div class="movie-actions">
              <button class="button secondary" data-edit="${movie._id}">Edit</button>
              <button class="button" data-delete="${movie._id}">Delete</button>
              <button class="button secondary" data-rate="${movie._id}" data-value="5">★ 5</button>
              <button class="button secondary" data-rate="${movie._id}" data-value="4">★ 4</button>
              <button class="button secondary" data-rate="${movie._id}" data-value="3">★ 3</button>
              <button class="button secondary" data-rate="${movie._id}" data-value="2">★ 2</button>
              <button class="button secondary" data-rate="${movie._id}" data-value="1">★ 1</button>
            </div>
          </div>
        `;
      })
      .join("");

    list.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => startEdit(btn.dataset.edit, movies));
    });

    list.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => deleteMovie(btn.dataset.delete));
    });

    list.querySelectorAll("[data-rate]").forEach((btn) => {
      btn.addEventListener("click", () => setRating(btn.dataset.rate, btn.dataset.value));
    });

    if (!movies.length) {
      list.innerHTML = "<div class=\"status\">No movies yet. Add your first.</div>";
    }

    setStatus(status, "Library synced", "success");
  } catch (err) {
    setStatus(status, err.message, "error");
  }
}

function setRating(movieId, value) {
  const ratings = getMovieRatings();
  ratings[movieId] = Number(value);
  saveMovieRatings(ratings);
  loadMovies();
}

function startEdit(id, movies) {
  const form = document.getElementById("movieForm");
  const status = document.getElementById("status");
  const movie = movies.find((item) => item._id === id);
  if (!movie) return;

  editingId = id;
  form.title.value = movie.title || "";
  form.year.value = movie.year || "";
  form.description.value = movie.description || "";
  form.querySelector("button").textContent = "Save changes";
  document.getElementById("cancelEdit").style.display = "inline-flex";
  setStatus(status, `Editing: ${movie.title}`, "success");
}

async function deleteMovie(id) {
  const status = document.getElementById("status");
  if (!confirm("Delete this movie?")) return;
  try {
    await apiRequest(`/movies/${id}`, "DELETE");
    setStatus(status, "Movie removed", "success");
    loadMovies();
  } catch (err) {
    setStatus(status, err.message, "error");
  }
}

function bindMovieForm() {
  const form = document.getElementById("movieForm");
  const cancelBtn = document.getElementById("cancelEdit");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.value.trim(),
      year: form.year.value ? Number(form.year.value) : undefined,
      description: form.description.value.trim(),
    };

    try {
      setStatus(status, editingId ? "Updating movie..." : "Adding movie...");
      if (editingId) {
        await apiRequest(`/movies/${editingId}`, "PUT", payload);
      } else {
        await apiRequest("/movies", "POST", payload);
      }
      form.reset();
      editingId = null;
      form.querySelector("button").textContent = "Save";
      cancelBtn.style.display = "none";
      setStatus(status, "Saved", "success");
      loadMovies();
    } catch (err) {
      setStatus(status, err.message, "error");
    }
  });

  cancelBtn.addEventListener("click", () => {
    editingId = null;
    form.reset();
    form.querySelector("button").textContent = "Save";
    cancelBtn.style.display = "none";
    setStatus(status, "Edit cancelled", "success");
  });
}

bindMovieForm();
loadMovies();
