import { Injectable } from '@nestjs/common';
import { AppDto } from './common/dto/app.dto';
import { ConfigService } from '@nestjs/config';
import git from 'git-rev-sync';
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getAppInfo(): AppDto {
    return {
      version: git.tag() || 'unknown',
      env: this.configService.get('NODE_ENV') || 'unknown',
    };
  }
}
