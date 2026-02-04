import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class HttpUtil {
  openCustomSSE(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // 立即发送响应头
  }
}