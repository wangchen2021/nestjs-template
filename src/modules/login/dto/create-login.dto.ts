import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    required: true,
    type: 'string',
  })
  username: string;
  @ApiProperty({
    description: '密码',
    example: '123456',
    required: true,
    type: 'string',
  })
  password: string;
}
