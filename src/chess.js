// @format
'use strict';

const Long = require('long');

class Chess {
  constructor() {
    this.ply = 0;

    this.BlackRook = new Long(0, 0, true);
    this.BlackKnight = new Long(0, 0, true);
    this.BlackBishop = new Long(0, 0, true);
    this.BlackQueen = new Long(0, 0, true);
    this.BlackKing = new Long(0, 0, true);
    this.BlackPawn = new Long(0, 0, true);
    this.WhiteRook = new Long(0, 0, true);
    this.WhiteKnight = new Long(0, 0, true);
    this.WhiteBishop = new Long(0, 0, true);
    this.WhiteQueen = new Long(0, 0, true);
    this.WhiteKing = new Long(0, 0, true);
    this.WhitePawn = new Long(0, 0, true);

    // prettier-ignore
    const standardBoard = [
      'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
      'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
      'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R',
    ];

    // Build our bitboards
    this.arrayToBitboards(standardBoard);
    this.empty = new Long(0, 0);

    // This needs calling after every move
    this.getEmptyBitboard();
  }

  testing() {
    //console.log(typeof this.WhitePawn);
    this.WhitePawn = this.popBit(this.WhitePawn);
    this.printBitboard(this.WhitePawn);

    //console.log(this.countBits(this.WhitePawn));
    //console.log(this.countBits(this.BlackRook));
    //this.printBitboard(this.empty);

    //let colour;
    //console.log('White Pawn Advance 1');
    //colour = 0;
    //this.WhitePawn = this.advancePawn(this.WhitePawn, colour);
    //this.printBitboard(this.WhitePawn);

    //console.log('Black Pawn Advance 1');
    //colour = 1;
    //this.BlackPawn = this.advancePawn(this.BlackPawn, colour);
    //this.printBitboard(this.BlackPawn);
    //
    //console.log('Black Rook');
    //this.printBitboard(this.BlackRook);
  }

  /**
   *
   * @description Pop the least significant bit
   */
  popBit(bitboard) {
    return bitboard.and(bitboard.subtract(1));
  }

  /**
   *
   * @description Count the number of bits in a given bitboard
   */
  countBits(bitboard) {
    let count;
    for (let count = 0; !bitboard.isZero(); count++)
      bitboard = bitboard.and(bitboard.subtract(1));
    return count;
  }

  /**
   *
   * @description Advance a pawn bitboard by one row
   */
  advancePawn(pawns, colour) {
    return pawns
      .shiftLeft(8)
      .shiftRightUnsigned(colour << 4)
      .and(this.empty);
  }

  /**
   *
   * @description Produce a bitboard of all empty spaces on the board
   */
  getEmptyBitboard() {
    this.empty = new Long(0, 0)
      .or(this.BlackRook)
      .or(this.BlackKnight)
      .or(this.BlackBishop)
      .or(this.BlackQueen)
      .or(this.BlackKing)
      .or(this.BlackPawn)
      .or(this.WhiteRook)
      .or(this.WhiteKnight)
      .or(this.WhiteBishop)
      .or(this.WhiteQueen)
      .or(this.WhiteKing)
      .or(this.WhitePawn)
      .not();
  }

  /**
   *
   * @description Print the given bitboard to the console
   */
  printBitboard(bitboard) {
    let line = '';
    let i;
    let oneBit;

    let board = '';

    for (let y = 8; y--; ) {
      line = `${y + 1} `;
      for (let x = 8; x--; ) {
        i = y * 8 + x;

        oneBit = new Long(1, 0);
        oneBit = oneBit.shiftLeft(i);
        if (bitboard.and(oneBit).toString() != '0') {
          line += `| x `;
        } else {
          line += `|   `;
        }
      }
      board += `${line}|\n`;
    }

    board += '- + A - B - C - D - E - F - G - H +\n';
    console.log(`${board}\n`);
  }

  /**
   *
   *
   */
  arrayToBitboards(boardArray) {
    let oneBit;
    boardArray.reverse();

    for (let i = 0; i < boardArray.length; i++) {
      oneBit = new Long(1, 0);
      oneBit = oneBit.shiftLeft(i);

      switch (boardArray[i]) {
        case 'r':
          this.BlackRook = this.BlackRook.xor(oneBit);
          break;
        case 'n':
          this.BlackKnight = this.BlackKnight.xor(oneBit);
          break;
        case 'b':
          this.BlackBishop = this.BlackBishop.xor(oneBit);
          break;
        case 'q':
          this.BlackQueen = this.BlackQueen.xor(oneBit);
          break;
        case 'k':
          this.BlackKing = this.BlackKing.xor(oneBit);
          break;
        case 'p':
          this.BlackPawn = this.BlackPawn.xor(oneBit);
          break;
        case 'R':
          this.WhiteRook = this.WhiteRook.xor(oneBit);
          break;
        case 'N':
          this.WhiteKnight = this.WhiteKnight.xor(oneBit);
          break;
        case 'B':
          this.WhiteBishop = this.WhiteBishop.xor(oneBit);
          break;
        case 'Q':
          this.WhiteQueen = this.WhiteQueen.xor(oneBit);
          break;
        case 'K':
          this.WhiteKing = this.WhiteKing.xor(oneBit);
          break;
        case 'P':
          this.WhitePawn = this.WhitePawn.xor(oneBit);
          break;
      }
    }
  }
}

export default Chess;
