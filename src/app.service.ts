import { Injectable } from '@nestjs/common';
import { AppDto } from './common/dto/app.dto';
import { VersionService } from './common/services/version.service';
import { AppConfigService } from './config/config.service';
@Injectable()
export class AppService {
  constructor(
    private readonly versionService: VersionService,
    private readonly appConfigService: AppConfigService,
  ) {}
  getAppInfo(): AppDto {
    return {
      app: this.appConfigService.getAppName(),
      version: this.versionService.getFullVersion(),
      env: this.versionService.getEnv(),
      data: this.versionService.getBuildTime(),
    };
  }
}
