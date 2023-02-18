import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import logger from '../utils/logger';

// the port that the id-api should boot on
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adds more headers to make the api more secure
  app.use(helmet());

  // adds cross origin reference abilities
  app.enableCors({
    origin: [
      'https://localhost:3000',
      'http://localhost:3000',
      // http/https domains for hyperlink-client
      'http://kreativehyperlink.com',
      'https://kreativehyperlink.com',
      // http/https domains for hyperlink-transformer
      'http://khyper.link',
      'https://khyper.link',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  // removes any data from request bodies that don't fit the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // adds /v1 before any route, used for API versioning
  app.setGlobalPrefix('/v1');

  logger.info(
    `id-api starting on port: ${PORT} enviroment: ${process.env.NODE_ENV}`,
  );
  await app.listen(PORT);
}

bootstrap();
