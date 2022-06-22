export class Products {
  constructor(
    private _steel: number,
    private _coal: number,
    private _oil: number
  ) {}

  get steel() {
    return this._steel;
  }

  set steel(steel: number) {
    this._steel = steel;
  }

  get coal() {
    return this._coal;
  }

  set coal(coal: number) {
    this._coal = coal;
  }

  get oil() {
    return this._oil;
  }

  set oil(oil: number) {
    this._oil = oil;
  }
}
