import expect from "expect";
import fs from "fs";
import path from "path";
import { GoalStrategy, ItemStructure } from "../Enums";
import { PlanInterpreter } from "../PlanInterpreter";
import { PlanSource } from "../PlanSource";

function loadFile(sourcePath: string) {
  let p = path.resolve(`./components/tests/data/${sourcePath}`);
  const source = fs.readFileSync(p, { encoding: "utf-8" });
  return source;
}

it("loads interpretation from json", function () {
  let definition = JSON.parse(loadFile("interpretation_full.json"));

  let planInterpreter = new PlanInterpreter(definition);

  expect(planInterpreter.interpretations.length).toBe(6);

  // check individual items
  let i1 = planInterpreter.interpretations[0];
  expect(i1.id).toBe("truck-transport-from-to");
  expect(i1.parameters).toHaveLength(4);
  expect(i1.parameters).toEqual(["packageId", "truckId", "from", "to"]);
  expect(i1.description).toBe("Truck delivery from !from to !to");

  expect(i1.plan!.items).toHaveLength(3);
  expect(i1.plan!.type).toBe(ItemStructure.Sequence);

  expect(i1.plan!.items![0].action!.name).toBe("load-truck");
  expect(i1.plan!.items![0].action!.parameters).toEqual([
    "packageId",
    "truckId",
    "from",
  ]);

  // check more complex structure

  var i3 = planInterpreter.interpretations[3];
  expect(i3.views).toHaveLength(1);

  var view = i3.views[0];
  expect(view.start[0].name).toBe("load-truck");
  expect(view.goals![0].name).toBe("unload-truck");
  expect(view.goalStrategy).toBe(GoalStrategy.Final);
  expect(view.view!.name).toBe("package-delivery-from-to");

  var i5 = planInterpreter.interpretations[5];
  expect(i5.views).toHaveLength(1);

  view = i5.views[0];
  expect(view.start).toHaveLength(4);
  expect(view.start[0].name).toBe("load-airplane");
});

it("loads test", function () {
  let definition = loadFile("plan.txt");

  let plan = new PlanSource(definition);
  let plaLines = plan.lines;

  expect(plaLines).toHaveLength(19);

  expect(plaLines[1].time).toBe(1);
  expect(plaLines[1].cost).toBe(1);
  expect(plaLines[1].action).toBe("drive-truck");
  expect(plaLines[1].parameters).toHaveLength(4);
  expect(plaLines[1].parameters[0]).toBe("trub");
  expect(plaLines[1].parameters[1]).toBe("b1");
  expect(plaLines[1].parameters[2]).toBe("b2");
  expect(plaLines[1].parameters[3]).toBe("b");

  expect(plan.getCost()).toBe(1269);
});

it("loads interpretation", function () {
  var definition = loadFile("plan.txt");
  var plan = new PlanSource(definition);
  definition = loadFile("interpretation.json");
  var planInterpreter = new PlanInterpreter(JSON.parse(definition));

  var ip = planInterpreter.interpret(plan);

  expect(ip).toHaveLength(1);

  console.log(ip[0].scenarios.map((s) => s.getText()));

  expect(ip[0].scenarios).toHaveLength(3);

  expect(ip).toEqual([
    {
      scenarios: [
        {
          scenarios: [
            {
              scenarios: [],
              lines: [
                {
                  time: 0,
                  parameters: ["obj1", "trub", "b1"],
                  action: "load-truck",
                  cost: 2,
                },
              ],
              text: "Truck delivery from b1 to ad",
            },
            {
              scenarios: [],
              lines: [
                {
                  time: 15,
                  parameters: ["obj1", "a380", "ad"],
                  action: "unload-airplane",
                  cost: 1,
                },
              ],
              text: "Plane delivery from b1 to ad",
            },
          ],
          lines: [],
          text: "Package delivery 'obj1' from 'b1' to 'ad'",
        },
      ],
      lines: [],
      text: "Package Tracking",
    },
    {
      scenarios: [
        {
          scenarios: [],
          lines: [
            {
              time: 0,
              parameters: ["obj1", "trub", "b1"],
              action: "load-truck",
              cost: 2,
            },
          ],
          text: "",
        },
      ],
      lines: [],
      text: "Airport Traffic",
    },
  ]);
});
