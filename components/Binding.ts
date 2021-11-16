export class Binding {
  public variable: string;
  public value: string;

  public constructor(variable: string, value: string) {
    this.variable = variable;
    this.value = value;
  }

  public clone(): Binding {
    return new Binding(this.variable, this.value);
  }

  public toString() {
    return this.variable + ": " + this.value;
  }
}
