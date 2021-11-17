import { PlanAction } from "./PlanAction";
import { ItemStructure } from "./Enums";

export interface ItemDAO {
  anyOf: ItemDAO[] | undefined;
  allOf: ItemDAO[] | undefined;
  oneOf: ItemDAO[] | undefined;
  sequence: ItemDAO[] | undefined;
}

export class Item {
  public items: Item[] | null;
  public type: ItemStructure;
  public action: PlanAction | null;

  public constructor(record: ItemDAO | string) {
    // this may be just a string line
    if (typeof record == "string") {
      this.action = new PlanAction(record);
      this.items = null;
      this.type = ItemStructure.Item;
      return;
    }

    // this is a complex record, either sequence, oneOf, anyOf, allOf

    this.action = null;

    let json = record;

    this.type = json.sequence
      ? ItemStructure.Sequence
      : json.anyOf
      ? ItemStructure.AnyOf
      : json.allOf
      ? ItemStructure.AllOf
      : ItemStructure.OneOf;

    let items =
      this.type == ItemStructure.Sequence
        ? json.sequence
        : this.type == ItemStructure.AnyOf
        ? json.anyOf
        : this.type == ItemStructure.OneOf
        ? json.oneOf
        : json.allOf;

    this.items = [];

    if (items != null) {
      for (let i = 0; i < items!.length; i++) {
        this.items[i] = new Item(items[i]);
      }
    }
  }
}
