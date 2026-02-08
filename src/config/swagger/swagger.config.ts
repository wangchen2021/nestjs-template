import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService } from '../config.service';

export function setupSwagger(app: INestApplication<any>) {
  const configService = app.get(AppConfigService);
  const PREFIX = configService.getApiPrefix();
  const config = new DocumentBuilder()
    .setTitle('Api Server')
    .setDescription('The Chen API description')
    .setVersion('1.0')
    .addTag('chen')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${PREFIX}/api/doc`, app, documentFactory);
}
