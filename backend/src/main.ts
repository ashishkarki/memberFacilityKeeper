import { Request, Response } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  // add middlewares to log requests
  app.use((req: Request, res: Response, next: Function) => {
    if (req.method === 'HEAD' || req.method === 'OPTIONS') {
      return next(); // Skip logging for these methods
    }

    console.log(
      `[NestJS Server: ${PORT}] Handling request: ${req.method} ${req.url}`,
    );

    next();
  });

  await app.listen(PORT);

  console.log(`Server running on port ${PORT}`);
}
bootstrap();
