import { PlanLine } from "./PlanLine";

export class PlanSource {
  public lines: PlanLine[];

  public constructor(definition: string) {
    this.lines = definition
      .trim()
      .split("\n")
      .map((l) => new PlanLine(l));
  }

  public getCost(): number {
    return this.lines
      .map((l) => l.cost)
      .reduce((subtotal, n) => subtotal + n, 0);
  }
}
