# 部署指南

本文档说明如何将续费数据看板部署到Vercel等云服务。

## 快速开始（Vercel）

### 方法1：通过GitHub部署（推荐）

1. **初始化Git仓库**
   ```bash
   cd renewal-dashboard
   git init
   git add .
   git commit -m "Initial commit: Renewal Dashboard"
   ```

2. **推送到GitHub**
   - 在GitHub创建新仓库 `renewal-dashboard`
   - 按照GitHub提示推送代码

3. **连接到Vercel**
   - 访问 https://vercel.com
   - 点击"New Project"
   - 选择你的GitHub仓库
   - Vercel会自动检测到Vite项目
   - 点击"Deploy"

4. **部署完成**
   - Vercel会生成一个公开URL
   - 每次git push都会自动重新部署

### 方法2：使用Vercel CLI部署

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel
   ```

3. **按提示配置**
   - 选择team（或创建新account）
   - 链接到现有项目或创建新项目
   - 选择部署目录（dist）

## 其他部署选项

### Netlify

1. 访问 https://netlify.com
2. 点击"New site from Git"
3. 连接GitHub账户
4. 选择仓库
5. 构建命令：`npm run build`
6. 发布目录：`dist`

### GitHub Pages

1. 修改`vite.config.js`添加base：
   ```javascript
   export default {
     base: '/renewal-dashboard/',
   }
   ```

2. 更新`package.json`的build脚本并部署到gh-pages分支

## 环境变量（如果需要）

目前应用不需要环境变量，所有处理都在浏览器端进行。

## 预部署检查清单

- [ ] 本地运行 `npm run dev` 测试功能
- [ ] 上传Excel文件验证数据解析
- [ ] 检查图表显示正常
- [ ] 验证导出CSV功能
- [ ] 运行 `npm run build` 确保构建成功
- [ ] 在dist目录生成的文件可以正常加载

## 部署后检查

- [ ] 打开公开URL并验证页面加载
- [ ] 上传Excel文件测试功能
- [ ] 在不同浏览器和设备上测试
- [ ] 检查控制台是否有错误信息

## 常见问题

### Q: 部署后看板为空？
A: 检查浏览器控制台是否有错误。通常是因为未上传Excel文件。

### Q: Excel文件上传后没有反应？
A: 
1. 确保Excel文件格式正确
2. 检查浏览器控制台的错误消息
3. 验证Excel包含必要的列

### Q: 如何更新已部署的看板？
A: 
- 若使用GitHub + Vercel/Netlify：git push会自动触发重新部署
- 若使用Vercel CLI：再次运行 `vercel` 命令

## 性能优化建议

当前应用使用了以下优化：
- Vite的代码分割和tree-shaking
- Recharts的轻量级图表库
- Tailwind CSS的按需样式加载

对于超大型Excel文件（>50MB），可能需要：
1. 实现虚拟滚动
2. 增加数据分页处理
3. 使用worker处理数据

## 需要帮助？

- Vercel文档：https://vercel.com/docs
- Netlify文档：https://docs.netlify.com
- React文档：https://react.dev
- Vite文档：https://vite.dev
