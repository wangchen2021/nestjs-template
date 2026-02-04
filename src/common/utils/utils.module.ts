import { Global, Module } from '@nestjs/common';
import { HttpUtil } from './http/httpUtil';

@Global()
@Module({
  providers: [HttpUtil],
  exports: [HttpUtil], // 导出供其他模块使用
})
export class UtilsModule {}