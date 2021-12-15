import { Binding } from "./Binding";
import { PlanAction } from "./PlanAction";

type GoalStrategy = "first" | "final";

export type ViewDAO = {
  start: string[];
  goal: string[];
  goalStrategy: GoalStrategy;
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
    let start = definition.start;
    if (typeof start === "string") {
      this.start = [new PlanAction(start)];
    } else {
      this.start = start.map((a) => new PlanAction(a));
    }

    let goal = definition.goal;
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

    if (definition.goalStrategy) {
      this.goalStrategy = definition.goalStrategy;
    } else {
      this.goalStrategy = "first";
    }

    // this.boundVariables = definition.bind
    //         ? definition.bind
    //         : null;
  }

  public isBound(binding: Binding[]) {
    return (
      this.finishedBindings.length > 0 &&
      this.finishedBindings.some((b) => {
        // filter bindings

        let boundVariables = this.goals!.flatMap((g) => g.bound);
        let myFilteredBindings =
          boundVariables.length > 0
            ? b.filter((bi) => boundVariables.indexOf(bi.variable) >= 0)
            : b;

        return myFilteredBindings.every((bi) => {
          let myValue = bi.value;
          let theirValue = binding.find(
            (bb) => bb.variable === bi.variable
          )?.value;
          return myValue === theirValue;
        });
      })
    );
  }
}
