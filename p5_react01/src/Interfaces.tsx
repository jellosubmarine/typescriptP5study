export interface ICostProvider {

  costBetween(from: State, to: State): Cost;
  draw(p5: p5Types): void;
}