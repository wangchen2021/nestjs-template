import { Injectable } from '@nestjs/common';
import { AppDto } from './common/dto/app.dto';
import { VersionService } from './common/services/version.service';
@Injectable()
export class AppService {
  constructor(private versionService: VersionService) {}
  getAppInfo(): AppDto {
    return {
      version: this.versionService.getFullVersion(),
      env: this.versionService.getEnv(),
    };
  }
}
