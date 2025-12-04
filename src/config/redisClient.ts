import { createClient } from 'redis';
import { envVars } from './env';

export const redisClient = createClient({
  username: envVars.REDIS_USERNAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
    connectTimeout: 20000,   // 20 seconds (previously 5 sec)
    reconnectStrategy(retries) {
      if (retries > 20) {
        return new Error("Redis Retry Limit Reached");
      }
      return Math.min(retries * 500, 5000);  // gradual retry
    }
  }
});

redisClient.on('error', err => console.log('Redis Client Error:', err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected");
  }
};
