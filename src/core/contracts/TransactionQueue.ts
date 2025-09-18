import { ContractError } from './errors';

interface QueuedTransaction<T> {
  id: string;
  operation: () => Promise<T>;
  maxAttempts: number;
  attempts: number;
  lastAttempt: number;
}

export class TransactionQueue {
  private static instance: TransactionQueue;
  private queue: QueuedTransaction<any>[] = [];
  private processing: boolean = false;
  private retryDelay: number = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): TransactionQueue {
    if (!TransactionQueue.instance) {
      TransactionQueue.instance = new TransactionQueue();
    }
    return TransactionQueue.instance;
  }

  public async addTransaction<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3
  ): Promise<string> {
    const id = this.generateTransactionId();
    
    this.queue.push({
      id,
      operation,
      maxAttempts,
      attempts: 0,
      lastAttempt: 0,
    });

    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  public getTransactionStatus(id: string): 'pending' | 'processing' | 'not_found' {
    const transaction = this.queue.find(t => t.id === id);
    if (!transaction) return 'not_found';
    return this.processing && this.queue[0].id === id ? 'processing' : 'pending';
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const transaction = this.queue[0];
      const now = Date.now();

      if (transaction.lastAttempt + this.retryDelay > now) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        continue;
      }

      try {
        await transaction.operation();
        this.queue.shift(); // Remove successful transaction
      } catch (error) {
        transaction.attempts++;
        transaction.lastAttempt = now;

        if (transaction.attempts >= transaction.maxAttempts) {
          this.queue.shift(); // Remove failed transaction
          console.error(new ContractError(
            `Transaction ${transaction.id} failed after ${transaction.maxAttempts} attempts`,
            error as Error
          ));
        } else {
          // Move to the end of the queue for retry
          this.queue.push(this.queue.shift()!);
        }
      }
    }

    this.processing = false;
  }

  private generateTransactionId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}