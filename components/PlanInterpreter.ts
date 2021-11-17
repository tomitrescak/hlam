import { InterpretedScenario } from "./InterpretedScenario";
import { PlanLine } from "./PlanLine";
import { PlanSource } from "./PlanSource";
import { Scenario, ScenarioDAO } from "./Scenario";

type InterpretationDAO = {
  views: ScenarioDAO[];
};

export class PlanInterpreter {
  public interpretations: Scenario[];

  public constructor(inter: InterpretationDAO) {
    let def = inter.views;

    this.interpretations = def.map((i) => new Scenario(i));
  }

  public interpret(plan: PlanSource): InterpretedScenario[] {
    // top level interpretations are those which do not have bound variables
    let topLevelInterpretations = this.interpretations.filter((p) =>
      p.views.some((v) => v.start.every((s) => s.bound.length == 0))
    );
    let scenarios: InterpretedScenario[] = [];

    for (let i of topLevelInterpretations) {
      scenarios.push(this.interpretScenario(plan.lines, i));
    }
    return scenarios;
  }

  private interpretScenario(
    lines: PlanLine[],
    scenario: Scenario
  ): InterpretedScenario {
    return new InterpretedScenario(this, lines, scenario, []);
  }
}
