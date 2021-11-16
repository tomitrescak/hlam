import { Binding } from "./Binding";
import { PlanAction } from "./PlanAction";

function getIndexOf(strings: string[], item: string): number {
  for (var i = 0; i < strings.length; i++) {
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
    var parts = line.split(":");

    this.time = parseFloat(parts[0]);
    parts = parts[1].split("[");

    var bodyString = parts[0];
    bodyString = bodyString.replace("(", "");
    bodyString = bodyString.replace(")", "");

    var body = bodyString.split(" ").filter((s) => s.length > 0);
    this.parameters = body.slice(1).map((b) => b.trim());
    this.action = body[0].trim();

    parts[1] = parts[1].trim();
    this.cost = parseFloat(parts[1].substring(0, parts[1].length - 1));
  }

  static empty: Binding[] = [];

  public matchesLines(
    lines: PlanAction[] | null,
    bindings: Binding[]
  ): Binding[] | null {
    if (lines == null) {
      return null;
    }
    for (var line of lines) {
      var match = this.matchesLine(line, bindings);
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
    for (var i = 0; i < line.bound.length; i++) {
      var b = line.bound[i];

      var binding = bindings.filter((bi) => bi.variable == b)[0];
      if (binding == null) {
        throw new Error(
          "Expected bound variable " + b + " does not exist in bindings"
        );
      }

      var index = getIndexOf(line.parameters, b);
      if (this.parameters[index] != binding.value) {
        return null;
      }
    }

    // add new bindings
    var newBindings: Binding[] = [];
    for (var b of line.bind) {
      var index = getIndexOf(line.parameters, b);
      newBindings.push(new Binding(b, this.parameters[index]));
    }

    // add existing bindings
    // browse the new bindings and only add it if does not exist previously
    for (var binding of bindings) {
      var exists = newBindings.some((s) => s.variable === binding.variable);
      if (!exists) {
        newBindings.push(new Binding(binding.variable, binding.value));
      }
    }
    return newBindings.length == 0 ? PlanLine.empty : newBindings;
  }
}
