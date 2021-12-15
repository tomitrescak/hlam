import expect from "expect";
import fs from "fs";
import path from "path";
import { ItemStructure } from "../Enums";
import { PlanInterpreter } from "../PlanInterpreter";
import { PlanSource } from "../PlanSource";

function loadFile(sourcePath: string) {
  let p = path.resolve(`./components/tests/data/${sourcePath}`);
  const source = fs.readFileSync(p, { encoding: "utf-8" });
  return source;
}

it("loads interpretation from json", function () {
  let definition = JSON.parse(loadFile("interpretation.json"));

  let planInterpreter = new PlanInterpreter(definition);

  expect(planInterpreter.interpretations.length).toBe(4);

  // check individual items
  let i1 = planInterpreter.interpretations[0];

  console.log(i1.id);

  expect(i1.id.name).toBe("truck-transport-from-to");
  expect(i1.id.parameters).toHaveLength(4);
  expect(i1.id.parameters).toEqual(["packageId", "truckId", "from", "to"]);
  expect(i1.description).toBe("Truck '!truckId' delivery from !from to !to");

  expect(i1.plan!.items).toHaveLength(3);
  expect(i1.plan!.type).toBe(ItemStructure.Sequence);

  expect(i1.plan!.items![0].action!.name).toBe("load-truck");
  expect(i1.plan!.items![0].action!.parameters).toEqual([
    "packageId",
    "truckId",
    "from",
  ]);

  // check more complex structure

  let i3 = planInterpreter.interpretations[3];
  expect(i3.views).toHaveLength(1);

  let view = i3.views[0];
  expect(view.start[0].name).toBe("load-truck");
  expect(view.goals![0].name).toBe("unload-truck");
  expect(view.goalStrategy).toBe("final");
  expect(view.view!.name).toBe("package-delivery-from-to");

  // let i5 = planInterpreter.interpretations[5];
  // expect(i5.views).toHaveLength(1);

  // view = i5.views[0];
  // expect(view.start).toHaveLength(4);
  // expect(view.start[0].name).toBe("load-airplane");
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
  let definition = loadFile("plan.txt");
  let plan = new PlanSource(definition);
  definition = loadFile("interpretation.json");
  let planInterpreter = new PlanInterpreter(JSON.parse(definition));

  let ip = planInterpreter.interpret(plan);

  expect(ip).toHaveLength(1);

  // three different packages
  expect(ip[0].scenarios).toHaveLength(3);

  // first package is loaded on the truck and then on the plane
  let first = ip[0].scenarios[0];

  expect(first.scenarios).toHaveLength(2);
  expect(first.scenarios[0].text).toBe("Truck 'trub' delivery from b1 to ab");
  expect(first.scenarios[0].lines).toHaveLength(4);
  expect(first.scenarios[0].lines[0].text).toBe("load-truck obj1 trub b1");
  expect(first.scenarios[0].lines[1].text).toBe("drive-truck trub b1 b2 b");
  expect(first.scenarios[0].lines[2].text).toBe("drive-truck trub b2 ab b");
  expect(first.scenarios[0].lines[3].text).toBe("unload-truck obj1 trub ab");

  expect(first.scenarios[1].text).toBe("Plane 'a380' delivery from ab to ad");
});
