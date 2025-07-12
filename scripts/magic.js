let magicMode = false;
let selectedEl = null;
let offsetX = 0;
let offsetY = 0;

// ✅ Make toggleMagicMode globally accessible
window.toggleMagicMode = function () {
  magicMode = !magicMode;
  selectedEl = null;
  document.body.style.cursor = magicMode ? "grab" : "default";
};

function startDragging(el, clientX, clientY) {
  const rect = el.getBoundingClientRect();

  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  el.style.position = "fixed";
  el.style.top = `${clientY - offsetY}px`;       // ✅ Use backticks
  el.style.left = `${clientX - offsetX}px`;      // ✅
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
  el.style.zIndex = "999";
  el.style.pointerEvents = "none";

  document.body.appendChild(el);
  selectedEl = el;
}

function moveSelected(clientX, clientY) {
  if (selectedEl) {
    selectedEl.style.top = `${clientY - offsetY}px`;   // ✅
    selectedEl.style.left = `${clientX - offsetX}px`;  // ✅
  }
}

function endDragging() {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }
}

// 🔸 Touch Support
document.addEventListener("touchstart", function (e) {
  if (!magicMode) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  startDragging(target, e.touches[0].clientX, e.touches[0].clientY);

  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);
});

function onTouchMove(e) {
  moveSelected(e.touches[0].clientX, e.touches[0].clientY);
}

function onTouchEnd() {
  endDragging();
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
}

// 🔸 Mouse Support
document.addEventListener("mousedown", function (e) {
  if (!magicMode) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  startDragging(target, e.clientX, e.clientY);

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
  moveSelected(e.clientX, e.clientY);
}

function onMouseUp() {
  endDragging();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}
