// @format
'use strict';

const Long = require('long');

class Pieces {
  constructor() {
    Long.prototype.applyBit = this.applyBit;
    Long.prototype.updateLong = this.updateLong;
    Long.prototype.popBit = this.popBit;
    Long.prototype.northEastOne = this.northEastOne;
    Long.prototype.northWestOne = this.northWestOne;

    Long.prototype.northNorthEast = this.northNorthEast;
    Long.prototype.northNorthWest = this.northNorthWest;
    Long.prototype.southSouthEast = this.southSouthEast;
    Long.prototype.southSouthWest = this.southSouthWest;
    Long.prototype.northEastEast = this.northEastEast;
    Long.prototype.northWestWest = this.northWestWest;
    Long.prototype.southEastEast = this.southEastEast;
    Long.prototype.southWestWest = this.southWestWest;

    Long.prototype.advancePawn = this.advancePawn;
    Long.prototype.pawnAttacks = this.pawnAttacks;
    Long.prototype.knightMoves = this.knightMoves;
    Long.prototype.knightAttacks = this.knightAttacks;
    Long.prototype.colour = 0;

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
  }

  /**
   * @param {long} bit to be set in long
   * @description apply a bit on out bitboard
   */
  applyBit(bit) {
    const tempLong = this.xor(bit);
    this.updateLong(tempLong);
  }

  /**
   * @param {long}
   * @description Update our Long object with given values
   */
  updateLong(tempLong) {
    this.low = tempLong.low;
    this.high = tempLong.high;
    this.unsigned = tempLong.unsigned;
  }

  /**
   *
   * @description Pop the least significant bit
   */
  popBit() {
    let index;
    let popped = this.and(new Long(0, 0, true).subtract(this));

    for (index = 0; !popped.isZero(); index++)
      popped = popped.shiftRightUnsigned(1);

    // Actually pop it
    this.updateLong(this.and(this.subtract(1)));

    return index;
  }

  knightMoves(teamPieces) {
    const oneEast = this.northNorthEast().or(this.southSouthEast());
    const oneWest = this.northNorthWest().or(this.southSouthWest());
    const twoEast = this.northEastEast().or(this.southEastEast());
    const twoWest = this.northWestWest().or(this.southWestWest());

    return oneEast
      .or(oneWest)
      .or(twoEast)
      .or(twoWest)
      .and(teamPieces.not());
  }

  knightAttacks(teamPieces, opponentPieces) {
    const moves = this.knightMoves(teamPieces);

    return moves.and(opponentPieces);
  }

  northNorthEast() {
    const aFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    return this.shiftLeft(15).and(aFile);
  }
  northNorthWest() {
    const hFile = new Long(0xfefefefe, 0xfefefefe, true);
    return this.shiftLeft(17).and(hFile);
  }
  southSouthEast() {
    const aFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    return this.shiftRight(17).and(aFile);
  }
  southSouthWest() {
    const hFile = new Long(0xfefefefe, 0xfefefefe, true);
    return this.shiftRight(15).and(hFile);
  }
  northEastEast() {
    const aFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    const bFile = new Long(0xbfbfbfbf, 0xbfbfbf, true);
    return this.shiftLeft(6)
      .and(aFile)
      .and(bFile);
  }
  northWestWest() {
    const hFile = new Long(0xfefefefe, 0xfefefefe, true);
    const gFile = new Long(0xfdfdfdfd, 0xfdfdfdfd, true);
    return this.shiftLeft(10)
      .and(hFile)
      .and(gFile);
  }
  southEastEast() {
    const aFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    const bFile = new Long(0xbfbfbfbf, 0xbfbfbf, true);
    return this.shiftRight(10)
      .and(aFile)
      .and(bFile);
  }
  southWestWest() {
    const hFile = new Long(0xfefefefe, 0xfefefefe, true);
    const gFile = new Long(0xfdfdfdfd, 0xfdfdfdfd, true);
    return this.shiftRight(6)
      .and(hFile)
      .and(gFile);
  }

  /**
   *
   * @description Advance a pawn bitboard by one row
   * @returns {long} bitboard containing all possible pawn attacks
   */
  pawnAttacks(empty) {
    return this.northEastOne()
      .or(this.northWestOne())
      .and(empty);
  }

  /**
   *
   * @description Move bitboard northeast by one rank
   * @returns {long} bitboard shifted northeast
   */
  northEastOne() {
    const hFile = new Long(0xfefefefe, 0xfefefefe, true);
    return this.shiftLeft(9)
      .shiftRightUnsigned(this.colour << 4)
      .and(hFile);
  }
  /**
   *
   * @description Move bitboard northwest by one rank
   * @returns {long} bitboard shifted northwest
   */
  northWestOne() {
    const aFile = new Long(0x7f7f7f7f, 0x7f7f7f7f, true);
    return this.shiftLeft(7)
      .shiftRightUnsigned(this.colour << 4)
      .and(aFile);
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
}

export default Pieces;
