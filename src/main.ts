import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);

  // Préfixe global de l’API
  const apiPrefix = config.get<string>('API_PREFIX') ?? '';
  if (apiPrefix.trim().length > 0) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Validation globale (DTO class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const swaggerPath = config.get<string>('SWAGGER_PATH') ?? 'docs';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RW API')
    .setVersion('1.0')
    // On documente le header Authorization (utilisé pour SSO GET ou API_KEY WRITE)
    .addApiKey({ type: 'apiKey', name: 'authorization', in: 'header' }, 'authorization')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
