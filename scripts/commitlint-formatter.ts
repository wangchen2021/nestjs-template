/**
 * 自定义 commitlint 格式化器
 * 实现与 commit-check.ts 相同的输出格式
 */

import type { FormattableProblem } from '@commitlint/types';

// 定义格式化器输入类型（根据实际数据结构）
interface FormatterResult {
  valid: boolean;
  errors: FormattableProblem[];
  warnings: FormattableProblem[];
  input: string;
}

interface FormatterInput {
  valid: boolean;
  errorCount: number;
  warningCount: number;
  results: FormatterResult[];
}

// 自定义格式化器函数
export default function commitlintFormatter(results: FormatterInput): string {
  // 检查是否通过验证
  if (results.valid) {
    console.log('✅ Commit message 验证通过！');
    return '';
  }

  // 输出错误统计
  console.log('\n❌ Commit message 验证失败：');
  console.log(`   错误数量: ${results.errorCount}`);
  console.log(`   警告数量: ${results.warningCount}`);
  console.log(`   提交内容: "${results.results[0]?.input || '未知'}"`);

  // 自定义错误信息映射
  const errorMessages: Record<string, string> = {
    'header-max-length': '长度不能超过 72 个字符',
    'type-enum': '无效的提交类型',
    'scope-enum': '无效的作用域',
    'type-empty': '提交类型不能为空',
    'scope-empty': '提交作用域不能为空',
    'subject-empty': '提交描述不能为空',
    'subject-full-stop': '提交描述不能以句号结尾',
    'subject-case': '提交描述格式错误',
    'header-full-stop': 'Commit message 不能以句号结尾',
  };

  // 输出错误信息（格式化）
  console.log('\n   ❌ 具体错误:');
  results.results.forEach((result) => {
    result.errors.forEach((error, index) => {
      const message = errorMessages[error.name] || error.message;
      console.log(`     ${index + 1}. ${message}`);
    });
  });

  // 输出示例（格式化）
  console.log('\n💡 正确格式示例:');
  console.log('   1. feat(components): 添加新的健身课程组件');
  console.log('   2. fix(core): 修复姿态识别算法 bug');
  console.log('   3. docs: 更新 README 文件');
  console.log('   4. refactor(util): 优化日期处理函数');

  console.log(
    '\n\x1b[1;33m🔔 提示: 可以执行 pnpm git:commit 进行标准提交\x1b[0m',
  );

  // 确保进程退出码为 1，表示验证失败
  process.exitCode = 1;

  return '';
}
