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
    var def = inter.views;

    this.interpretations = def.map((i) => new Scenario(i));
  }

  public interpret(plan: PlanSource): InterpretedScenario[] {
    var topLevelInterpretations = this.interpretations.filter(
      (p) => p.parameters == null
    );
    var scenarios: InterpretedScenario[] = [];

    for (var i of topLevelInterpretations) {
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
