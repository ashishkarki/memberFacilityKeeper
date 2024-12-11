import { Logger, Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

const logger = new Logger('CacheModule');
const CONNECTION_ATTEMPTS = 10;

@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single', // single redis rather than using a cluster
      options: {
        host: 'localhost',
        port: 6379, // default redis port
        // retry max 10 times, each time with additional 50ms delay
        retryStrategy: (times: number) => {
          if (times > CONNECTION_ATTEMPTS) {
            logger.error(`Redis connection failed after ${times} attempts.`);

            // also, throw an error to trigger custom behavior
            // throw new Error(
            //   `Unable to connect to Redis after ${CONNECTION_ATTEMPTS} attempts.`,
            // );
          } else {
            const retryDelay = times * 50; // Retry with increasing delay
            logger.warn(
              `Redis connection retrying (${times}). Next attempt in ${retryDelay}ms.`,
            );
            return retryDelay;
          }
        },
      },
    }),
  ],
  exports: [NestRedisModule],
})
export class CacheModule {}
