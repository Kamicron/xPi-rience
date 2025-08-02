import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('proces.FRONT_URL', process.env.FRONT_URL);

  // Configuration CORS
  const frontUrl =
    process.env.FRONT_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  app.enableCors({
    origin: frontUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Activation de la validation
  app.useGlobalPipes(new ValidationPipe());

  // Configuration du port
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
