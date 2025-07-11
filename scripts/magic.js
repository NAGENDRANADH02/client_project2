let magicMode = false;
let selectedEl = null;

function toggleMagicMode() {
  magicMode = !magicMode;
  selectedEl = null;
}

document.addEventListener("touchstart", function (e) {
  if (!magicMode) return;

  const touchedEl = e.target.closest("img");
  if (!touchedEl) return;

  const rect = touchedEl.getBoundingClientRect();

  // Remove the original element from its parent
  selectedEl = touchedEl;
  touchedEl.style.position = "fixed";
  touchedEl.style.top = `${rect.top}px`;
  touchedEl.style.left = `${rect.left}px`;
  touchedEl.style.width = `${rect.width}px`;
  touchedEl.style.height = `${rect.height}px`;
  touchedEl.style.zIndex = "999";
  touchedEl.style.pointerEvents = "none";
  touchedEl.style.transition = "none";

  document.body.appendChild(touchedEl);

  const moveHandler = (e) => {
    const touch = e.touches[0];
    touchedEl.style.top = `${touch.clientY - rect.height / 2}px`;
    touchedEl.style.left = `${touch.clientX - rect.width / 2}px`;
  };

  const endHandler = () => {
    touchedEl.remove(); // Delete the image permanently
    selectedEl = null;
    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", endHandler);
  };

  document.addEventListener("touchmove", moveHandler);
  document.addEventListener("touchend", endHandler);
});
