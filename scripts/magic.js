let magicMode = false;
let magicStep = 0;
let selectedClone = null;

function toggleMagicMode() {
  magicMode = !magicMode;
  magicStep = 0;
  selectedClone = null;
  // Removed alert
}

document.addEventListener("touchstart", function (e) {
  if (!magicMode) return;

  const touchedEl = e.target.closest("img");
  if (!touchedEl) return;

  // Step 1: Select a product
  if (magicStep === 0) {
    const rect = touchedEl.getBoundingClientRect();
    selectedClone = touchedEl.cloneNode(true);
    selectedClone.classList.add("magic-float");

    document.body.appendChild(selectedClone);

    selectedClone.style.top = `${rect.top}px`;
    selectedClone.style.left = `${rect.left}px`;

    // Force repaint for transition to work
    getComputedStyle(selectedClone).transform;

    setTimeout(() => {
      selectedClone.style.transform = `translateY(${window.innerHeight - rect.top - 100}px)`;
      magicStep = 1;
    }, 100);
  }

  // Step 2: Follow finger and disappear
  else if (magicStep === 1 && selectedClone) {
    const moveHandler = (e) => {
      const touch = e.touches[0];
      selectedClone.style.top = `${touch.clientY - 50}px`;
      selectedClone.style.left = `${touch.clientX - 50}px`;
      selectedClone.style.transform = "none";
    };

    const endHandler = () => {
      selectedClone.remove();
      selectedClone = null;
      magicStep = 0;
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", endHandler);
    };

    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", endHandler);
  }
});
