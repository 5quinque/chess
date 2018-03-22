// @format
'use strict';

class Interface {
  constructor(chess) {
    this.chess = chess;
    this.chess.setChessInterface(this);

    this.whiteBottom = true;
    this.chessboard = document.querySelector('.chessboard');
    this.current_drag = false;

    this.renderTiles();
    this.renderChessboard();

    //this.testing();
  }

  renderChessboard() {
    const chessObj = this.chess.getChessboardObj();
    const tiles = document.querySelectorAll('.chessboard > div');

    let piece;
    let colourAndType;

    let i = tiles.length;
    let j = -1;
    while (i--) {
      if (this.whiteBottom) {
        j++;
      } else {
        j = i;
      }
      if (!chessObj[j]) continue;

      piece = document.createElement('img');
      piece.src = `assets/Chess_Pieces_Sprite.svg#${chessObj[j]}`;
      piece.className = 'piece';

      // Drag/drop event handlers
      piece.draggable = true;
      piece.addEventListener('dragstart', this.dragstart_handler.bind(this));
      piece.addEventListener('dragend', this.dragend_handler.bind(this));
      //piece.addEventListener('click', this.click_handler.bind(this));

      tiles[i].appendChild(piece);
    }
  }

  dragstart_handler(ev) {
    this.current_drag = ev.target;
    ev.target.style.opacity = 0.5;

    const board_coord = ev.target.parentElement.id;
    const piece_type = this.chess.getChessPiece(board_coord);

    console.log(`${piece_type} from ${board_coord}`);
  }

  dragend_handler(ev) {
    ev.target.removeAttribute('style');
  }

  drop_handler(ev) {
    ev.preventDefault();
    let data = this.current_drag;

    // If you drop the piece back on itself
    if (ev.target.id === data) return;

    //
    // Check if the move is valid
    //

    // Remove the yellow background from our last moved piece
    if (this.lastMoveID) {
      document.getElementById(this.lastMoveID).removeAttribute('style');
    }

    ev.currentTarget.style.background = '#ffeaa7';
    this.lastMoveID = ev.currentTarget.id;

    console.log('to ', ev.currentTarget.id);

    ev.currentTarget.innerHTML = '';
    ev.currentTarget.appendChild(data);

    this.playSound('chess_move.wav');
  }

  playSound(soundFile) {
    var audio = new Audio(`assets/${soundFile}`);
    audio.volume = 0.2;
    audio.play();
  }

  dragover_handler(ev) {
    ev.preventDefault();
  }

  testing() {
    let knMoves = this.chess.pieces.WhiteKnight.knightMoves(
      this.chess.allWhitePieces(),
    );
    const moveObj = this.chess.getPieceObj(knMoves);

    const tiles = document.querySelectorAll('.chessboard > div');

    let i = tiles.length;
    let j = -1;

    while (i--) {
      if (this.whiteBottom) {
        j++;
      } else {
        j = i;
      }

      if (!moveObj[j]) continue;

      tiles[i].classList += ' possible';
    }
  }

  renderTiles() {
    let tile;
    const columns = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    for (let i = 64; i--; ) {
      tile = document.createElement('div');
      tile.id = `${columns[i % 8]}${Math.floor(i / 8) + 1}`;
      this.chessboard.appendChild(tile);

      tile.addEventListener('dragover', function(event) {
        event.preventDefault();
      });

      tile.addEventListener('dragenter', function(event) {
        event.target.style.background = 'purple';
      });

      tile.addEventListener('dragleave', function(event) {
        event.target.removeAttribute('style');
      });

      tile.addEventListener('drop', this.drop_handler.bind(this));
    }
  }
}

export default Interface;
