import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * 获取环境
   */
  getEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  /**
   * 判断是否为开发环境
   */
  isDevelopment(): boolean {
    return this.getEnv() === 'development';
  }

  /**
   * 判断是否为测试环境
   */
  isTest(): boolean {
    return this.getEnv() === 'test';
  }

  /**
   * 判断是否为生产环境
   */
  isProduction(): boolean {
    return this.getEnv() === 'production';
  }

  /**
   * 获取服务端口
   */
  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  /**
   * 获取API前缀
   */
  getApiPrefix(): string {
    return this.configService.get<string>('PREFIX', '/api');
  }

  /**
   * 获取CORS配置
   */
  getCorsOrigin(): string[] {
    const origin = this.configService.get<string>(
      'CORS_ORIGIN',
      'http://localhost:5173',
    );
    return origin.split(',');
  }

  /**
   * 获取JWT密钥
   */
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'default-secret-key');
  }

  /**
   * 获取日志级别
   */
  getLogLevel(): string {
    return this.configService.get<string>('LOG_LEVEL', 'info');
  }

  /**
   * 判断是否开启调试模式
   */
  isDebugMode(): boolean {
    return this.configService.get<boolean>('DEBUG_MODE', false);
  }

  /**
   * 获取应用名称
   */
  getAppName(): string {
    return this.configService.get<string>('APP_NAME', 'nestjs-app');
  }

  /**
   * 获取API版本
   */
  getApiVersion(): string {
    return this.configService.get<string>('API_VERSION', '1.0.0');
  }
}
