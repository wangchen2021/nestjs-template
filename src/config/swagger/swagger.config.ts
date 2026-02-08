import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService } from '../config.service';

export function setupSwagger(app: INestApplication<any>) {
  const configService = app.get(AppConfigService);
  if (configService.isProduction()) {
    console.log('生产环境关闭Swagger文档');
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Api Server')
    .setDescription('The Chen API description')
    .setVersion('1.0.0')
    .addTag('chen')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/doc', app, documentFactory);
}
