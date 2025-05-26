let isDragging = false;
let startX, startY;
let translateX = 0,
  translateY = 0; // Initial translation

function setupDropDrag() {
  const svgElement = mapContainer.children[0];
  mapContainer.addEventListener("mousedown", startDrag);
  mapContainer.addEventListener("touchstart", startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();

    // Get current scale from data attribute
    let scale = parseFloat(svgElement.getAttribute("data-scale")) || 1;

    // Check if the SVG is overflowing
    const mapRect = mapContainer.getBoundingClientRect();
    const svgRect = svgElement.getBoundingClientRect();

    const isOverflowing =
      svgRect.width > mapRect.width || svgRect.height > mapRect.height;

    if (!isOverflowing) return; // Prevent dragging if map is not overflowing

    isDragging = true;

    // Get initial position
    if (e.touches) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }

    document.addEventListener("mousemove", drag);
    document.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function drag(e) {
    if (!isDragging) return;

    let moveX, moveY;
    if (e.touches) {
      moveX = e.touches[0].clientX - startX;
      moveY = e.touches[0].clientY - startY;
    } else {
      moveX = e.clientX - startX;
      moveY = e.clientY - startY;
    }

    // Update translation values
    translateX += moveX;
    translateY += moveY;

    startX += moveX; // Update for smoother movement
    startY += moveY;

    applyTransform();
    updatePositionOfAllDroppedTexts();
  }

  function endDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  // Apply transformations while keeping the zoom level from data-scale
  function applyTransform() {
    svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${data.scale})`;
  }
}
