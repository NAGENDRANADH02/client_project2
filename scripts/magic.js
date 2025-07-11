let magicMode = false;
let selectedEl = null;
let isDragging = false;

function toggleMagicMode() {
  magicMode = !magicMode;
  selectedEl = null;
}

// Handle both mouse and touch events
function startDrag(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();
  selectedEl = el;

  el.style.position = "fixed";
  el.style.top = `${rect.top}px`;
  el.style.left = `${rect.left}px`;
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
  el.style.zIndex = "999";
  el.style.pointerEvents = "none";
  el.style.transition = "none";

  document.body.appendChild(el);
  isDragging = true;

  const moveHandler = (e) => {
    if (!isDragging || !selectedEl) return;
    let x = e.clientX || (e.touches && e.touches[0].clientX);
    let y = e.clientY || (e.touches && e.touches[0].clientY);
    selectedEl.style.top = `${y - rect.height / 2}px`;
    selectedEl.style.left = `${x - rect.width / 2}px`;
  };

  const endHandler = () => {
    if (selectedEl) selectedEl.remove();
    selectedEl = null;
    isDragging = false;
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", endHandler);
    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", endHandler);
  };

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("mouseup", endHandler);
  document.addEventListener("touchmove", moveHandler);
  document.addEventListener("touchend", endHandler);
}

// Touch support
document.addEventListener("touchstart", function (e) {
  if (!magicMode) return;

  const touchedEl = e.target.closest("img");
  if (!touchedEl) return;

  e.preventDefault(); // Prevent scrolling
  startDrag(touchedEl, e.touches[0].clientX, e.touches[0].clientY);
});

// Mouse support
document.addEventListener("mousedown", function (e) {
  if (!magicMode) return;

  const clickedEl = e.target.closest("img");
  if (!clickedEl) return;

  e.preventDefault(); // Prevent image drag ghost
  startDrag(clickedEl, e.clientX, e.clientY);
});
