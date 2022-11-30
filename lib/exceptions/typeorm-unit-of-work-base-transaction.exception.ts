export class TypeormUnitOfWorkBaseTransactionException extends Error {
  constructor() {
    super("Base transaction can't be called");
  }
}
