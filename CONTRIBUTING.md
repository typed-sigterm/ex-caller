# 贡献指南

本文档将介绍项目技术信息和开发中的一些约定和规范。

## 技术栈与工具链

前端使用 Nuxt 开发，使用 tauri 打包为独立应用程序。

建议使用 Node.js 20，包管理器使用 pnpm 8。

## 目录结构

可参考 [Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure)。

```
ex-caller
├── .nuxt                  // 开发时 Nuxt 自动生成的文件
├── .output                // Nuxt 构建产物
├── app                    // 用来放首屏的加载中占位文件
├── app.vue                // Nuxt 应用程序入口
├── components             // 全局可用的 Nuxt 组件
├── composables            // 全局可用的 Vue hook
├── dist -> .output/public // Nuxt 构建产物
├── error.vue              // Nuxt 出现 fatal error 时显示的占位组件
├── public                 // 复制到 dist 的文件
├── src-tauri              // tauri 相关文件
│   ├── icons              // 应用程序图标
│   ├── src                // tauri 相关源代码
│   └── target             // tauri 构建产物
└── utils                  // 全局可用的工具函数
```

## 脚本

- 启动 tauri 和 Nuxt 的开发服务器：`pnpm dev`
- 仅启动 Nuxt 开发服务器 `pnpm dev:web`
- 检查代码格式：`pnpm lint`
- 构建：`pnpm build`

开始开发之前，需要运行 `pnpm install` 安装依赖。

## 代码规范

遵循 [ESLint 配置](./eslint.config.js) 即可。

如果你使用 VSCode，建议安装 .vscode/extensions.json 中的推荐插件，并在 .vscode/settings.json 中写入 [antfu 的推荐设置](https://github.com/antfu/eslint-config?tab=readme-ov-file#vs-code-support-auto-fix)。

## 测试

自由心证。

## 版本管理与发布

使用 Git 管理版本。

一个 commit 做一件事，建议添加 GPG 签名，无需添加 `Signoff`。Commit message 遵循[约定式提交 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)。

每个 tag 代表一个版本，以 `v` 开头，加上版本号，无需 GPG 签名。

有两个常驻分支，除此之外都是用于 PR 的临时分支：

- `main` (default)：最新的代码，可以推送，可以 commit
- `latest`：最新的已发布的代码，禁止除 CI 以外的推送

常驻分支必须拥有线性历史记录。

版本发布遵循 [SemVer 2.0.0](https://semver.org/lang/zh-CN/)，但是 semver 针对的是 dependencies，所以大部分情况仍然自由心证。

在一个版本发布前，可以在 [Canary 环境](https://main--ex-caller.netlify.app/)查看 `main` 分支上的代码效果。
