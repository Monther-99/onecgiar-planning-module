import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(env.APP_PORT);
}
bootstrap();
