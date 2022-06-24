import { ErrorObject } from 'ajv';

export class ValidationError extends Error {
  public readonly info: Array<ErrorObject>;

  constructor(errors: Array<ErrorObject>, public readonly dataVar?: string) {
    super(errors[0].message);

    this.name = 'ValidationError';
    this.info = errors;
  }
}
