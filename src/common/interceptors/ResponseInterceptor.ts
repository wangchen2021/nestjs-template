import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        // 如果响应头包含 Content-Disposition（文件下载），直接返回原始数据
        if (response.getHeader('Content-Disposition')) {
          return data;
        }
        return {
          code: HttpStatus.OK,
          data: data ?? null,
          msg: 'success',
          time: Date.now(),
        };
      }),
    );
  }
}