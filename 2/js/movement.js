function getCurrentCoordinates(element) {
  const coords = { x: 0, y: 0 };
  const transform = element
    .getAttribute("style")
    .replace("transform:translate", "");
  if (transform) {
    const match = transform.match(
      /translate\(\s*([-\d.]+)px\s*,\s*([-\d.]+)px\s*\)/
    );
    if (match) {
      coords.x = parseFloat(match[1]);
      coords.y = parseFloat(match[2]);
    }
  }
  return coords;
}

function makeDraggable(element) {
  let isDragging = false;
  let startX, startY;
  let currentTransform = { x: 0, y: 0 };

  function startDrag(x, y) {
    isDragging = true;
    startX = x;
    startY = y;
    currentTransform = getCurrentCoordinates(element);
  }

  function dragMove(x, y) {
    if (!isDragging) return;
    const dx = x - startX;
    const dy = y - startY;
    element.setAttribute(
      "style",
      `transform: translate(${currentTransform.x + dx}px, ${
        currentTransform.y + dy
      }px)`
    );
  }

  function endDrag() {
    isDragging = false;
  }

  // Mouse events
  element.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    dragMove(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", () => {
    endDrag();
  });

  // Touch events
  element.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  });

  element.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    dragMove(touch.clientX, touch.clientY);
  });

  element.addEventListener("touchend", () => {
    endDrag();
  });
}
