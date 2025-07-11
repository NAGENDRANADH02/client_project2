let magicMode = false;
let selectedEl = null;
let offsetX = 0;
let offsetY = 0;
let delayTimer = null;

function toggleMagicMode() {
  magicMode = !magicMode;
  selectedEl = null;
  if (magicMode) {
    document.body.style.cursor = "grab";
  } else {
    document.body.style.cursor = "default";
    clearTimeout(delayTimer);
  }
}

function startDragging(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();

  offsetX = rect.width / 2;
  offsetY = rect.height / 2;

  // Resize image to 60% of screen height, keep aspect ratio
  const aspectRatio = rect.width / rect.height;
  const newHeight = window.innerHeight * 0.6;
  const newWidth = newHeight * aspectRatio;

  el.style.position = "fixed";
  el.style.top = `${clientY - newHeight / 2}px`;
  el.style.left = `${clientX - newWidth / 2}px`;
  el.style.width = `${newWidth}px`;
  el.style.height = `${newHeight}px`;
  el.style.zIndex = "999";
  el.style.pointerEvents = "none";
  el.style.transition = "none";

  document.body.appendChild(el);
  selectedEl = el;
}

function moveSelected(clientX, clientY) {
  if (selectedEl) {
    selectedEl.style.top = `${clientY - offsetY}px`;
    selectedEl.style.left = `${clientX - offsetX}px`;
  }
}

function endDragging() {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }
}

// Touch Support
document.addEventListener("touchstart", function (e) {
  if (!magicMode || delayTimer) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  const clientX = e.touches[0].clientX;
  const clientY = e.touches[0].clientY;

  delayTimer = setTimeout(() => {
    delayTimer = null;
    startDragging(target, clientX, clientY);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
  }, 3000); // 3 seconds
});

function onTouchMove(e) {
  moveSelected(e.touches[0].clientX, e.touches[0].clientY);
}

function onTouchEnd() {
  endDragging();
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
}

// Mouse Support
document.addEventListener("mousedown", function (e) {
  if (!magicMode || delayTimer) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  const clientX = e.clientX;
  const clientY = e.clientY;

  delayTimer = setTimeout(() => {
    delayTimer = null;
    startDragging(target, clientX, clientY);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, 3000); // 3 seconds
});

function onMouseMove(e) {
  moveSelected(e.clientX, e.clientY);
}

function onMouseUp() {
  endDragging();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}
