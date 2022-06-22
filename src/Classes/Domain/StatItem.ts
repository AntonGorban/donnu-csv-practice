import { Country } from './Country';
import { Products } from './Products';

export class StatItem {
  constructor(
    private readonly _country: Country,
    private readonly _products: Products
  ) {}

  get country() {
    return this._country;
  }

  get products() {
    return this._products;
  }
}
