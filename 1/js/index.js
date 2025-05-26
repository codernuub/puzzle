const states = document.querySelectorAll(".state");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
const alertButton = document.getElementById("alertButton");
const mapContainer = document.querySelector(".map");
const instructionEl = document.querySelector(".instruction");

const data = {
  randomStates: [],
  dragged: [],
  scale: 1,
  minScale: 1,
  maxScale: 2,
  scaleStep: 0.2,
  passed: false,
};

async function renderMap() {
  await fetch("images/map.svg")
    .then((res) => res.text())
    .then((res) => {
      mapContainer.innerHTML = `${res} <div class="zooms">
            <button onclick="zoomOut()"><span>-</span></button>
            <span>0%</span>
            <button onclick="zoomIn()"><span>+</span></button>
          </div>`;
    })
    .catch((error) => {
      alert("Error loading SVG:", error);
    });
}

function setupInstructionModal() {
  instructionEl.children[0].children[1].innerHTML = ACTIVITY.instruction;
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

function updateZoomPercentage() {
  mapContainer.children[1].children[1].textContent = `${Math.round(
    (data.scale - 1 / data.minScale) * 100
  )}%`;
}
function zoomIn() {
  const svgElement = mapContainer.children[0];
  if (data.scale < data.maxScale) {
    data.scale += data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    updateZoomPercentage();
  }
}

function zoomOut() {
  const svgElement = mapContainer.children[0];
  if (data.scale > data.minScale) {
    data.scale -= data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    updateZoomPercentage();
  }
}

// Function to get 10 random states
function getRandomStates(states, count = 10) {
  const shuffled = states.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to render states inside the states div
function generateAndRenderStates() {
  const statesContainer = document.querySelector(".states");
  statesContainer.innerHTML = "";
  data.randomStates = ACTIVITY.states.length
    ? ACTIVITY.states
    : getRandomStates(statesData, ACTIVITY.randomStatesCount);
  data.randomStates.forEach((stateName) => {
    const div = document.createElement("div");
    div.className = "state";
    div.setAttribute("draggable", "true");
    div.setAttribute("data-state", stateName);
    div.textContent = stateName;
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", stateName);
    });
    statesContainer.appendChild(div);
  });
}
// Function to show the alert
function showAlert(isSuccess) {
  const audioSrc = isSuccess ? "audio/welldone.mp3" : "audio/tryAgain.mp3";
  var audio = new Audio(audioSrc);
  alertMessage.textContent = isSuccess ? "Well Done!" : "Try Again!";
  alertMessage.style.color = isSuccess ? "green" : "#F44336"; // Green for success, red for try again
  alertBox.style.display = "flex";
  audio.play();
}

function undo() {
  //window.location.reload();
  const lastDrop = data.dragged.pop();
  if (!lastDrop) return;
  const zone = document.querySelector(`path[data-state="${lastDrop.place}"]`);
  //Change zone bg color
  zone.style.stroke = "#ffffff";
  zone.style.fill = "#c3cf6b";
  zone.removeAttribute("user-ans");
  //Show cirle
  updateMapCircle(lastDrop.place, true);
  //Remove text
  const textDiv = document.querySelector(
    `.drop-zone-text[original-state="${lastDrop.place}"]`
  );
  if (textDiv) textDiv.remove();
  updateDragElement(lastDrop.piece, true);
}

function tryAgain() {
  const dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach((zone) => {
    zone.classList.remove("correct");
    zone.classList.remove("incorrect");
    const answeredState = zone.getAttribute("user-ans");
    if (!answeredState) return;
    const originalState = zone.getAttribute("data-state");
    zone.style.fill = "#c3cf6b";
    zone.style.stroke = "#ffffff";
    zone.removeAttribute("user-ans", "");
    //Remove text div
    const textDiv = document.querySelector(
      `div[original-state="${originalState}"]`
    );
    if (textDiv) textDiv.remove();
    //Show circle
    updateMapCircle(originalState, true);
    //Display source
    updateDragElement(answeredState, true);
  });
}

function restart() {
  window.location.reload();
}

