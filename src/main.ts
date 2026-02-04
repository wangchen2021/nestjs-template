import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = configService.get<number>('PORT');
    const NODE_ENV = configService.get<string>('NODE_ENV');
    const CORS_ORIGIN =
      configService.get<string>('CORS_ORIGIN')?.split(',') || [];
    app.use(
      cors({
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI, //版本控制
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT ?? 3000, () => {
      console.log(`✅ ${NODE_ENV} 环境服务启动成功，端口：${PORT}`);
    });
  } catch (err) {
    console.error(`sever start fail: `, err);
  }
}
bootstrap();