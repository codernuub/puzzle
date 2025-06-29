class SVGMap {
  resizedSVGRect = null;

  calculateSVGResize(containerRect, svg) {
    const svgWidth = svg.width.baseVal.value;
    const svgHeight = svg.height.baseVal.value;
    const scaleX = containerRect.width / svgWidth;
    const scaleY = containerRect.height / svgHeight;
    const scale = Math.min(scaleX, scaleY);

    const result = {
      scale,
      originalWidth: svgWidth,
      originalHeight: svgHeight,
      width: svgWidth * scale,
      height: svgHeight * scale,
    };

    result.mapScale = {
      scaleX: result.width / result.originalWidth,
      scaleY: result.height / result.originalHeight,
    };

    return result;
  }

  calculateTranslateCoords(containerRect, resizedSVGRect) {
    const x = (containerRect.width - resizedSVGRect.width) / 4;
    const y = (containerRect.height - resizedSVGRect.height) / 4;
    return { x, y };
  }

  //Fetch and render map svg on screen
  async render(container) {
    await fetch("images/map/outline-map.svg")
      .then((response) => response.text())
      .then((svgText) => {
        container.children[0].innerHTML = svgText;
        const svg = container.children[0].children[0];
        const containerRect = container.getBoundingClientRect();
        this.resizedSVGRect = this.calculateSVGResize(containerRect, svg);
        const coords = this.calculateTranslateCoords(
          containerRect,
          this.resizedSVGRect
        );
        svg.style.transform = `scale(${this.resizedSVGRect.scale})`;
        svg.classList.add("svg");
        const cont = container.children[0];
        console.log(cont);
        cont.style.width = `${this.resizedSVGRect.width}px`;
        cont.style.height = `${this.resizedSVGRect.height}px`;
        //svg.style.marginTop = coords.y;
        //svg.style.marginLeft = coords.x;
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }
}
