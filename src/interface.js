// @format
'use strict';

class Interface {
  constructor(chess) {
    this.chess = chess;

    this.whiteBottom = true;

    this.chessboard = document.querySelector('.chessboard');
    this.renderTiles();

    this.renderChessboard();

    this.testing();

    this.chess.setChessInterface(this);

    this.sendCommand('uci');
  }

  sendCommand(command) {
    this.chess.receiveCommand(`${command}\n`);
  }

  receiveCommand(command) {
    command = command.replace('\n', '');
    console.log(`UI Received Command: ${command}`);
  }

  renderChessboard() {
    const chessObj = this.chess.getChessboardObj();
    let piece;
    let colourAndType;

    const tiles = document.querySelectorAll('.chessboard > div');

    let i = tiles.length;
    let j = -1;

    while (i--) {
      if (this.whiteBottom) {
        j++;
      } else {
        j = i;
      }
      if (!chessObj[j]) {
        continue;
      }

      piece = document.createElement('img');
      piece.src = `assets/Chess_Pieces_Sprite.svg#${chessObj[j]}`;
      piece.className = 'piece';
      tiles[i].appendChild(piece);
    }

    //console.log(chessObj);
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
    self = this;
    const columns = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    for (let i = 64; i--; ) {
      tile = document.createElement('div');
      tile.id = `${columns[i % 8]}${Math.floor(i / 8) + 1}`;
      this.chessboard.appendChild(tile);

      // Add our drag/drop event handlers
      //tile.ondrop = function(event) {
      //  self.drop_handler(event);
      //};
      //tile.ondragover = function(event) {
      //  self.dragover_handler(event);
      //};
    }
  }
}

export default Interface;
