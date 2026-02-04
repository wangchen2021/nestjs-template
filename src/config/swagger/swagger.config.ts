import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Api Server')
    .setDescription('The Chen API description')
    .setVersion('1.0')
    .addTag('chen')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/doc', app, documentFactory);
}