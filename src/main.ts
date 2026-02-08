import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { setupSwagger } from './config/swagger/swagger.config';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // 获取配置服务
    const configService = app.get(AppConfigService);
    const PORT = configService.getPort();
    const NODE_ENV = configService.getEnv();
    const CORS_ORIGIN = configService.getCorsOrigin();
    const PREFIX = configService.getApiPrefix();

    // 设置Swagger文档
    setupSwagger(app);

    // 配置CORS
    app.use(
      cors({
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      }),
    );

    // 启用版本控制
    app.enableVersioning({
      type: VersioningType.URI, //版本控制
    });

    // 设置全局验证管道
    app.useGlobalPipes(new ValidationPipe());

    // 设置全局路由前缀
    app.setGlobalPrefix(PREFIX);

    // 启动服务
    await app.listen(PORT, () => {
      console.log(`✅ ${NODE_ENV} 环境服务启动成功，端口：${PORT}`);
      if (NODE_ENV === 'development') {
        console.log(`本地地址：http://localhost:${PORT}${PREFIX}`);
        console.log(`文档地址：http://localhost:${PORT}${PREFIX}api/doc`);
      }
      console.log(`API前缀：${PREFIX}`);
    });
  } catch (err) {
    console.error(`服务启动失败: `, err);
  }
}
void bootstrap();
