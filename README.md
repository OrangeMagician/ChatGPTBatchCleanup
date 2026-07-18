# ChatGPT Batch Cleanup

简体中文 | [English](README_EN.md)

一个简单的 ChatGPT 会话批量管理工具，用于批量选择、归档或删除侧栏中的会话。

项目同时提供油猴脚本和 Chrome 扩展两种安装方式。功能保持克制，不包含数据统计、云端同步、广告或其他附加功能。

## 功能

- 单击会话进行勾选或取消勾选。
- 一键全选或取消全选当前已加载的会话列表。
- 批量归档所选会话。
- 批量删除所选会话。
- 归档和删除前列出会话标题并进行二次确认。
- 显示批量处理进度，成功后立即隐藏对应会话。
- 刷新页面或双击进入其他会话后保留已勾选项目。
- 支持 ChatGPT 浅色和深色界面。

## 油猴脚本安装（推荐）

1. 在 Chrome 中安装 Tampermonkey。
2. 打开[油猴脚本安装地址](https://raw.githubusercontent.com/OrangeMagician/ChatGPTBatchCleanup/main/chatgpt-batch-cleanup.user.js)。
3. Tampermonkey 打开安装页面后，确认安装并刷新 ChatGPT。

油猴版是单文件脚本，适合个人使用和通过 GitHub 分发，不需要注册 Chrome 网上应用店开发者账号。

## Chrome 扩展安装

1. 下载项目，或运行 `git clone https://github.com/OrangeMagician/ChatGPTBatchCleanup.git`。
2. 打开 `chrome://extensions/`。
3. 开启右上角的“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择项目根目录，然后刷新 ChatGPT。

## 使用方法

1. 点击 ChatGPT 侧栏“最近”标题旁的批量管理按钮。
2. 单击会话进行勾选；再次单击取消勾选。
3. 双击会话仍可进入对应会话，并保留当前选择。
4. 使用工具栏中的当前列表全选、归档或删除按钮执行操作。
5. 在确认弹窗中检查会话标题后确认，工具栏会显示处理进度。
6. 点击高亮的退出按钮可退出选择模式并清空选择。

归档或删除成功的会话会立即从侧栏隐藏。全部处理结束后页面会自动刷新；失败的会话会保留勾选，方便再次操作。确认框会特别提示当前不在侧栏列表中、但因之前勾选而仍将被处理的会话数量。

## 数据与隐私

- 选择状态、会话 ID 和用于确认的会话标题只保存在浏览器本地。
- 不读取或保存会话正文。
- 不保存 ChatGPT 登录令牌。
- 不向开发者或第三方服务器发送数据。
- 归档和删除请求仅发送到当前登录的 ChatGPT 站点。

## 注意事项

- 删除操作不可恢复，请在确认前检查所选会话。
- 本项目依赖 ChatGPT 当前网页结构和私有页面接口，ChatGPT 更新后可能需要同步调整。
- 本项目是非官方工具，与 OpenAI 或 ChatGPT 官方无隶属或合作关系。

## 开发

`content.js` 和 `styles.css` 是 Chrome 扩展与油猴脚本共用的源码。修改任一文件后运行：

```bash
node scripts/build-userscript.mjs
```

该命令会根据当前 `manifest.json` 版本重新生成 `chatgpt-batch-cleanup.user.js`。

提交代码前可以运行：

```bash
node --check content.js
node --check chatgpt-batch-cleanup.user.js
node scripts/build-userscript.mjs --check
```

GitHub Actions 会在推送和拉取请求中执行同样的源码与生成文件一致性检查。

## 开源许可

本项目采用 [MIT License](LICENSE)。

## 项目结构

```text
ChatGPTBatchCleanup/
├── .github/workflows/verify.yml   # GitHub 自动校验
├── chatgpt-batch-cleanup.user.js  # 可直接安装的油猴脚本
├── content.js                     # 功能逻辑
├── icons/                         # Chrome 与油猴图标
├── LICENSE                        # MIT 开源许可证
├── styles.css                     # 界面样式
├── manifest.json                  # Chrome 扩展配置
├── scripts/build-userscript.mjs   # 油猴脚本生成工具
├── README.md                      # 中文说明
└── README_EN.md                   # English documentation
```
