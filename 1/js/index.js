const states = document.querySelectorAll(".state");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
const alertButton = document.getElementById("alertButton");
const screenContainer = document.querySelector(".screen");
const mapContainer = document.querySelector(".map");
const instructionEl = document.querySelector(".instruction");

var percentageElement = null; //display zoom percentage
var zoomButtons = null;

const circleMap = new Map();
const pathMap = new Map();
const dropZoneTextMap = new Map();

const data = {
  randomStates: [],
  dragged: [],
  scale: 1,
  minScale: 1,
  maxScale: 2,
  scaleStep: 0.2,
  passed: false,
};

/**
 * Render svg map on screen
 */
async function renderMap() {
  await fetch("images/map.svg")
    .then((res) => res.text())
    .then((res) => {
      mapContainer.innerHTML = `${res} <div class="zooms">
            <button id="zoom-out" onclick="zoomOut()"><span>-</span></button>
            <!--<span>0%</span>-->
            <button id="zoom-in" onclick="zoomIn()"><span>+</span></button>
          </div>`;

      zoomButtons = mapContainer.children[1];
      zoomButtons.children[0].disabled = true;
      percentageElement = zoomButtons.children[1];
    })
    .catch((error) => {
      alert("Error loading SVG:", error);
    });
}

/**ELEMENT MAP START*/
function mapCircleElements() {
  const circles = document.querySelectorAll("circle[data-state]");
  circles.forEach((circle) => {
    circleMap.set(circle.getAttribute("data-state"), circle);
  });
}

function mapPathElements() {
  const paths = document.querySelectorAll("path[data-state]");
  paths.forEach((path) => {
    pathMap.set(path.getAttribute("data-state"), path);
  });
}

/**ELEMENT MAP END*/

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

function updatePositionOfAllDroppedTexts() {
  //const droppedTexts = document.querySelectorAll(".drop-zone-text");
  dropZoneTextMap.forEach((droppedText, originalStateName) => {
    //Update circle drop zone style
    const circleElement = circleMap.get(originalStateName);
    const rect = circleElement.getBoundingClientRect(); // Get the bounding rectangle
    const xPosition = rect.left + window.scrollX; // X position relative to the document
    const yPosition = rect.top + window.scrollY;
    droppedText.style.top = `${yPosition}px`;
    droppedText.style.left = `${xPosition - rect.width / 2}px`;
  });
}

var percentTimer = null;
function updateZoomPercentage() {
  clearInterval(percentTimer);
  percentTimer = setTimeout(() => {
    const percentage =
      ((data.scale - data.minScale) / (data.maxScale - data.minScale)) * 100;
    percentageElement.textContent = `${Math.round(percentage)}%`;
  }, 120);
}

function updateZoomButtons() {
  const [zoomOutBtn, zoomInBtn] = [...zoomButtons.children];

  // Disable zoom out if at or below min scale
  if (data.scale <= data.minScale) {
    zoomOutBtn.disabled = true;
  } else {
    zoomOutBtn.disabled = false;
  }

  // Disable zoom in if at or above max scale
  if (data.scale >= data.maxScale) {
    zoomInBtn.disabled = true;
  } else {
    zoomInBtn.disabled = false;
  }
}

function zoomIn() {
  const svgElement = mapContainer.children[0];
  if (data.scale < data.maxScale) {
    data.scale += data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    //updateZoomPercentage();
    updateZoomButtons();
    if (data.scale >= data.maxScale) {
      zoomButtons.children[1].disabled = true;
    }
  }
}

function zoomOut() {
  console.log("Clicked zoomOut");
  const svgElement = mapContainer.children[0];
  if (data.scale > data.minScale) {
    data.scale -= data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    //updateZoomPercentage();
    updateZoomButtons();
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
    : getRandomStates(DATA_LIST, ACTIVITY.randomStatesCount);
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
  const lastDrop = data.dragged.pop();
  if (!lastDrop) return;
  const zone = pathMap.get(lastDrop.place);
  //Change zone bg color
  zone.classList.remove("area-dropped");
  zone.classList.remove("area-hover");
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
  pathMap.forEach((zone, originalState) => {
    zone.classList.remove("correct");
    zone.classList.remove("incorrect");
    zone.classList.remove("area-dropped");
    zone.classList.remove("area-hover");
    const answeredState = zone.getAttribute("user-ans");
    if (!answeredState) return;
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
    const zone = pathMap.get(stateName);
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

function updateMapCircle(stateName, show) {
  //Update circle drop zone style
  const circleElement = circleMap.get(stateName);
  if (!show) {
    circleElement.classList.add("circle-dropped");
  } else {
    circleElement.classList.remove("circle-dropped");
  }
  return circleElement;
}

function updateDragElement(draggedState, show) {
  //Hide dragged element from source container
  const stateElement = document.querySelector(
    `.state[data-state="${draggedState}"]`
  );
  stateElement.setAttribute("draggable", show ? "true" : "false");
  stateElement.style.display = show ? "block" : "none";
}

function setupDropZones() {
  pathMap.forEach((zone, originalState) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (zone.getAttribute("user-ans")) return;
      zone.classList.add("area-hover");
    });

    zone.addEventListener("dragleave", () => {
      if (zone.getAttribute("user-ans")) return;
      zone.classList.remove("area-hover");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      if (zone.getAttribute("user-ans")) return;
      const droppedState = e.dataTransfer.getData("text/plain");
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
      mapContainer.appendChild(dropText);
      dropZoneTextMap.set(originalState, dropText);

      //Hide dragged element from source container
      updateDragElement(droppedState, false);
      //Zone will map area
      zone.classList.add("area-dropped");
      zone.setAttribute("user-ans", droppedState);
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

  console.log(svgBBox);
  console.log(containerWidth, containerHeight);

  const scaleX = containerWidth / svgBBox.width;
  const scaleY = containerHeight / svgBBox.height;

  console.log(scaleX, scaleY);

  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  //svgElement.setAttribute("transform", `scale(${scale + 0.1})`);
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

  mapCircleElements();
  mapPathElements();

  setupDropDrag();
  setupDropZones();

  generateAndRenderStates();
  toggleInstructionModal();
});
