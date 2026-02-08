import { ApiProperty } from '@nestjs/swagger';

export class AppDto {
  @ApiProperty({
    description: '应用名称',
    example: 'nestjs-template',
    required: true,
    type: 'string',
  })
  app: string;
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
  @ApiProperty({
    description: '构建时间',
    example: '2023-01-01 00:00:00',
    required: true,
    type: 'string',
  })
  data: string;
}
