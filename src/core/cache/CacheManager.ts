interface CacheConfig {
  maxSize: number;
  expirationTime: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;

  private constructor() {
    this.cache = new Map();
    this.config = {
      maxSize: 100,
      expirationTime: 5 * 60 * 1000, // 5 minutes
    };
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set<T>(key: string, data: T): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public clearContractCache(): void {
    this.cache.clear();
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > this.config.expirationTime;
  }

  private evictOldest(): void {
    const oldestKey = Array.from(this.cache.entries())
      .reduce((oldest, current) => {
        return oldest[1].timestamp < current[1].timestamp ? oldest : current;
      })[0];
    
    this.cache.delete(oldestKey);
  }

  public setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }
}