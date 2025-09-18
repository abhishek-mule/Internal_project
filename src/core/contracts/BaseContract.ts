import { SmartContract, BaseContract as TWBaseContract } from '@thirdweb-dev/sdk';
import { ContractError } from './errors';

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
}

export abstract class BaseContract {
  protected contract: SmartContract<TWBaseContract>;
  protected retryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
  };

  constructor(contract: SmartContract<TWBaseContract>) {
    this.contract = contract;
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.retryConfig.initialDelay;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === this.retryConfig.maxAttempts) break;

        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, this.retryConfig.maxDelay);
      }
    }

    throw new ContractError(
      `${context} failed after ${this.retryConfig.maxAttempts} attempts`,
      lastError
    );
  }

  protected validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}