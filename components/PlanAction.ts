export class PlanAction {
  public name: string;
  public parameters: string[];
  public bound: string[];
  public bind: string[];

  public constructor(stringRecord: string) {
    var parts = stringRecord.split(" ");
    this.name = parts[0];
    this.parameters = parts
      .slice(1)
      .map((e) =>
        e.charAt(0) == "?" || e.charAt(0) == "!" ? e.substring(1) : e
      );

    this.bound = this.parameters.filter(
      (p) => stringRecord.indexOf("!" + p) >= 0
    );
    this.bind = this.parameters.filter(
      (p) => stringRecord.indexOf("?" + p) >= 0
    );
  }
}
