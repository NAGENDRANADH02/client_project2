let magicMode = false;
let selectedEl = null;
let floatingClone = null;
let offsetX = 0;
let offsetY = 0;
let delayTimer = null;

function toggleMagicMode() {
  magicMode = !magicMode;

  // Reset everything when magic mode turns off
  if (!magicMode) {
    if (floatingClone) floatingClone.remove();
    floatingClone = null;
    selectedEl = null;
    clearTimeout(delayTimer);

    // Optional: allow previously used images to be reused
    document.querySelectorAll("img[data-used='true']").forEach(img => {
      delete img.dataset.used;
    });
  }

  document.body.style.cursor = magicMode ? "grab" : "default";
}

// Create the floating image
function initiateMagicClone(cloneEl, clientX, clientY) {
  const rect = cloneEl.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;
  const newHeight = window.innerHeight * 0.6;
  const newWidth = newHeight * aspectRatio;

  cloneEl.style.position = "fixed";
  cloneEl.style.top = `${clientY - newHeight / 2}px`;
  cloneEl.style.left = `${clientX - newWidth / 2}px`;
  cloneEl.style.width = `${newWidth}px`;
  cloneEl.style.height = `${newHeight}px`;
  cloneEl.style.zIndex = "1000";
  cloneEl.style.pointerEvents = "none";
  cloneEl.style.transition = "transform 0.3s ease";
  cloneEl.classList.add("magic-glow");

  document.body.appendChild(cloneEl);
  floatingClone = cloneEl;

  offsetX = newWidth / 2;
  offsetY = newHeight / 2;
}

// Start dragging the floating image
function startDrag(clientX, clientY) {
  if (!floatingClone) return;
  floatingClone.style.top = `${clientY - offsetY}px`;
  floatingClone.style.left = `${clientX - offsetX}px`;

  const moveHandler = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    floatingClone.style.top = `${y - offsetY}px`;
    floatingClone.style.left = `${x - offsetX}px`;
  };

  const endHandler = () => {
    floatingClone.remove();
    floatingClone = null;
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

// Trigger magic on product click/touch
function handleMagicTrigger(e, isTouch = false) {
  if (!magicMode || delayTimer) return;

  const target = e.target.closest("img");
  if (!target || target.dataset.used === "true") return;

  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  const cloneForMagic = target.cloneNode(true);
  target.dataset.used = "true";

  // Optional fade before removal
  target.style.transition = "opacity 0.3s ease";
  target.style.opacity = "0";

  delayTimer = setTimeout(() => {
    delayTimer = null;

    // Remove original from DOM after fade
    setTimeout(() => {
      target.remove();
    }, 300);

    // Pop floating magic clone
    initiateMagicClone(cloneForMagic, clientX, clientY);
  }, 3000);
}

// Mouse & touch events for clicking product
document.addEventListener("mousedown", (e) => handleMagicTrigger(e, false));
document.addEventListener("touchstart", (e) => handleMagicTrigger(e, true));

// Mouse & touch events for dragging
document.addEventListener("touchstart", function (e) {
  if (!magicMode || !floatingClone) return;
  e.preventDefault();
  startDrag(e.touches[0].clientX, e.touches[0].clientY);
});

document.addEventListener("mousedown", function (e) {
  if (!magicMode || !floatingClone) return;
  e.preventDefault();
  startDrag(e.clientX, e.clientY);
});
