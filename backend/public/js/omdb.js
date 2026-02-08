function getLocalReviews(id) {
  const raw = localStorage.getItem(`reviews:${id}`);
  return raw ? JSON.parse(raw) : [];
}

function saveLocalReviews(id, reviews) {
  localStorage.setItem(`reviews:${id}`, JSON.stringify(reviews));
}

function renderReviews(container, imdbID) {
  const reviews = getLocalReviews(imdbID);
  if (!reviews.length) {
    container.innerHTML = "<div class=\"status\">No personal reviews yet.</div>";
    return;
  }

  container.innerHTML = reviews
    .map(
      (review) => `
      <div class="review-card">
        <strong>${escapeHtml(review.title)} • ${formatStars(review.rating)}</strong>
        <p>${escapeHtml(review.text)}</p>
        <small>${new Date(review.date).toLocaleDateString()}</small>
      </div>
    `
    )
    .join("");
}

function bindReviewForm(imdbID) {
  const form = document.getElementById("reviewForm");
  const list = document.getElementById("reviewList");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = form.reviewTitle.value.trim();
    const rating = Number(form.reviewRating.value);
    const text = form.reviewText.value.trim();
    if (!title || !text) return;

    const reviews = getLocalReviews(imdbID);
    reviews.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      rating,
      text,
      date: new Date().toISOString(),
    });

    saveLocalReviews(imdbID, reviews);
    form.reset();
    renderReviews(list, imdbID);
  });
}

function renderOmdb(data) {
  const output = document.getElementById("omdbResult");

  if (!data || data.Response === "False") {
    output.innerHTML = `<div class="status error">${escapeHtml(data?.Error || "Not found")}</div>`;
    return;
  }

  const ratings = (data.Ratings || []).map(
    (rating) => `<span class="badge">${rating.Source}: ${rating.Value}</span>`
  );

  output.innerHTML = `
    <div class="panel omdb-card">
      <div class="omdb-header">
        <div class="poster">
          ${data.Poster && data.Poster !== "N/A" ? `<img src="${data.Poster}" alt="Poster">` : ""}
        </div>
        <div>
          <h2>${escapeHtml(data.Title)}</h2>
          <p class="movie-meta">${escapeHtml(data.Year)} • ${escapeHtml(data.Runtime || "")}</p>
          <p>${escapeHtml(data.Plot || "")}</p>
          <div class="ratings">${ratings.join("") || "<span class=\"badge\">No ratings</span>"}</div>
        </div>
      </div>
      <div class="movie-actions">
        <a class="button secondary" href="https://www.youtube.com/results?search_query=${encodeURIComponent(
          `${data.Title} trailer`
        )}" target="_blank" rel="noreferrer">Watch Trailer</a>
        <a class="button secondary" href="https://www.imdb.com/title/${data.imdbID}/reviews" target="_blank" rel="noreferrer">Read IMDb Reviews</a>
      </div>
      <div class="grid two">
        <div>
          <h3>Details</h3>
          <p><strong>Genre:</strong> ${escapeHtml(data.Genre || "")}</p>
          <p><strong>Director:</strong> ${escapeHtml(data.Director || "")}</p>
          <p><strong>Actors:</strong> ${escapeHtml(data.Actors || "")}</p>
        </div>
        <div>
          <h3>Your Review</h3>
          <form id="reviewForm" class="form">
            <label>Title
              <input name="reviewTitle" placeholder="Short headline" required />
            </label>
            <label>Rating
              <select name="reviewRating" required>
                <option value="5">5 - Masterpiece</option>
                <option value="4">4 - Great</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Mixed</option>
                <option value="1">1 - Not for me</option>
              </select>
            </label>
            <label>Review
              <textarea name="reviewText" placeholder="Write your thoughts" required></textarea>
            </label>
            <button class="button primary" type="submit">Save Review</button>
          </form>
        </div>
      </div>
      <div>
        <h3>Personal Reviews</h3>
        <div id="reviewList" class="review-list"></div>
      </div>
    </div>
  `;

  const reviewList = document.getElementById("reviewList");
  renderReviews(reviewList, data.imdbID);
  bindReviewForm(data.imdbID);
}

function bindOmdbSearch() {
  const form = document.getElementById("searchForm");
  const status = document.getElementById("status");
  const result = document.getElementById("omdbResult");

  if (!requireAuth("login.html")) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "Searching OMDb...");
    result.innerHTML = "";

    try {
      const title = form.title.value.trim();
      const data = await apiRequest(`/external/omdb?title=${encodeURIComponent(title)}`);
      setStatus(status, "Data loaded", "success");
      renderOmdb(data);
    } catch (err) {
      setStatus(status, err.message, "error");
      result.innerHTML = "";
    }
  });
}

bindOmdbSearch();
