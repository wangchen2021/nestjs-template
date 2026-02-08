import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import git from 'git-rev-sync';
import dayjs from 'dayjs';
import { AppConfigService } from '../../config/config.service';

export type BuildInfo = {
  coreVersion: string;
  env: string;
  commitHash: string;
  buildTime: string;
  fullVersion: string;
  buildId: string;
};

@Injectable()
export class VersionService implements OnModuleInit {
  private buildInfo: BuildInfo;
  private env: string;

  constructor(private appConfigService: AppConfigService) {
    // 初始化时获取环境标识
    this.env = this.appConfigService.getEnv() || 'unknown';
  }

  private get fallbackInfo(): BuildInfo {
    // 动态计算兜底信息（每次调用都重新获取最新 Git 信息）
    const coreVersion = git.tag() || 'unknown';
    const commitHash = git.short() || 'unknown';
    const buildTime =
      dayjs(git.date()).format('YYYY-MM-DD HH:mm:ss') || 'unknown';
    const env = this.appConfigService.getEnv() || 'unknown';

    return {
      coreVersion,
      env,
      commitHash,
      buildTime,
      fullVersion: `${coreVersion}-${env}-${buildTime}-${commitHash}`, // 拼接完整版本号
      buildId: 'local-dev',
    };
  }

  onModuleInit() {
    this.loadBuildInfo();
  }

  private loadBuildInfo() {
    if (this.env === 'production') {
      try {
        const buildInfoPath = path.join(
          process.cwd(),
          // 生产环境优先读 dist 目录下的文件
          fs.existsSync('dist/config/build-info.json')
            ? 'dist/config/build-info.json'
            : 'src/config/build-info.json',
        );

        const buildInfoContent = fs.readFileSync(buildInfoPath, 'utf8');
        this.buildInfo = JSON.parse(buildInfoContent) as BuildInfo;

        // 日志提示（生产环境便于排查）
        console.log(
          `[VersionService] 生产环境加载版本文件成功：${this.buildInfo.fullVersion}`,
        );
      } catch (error) {
        // 生产环境读取失败也用 fallback（兜底）
        console.error(
          `[VersionService] 生产环境加载版本文件失败，使用兜底信息：${error}`,
        );
        this.buildInfo = this.fallbackInfo;
      }
    } else {
      // 非生产环境（dev/test）直接使用 fallback
      this.buildInfo = this.fallbackInfo;
      console.log(
        `[VersionService] 非生产环境（${this.env}）使用本地 Git 版本信息：${this.buildInfo.fullVersion}`,
      );
    }
  }

  getBuildInfo(): BuildInfo {
    return { ...this.buildInfo };
  }

  getCoreVersion(): string {
    return this.buildInfo.coreVersion;
  }

  getEnv(): string {
    return this.buildInfo.env || this.appConfigService.getEnv() || 'unknown';
  }

  getFullVersion(): string {
    return this.buildInfo.fullVersion;
  }

  getBuildTime(): string {
    return this.buildInfo.buildTime;
  }
}
