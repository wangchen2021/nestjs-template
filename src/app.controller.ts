import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AppDto } from './common/dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiCreatedResponse({
    description: 'app信息',
    type: AppDto,
    example: {
      version: '1.0.0',
      env: 'development',
    },
  })
  @Get()
  getAppInfo(): AppDto {
    return this.appService.getAppInfo();
  }

  @Get('health')
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nestjs-template',
      version: '0.0.1',
    };
  }
}
