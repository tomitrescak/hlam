import { Binding } from "./Binding";
import { GoalStrategy } from "./Enums";
import { PlanAction } from "./PlanAction";

type StrategyDAO = {
  type: "final" | "first";
  filter: string[] | undefined;
};

export type ViewDAO = {
  start: string[];
  goal: string[];
  goalStrategy: StrategyDAO;
  view: string | null;
  // boundVariables: string[];
};

type Strategy = {
  type: GoalStrategy;
  filter?: string[] | undefined;
};

export class View {
  public start: PlanAction[];
  public goals: PlanAction[] | null;
  public goalStrategy: Strategy;
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
      this.goalStrategy = {
        type:
          definition.goalStrategy.type === "final"
            ? GoalStrategy.Final
            : GoalStrategy.First,
        filter: definition.goalStrategy.filter,
      };
    } else {
      this.goalStrategy = {
        type: GoalStrategy.First,
      };
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
        let myFilteredBindings = this.goalStrategy.filter
          ? b.filter(
              (bi) => this.goalStrategy.filter!.indexOf(bi.variable) >= 0
            )
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
