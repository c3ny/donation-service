import { NestFactory } from '@nestjs/core';
import { AppModule } from './donation.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
