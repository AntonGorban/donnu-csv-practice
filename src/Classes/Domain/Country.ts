export class Country {
  constructor(private _region: string, private _country: string) {}

  get region() {
    return this._region;
  }

  set region(region: string) {
    this._region = region;
  }

  get country() {
    return this._country;
  }

  set country(country: string) {
    this._country = country;
  }
}
