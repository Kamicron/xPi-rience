import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });

  // Activation de la validation
  app.useGlobalPipes(new ValidationPipe());

  // Configuration du port
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
