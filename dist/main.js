/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chess.js":
/*!**********************!*\
  !*** ./src/chess.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// @format


class Piece {
  constructor(chess, position) {
    this.chess = chess;
    this.position = position;
    this.type = this.chess.getPieceType(position);

    this.renderPiece();
  }

  renderPiece() {
    const tile = document.getElementById(this.position);
    const piece = document.createElement('img');
    piece.src = `Chess_Pieces_Sprite.svg#${this.type}`;
    piece.id = `${this.type}-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
    piece.className = 'piece';
    tile.appendChild(piece);

    // Drag/drop event handlers
    piece.draggable = true;
    piece.addEventListener('drag', this.chess.drag_handler.bind(this));
    piece.addEventListener(
      'dragstart',
      this.chess.dragstart_handler.bind(this),
    );
    piece.addEventListener('click', this.chess.click_handler.bind(this));
  }

  test() {
    console.log(this.type, this.position);
  }
}

class Chess {
  constructor() {
    this.lastMoveID = false;
    this.chessboard = document.querySelector('.chessboard');
    this.renderTiles();

    this.startingPositions = {
      a8: 'black-rook',
      b8: 'black-knight',
      c8: 'black-bishop',
      d8: 'black-queen',
      e8: 'black-king',
      f8: 'black-bishop',
      g8: 'black-knight',
      h8: 'black-rook',
      a7: 'black-pawn',
      b7: 'black-pawn',
      c7: 'black-pawn',
      d7: 'black-pawn',
      e7: 'black-pawn',
      f7: 'black-pawn',
      g7: 'black-pawn',
      h7: 'black-pawn',
      a1: 'white-rook',
      b1: 'white-knight',
      c1: 'white-bishop',
      d1: 'white-queen',
      e1: 'white-king',
      f1: 'white-bishop',
      g1: 'white-knight',
      h1: 'white-rook',
      a2: 'white-pawn',
      b2: 'white-pawn',
      c2: 'white-pawn',
      d2: 'white-pawn',
      e2: 'white-pawn',
      f2: 'white-pawn',
      g2: 'white-pawn',
      h2: 'white-pawn',
    };

    this.pieces = [];
    this.renderChessPieces();

    this.currentDrag = false;
  }

  getPieceType(position) {
    return this.startingPositions[position];
  }

  renderTiles() {
    let tile;
    self = this;
    const columns = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    for (let i = 64; i--; ) {
      tile = document.createElement('div');
      tile.id = `${columns[i % 8]}${Math.floor(i / 8) + 1}`;
      this.chessboard.appendChild(tile);

      // Add our drag/drop event handlers
      tile.ondrop = function(event) {
        self.drop_handler(event);
      };
      tile.ondragover = function(event) {
        self.dragover_handler(event);
      };
    }
  }

  renderChessPieces() {
    let piece;
    self = this;
    Object.keys(this.startingPositions).forEach(function(pos) {
      self.pieces.push(new Piece(self, pos));
    });
  }

  click_handler(ev) {
    console.log(this);
    let parentElement = ev.target.parentElement;

    // Show valid moves..?
    const matches = parentElement.id.match(/(\w)(\d+)/);
    let col = matches[1];
    let row = Number(matches[2]);

    const up = document.getElementById(`${col}${row + 1}`);
    const down = document.getElementById(`${col}${row - 1}`);
    const left = document.getElementById(
      `${String.fromCharCode(col.charCodeAt(0) - 1)}${row}`,
    );
    const right = document.getElementById(
      `${String.fromCharCode(col.charCodeAt(0) + 1)}${row}`,
    );

    if (up) if (up.innerHTML.length === 0) up.innerHTML = 'U';
    if (down) if (down.innerHTML.length === 0) down.innerHTML = 'D';
    if (left) if (left.innerHTML.length === 0) left.innerHTML = 'L';
    if (right) if (right.innerHTML.length === 0) right.innerHTML = 'R';
  }

  drag_handler(ev) {
    //console.log("Drag");
  }

  dragstart_handler(ev) {
    //console.log('dragStart');
    //console.log(ev.srcElement);
    ev.dataTransfer.setData('image', ev.target.id);

    this.chess.currentDrag = this;
  }

  drop_handler(ev) {
    // ev.target
    // ev.currentTarget
    //
    let data = ev.dataTransfer.getData('image');
    this.currentDrag.test();
    this.currentDrag.position = ev.currentTarget.id;
    this.currentDrag.test();

    ev.preventDefault();

    // If you drop the piece back on itself
    if (ev.target.id === data) return;

    // Check if the move is valid
    // [TODO]

    // Remove the yellow background from our last moved piece
    if (this.lastMoveID) {
      document.getElementById(this.lastMoveID).removeAttribute('style');
    }

    ev.currentTarget.style.background = '#ffeaa7';
    this.lastMoveID = ev.currentTarget.id;

    ev.currentTarget.innerHTML = '';

    ev.currentTarget.appendChild(document.getElementById(data));
  }

  dragover_handler(ev) {
    //console.log("dragOver");
    ev.preventDefault();
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Chess);


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chess_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chess.js */ "./src/chess.js");
// @format




var chess = new _chess_js__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ })

/******/ });
//# sourceMappingURL=main.js.map