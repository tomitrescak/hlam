import { Binding } from "./Binding";
import { GoalStrategy } from "./Enums";
import { PlanInterpreter } from "./PlanInterpreter";
import { PlanLine } from "./PlanLine";
import { Scenario } from "./Scenario";
import { View } from "./View";

export class InterpretedScenario {
  // private Scenario scenario;
  private text: string;
  private lines: PlanLine[];

  public scenarios: InterpretedScenario[];

  public constructor(
    interpreter: PlanInterpreter,
    lines: PlanLine[],
    scenario: Scenario,
    bindings: Binding[]
  ) {
    this.scenarios = [];
    this.lines = [];

    // create the text
    this.text = scenario.description;
    if (this.text != null) {
      for (var b of bindings) {
        this.text = this.text.replace("!" + b.variable, b.value);
      }
    }

    // process the views
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      ////////////////////////////////////////////////////
      // if this is a final plan view, add all matching plan lines
      ////////////////////////////////////////////////////

      if (scenario.plan != null) {
        this.checkAddPlanLine(scenario, line, bindings);
      }

      /////////////////////////////////////////////////////
      // process view find all plan subsets in all views
      ////////////////////////////////////////////////////

      for (var s = 0; s < scenario.views.length; s++) {
        var view = scenario.views[s];
        var startBind = this.checkStartMatch(view, line, bindings);

        // we did not find the starting line
        if (startBind == null) {
          continue;
        }

        // we may have finished processing the plan
        if (view.isBound(startBind)) {
          continue;
        }

        // if we found a startLine we find the finish

        var lineSet: PlanLine[] = [];
        var goalBind: Binding[] | null = null;

        // we mark that we are taking everything from this line forward  in the list of lines from start to goal
        var goalLineStart = i;

        ///////////////////////////////////////////////////////////////////////////////////////////////////
        // !IMPORTANT - If we have no goal, we take only the first line and continue execution
        //            - Otherwise we wil try to find the final goal
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        if (view.goals == null) {
          // we check that the existing binding from start as goal does not exist
          goalBind = startBind.map((b) => b.clone());

          // we only add one line and that is a start line, since we have no goal
          lineSet.push(lines[i]);
        } else {
          // copy all lines from start to goal to the output and create a new view from it
          goalBind = this.findLinesTillGoal(
            lines,
            i,
            view,
            startBind,
            lineSet,
            goalLineStart
          );
        }

        // if we found a goal, we can now

        if (view.view != null) {
          if (goalBind != null) {
            this.expandScenario(interpreter, view, lineSet, goalBind);
          } else {
            throw new Error("Could not find the goal state");
          }
        }

        // we mark this as finished so no more processing is done on this view
        if (view.goalStrategy === GoalStrategy.Final) {
          view.finishedBindings.push(startBind);
        }
      }
    }
  }

  private checkAddPlanLine(
    scenario: Scenario,
    line: PlanLine,
    bindings: Binding[]
  ) {
    // currently support only anyOf
    if (
      scenario.plan?.items?.some((m) => {
        try {
          return line.matchesLine(m.action, bindings) != null;
        } catch (e) {
          console.log(e);
        }
        return false;
      })
    ) {
      this.lines.push(line);
    }
  }

  private checkStartMatch(
    view: View,
    line: PlanLine,
    bindings: Binding[]
  ): Binding[] | null {
    var startBind: Binding[] | null = null;

    // find a starting line
    for (let start of view.start) {
      startBind = line.matchesLine(start, bindings);
      if (startBind != null) {
        return startBind;
      }
    }
    return null;
  }

  private findLinesTillGoal(
    lines: PlanLine[],
    i: number,
    view: View,
    startBind: Binding[],
    lineSet: PlanLine[],
    goalLineStart: number
  ): Binding[] | null {
    let goalBind: Binding[] | null = null;
    for (let j = i + 1; j < lines.length; j++) {
      let matchedGoal: Binding[] | null = null;

      // match any of the goals
      matchedGoal = lines[j].matchesLines(view.goals, startBind);

      // if we are ok with first matching goal we stopt the execution, otherwise we will try to match the last possible goal
      if (matchedGoal != null) {
        // remember this goal
        goalBind = matchedGoal;

        // add all lines until current goal
        for (var l = goalLineStart; l <= j; l++) {
          lineSet.push(lines[l]);
          goalLineStart = j + 1;
        }

        if (view.goalStrategy === GoalStrategy.First) {
          break;
        }
      }
    }
    return goalBind;
  }

  private expandScenario(
    interpreter: PlanInterpreter,
    view: View,
    lineSet: PlanLine[],
    goalBind: Binding[]
  ): void {
    var referenceScenario = interpreter.interpretations.find(
      (k) => k.id === view.view!.name
    );

    if (referenceScenario == null) {
      throw new Error("View does not exist: " + view.view!.name);
    }
    this.scenarios.push(
      new InterpretedScenario(interpreter, lineSet, referenceScenario, goalBind)
    );
  }

  getText(): string {
    return this.text;
  }

  setText(text: string) {
    this.text = text;
  }
}
