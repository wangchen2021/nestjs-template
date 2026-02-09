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
      app: 'nestjs-template',
      version: '1.0.0',
      env: 'development',
      date: '2023-01-01 00:00:00',
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
