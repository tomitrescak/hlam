import { Binding } from "./Binding";
import { PlanAction } from "./PlanAction";

function getIndexOf(strings: string[], item: string): number {
  for (let i = 0; i < strings.length; i++) {
    if (item === strings[i]) return i;
  }
  return -1;
}

export class PlanLine {
  public time: number;
  public action: string;
  public parameters: string[];
  public cost: number;

  public constructor(line: string) {
    let parts = line.split(":");

    this.time = parseFloat(parts[0]);
    parts = parts[1].split("[");

    let bodyString = parts[0];
    bodyString = bodyString.replace("(", "");
    bodyString = bodyString.replace(")", "");

    let body = bodyString.split(" ").filter((s) => s.length > 0);
    this.parameters = body.slice(1).map((b) => b.trim());
    this.action = body[0].trim();

    parts[1] = parts[1].trim();
    this.cost = parseFloat(parts[1].substring(0, parts[1].length - 1));
  }

  public get text() {
    return `${this.action} ${this.parameters.join(" ")}`;
  }

  static empty: Binding[] = [];

  public matchesLines(
    lines: PlanAction[] | null,
    bindings: Binding[]
  ): Binding[] | null {
    if (lines == null) {
      return null;
    }
    for (let line of lines) {
      let match = this.matchesLine(line, bindings);
      if (match != null) {
        return match;
      }
    }
    return null;
  }

  public matchesLine(
    line: PlanAction | null,
    bindings: Binding[]
  ): Binding[] | null {
    if (line == null || this.action != line.name) {
      return null;
    }
    if (this.parameters.length != line.parameters.length) {
      return null;
    }

    // check all bound variables
    for (let i = 0; i < line.bound.length; i++) {
      let b = line.bound[i];

      let binding = bindings.filter((bi) => bi.variable == b)[0];
      if (binding == null) {
        throw new Error(
          "Expected bound variable " + b + " does not exist in bindings"
        );
      }

      let index = getIndexOf(line.parameters, b);
      if (this.parameters[index] != binding.value) {
        return null;
      }
    }

    // add new bindings
    let newBindings: Binding[] = [];
    for (let b of line.bind) {
      let index = getIndexOf(line.parameters, b);
      newBindings.push(new Binding(b, this.parameters[index]));
    }

    // add existing bindings
    // browse the new bindings and only add it if does not exist previously
    for (let binding of bindings) {
      let exists = newBindings.some((s) => s.variable === binding.variable);
      if (!exists) {
        newBindings.push(new Binding(binding.variable, binding.value));
      }
    }
    return newBindings.length == 0 ? PlanLine.empty : newBindings;
  }
}
