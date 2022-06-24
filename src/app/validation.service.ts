import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import ajvErrors from 'ajv-errors';

import { Injectable } from '@angular/core';

import { Validator } from '../Classes/Validation/Validator';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private readonly _ajv: Ajv;

  constructor() {
    this._ajv = new Ajv({
      allErrors: true,
      removeAdditional: 'all',
      useDefaults: true,
      coerceTypes: true,
    });

    this._activateAjvPlugins();
  }

  private readonly _activateAjvPlugins = () => {
    ajvErrors(this._ajv, { singleError: true });
  };

  public readonly generateValidator: <T>(
    schema: JSONSchemaType<T>,
    dataVar?: string
  ) => Validator<T> = (schema, dataVar) => {
    return new Validator(this._ajv.compile(schema), dataVar);
  };

  public getErrorMessage(errors: Array<ErrorObject>, dataVar?: string) {
    return this._ajv.errorsText(errors, { dataVar });
  }
}
