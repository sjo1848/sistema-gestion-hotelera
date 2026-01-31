import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  // Habilitar CORS es vital para que Vue (puerto 5173) hable con Nest (puerto 3000)
  app.enableCors(); 

  // Accesible desde fuera del contenedor
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🏨 Backend del Hotel corriendo en: http://localhost:${port}`);
}
bootstrap();
