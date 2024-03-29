import type { Card } from "./Card";

export class Lane {
  cards: Card[]
  hidden: Card[]

  constructor(hidden: Card[], cards: Card[]) {
    this.hidden = hidden;
    this.cards = cards;
  }

  isEmpty(): boolean {
    return this.hidden.length === 0 && this.cards.length === 0;
  }

  canAddCard(card: Card): boolean {
    if (!this.cards.length) return false;

    const topCard = this.cards[this.cards.length - 1];

    return topCard.n - 1 === card.n && topCard.isRed() !== card.isRed()
  }

  popHidden(): void {
    if (this.cards.length === 0 && this.hidden.length) {
      this.cards.push(this.hidden.pop()!)
    }
  }
}
