import { NestFactory } from '@nestjs/core';
import { AppModule } from './donation.module';
import { setupSwagger } from '../swagger/swagger.config';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  setupSwagger(app);

  await app.listen(port);

  console.log(`🚀 Donation Service running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
}

bootstrap();
