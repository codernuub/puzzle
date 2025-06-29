class MapPieces {
  lastDragged = [];
  savedPieces = {};
  containerRect = {};
  saveKey = "map:coords";

  constructor({ containerRect }) {
    this.containerRect = containerRect;
    this.savedPieces = JSON.parse(
      window.localStorage.getItem(this.saveKey) || "{}"
    );
  }

  #getResizedImageDims(id, imageDims, scale = 1) {
    const mapPathEl = document.querySelector(`path[id="${id}"]`);
    const bbox = mapPathEl.getBBox();
    const resizeFactor = {
      x: imageDims.width / bbox.width,
      y: imageDims.height / bbox.height,
    };

    return {
      width: (imageDims.width / resizeFactor.x) * scale,
      height: (imageDims.height / resizeFactor.y) * scale,
    };
  }

  renderSavedPieces(scale) {
    Object.keys(this.savedPieces).forEach((stateName) => {
      this.lastDragged.push(stateName);
      this.renderPiece({
        stateName,
        scale,
        offset: this.savedPieces[stateName],
      });
    });
  }

  renderPiece({ stateName, scale = 1, mouseDrop, offset }) {
    const state = document.querySelector(`.state#${stateName}`);
    const stateImg = state?.children[0];
    if (stateImg) {
      const outerEl = document.createElement("div");
      outerEl.classList.add("drag-state");
      outerEl.setAttribute("id", stateName);

      //Create Image Element
      const imageDims = { width: 0, height: 0 };
      const image = new Image();
      image.src = stateImg.getAttribute("src");
      image.onload = () => {
        const { width, height } = this.#getResizedImageDims(
          stateName,
          {
            width: image.width,
            height: image.height,
          },
          scale
        );
        imageDims.width = width;
        imageDims.height = height;
        image.width = imageDims.width;

        outerEl.appendChild(image);
        //Create Text Element
        if (ACTIVITY.showStateName) {
          const p = document.createElement("p");
          p.textContent = stateName.split("-").join(" ");
          const x = (imageDims.width - p.clientWidth) / 2;
          const y = (imageDims.height - p.clientHeight) / 2;
          p.style.transform = `translate(${x}px,-${y}px)`;
          outerEl.appendChild(p);
        }
        makeDraggable(outerEl);
        container.appendChild(outerEl);
        outerEl.style.opacity = 0;
        const x =
          offset?.x ||
          mouseDrop.clientX - this.containerRect.left - imageDims.width / 2;
        const y =
          offset?.y ||
          mouseDrop.clientY - this.containerRect.top - imageDims.height / 2;
        outerEl.setAttribute("style", `transform: translate(${x}px,${y}px)`);
        outerEl.style.opacity = 1;
        //Hide piece from list
        state.classList.add("selected");
        //Store last dragged
        this.lastDragged.push(stateName);
      };
    }
  }
}
