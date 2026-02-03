import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import { requestLogger } from './common/middleware/request-logger.middleware';
import { requestId } from './common/middleware/request-id.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 VALIDACIÓN GLOBAL (CLAVE)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Observabilidad: request id y logs estructurados
  app.use(requestId);
  app.use(requestLogger);

  // Seguridad: headers con helmet
  app.use(helmet());

  // CORS con whitelist
  const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  });

  // Versionado de API
  app.setGlobalPrefix('api/v1');

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema de Gestion Hotelera API')
    .setDescription('Documentacion de endpoints del PMS')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, swaggerDoc);

  // Accesible desde fuera del contenedor
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🏨 Backend del Hotel corriendo en: http://localhost:${port}`);
}
bootstrap();
