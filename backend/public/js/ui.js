function setStatus(element, message, variant = "") {
  if (!element) return;
  element.textContent = message;
  element.className = `status ${variant}`.trim();
}

function formatYear(value) {
  if (!value) return "";
  return Number.isFinite(Number(value)) ? value : "";
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function formatStars(value) {
  const rating = Math.max(0, Math.min(5, Number(value)));
  const full = "★".repeat(Math.floor(rating));
  const empty = "☆".repeat(5 - Math.floor(rating));
  return `${full}${empty}`;
}
