import { SetMetadata } from '@nestjs/common';

// 定义元数据 key
export const LOG_METADATA_KEY = 'log';

/**
 * 日志装饰器（注解）
 * @param options 日志配置：级别、是否记录请求体、是否记录响应
 */
export const Log = (
  options: {
    level?: 'INFO' | 'DEBUG' | 'ERROR';
    logBody?: boolean; // 是否记录请求体（默认 true）
    logResponse?: boolean; // 是否记录响应（默认 true）
  } = {
    level: 'INFO',
    logBody: true,
    logResponse: true,
  },
) => SetMetadata(LOG_METADATA_KEY, options);