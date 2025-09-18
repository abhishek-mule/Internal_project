import { PaymentDetails, PaymentResult, PaymentService } from '../PaymentService';

interface QueuedPayment {
  id: string;
  details: PaymentDetails;
  attempts: number;
  maxAttempts: number;
  lastAttempt: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: PaymentResult;
}

export class PaymentQueue {
  private static instance: PaymentQueue;
  private queue: QueuedPayment[] = [];
  private isProcessing: boolean = false;
  private paymentService: PaymentService;

  private constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
    this.startProcessing();
  }

  public static getInstance(paymentService: PaymentService): PaymentQueue {
    if (!PaymentQueue.instance) {
      PaymentQueue.instance = new PaymentQueue(paymentService);
    }
    return PaymentQueue.instance;
  }

  public async queuePayment(details: PaymentDetails, maxAttempts: number = 3): Promise<string> {
    const id = this.generatePaymentId();
    
    this.queue.push({
      id,
      details,
      attempts: 0,
      maxAttempts,
      lastAttempt: 0,
      status: 'pending'
    });

    if (!this.isProcessing) {
      this.startProcessing();
    }

    return id;
  }

  public getPaymentStatus(id: string): QueuedPayment | null {
    return this.queue.find(p => p.id === id) || null;
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const payment = this.queue[0];
      
      if (payment.status === 'completed' || payment.status === 'failed') {
        this.queue.shift();
        continue;
      }

      const now = Date.now();
      if (payment.lastAttempt + this.getRetryDelay(payment.attempts) > now) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      try {
        payment.status = 'processing';
        payment.lastAttempt = now;
        payment.attempts++;

        const result = await this.paymentService.processPayment(payment.details);
        
        if (result.success) {
          payment.status = 'completed';
          payment.result = result;
          this.queue.shift();
        } else {
          if (payment.attempts >= payment.maxAttempts) {
            payment.status = 'failed';
            payment.result = result;
            this.queue.shift();
          } else {
            // Move to end of queue for retry
            payment.status = 'pending';
            this.queue.push(this.queue.shift()!);
          }
        }
      } catch (error) {
        console.error(`Payment processing error for ID ${payment.id}:`, error);
        
        if (payment.attempts >= payment.maxAttempts) {
          payment.status = 'failed';
          this.queue.shift();
        } else {
          // Move to end of queue for retry
          payment.status = 'pending';
          this.queue.push(this.queue.shift()!);
        }
      }
    }

    this.isProcessing = false;
  }

  private getRetryDelay(attempt: number): number {
    // Exponential backoff: 5s, 10s, 20s, etc.
    return Math.min(5000 * Math.pow(2, attempt - 1), 60000);
  }

  private generatePaymentId(): string {
    return `pay_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}