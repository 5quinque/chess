// @format
'use strict';

const Long = require('long');

import Pieces from './pieces.js';

class Chess {
  constructor() {
    this.ply = 0;

    // prettier-ignore
    const standardBoard = [
      'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
      'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
      ' ', ' ', 'N', ' ', ' ', ' ', ' ', ' ',
      'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P',
      'R', ' ', 'B', 'Q', 'K', 'B', 'N', 'R',
    ];

    this.pieces = new Pieces();

    // Build our bitboards
    this.arrayToChessBitboards(standardBoard);
    this.empty = new Long(0, 0);

    // This needs calling after every move
    this.getEmptyBitboard();

    this.testing();
  }

  /**
   *
   * @description Used during development to test methods
   */
  testing() {
    //console.log('White Knight Current');
    this.printBitboard(this.pieces.WhiteKnight, 'WhiteKnight');

    //let knAttack = this.pieces.WhiteKnight.knightAttacks(this.empty);
    //console.log('White Knight possible attack');
    //this.printBitboard(knAttack, 'WhiteKnight');

    //console.log('Black Knight Current');
    //this.printBitboard(this.pieces.BlackKnight, 'blackKnight');

    //let knbAttack = this.pieces.BlackKnight.knightAttacks(this.empty);
    //console.log('Black Knight possible attack');
    //this.printBitboard(knbAttack, 'blackKnight');

    let n = 'a5';
    let piece = this.getChessPiece(n);

    console.log(`${n} - ${piece}`);
  }

  /**
   * @param {string} Algebraic notation of the board
   * @returns {string} The type of piece on the given square
   */
  getChessPiece(notation) {
    let [file, rank] = notation.split('');
    file = file.charCodeAt(0) & 15;
    rank = Number(rank) - 1;

    let pieceType = 'empty';

    const flipAH = {
      1: 7,
      2: 6,
      3: 5,
      4: 4,
      5: 3,
      6: 2,
      7: 1,
      8: 0,
    };

    const index = rank * 8 + flipAH[file];

    let bit = new Long(1, 0, true).shiftLeft(index);

    self = this;
    const allPieces = [
      'BlackRook',
      'BlackKnight',
      'BlackBishop',
      'BlackQueen',
      'BlackKing',
      'BlackPawn',
      'WhiteRook',
      'WhiteKnight',
      'WhiteBishop',
      'WhiteQueen',
      'WhiteKing',
      'WhitePawn',
    ];

    allPieces.forEach(function(t) {
      if (!self.pieces[t].and(bit).isZero()) {
        pieceType = t;
        return;
      }
    });

    return pieceType;
  }

  /**
   * @param {long} bitboard that we count to count the bits of
   * @description Count the number of bits in a given bitboard
   * @returns {int} number of bits in bitboard
   */
  countBits(bitboard) {
    let count;
    for (count = 0; !bitboard.isZero(); count++)
      bitboard = bitboard.and(bitboard.subtract(1));
    return count;
  }

  /**
   *
   * @description Produce a bitboard of all empty spaces on the board
   */
  getEmptyBitboard() {
    this.empty = new Long(0, 0)
      .or(this.pieces.BlackRook)
      .or(this.pieces.BlackKnight)
      .or(this.pieces.BlackBishop)
      .or(this.pieces.BlackQueen)
      .or(this.pieces.BlackKing)
      .or(this.pieces.BlackPawn)
      .or(this.pieces.WhiteRook)
      .or(this.pieces.WhiteKnight)
      .or(this.pieces.WhiteBishop)
      .or(this.pieces.WhiteQueen)
      .or(this.pieces.WhiteKing)
      .or(this.pieces.WhitePawn)
      .not();
  }

  /**
   * @param {long} bitboard to print to console
   * @param {string} Chess symbol key for unicode
   * @description Print the given bitboard to the console
   */
  printBitboard(bitboard, unicodeKey) {
    /**
     * https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms
     * https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode
     */
    const unicode = {
      WhiteKing: 0x2654,
      WhiteQueen: 0x2655,
      WhiteRook: 0x2656,
      WhiteBishop: 0x2657,
      WhiteKnight: 0x2658,
      WhitePawn: 0x2659,
      BlackKing: 0x265a,
      BlackQueen: 0x265b,
      BlackRook: 0x265c,
      BlackBishop: 0x265d,
      BlackKnight: 0x265e,
      BlackPawn: 0x265f,
    };

    let line = '';
    let i;
    let oneBit;
    let unicodePiece = String.fromCharCode(unicode[unicodeKey]);
    let unicodeUnder = String.fromCharCode(0xff3f);

    let board = '%c';

    for (let y = 8; y--; ) {
      line = `${y + 1} `;
      for (let x = 8; x--; ) {
        i = y * 8 + x;

        oneBit = new Long(1, 0);
        oneBit = oneBit.shiftLeft(i);
        if (bitboard.and(oneBit).toString() != '0') {
          line += `|_${unicodePiece}_`;
        } else {
          line += `|_${unicodeUnder}_`;
        }
      }
      board += `${line}|\n`;
    }

    board += `  `;
    for (let i = 0xff21; i <= 0xff28; i++)
      board += `| ${String.fromCharCode(i)} `;
    board += `|\n`;
    console.log(`${board}\n`, 'font-size: 1.3em;');
  }

  arrayToBitboard(array) {
    let tempLong = new Long(0, 0, true);
    let bit;

    array.reverse();
    for (let i = 0; i < array.length; i++) {
      bit = new Long(1, 0, true).shiftLeft(i);
      if (array[i] === '1') tempLong.applyBit(bit);
    }

    return tempLong;
  }

  /**
   * @param {array} Chess board piece positions
   * @description Build all our bitboards
   */
  arrayToChessBitboards(boardArray) {
    let piece;

    const allPieces = {
      r: 'BlackRook',
      n: 'BlackKnight',
      b: 'BlackBishop',
      q: 'BlackQueen',
      k: 'BlackKing',
      p: 'BlackPawn',
      R: 'WhiteRook',
      N: 'WhiteKnight',
      B: 'WhiteBishop',
      Q: 'WhiteQueen',
      K: 'WhiteKing',
      P: 'WhitePawn',
    };

    boardArray.reverse();

    for (let i = 0; i < boardArray.length; i++) {
      piece = new Long(1, 0).shiftLeft(i);

      if (allPieces[boardArray[i]]) {
        this.pieces[allPieces[boardArray[i]]].applyBit(piece);
        continue;
      }
    }
  }
}

export default Chess;
