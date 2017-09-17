//96 px = 1 inch
var pixelDensity = document.getElementsByName("pixel-density")[0]
var squaresPerInch = Number(document.getElementsByName("pixel-density")[0].value);
var pixelGrid = document.getElementById("pixel-grid");
var colorPalette = document.getElementById("color-palette");
var wholeEditor = document.getElementsByClassName("edit-surround")[0];

window.addEventListener('resize', printGrid);
//pixelDensity.addEventListener('onchange', changeDensity);

function printGrid () {
  setGridHeight();
  drawGrid(squaresPerInch);
}

function changeDensity () {
  squaresPerInch = Number(document.getElementsByName("pixel-density")[0].value);
}

function drawGrid () {
  squaresPerInch = Number(document.getElementsByName("pixel-density")[0].value);
  let sideLength = 96 / squaresPerInch;
}

function setGridHeight () {
  var editorHeight = wholeEditor.clientHeight;
  var paletteHeight = colorPalette.clientHeight;
  pixelGrid.style.height = `calc(${editorHeight}px - 4vh - ${paletteHeight}px)`
}
