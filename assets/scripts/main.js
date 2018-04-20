//96 px = 1 inch
var pixelDensity = document.getElementsByName("pixel-density")[0];
var squaresPerInch = Number(pixelDensity.value);
var pixelGrid = document.getElementById("pixel-grid");
var colorPalette = document.getElementById("color-palette");
var wholeEditor = document.getElementsByClassName("edit-surround")[0];
var defaultColor = "#ffffff";
var defaultOutlineColor = "#cccccc";
var currentlySelectedColor = "pink";
var keepColoring = false;
var keepDeleting = false;
var squaresX;
var squaresY;
var drawTimeout;
var colorToFillIn = '#ffffff';
var filling = false;

function setGridHeight () {
  var editorHeight = wholeEditor.clientHeight;
  var paletteHeight = colorPalette.clientHeight;
  pixelGrid.style.height = `calc(${editorHeight}px - 4vh - ${paletteHeight}px)`;
}
setGridHeight();

/* If user changes pixel/squares per inch, redraw grid */
pixelDensity.addEventListener('change', drawGrid);

// pixelGrid.addEventListener('keypress', function (event) {
//   filling = !filling;
// })
/************* Drawing Events ************/
pixelGrid.addEventListener('mousedown', function (event) {
  // if (filling & event.target.classList[0] === "grid-square") {
  //   let rowAndColumn = event.target.id.split("_");
  //   colorToFillIn = event.target.backgroundColor;
  //   let row = Number(rowAndColumn[0]);
  //   let column = Number(rowAndColumn[1]);
  //   recursiveFill(row, column);
  //   drawGrid();
  // } else {
    if (event.shiftKey) {
      keepDeleting = true;
    } else {
      keepColoring = true;
    }
    drawDelete(event);
  //}
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
      storeColor(event);
    }
  } else if (keepDeleting) {
    if (event.target.classList[0] === "grid-square") {
      event.target.style.backgroundColor = defaultColor;
      event.target.style.outlineColor = defaultOutlineColor;
      storeColor(event);
    }
  }
}
/***** End Drawing Events *****/

/* Color Picking Events */
colorPalette.addEventListener('click', function (event) {
  if (event.target.classList[0] = "swatch") {
    currentlySelectedColor = event.target.style.backgroundColor;
  }
})

var grid = {
  squareRowCol : []
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
        color : defaultColor,
        outlineColor : defaultOutlineColor,
      })
    }
  }
}
initGrid();

window.addEventListener('resize', function () {
  clearTimeout(drawTimeout);
  drawTimeout = setTimeout(printOnResize, 0);
});

function drawGrid () {
  pixelGrid.innerHTML = "";
  let wholeGrid = grid.squareRowCol;
  let innerRow = ""
  pixelDensity = document.getElementsByName("pixel-density")[0];
  squaresPerInch = Number(pixelDensity.value);
  let sideLength = 96 / squaresPerInch;
  let numRows = Math.floor(pixelGrid.clientHeight/ sideLength) - 1;
  let numCols = Math.floor(pixelGrid.clientWidth / sideLength) - 1;
  squaresY = numRows;
  squaresX = numCols;
  /*
  <div id="row_#" class=gridrow>
    <div id="row_col"></div>...
  </div>
  */
  for (let r = 0; r <= numRows; r++) {
    innerRow = "";
    for (let c = 0; c <= numCols; c++) {
      innerRow += `<div id=\"${r}_${c}\" class=\"grid-square ${wholeGrid[r][c].color}\" style=\"width: ${sideLength}px; height: ${sideLength}px; background-color: ${wholeGrid[r][c].color}; outline-color: ${wholeGrid[r][c].outlineColor}\"></div>`
    }
    pixelGrid.innerHTML += `<div id=\"grid-row-${r}\" class=\"grid-row\">${innerRow}</div>`;
  }
}
drawGrid();

function storeColor (event) {
  let rowAndColumn = event.target.id.split("_");
  let row = Number(rowAndColumn[0]);
  let column = Number(rowAndColumn[1]);
  let square = grid.squareRowCol[row][column];
  console.log(`${row}, ${column}`);
  console.log(square);
  square.color = event.target.style.backgroundColor;
  square.outlineColor = event.target.style.outlineColor;
}


/* If you will always be working with a grid that is as large as it can get, you can -probably- remove the 'else if's, add = to the > and < signs in the outer if statements, and add 'shortGrid[x][y] !== undefined && ' before the rest of the inner if statements */
function recursiveFill (r, c) {
  let shortGrid = grid.squareRowCol;
  let square = grid.squareRowCol[r][c];
  let rD = r - 1;
  let rU = r + 1;
  let cD = c - 1;
  let cU = c + 1;
  square.color = currentlySelectedColor;
  square.outlineColor = currentlySelectedColor;
  if (r > 0 && r < squaresY) {
    if (shortGrid[rU][c].color === colorToFillIn) {
      recursiveFill(rU, c);
    }
    if (shortGrid[rD][c].color === colorToFillIn) {
      recursiveFill(rD, c);
    }
  } else if (r === 0) {
    if (shortGrid[rU][c].color === colorToFillIn) {
      recursiveFill(rU, c);
    }
  } else if (r === squaresY) {
    if (shortGrid[rD][c].color === colorToFillIn) {
      recursiveFill(rD, c);
    }
  }
  if (c > 0 && c < squaresX) {
    if (shortGrid[r][cU].color === colorToFillIn) {
      recursiveFill(r, cU);
    }
    if (shortGrid[r][cD].color === colorToFillIn) {
      recursiveFill(r, cD);
    }
  } else if (c === 0) {
    if (shortGrid[r][cU].color === colorToFillIn) {
      recursiveFill(r, cU);
    }
  } else if (c === squaresX) {
    if (shortGrid[r][cU].color === colorToFillIn) {
      recursiveFill(r, cD);
    }
  }
}

function fillThatB (r, c) {
  recursiveFill(r,c);
  drawGrid();
}

function printOnResize () {
  setGridHeight();
  printGrid();
}

function printGrid () {
  setGridHeight();
  drawGrid();
}

function changeDensity () {
  squaresPerInch = Number(document.getElementsByName("pixel-density")[0].value);
}
