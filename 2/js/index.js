const container = document.querySelector("#container");
const instructionEl = document.querySelector(".instruction");

const svgMap = new SVGMap();
const mapPieces = new MapPieces({ containerRect: container.getBoundingClientRect()});

function showAlert(isSuccess) {
  const audioSrc = isSuccess ? "audio/welldone.mp3" : "audio/tryAgain.mp3";
  var audio = new Audio(audioSrc);
  alertMessage.textContent = isSuccess ? "Well Done!" : "Try Again!";
  alertMessage.style.color = isSuccess ? "green" : "#F44336"; // Green for success, red for try again
  alertBox.style.display = "flex";
  audio.play();
}

function setupInstructionModal() {
  instructionEl.children[0].children[1].innerHTML = ACTIVITY.instructions;
  instructionEl.classList.add("slide-left");
}

function toggleInstructionModal() {
  console.log("Clicked");
  if (instructionEl.classList.contains("slide-left")) {
    instructionEl.classList.add("slide-right");
    instructionEl.classList.remove("slide-left");
  } else {
    instructionEl.classList.add("slide-left");
    instructionEl.classList.remove("slide-right");
  }
}

function renderStateList() {
  const states = SUPPORTED_STATES.map((stateName) => {
    return `<div class='state' id="${stateName}">
         <img src="images/map/states/${stateName}.png" draggable="true" id="${stateName}"  alt="${stateName}"/>
    </div>`;
  });
  document.querySelector(".states").innerHTML = states.join(" ");

  // Add event listeners after rendering
  document.querySelectorAll(".state").forEach((state) => {
    state.children[0].addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });
}

//MAP CHECKER FUNCTIONS
function showStatusIcon(isCorrect, position) {
  const img = document.createElement("img");
  img.classList.add("popup-icon");
  img.classList.add("status-icon");
  img.classList.add(isCorrect ? "tick" : "cross");
  img.src = isCorrect ? `images/tick.png` : `images/cross.png`;
  img.style.transform = `translate(${position.x + position.width / 2 - 20}px,${
    position.y + position.height / 2 - 20
  }px)`;
  container.appendChild(img);
}

function isMostlyOverlapping(rect1, rect2) {
  // Find the coordinates of the intersection rectangle
  const xOverlap = Math.max(
    0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
      Math.max(rect1.x, rect2.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
      Math.max(rect1.y, rect2.y)
  );

  const intersectionArea = xOverlap * yOverlap;
  const area1 = rect1.width * rect1.height;
  const area2 = rect2.width * rect2.height;

  // Overlap percentage relative to the smaller rectangle
  const minArea = Math.min(area1, area2);
  const overlapPercent = (intersectionArea / minArea) * 100;

  return overlapPercent >= 90 && overlapPercent <= 100;
}

//BUTTON ACTIONS
function check() {
  const droppedImages = container.querySelectorAll(`div.drag-state`);
  const success = [...droppedImages].map((state) => {
    const id = state.getAttribute("id");
    var isCorrect = false;
    if (!id) return isCorrect;
    const draggedPieceRect = state.getBoundingClientRect();
    if (ACTIVITY.states.includes(id)) {
      const piece = container.querySelector(`path[id="${id}"]`);
      if (!piece) return false;
      const piecePathRect = piece.getBoundingClientRect();
      isCorrect = isMostlyOverlapping(draggedPieceRect, piecePathRect);
    }
    showStatusIcon(isCorrect, draggedPieceRect);
    return isCorrect;
  });
  const allPlaced = success.length === ACTIVITY.states.length;
  console.log(allPlaced);
  const status = success.some((success) => !success);
  showAlert(!status && allPlaced);
}

function saveMap() {
  const coords = [...container.children].reduce((acc, element, index) => {
    if (index === 0) return {};
    const coord = getCurrentCoordinates(element);
    acc[element.id] = coord; // Use element's id as the key
    return acc;
  }, {});
  window.localStorage.setItem("map:coords", JSON.stringify(coords));
  alert("Saved successfully");
}

function restart() {
  window.localStorage.removeItem("map:coords");
  window.location.reload();
}

function undo() {
  const stateName = mapPieces.lastDragged.pop();
  if (!stateName) return;
  document.querySelector(`div#${stateName}`).classList.remove("selected");
  container.querySelector(`div#${stateName}`).remove();
}

//ATTACH EVENT LISTENERS
alertButton.addEventListener("click", () => {
  alertBox.style.display = "none";
  restart();
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  e.preventDefault();
  const stateId = e.dataTransfer.getData("text/plain");
  mapPieces.renderPiece({stateName:stateId, scale:svgMap.resizedSVGRect.scale, mouseDrop:e});
});

document.addEventListener("DOMContentLoaded", async () => {
  await svgMap.render(container);
  renderStateList();
  mapPieces.renderSavedPieces(svgMap.resizedSVGRect.scale);
  setupInstructionModal();
});
