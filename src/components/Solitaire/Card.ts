export class Card {
  suit: string
  n: number

  constructor(suit: string, n: number) {
    this.suit = suit;
    this.n = n;
  }

  isRed(): boolean {
    return this.suit === "hearts" || this.suit === "diamonds";
  }
}
