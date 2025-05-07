const states = document.querySelectorAll(".state");
const dropZones = document.querySelectorAll(".drop-zone");
const alertBox = document.getElementById("alertBox");
const alertMessage = document.getElementById("alertMessage");
const alertButton = document.getElementById("alertButton");
const mapContainer = document.querySelector(".map");
const svgElement = mapContainer.children[0];

const data = {
  randomStates: [],
  scale: 1,
  minScale: 1,
  maxScale: 2,
  scaleStep: 0.2,
};

function updateZoomPercentage() {
  mapContainer.children[1].children[1].textContent = `${Math.round(
    (data.scale - 1 / data.minScale) * 100
  )}%`;
}
function zoomIn() {
  if (data.scale < data.maxScale) {
    data.scale += data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    updateZoomPercentage();
  }
}

function zoomOut() {
  if (data.scale > data.minScale) {
    data.scale -= data.scaleStep;
    svgElement.style.transform = `scale(${data.scale})`;
    updatePositionOfAllDroppedTexts();
    updateZoomPercentage();
  }
}

// Function to get 10 random states
function getRandomStates(states, count = 10) {
  const shuffled = [...states.filter(state => !state.disabled)].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to render states inside the states div
function generateAndRenderStates() {
  const statesContainer = document.querySelector(".states");
  statesContainer.innerHTML = ""; // Clear existing states
  data.randomStates = getRandomStates(statesData);
  data.randomStates.forEach((state) => {
    const div = document.createElement("div");
    div.className = "state";
    div.setAttribute("draggable", "true");
    div.setAttribute("data-state", state.dataState);
    div.textContent = state.name;
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", state.dataState);
    });
    statesContainer.appendChild(div);
  });
}
// Function to show the alert
function showAlert(isSuccess) {
  const audioSrc = isSuccess ? "../audio/welldone.mp3" : "../audio/tryAgain.mp3";
  var audio = new Audio(audioSrc);
  alertMessage.textContent = isSuccess ? "Well Done!" : "Try Again!";
  alertMessage.style.color = isSuccess ? "green" : "#F44336"; // Green for success, red for try again
  alertBox.style.display = "flex";
  audio.play();
}

function reset() {
  window.location.reload();
}

function restart() {
  dropZones.forEach((zone) => {
    zone.classList.remove("correct");
    zone.classList.remove("incorrect");
    const answeredState = zone.getAttribute("user-ans");
    if (!answeredState) return;
    const originalState = zone.getAttribute("data-state");
    zone.style.fill = "#ffffff";
    zone.style.stroke = "#0f0f0f";
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

function check() {
  var correct = 0;

  data.randomStates.forEach((state) => {
    const zone = document.querySelector(
      `path[data-state="${state.dataState}"]`
    );
    if (!zone) return;
    if (zone.getAttribute("data-state") === zone.getAttribute("user-ans")) {
      correct += 1;
      zone.classList.add("correct");
    } else {
      zone.classList.add("incorrect");
    }
  });

  const isSuccess =
    correct && correct === data.randomStates.length ? true : false;
  showAlert(isSuccess);
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

// Call the function to render
generateAndRenderStates();

function updateMapCircle(stateName, show) {
  //Update circle drop zone style
  const circleElement = document.querySelector(
    `circle[data-state="${stateName}"]`
  );
  circleElement.style.fill = "none";
  circleElement.style.stroke = show ? "goldenrod" : "none";
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
    //Update drop zone style
    if (originalState === "Puducherry") {
      //zone will circle, need to access map area
      const pathElement = document.querySelector(
        `path[data-state="${originalState}"]`
      );
      pathElement.style.fill = "#007bff";
      pathElement.style.stroke = "#ffffff";
      pathElement.setAttribute("user-ans", droppedState);
      zone.setAttribute("user-ans", droppedState);
    } else {
      //Zone will map area
      zone.style.fill = "#007bff";
      zone.style.stroke = "#ffffff";
      zone.setAttribute("user-ans", droppedState);
    }
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
  });
});

mapContainer.addEventListener("scroll", updatePositionOfAllDroppedTexts);

alertButton.addEventListener("click", () => {
  window.location.reload();
});
