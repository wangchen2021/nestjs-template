import { ApiProperty } from '@nestjs/swagger';

export class AppDto {
  @ApiProperty({
    description: '版本号',
    example: '1.0.0',
    required: true,
    type: 'string',
  })
  version: string;
  @ApiProperty({
    description: '当前环境',
    example: 'development',
    required: true,
    type: 'string',
  })
  env: string;
}
