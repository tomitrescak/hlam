import { Binding } from "./Binding";
import { GoalStrategy } from "./Enums";
import { PlanAction } from "./PlanAction";

export type ViewDAO = {
  start: string[];
  goal: string[];
  goalStrategy: "final" | "first";
  view: string | null;
  // boundVariables: string[];
};

export class View {
  public start: PlanAction[];
  public goals: PlanAction[] | null;
  public goalStrategy: GoalStrategy;
  public view: PlanAction | null;
  // public boundVariables: string[];

  public finishedBindings: Binding[][] = [];

  public constructor(definition: ViewDAO) {
    var start = definition.start;
    if (typeof start === "string") {
      this.start = [new PlanAction(start)];
    } else {
      this.start = start.map((a) => new PlanAction(a));
    }

    var goal = definition.goal;
    if (goal != null) {
      if (typeof goal == "string") {
        this.goals = [new PlanAction(goal)];
      } else {
        this.goals = goal.map((a) => new PlanAction(a));
      }
    } else {
      this.goals = null;
    }

    this.view = definition.view ? new PlanAction(definition.view) : null;

    var strategyString = definition.goalStrategy
      ? definition.goalStrategy
      : null;
    this.goalStrategy =
      strategyString === "final" ? GoalStrategy.Final : GoalStrategy.First;

    // this.boundVariables = definition.bind
    //         ? definition.bind
    //         : null;
  }

  public isBound(binding: Binding[]) {
    return (
      this.finishedBindings.length > 0 &&
      this.finishedBindings.some((b) =>
        b.every((bi, i) => bi.value === binding[i].value)
      )
    );
  }
}
