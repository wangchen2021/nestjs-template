import { Injectable } from '@nestjs/common';
import { AppDto } from './common/dto/app.dto';
import * as packageJson from '../package.json';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getAppInfo(): AppDto {
    return {
      version: packageJson.version,
      env: this.configService.get('NODE_ENV') || 'unknown',
    };
  }
}
