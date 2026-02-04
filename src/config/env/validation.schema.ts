import * as Joi from 'joi';

// 定义配置校验规则，确保端口等配置合法
export const validationSchema = Joi.object({
  // 端口：必填、数字、1-65535
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  // 环境：只能是 dev/test/prod
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  // CORS 白名单：字符串，可选
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
});