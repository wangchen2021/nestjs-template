// // scripts/generate-openapi.ts（回到你最开始的版本，零修改）
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as fs from 'fs';
// import * as path from 'path';
// import packageJson from '../package.json';

// async function generate() {
//   const app = await NestFactory.create(AppModule, {
//     logger: false,
//     abortOnError: false,
//   });

//   const config = new DocumentBuilder()
//     .setTitle('API')
//     .setDescription('API Document')
//     .setVersion(packageJson.version)
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   // 在根目录生成openapi.json文件
//   const outputPath = path.resolve(process.cwd(), 'openapi.json');
//   fs.writeFileSync(
//     outputPath,
//     JSON.stringify(document, null, 2),
//   );

//   console.log(`OpenAPI JSON文件已生成: ${outputPath}`);

//   await app.close();
// }
// void generate();
