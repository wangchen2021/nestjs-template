import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/GlobalExceptionFilter';
import { ResponseInterceptor } from './common/interceptors/ResponseInterceptor';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { validationSchema } from './config/env/validation.schema';
import { LogsService } from './common/logsUtils/logs.service';
import { LogsModule } from './common/logsUtils/logs.module';
import { UtilsModule } from './common/utils/utils.module';
import { UserModule } from './modules/user/user.module';
import { LoginModule } from './modules/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 加载对应环境的配置文件
      envFilePath: path.resolve(
        process.cwd(),
        `src/config/env/.env.${process.env.NODE_ENV || 'development'}`,
      ),
      // 启用全局配置（所有模块可注入 ConfigService）
      isGlobal: true,
      // 配置校验规则
      validationSchema,
      // 允许环境变量覆盖配置文件
      expandVariables: true,
    }),
    LogsModule,
    UtilsModule,
    UserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    LogsService,
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}