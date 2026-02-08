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
import { AppConfigModule } from './config/config.module';
import { VersionService } from './common/services/version.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(process.cwd(), 'src/config/env/.env'),
        path.resolve(
          process.cwd(),
          `src/config/env/.env.${process.env.NODE_ENV || 'development'}`,
        ),
      ],
      isGlobal: true,
      validationSchema,
      expandVariables: true,
      ignoreEnvFile: false,
      ignoreEnvVars: false,
    }),
    LogsModule,
    UtilsModule,
    AppConfigModule,
    UserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    LogsService,
    AppService,
    VersionService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
