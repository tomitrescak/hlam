import { Item, ItemDAO } from "./Item";
import { View, ViewDAO } from "./View";

export type ScenarioDAO = {
  id: string;
  description: string;
  parameters: string[] | null;
  views: ViewDAO[];
  plan: ItemDAO | null;
};

export class Scenario {
  public id: string;
  public description: string;
  public parameters: string[] | null;
  public views: View[];
  public plan: Item | null;

  public constructor(definition: ScenarioDAO) {
    this.id = definition.id;
    this.description = definition.description ? definition.description : "";
    this.plan = definition.plan ? new Item(definition.plan) : null;
    this.parameters = definition.parameters ? definition.parameters : null;
    this.views = definition.views
      ? definition.views.map((v) => new View(v))
      : [];
  }
}
