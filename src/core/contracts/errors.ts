export class ContractError extends Error {
  public originalError: Error | null;

  constructor(message: string, originalError: Error | null = null) {
    super(message);
    this.name = 'ContractError';
    this.originalError = originalError;
  }
}