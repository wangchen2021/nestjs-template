import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Apifox配置（从环境变量读取，CI中配置）
const APIFOX_CONFIG = {
  token: process.env.APIFOX_TOKEN!, // Apifox开放API令牌
  projectId: process.env.APIFOX_PROJECT_ID!, // 项目ID
  baseUrl: 'https://api.apifox.com/v1',
};

// 同步OpenAPI到Apifox
async function syncToApifox() {
  try {
    // 1. 读取本地生成的openapi.json
    const openApiPath = path.resolve(process.cwd(), 'openapi.json');
    if (!fs.existsSync(openApiPath)) {
      throw new Error(`未找到OpenAPI文件: ${openApiPath}`);
    }
    const openApiContent = fs.readFileSync(openApiPath, 'utf8');
    const openApiJson = JSON.parse(openApiContent) as Record<string, any>;

    if (!openApiJson) {
      throw new Error('OpenAPI JSON内容为空');
    }

    // 2. 调用Apifox开放API更新文档
    const response = await axios.post(
      `${APIFOX_CONFIG.baseUrl}/projects/${APIFOX_CONFIG.projectId}/import-openapi?locale=zh-CN`,
      JSON.stringify({
        input: openApiJson,
        options: {},
      }),
      {
        headers: {
          'X-Apifox-Api-Version': '2024-03-28',
          Authorization: `Bearer ${APIFOX_CONFIG.token}`,
        },
      },
    );

    if (response.status === 200) {
      console.log(`✅ 同步到Apifox成功！`);
      const data = response.data as Record<string, any>;
      console.log(data.counters);
    }
  } catch (error) {
    console.error('❌ 同步到Apifox失败:', error);
    process.exit(1);
  }
}

void syncToApifox();
