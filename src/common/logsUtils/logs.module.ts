import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

// 日志级别配置
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// 通用时间格式化
const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss.SSS', // 更易读的时间格式
});

const consoleFormat = winston.format.combine(
  timestampFormat,
  winston.format.colorize({ all: false }), // 只给级别上色
  winston.format.printf(
    ({ timestamp, level, context, message, stack, requestId, ...meta }) => {
      // 基础日志模板
      let logStr = `[${timestamp}] [${level}] [${context || 'APP'}]`;

      // 添加请求ID
      if (requestId) logStr += ` [REQ:${requestId}]`;

      // 添加核心消息
      logStr += ` ${message}`;

      // 添加其他元数据
      const metaStr = Object.keys(meta).length
        ? ` | Meta: ${JSON.stringify(meta, null, 2)}`
        : '';
      logStr += metaStr;

      // 修复核心：先校验stack类型，确保是字符串且非空
      if (stack && typeof stack === 'string' && stack.trim()) {
        logStr += `\n└─ Stack Trace:\n${stack
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n')}`;
      }

      return logStr;
    },
  ),
);

// ---- 优化文件日志格式化（JSON结构化）----
const fileFormat = winston.format.combine(
  timestampFormat,
  winston.format.json({
    space: 2, // 格式化JSON输出，便于日志分析工具解析
  }),
);

// 日志文件轮转配置
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: join(process.cwd(), 'logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat, // 使用优化后的文件格式
});

// 控制台输出配置
const consoleTransport = new winston.transports.Console({
  format: consoleFormat, // 使用优化后的控制台格式
});

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: LOG_LEVEL,
      defaultMeta: { service: 'nest-api' },
      transports: [
        consoleTransport,
        ...(process.env.NODE_ENV === 'production' ? [fileRotateTransport] : []),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LogsModule {}