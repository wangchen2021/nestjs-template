import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../logsUtils/logs.service';

// 定义需要忽略日志的路由前缀/路径
const IGNORED_PATHS = [
  '/.well-known', // Chrome DevTools 自动请求
  '/favicon.ico', // 浏览器图标请求
  '/health', // 健康检查接口（可选）
  '/robots.txt', // 爬虫协议文件（可选）
];

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const isIgnoredPath = IGNORED_PATHS.some((path) =>
      req.url.startsWith(path),
    );
    let code: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg: string = `unknown server error: ${exception.message}`;
    if (exception instanceof HttpException) {
      code = exception.getStatus();
      msg = exception.message;
    } else if (exception instanceof Error) {
      msg = exception.message;
    }
    const resJson = {
      code,
      data: null,
      msg,
      time: Date.now(),
    };
    // 记录错误日志
    if (!isIgnoredPath) {
      this.logsService.error(
        `[${req.method}] ${req.url}`,
        exception.stack || '',
        'EXCEPTION_FILTER',
        {
          status: code,
          requestId: req.headers['x-request-id'] || 'unknown',
          ip: req.ip,
          body: req.body,
          params: req.params,
          query: req.query,
        },
      );
    }
    res.status(code).json(resJson);
  }
}