let magicMode = false;
let selectedEl = null;
let offsetX = 0;
let offsetY = 0;

// ✅ Toggle magic mode
window.toggleMagicMode = function () {
  magicMode = !magicMode;
  selectedEl = null;
  document.body.style.cursor = magicMode ? "grab" : "default";

  const magicKey = document.getElementById("magic-key");
  if (magicMode) {
    magicKey.classList.add("active");
  } else {
    magicKey.classList.remove("active");
  }
};

// ✅ Touch support for starting drop
document.addEventListener("touchstart", function (e) {
  if (!magicMode) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  startDropAnimation(target, e.touches[0].clientX, e.touches[0].clientY);
});

// ✅ Mouse support for starting drop
document.addEventListener("mousedown", function (e) {
  if (!magicMode) return;

  const target = e.target.closest("img");
  if (!target) return;
  e.preventDefault();

  startDropAnimation(target, e.clientX, e.clientY);
});

// ✅ Start pop + drop animation after delay
function startDropAnimation(target, clientX, clientY) {
  setTimeout(() => {
    initiateDrop(target);
    target.style.visibility = "hidden"; // hide original
  }, 4000);
}

// ✅ Handle the drop animation with bounce
function initiateDrop(el) {
  const rect = el.getBoundingClientRect();

  const dropClone = el.cloneNode(true);
  dropClone.style.position = "fixed";
  dropClone.style.top = `${rect.top}px`;
  dropClone.style.left = `${rect.left}px`;
  dropClone.style.width = `${rect.width}px`;
  dropClone.style.height = `${rect.height}px`;
  dropClone.style.zIndex = "999";
  dropClone.style.pointerEvents = "none";
  dropClone.style.transition = "transform 0.2s ease";
  dropClone.style.willChange = "transform, top, left";

  document.body.appendChild(dropClone);

  // 🔸 Pop effect
  dropClone.style.transform = "scale(1.2)";
  setTimeout(() => {
    dropClone.style.transform = "scale(1)";
  }, 150);

  // 🔸 Gravity animation
  setTimeout(() => {
    let velocity = 0;
    let gravity = 1.8;
    let posY = rect.top;
    let floor = window.innerHeight - rect.height;

    let vx = Math.random() < 0.5 ? -2 : 2;
    let posX = rect.left;

    let bounce = 0.6;
    let bounceCount = 0;

    function fall() {
      velocity += gravity;
      posY += velocity;
      posX += vx;

      if (posY >= floor) {
        posY = floor;
        velocity = -velocity * bounce;
        bounceCount++;

        if (Math.abs(velocity) < 5 || bounceCount > 4) {
          cancelAnimationFrame(fallID);
          makeDraggable(dropClone);
          return;
        }
      }

      dropClone.style.top = `${posY}px`;
      dropClone.style.left = `${posX}px`;

      fallID = requestAnimationFrame(fall);
    }

    let fallID = requestAnimationFrame(fall);
  }, 400);
}

// ✅ Enable drag (Mouse + Touch)
function makeDraggable(el) {
  el.style.pointerEvents = "auto";
  el.style.cursor = "grab";

  // Mouse support
  el.addEventListener("mousedown", (e) => {
    selectedEl = el;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  // Touch support
  el.addEventListener("touchstart", (e) => {
    selectedEl = el;
    const touch = e.touches[0];
    offsetX = touch.clientX - el.getBoundingClientRect().left;
    offsetY = touch.clientY - el.getBoundingClientRect().top;

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  });
}

// ✅ Drag logic for mouse
function onMouseMove(e) {
  if (!selectedEl) return;
  selectedEl.style.top = `${e.clientY - offsetY}px`;
  selectedEl.style.left = `${e.clientX - offsetX}px`;
}

function onMouseUp() {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }

  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

// ✅ Drag logic for touch
function onTouchMove(e) {
  if (!selectedEl) return;
  const touch = e.touches[0];
  selectedEl.style.top = `${touch.clientY - offsetY}px`;
  selectedEl.style.left = `${touch.clientX - offsetX}px`;
  e.preventDefault(); // prevent screen scrolling while dragging
}

function onTouchEnd() {
  if (selectedEl) {
    selectedEl.remove();
    selectedEl = null;
  }

  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
}
