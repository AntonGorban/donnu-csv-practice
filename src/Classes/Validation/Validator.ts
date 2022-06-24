import { ValidateFunction } from 'ajv';
import * as lo from 'lodash';

import { ValidationError } from '../Error/ValidationError';

export class Validator<T extends {}> {
  constructor(
    private readonly _validator: ValidateFunction,
    private readonly _dataVar?: string
  ) {}

  public readonly validate: (rawData: unknown) => T = (rawData) => {
    const data = lo.cloneDeep(rawData);

    const valid = this._validator(data);

    if (!valid) {
      if (!this._validator.errors) throw new Error('что-то пошло не так');
      throw new ValidationError(this._validator.errors, this._dataVar);
    }

    return data as T;
  };
}
