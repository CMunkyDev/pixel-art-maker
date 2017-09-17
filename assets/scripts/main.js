//96 px = 1 inch
var pixelDensity = document.getElementsByName("pixel-density")[0];
var squaresPerInch = Number(pixelDensity.value);
var pixelGrid = document.getElementById("pixel-grid");
var colorPalette = document.getElementById("color-palette");
var wholeEditor = document.getElementsByClassName("edit-surround")[0];
var defaultColor = "#fff";
var defaultOutlineColor = "ccc";
var currentlySelectedColor = "#000";
var keepColoring = false;
var keepDeleting = false;

function setGridHeight () {
  var editorHeight = wholeEditor.clientHeight;
  var paletteHeight = colorPalette.clientHeight;
  pixelGrid.style.height = `calc(${editorHeight}px - 4vh - ${paletteHeight}px)`;
}
setGridHeight();

pixelDensity.addEventListener('change', drawGrid);

pixelGrid.addEventListener('mousedown', function (event) {
  if (event.shiftKey) {
    keepDeleting = true;
  } else {
    keepColoring = true;
  }
  drawDelete(event);
})
pixelGrid.addEventListener('mouseup', function (event) {
  keepColoring = false;
  keepDeleting = false;
})
pixelGrid.addEventListener('mouseover', drawDelete);

function drawDelete(event) {
  if (keepColoring) {
    if (event.target.classList[0] === "grid-square") {
      event.target.style.backgroundColor = currentlySelectedColor;
      event.target.style.outlineColor = currentlySelectedColor;
    }
  } else if (keepDeleting) {
    if (event.target.classList[0] === "grid-square") {
      event.target.style.backgroundColor = defaultColor;
      event.target.style.outlineColor = defaultOutlineColor;
    }
  }
}

var grid = {
  squareRowCol : [],
  squareColor : "#fff",
  borderColor : "#ccc"
}

function initGrid () {
  let minSideLength = 96 / Number(pixelDensity.lastElementChild.value);
  let maxHeight = window.screen.availHeight;
  let maxWidth = window.screen.availWidth;
  let numRows = Math.floor(maxHeight / minSideLength);
  let numCols = Math.floor(maxWidth / minSideLength);

  for (let i = 0; i < numRows; i++) {
    grid.squareRowCol.push([]);
    for (let j = 0; j < numCols; j++) {
      grid.squareRowCol[i].push({
        color : defaultColor
      })
    }
  }
}
initGrid();

window.addEventListener('resize', printOnResize);
//pixelDensity.addEventListener('onchange', changeDensity);

function drawGrid () {
  pixelGrid.innerHTML = "";
  let wholeGrid = grid.squareRowCol;
  let innerRow = ""
  pixelDensity = document.getElementsByName("pixel-density")[0];
  squaresPerInch = Number(pixelDensity.value);
  let sideLength = 96 / squaresPerInch;
  let numRows = Math.floor(pixelGrid.clientHeight/ sideLength) - 1;
  let numCols = Math.floor(pixelGrid.clientWidth / sideLength) - 1;
  /*
  <div id="row_#" class=gridrow>
    <div id="row_col"></div>...
  </div>
  */
  for (let r = 0; r <= numRows; r++) {
    innerRow = "";
    for (let c = 0; c <= numCols; c++) {
      innerRow += `<div id=\"${r}_${c}\" class=\"grid-square ${wholeGrid[r][c].color}\" style=\"width: ${sideLength}px; height: ${sideLength}px; background-color: ${defaultColor}; outline-color: ${defaultOutlineColor}\"></div>`
    }
    pixelGrid.innerHTML += `<div id=\"grid-row-${r}\" class=\"grid-row\">${innerRow}</div>`;
  }
}
drawGrid();

function printOnResize () {
  setGridHeight();
  let poot = setTimeout(printGrid, 10);
}

function printGrid () {
  setGridHeight();
  drawGrid();
  //drawGrid(squaresPerInch);
}

function changeDensity () {
  squaresPerInch = Number(document.getElementsByName("pixel-density")[0].value);
}