function check() {
  var correct = 0;

  data.randomStates.forEach((stateName) => {
    const zone = document.querySelector(`path[data-state="${stateName}"]`);
    if (!zone) return;
    if (zone.getAttribute("data-state") === zone.getAttribute("user-ans")) {
      correct += 1;
      zone.classList.add("correct");
    } else {
      zone.classList.add("incorrect");
    }
  });

  data.passed = correct && correct === data.randomStates.length ? true : false;
  showAlert(data.passed);
}

function updatePositionOfAllDroppedTexts() {
  const droppedTexts = document.querySelectorAll(".drop-zone-text");
  droppedTexts.forEach((droppedText) => {
    //Update circle drop zone style
    const circleElement = document.querySelector(
      `circle[data-state="${droppedText.getAttribute("original-state")}"]`
    );
    const rect = circleElement.getBoundingClientRect(); // Get the bounding rectangle
    const xPosition = rect.left + window.scrollX; // X position relative to the document
    const yPosition = rect.top + window.scrollY;
    droppedText.style.top = `${yPosition}px`;
    droppedText.style.left = `${xPosition - rect.width / 2}px`;
  });
}

function updateMapCircle(stateName, show) {
  //Update circle drop zone style
  const circleElement = document.querySelector(
    `circle[data-state="${stateName}"]`
  );
  circleElement.style.fill = "none";
  circleElement.style.stroke = show ? "grey" : "none";
  return circleElement;
}

function updateDragElement(draggedState, show) {
  //Hide dragged element from source container
  const stateElement = document.querySelector(
    `.state[data-state="${draggedState}"]`
  );
  stateElement.setAttribute("draggable", show ? "true" : "false");
  stateElement.style.opacity = show ? "1" : "0";
}

function setupDropZones() {
  const dropZones = document.querySelectorAll(".drop-zone");
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (zone.getAttribute("user-ans")) return;
      zone.style.stroke = "#007bff";
    });

    zone.addEventListener("dragleave", () => {
      if (zone.getAttribute("user-ans")) return;
      zone.style.stroke = "#ffffff";
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      if (zone.getAttribute("user-ans")) return;
      const droppedState = e.dataTransfer.getData("text/plain");
      const originalState = zone.getAttribute("data-state");
      //Hide dragged element from source container
      updateDragElement(droppedState, false);
      //Zone will map area
      zone.style.fill = "#007bff";
      zone.style.stroke = "#ffffff";
      zone.setAttribute("user-ans", droppedState);
      //Update circle drop zone style
      const circleElement = updateMapCircle(originalState, false);
      //Create and show text element
      const dropText = document.createElement("div");
      dropText.classList.add("drop-zone-text");
      const rect = circleElement.getBoundingClientRect(); // Get the bounding rectangle
      const xPosition = rect.left + window.scrollX; // X position relative to the document
      const yPosition = rect.top + window.scrollY;
      dropText.setAttribute("original-state", originalState);
      dropText.style.top = `${yPosition}px`;
      dropText.style.left = `${xPosition - rect.width / 2}px`;
      dropText.innerText = droppedState;
      document.querySelector(".map").appendChild(dropText);

      //Store pieces to revert
      data.dragged.push({ place: originalState, piece: droppedState });
    });
  });
}

function scaleSVGToFit() {
  const svgElement = mapContainer.children[0];
  const svgBBox = svgElement.getBBox(); // Get bounding box of SVG content
  const containerWidth = mapContainer.clientWidth;
  const containerHeight = mapContainer.clientHeight;

  const scaleX = containerWidth / svgBBox.width;
  const scaleY = containerHeight / svgBBox.height;

  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  svgElement.setAttribute("transform", `scale(${scale + 0.1})`);
}

mapContainer.addEventListener("scroll", updatePositionOfAllDroppedTexts);

alertButton.addEventListener("click", () => {
  if (data.passed) {
    restart();
  } else {
    tryAgain();
  }
  alertBox.style.display = "none";
});

document.addEventListener("DOMContentLoaded", async () => {
  await renderMap();
  scaleSVGToFit();
  setupDropDrag();
  setupDropZones();
  generateAndRenderStates();
  toggleInstructionModal();
});
