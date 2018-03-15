// @format
'use strict';

const Long = require('long');

class Chess {
  constructor() {
    Long.prototype.applyBit = this.applyBit;
    Long.prototype.updateLong = this.updateLong;
    Long.prototype.popBit = this.popBit;
    Long.prototype.advancePawn = this.advancePawn;
    Long.prototype.attackPawn = this.attackPawn;
    Long.prototype.colour = 0;

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

    // 1 = black, 0 = white
    this.BlackRook.colour = 1;
    this.BlackKnight.colour = 1;
    this.BlackBishop.colour = 1;
    this.BlackQueen.colour = 1;
    this.BlackKing.colour = 1;
    this.BlackPawn.colour = 1;
    this.WhiteRook.colour = 0;
    this.WhiteKnight.colour = 0;
    this.WhiteBishop.colour = 0;
    this.WhiteQueen.colour = 0;
    this.WhiteKing.colour = 0;
    this.WhitePawn.colour = 0;

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

    // prettier-ignore
    const examplePawnArray = [
      '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0',
      '0', '0', '1', '0', '0', '0', '0', '0',
      '1', '1', '0', '1', '0', '1', '1', '1',
      '0', '0', '0', '0', '0', '0', '0', '0',
    ];

    this.examplePawn = this.arrayToBitboard(examplePawnArray);

    // Build our bitboards
    this.arrayToChessBitboards(standardBoard);
    this.empty = new Long(0, 0);

    // This needs calling after every move
    this.getEmptyBitboard();

    this.testing();
  }

  testing() {
    //console.log(typeof this.WhitePawn);
    //this.WhitePawn = this.popBit(this.WhitePawn);
    //this.printBitboard(this.WhitePawn);

    //console.log(this.countBits(this.WhitePawn));
    //console.log(this.countBits(this.BlackRook));
    //this.printBitboard(this.empty);

    //console.log('White Pawn Advance 1');
    //this.printBitboard(this.WhitePawn);
    //this.WhitePawn.advancePawn(this.empty);
    //this.printBitboard(this.WhitePawn);

    //let possibleBlackPawnMoves = this.BlackPawn.advancePawn(this.empty);
    //console.log('Black Pawn Current');
    //this.printBitboard(this.BlackPawn);
    //console.log('Black Pawn Advance 1');
    //this.printBitboard(possibleBlackPawnMoves);

    //let possibleWhitePawnMoves = this.WhitePawn.advancePawn(this.empty);
    //console.log('White Pawn Current');
    //this.printBitboard(this.WhitePawn);
    //console.log('White Pawn Advance 1');
    //this.printBitboard(possibleWhitePawnMoves);
    //

    //console.log('White Pawn Current');
    //this.printBitboard(this.WhitePawn);

    //let pwAttack = this.WhitePawn.attackPawn(this.empty);
    //console.log('White Pawn Attack');
    //this.printBitboard(pwAttack);

    console.log('cpw example pawns');
    this.printBitboard(this.examplePawn);

    let pwAttack = this.examplePawn.attackPawn(this.empty);
    console.log('cpw example all attacks');
    this.printBitboard(pwAttack);

    //this.singlePush(this.WhitePawn);
  }

  /**
   *
   * @description Advance a pawn bitboard by one row
   */
  attackPawn(empty) {
    const notAFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    const notHFile = new Long(0xfefefefe, 0xfefefefe, true);

    const east = this.shiftLeft(9)
      .shiftRightUnsigned(this.colour << 4)
      .and(empty)
      .and(notHFile);

    const west = this.shiftLeft(7)
      .shiftRightUnsigned(this.colour << 4)
      .and(empty)
      .and(notAFile);

    return east.or(west);
  }

  /**
   *
   * @description Move a single target forward
   */
  //singlePush(bitboard) {
  //const rank3 = new Long(0x00000000ff000000, 0, true);

  ////rank3.shiftLeft(5);

  //this.printBitboard(rank3);
  //console.log(rank3.toString());
  //}

  /**
   *
   * [TODO] return the index of the popped bit?
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
  advancePawn(empty) {
    return this.shiftLeft(8)
      .shiftRightUnsigned(this.colour << 4)
      .and(empty);
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
   * @description apply a bit on out bitboard
   */
  applyBit(bit) {
    const tempLong = this.xor(bit);
    this.updateLong(tempLong);
  }

  arrayToBitboard(array) {
    let tempLong = new Long(0, 0, true);
    let bit;

    array.reverse();

    for (let i = 0; i < array.length; i++) {
      bit = new Long(1, 0, true).shiftLeft(i);

      if (array[i] === '1') {
        tempLong.applyBit(bit);
      }
    }

    return tempLong;
  }

  /**
   *
   * @description Build all our bitboards
   */
  arrayToChessBitboards(boardArray) {
    let piece;
    boardArray.reverse();

    for (let i = 0; i < boardArray.length; i++) {
      piece = new Long(1, 0).shiftLeft(i);

      // prettier-ignore
      switch (boardArray[i]) {
        case 'r': this.BlackRook.applyBit(piece);
          break;
        case 'n': this.BlackKnight.applyBit(piece);
          break;
        case 'b': this.BlackBishop.applyBit(piece);
          break;
        case 'q': this.BlackQueen.applyBit(piece);
          break;
        case 'k': this.BlackKing.applyBit(piece);
          break;
        case 'p': this.BlackPawn.applyBit(piece);
          break;
        case 'R': this.WhiteRook.applyBit(piece);
          break;
        case 'N': this.WhiteKnight.applyBit(piece);
          break;
        case 'B': this.WhiteBishop.applyBit(piece);
          break;
        case 'Q': this.WhiteQueen.applyBit(piece);
          break;
        case 'K': this.WhiteKing.applyBit(piece);
          break;
        case 'P': this.WhitePawn.applyBit(piece);
          break;
      }
    }
  }

  /**
   *
   * @description Update our Long object with given values
   */
  updateLong(tempLong) {
    this.low = tempLong.low;
    this.high = tempLong.high;
    this.unsigned = tempLong.unsigned;
  }
}

export default Chess;
