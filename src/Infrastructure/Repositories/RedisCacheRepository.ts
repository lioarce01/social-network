import { createClient, RedisClientType } from "redis";
import { redisConfig } from "../../config/config";
import { CacheRepository } from "../../Domain/Repositories/CacheRepository";
import { injectable } from "tsyringe";

@injectable()
export class RedisCacheRepository implements CacheRepository {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      username: redisConfig.username,
      password: redisConfig.password,
      socket: {
        host: redisConfig.url,
        port: redisConfig.port,
      },
    });

    this.client
      .connect()
      .then(() => console.log("Redis connected"))
      .catch((err) => console.error("Redis connection error:", err));
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}
