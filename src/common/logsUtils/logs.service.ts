import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LogsService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 通用日志方法
   */
  private logMessage(
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
    message: string,
    context: string,
    meta?: Record<string, any>,
  ) {
    this.logger.log({
      level,
      message,
      context,
      ...meta,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 调试日志
   */
  debug(message: string, context = 'APP', meta?: Record<string, any>) {
    this.logMessage('debug', message, context, meta);
  }

  /**
   * 信息日志
   */
  log(message: string, context = 'APP', meta?: Record<string, any>) {
    this.logMessage('info', message, context, meta);
  }

  /**
   * 警告日志
   */
  warn(message: string, context = 'APP', meta?: Record<string, any>) {
    this.logMessage('warn', message, context, meta);
  }

  /**
   * 错误日志（包含堆栈信息）
   */
  error(
    message: string,
    trace = '',
    context = 'APP',
    meta?: Record<string, any>,
  ) {
    this.logMessage('error', message, context, {
      ...meta,
      stack: trace,
    });
  }

  /**
   * 致命错误日志
   */
  fatal(
    message: string,
    trace = '',
    context = 'APP',
    meta?: Record<string, any>,
  ) {
    this.logMessage('fatal', message, context, {
      ...meta,
      stack: trace,
    });
  }

  /**
   * 请求日志（带请求ID）
   */
  request(
    message: string,
    requestId: string,
    context = 'HTTP',
    meta?: Record<string, any>,
  ) {
    this.logMessage('info', message, context, {
      ...meta,
      requestId,
    });
  }
}