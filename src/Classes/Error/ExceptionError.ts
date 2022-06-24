export class ExceptionError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.name = 'ExceptionError';
  }
}
