let magicMode = false;
let selectedEl = null;
let floatingClone = null;
let offsetX = 0;
let offsetY = 0;
let delayTimer = null;

function toggleMagicMode() {
  magicMode = !magicMode;
  if (!magicMode) {
    // Reset everything
    if (floatingClone) floatingClone.remove();
    floatingClone = null;
    selectedEl = null;
    clearTimeout(delayTimer);
  }
  document.body.style.cursor = magicMode ? "grab" : "default";
}

// Step 2: Click product → 3 sec delay → clone floats
function initiateMagicClone(originalEl, clientX, clientY) {
  const rect = originalEl.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;
  const newHeight = window.innerHeight * 0.6;
  const newWidth = newHeight * aspectRatio;

  const clone = originalEl.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.top = `${clientY - newHeight / 2}px`;
  clone.style.left = `${clientX - newWidth / 2}px`;
  clone.style.width = `${newWidth}px`;
  clone.style.height = `${newHeight}px`;
  clone.style.zIndex = "1000";
  clone.style.pointerEvents = "none";
  clone.style.transition = "transform 0.3s ease";
  clone.classList.add("magic-glow");

  document.body.appendChild(clone);
  floatingClone = clone;

  offsetX = newWidth / 2;
  offsetY = newHeight / 2;
}

// Step 3: Drag
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

// 🔸 Unified handler for both touch and click
function handleMagicTrigger(e, isTouch = false) {
  if (!magicMode || delayTimer) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  // Set 3-second delay for magic pop
  delayTimer = setTimeout(() => {
    delayTimer = null;
    initiateMagicClone(target, clientX, clientY);
  }, 3000);
}

// Event bindings
document.addEventListener("mousedown", (e) => handleMagicTrigger(e, false));
document.addEventListener("touchstart", (e) => handleMagicTrigger(e, true));

// Step 3: User touches/follows floating image
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
