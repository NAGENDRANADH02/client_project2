let magicMode = false;
let floatingClone = null;
let offsetX = 0;
let offsetY = 0;
let delayTimer = null;

function toggleMagicMode() {
  magicMode = !magicMode;
  document.body.style.cursor = magicMode ? "grab" : "default";

  // Remove any existing clone if disabling magic mode
  if (!magicMode && floatingClone) {
    floatingClone.remove();
    floatingClone = null;
    clearTimeout(delayTimer);
  }
}

// Start the clone animation
function initiateMagicClone(originalEl, clientX, clientY) {
  const rect = originalEl.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;
  const newHeight = window.innerHeight * 0.8; // 80% screen height
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

// Trigger clone on image interaction
function handleMagicTrigger(e, isTouch = false) {
  if (!magicMode || delayTimer) return;

  const target = e.target.closest("#prod_img");
  if (!target || target.dataset.used === "true") return;

  target.dataset.used = "true";
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  const fullCard = document.querySelector("#prod_left_right");
  if (!fullCard) return;

  fullCard.style.transition = "opacity 0.3s ease";
  fullCard.style.opacity = "0";

  delayTimer = setTimeout(() => {
    delayTimer = null;

    setTimeout(() => {
      fullCard.remove(); // Remove entire product detail section
    }, 300);

    initiateMagicClone(target, clientX, clientY);
  }, 3000);
}

// Mouse event
document.addEventListener("mousedown", (e) => handleMagicTrigger(e, false));
document.addEventListener("touchstart", (e) => handleMagicTrigger(e, true));

// Dragging logic
document.addEventListener("mousedown", function (e) {
  if (!magicMode || !floatingClone) return;
  e.preventDefault();
  startDrag(e.clientX, e.clientY);
});
document.addEventListener("touchstart", function (e) {
  if (!magicMode || !floatingClone) return;
  e.preventDefault();
  startDrag(e.touches[0].clientX, e.touches[0].clientY);
});
