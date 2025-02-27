# 贡献指南

本文档将介绍项目技术信息和开发中的一些约定和规范。

## Roadmap

[在这](https://github.com/users/typed-sigterm/projects/5)

## 技术栈与工具链

使用 Bun 运行时，使用 Nuxt 框架。

Web 版部署在 Netlify，桌面版使用 tauri 打包为独立应用程序。

## 目录结构

可参考 [Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure)。

```
ex-caller
├── .nuxt                  // 开发模式 Nuxt 自动生成的文件
├── .output                // Nuxt 构建产物
├── app                    // Nuxt 前端根目录
├── dist -> .output/public // Nuxt 构建产物
├── public                 // 复制到 dist 的文件
├── src-tauri              // tauri 相关文件
└── static                 // 其他用途的静态文件，不包含在 app 中
```

## 脚本

开始开发之前，需要运行 `bun i` 安装依赖。

- 启动 tauri 和 Nuxt 的开发服务器：`bun run dev`
- 仅启动 Nuxt 开发服务器：`bun run dev:web`
- 检查代码格式：`bun run lint`
- 构建：`bun run build`
- 运行类型测试：`bun run test:types`
- 运行单元测试：`bun run test:unit`

## 代码风格

遵循 [ESLint 配置](./eslint.config.js) 即可。

如果你使用 VS Code，建议安装 `.vscode/extensions.json` 中的推荐插件，并在 `.vscode/settings.json` 中写入 [antfu 的推荐设置](https://github.com/antfu/eslint-config?tab=readme-ov-file#vs-code-support-auto-fix)。

## 依赖管理

依赖项更新的 commit scope 为 `deps`。

可以在 [Dependency Dashboard](https://github.com/typed-sigterm/ex-caller/issues/10) 中勾选需要更新的依赖，Renovate Bot 会创建 PR 更新。

若需要在 Renoate Bot 的自动更新上手动调整代码，可以直接提交到 PR 分支。

## 测试

自由心证，但至少 CI 和 Netlify Build 得通过。

可以适当使用 `[skip ci]` `[skip netlify]`。

## 版本管理与发布

使用 Git 管理版本。在 Gitee 有一个[只读镜像](https://gitee.com/typed-sigterm/ex-caller)。

一个 commit 做一件事，非 CI 的提交必须添加 GPG 签名，无需添加 `Signoff`。Commit message 遵循[约定式提交 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)。

每个 tag 代表一个版本，以 `v` 开头，加上版本号，无需 GPG 签名。

有 2~3 个常驻分支，除此之外都是用于 PR 的临时分支：

- `main` (default)：最新的代码，可以推送，可以 commit
- `latest`：最新的已发布稳定版的代码，禁止除 CI 以外的推送
- 如果有活跃的先行版的，代码放在 `insider` 分支，禁止除 CI 以外的推送。

常驻分支必须拥有线性历史记录。

版本号格式遵循 [SemVer 2.0.0](https://semver.org/lang/zh-CN/)，但是 semver 针对的是 dependencies，所以大部分情况仍然自由心证。

在一个版本发布前，可以在 [Canary 环境](https://main.ex-caller.by-ts.top)查看 `main` 分支上的代码效果。

发版的一般流程如下：

1. 更新 `CHANGELOG.md`
2. 更新版本号（`src-tauri/tauri.conf.json` > `version`）
3. commit，格式如：`release: v1.0.0`
4. tag，格式如：`v1.0.0`
5. push 到 GitHub
6. 在 GitHub 创建 release，标题如 `ExCaller v1.0.0`，内容为 (1) 中增加的部分
7. 发布 release 后，构建流程自动启动，等待完成后查看 release assets

如果版本发布失败，则可以继续 commit 以修复问题，并把 tag 更新到最终成功发版的 commit。

更新记录和版本号应以用户的视角撰写，因此：

- 版本号无需遵循 semver，根据用户感知的重要性来决定
- 更新记录一般不要包含技术细节
- 更新记录不必包含所有变更
