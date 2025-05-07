const stateNames = Object.keys(STATES_INFO);
const svgContainer = document.querySelector("#svg-container");

const savedState = JSON.parse(
  window.localStorage.getItem("map:coords") || "{}"
);

function renderPiece(stateName, { width, height, order }, { x, y }) {
  const state = document.querySelector(`.state#${stateName}`);
  const stateImg = state?.children[0];
  if (stateImg) {
    const img = document.createElement("img");
    img.src = stateImg.getAttribute("src");
    img.setAttribute("id", stateName);
    img.width = width;
    img.height = height;
    img.style.zIndex = order;
    makeDraggable(img);
    svgContainer.appendChild(img);
    img.style.opacity = 0;
    img.setAttribute("style", `transform: translate(${x}px,${y}px)`);
    img.style.opacity = 1;
    //Hide piece from list
    state.classList.add("selected");
  }
}

function renderSavedPieces() {
  Object.keys(savedState).forEach((stateName) => {
    renderPiece(stateName, STATES_INFO[stateName], savedState[stateName]);
  });
}

function renderStateList() {
  const states = stateNames.map((stateName) => {
    return `<div class='state' id="${stateName}">
         <img src="images/states/${stateName}.png" draggable="true" id="${stateName}"  alt="${stateName}"/>
        
         <span>${stateName.split("-").join(" ")}</span>
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

renderStateList();
renderSavedPieces();

//MAP CHECKER FUNCTIONS

function showAlert(isSuccess) {
  const audioSrc = isSuccess ? "/audio/welldone.mp3" : "/audio/tryAgain.mp3";
  var audio = new Audio(audioSrc);
  alertMessage.textContent = isSuccess ? "Well Done!" : "Try Again!";
  alertMessage.style.color = isSuccess ? "green" : "#F44336"; // Green for success, red for try again
  alertBox.style.display = "flex";
  audio.play();
}

function getCenterCoordinates(state) {
  const pathElement = document.querySelector(`img#${state}`);
  const rect = pathElement.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return { x: centerX, y: centerY };
}

function getDistance(coordsA, coordsB) {
  const dx = coordsA.x - coordsB.x;
  const dy = coordsA.y - coordsB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const coords = {};
const distances = [];

function getStateOrder() {
  coords["ladakh"] = getCenterCoordinates("ladakh");
  stateNames.slice(0, stateNames.length).forEach((state, i) => {
    coords[state] = getCenterCoordinates(state);
    const distance = getDistance(coords["ladakh"], coords[state]);
    distances[i + 1] = { distance, state };
  });
  const order = distances
    .sort((a, b) => a.distance - b.distance)
    .map((distance, i) => ({
      order: i,
      state: distance.state,
      distance: distance.distance,
    }));
  return order;
}

function isCorrectlyArranged(array1, array2) {
  const length = Math.max(array1.length, array2.length);
  let correctCount = 0,
    incorrectCount = 0;
  const incorrects = [];

  for (let i = 0; i < length; i++) {
    const o1 = array1[i] || {};
    const o2 = array2[i] || {};

    const state1 = o1.state || null;
    const state2 = o2.state || null;
    const matched = state1 === state2;

    if (matched) {
      correctCount++;
    } else {
      incorrectCount++;
      incorrects.push([state1, state2]);
    }
  }

  if (incorrects.length === 2) {
    console.log("Fixing Exception case");
    const [arr1, arr2] = incorrects;
    const isSwappedMatch = arr1[0] === arr2[1] && arr1[1] === arr2[0];
    correctCount += isSwappedMatch ? 2 : 0;
  }
  console.log(correctCount === length, correctCount, length);
  return correctCount === length;
}

function check() {
  const order = getStateOrder();
  const isSuccess = isCorrectlyArranged(centerOrder, order);
  showAlert(isSuccess);
}

//BUTTON ACTIONS
function saveMap() {
  const coords = [...svgContainer.children].reduce((acc, element) => {
    const coord = getCurrentCoordinates(element);
    acc[element.id] = coord; // Use element's id as the key
    return acc;
  }, {});
  window.localStorage.setItem("map:coords", JSON.stringify(coords));
  alert("Saved successfully");
}

function restart() {
  window.location.reload();
}

function reset() {
  window.localStorage.removeItem("map:coords");
  restart();
}

//ATTACH EVENT LISTENERS

alertButton.addEventListener("click", () => {
  alertBox.style.display = "none";
  restart();
});

svgContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

svgContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const stateId = e.dataTransfer.getData("text/plain");
  const { width, height } = STATES_INFO[stateId];
  const rect = svgContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - width / 2;
  const offsetY = e.clientY - rect.top - height / 2;
  renderPiece(stateId, { width, height }, { x: offsetX, y: offsetY });
});
