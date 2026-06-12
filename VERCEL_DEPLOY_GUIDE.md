# 🚀 Vercel部署完整指南

## 📋 部署流程概览

```
1. 创建GitHub仓库 (GitHub.com)
   ↓
2. 推送代码到GitHub (你的终端)
   ↓
3. 连接GitHub到Vercel (Vercel.com)
   ↓
4. 自动部署并获得在线链接 ✓
```

---

## 🎯 详细步骤

### Step 1️⃣: 在GitHub创建仓库 (2分钟)

**打开**: https://github.com/new

**填写信息**:
```
Repository name: renewal-dashboard
Description: 续费数据看板 - 实时分析班级续费情况
Visibility: 🔓 Public (必须选Public)
```

**不要选择以下选项**:
- ☐ Initialize this repository with a README
- ☐ Add .gitignore
- ☐ Add a license

**点击**: "Create repository" 绿色按钮

---

### Step 2️⃣: 推送代码到GitHub (3分钟)

**在终端执行**:

```bash
cd /Users/wuwei/Documents/renewal-dashboard
```

**执行推送命令**:

```bash
git remote set-url origin https://github.com/zhangnana0524-cell/renewal-dashboard.git
git push -u origin main
```

**输入凭证**:
- Username: `zhangnana0524-cell`
- Password: 输入你的GitHub密码或Personal Access Token

> **如果不知道密码**: 
> 1. 访问 https://github.com/settings/tokens
> 2. 点击 "Generate new token (classic)"
> 3. 勾选 "repo" 权限
> 4. 点击 "Generate token"
> 5. 复制token，粘贴到密码字段

**验证成功**:
```
✓ 看到这样的消息表示推送成功:
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### Step 3️⃣: 在Vercel部署 (5分钟)

#### 方式A: 通过Vercel网站（推荐）

**1. 访问**: https://vercel.com/new

**2. 选择GitHub登录**:
- 点击 "GitHub" 按钮
- 使用你的GitHub账户登录
- 授予Vercel访问权限

**3. 选择仓库**:
- 搜索: `renewal-dashboard`
- 找到后点击 "Import"

**4. 配置项目** (可以全部保持默认):
- Framework Preset: `Vite` (应该自动选择)
- Root Directory: `.`
- Build Command: `npm run build` (默认)
- Output Directory: `dist` (默认)

**5. 点击**: "Deploy" 按钮

**6. 等待部署** (通常1-2分钟):
- 看到 "Deployment successful" 表示完成

---

#### 方式B: 使用Vercel CLI (更快)

**1. 安装Vercel CLI**:
```bash
npm install -g vercel
```

**2. 运行部署命令**:
```bash
cd /Users/wuwei/Documents/renewal-dashboard
vercel
```

**3. 按照提示操作**:
```
? Set up and deploy "~/renewal-dashboard"? [Y/n] → Y

? Which scope should contain your new Project? 
→ 你的Vercel账户

? What's your project's name? 
→ renewal-dashboard

? In which directory is your code located? 
→ .

? Want to modify these settings? [y/N] → N

✓ 部署完成！
```

---

## ✅ 部署完成！

看到类似的输出表示成功:
```
✓ Production: https://renewal-dashboard-xxxxx.vercel.app
✓ Preview: https://renewal-dashboard-xxx-git-main-xxxxx.vercel.app
```

**你的看板在线链接**:
```
https://renewal-dashboard-xxxxx.vercel.app
```

---

## 🧪 测试你的看板

1. **打开链接**: https://renewal-dashboard-xxxxx.vercel.app
2. **上传Excel文件**: 拖拽或点击上传
3. **查看数据**: 看板应该显示续费分析数据

---

## 🔄 后续更新

修改代码后的更新非常简单:

```bash
# 修改代码...

# 提交更新
git add .
git commit -m "feat: your changes description"
git push

# Vercel会自动重新部署 (1-2分钟后)
```

---

## ❓ 常见问题

### Q: 推送到GitHub时显示 "Permission denied"

**A**: 
```bash
# 重新配置git凭证
git config --global user.name "zhangnana0524-cell"
git config --global user.email "zhangnana0524@example.com"

# 或者使用SSH密钥（高级）
# 访问: https://github.com/settings/keys
```

### Q: Vercel部署失败

**A**: 
1. 检查构建日志: 在Vercel网站查看 "Deployments" 标签
2. 确保GitHub仓库是Public的
3. 尝试从Vercel重新部署

### Q: 看板显示为空白

**A**:
1. 打开浏览器开发者工具 (F12)
2. 检查 Console 标签的错误信息
3. 尝试清除浏览器缓存
4. 等待30秒，Vercel可能还在构建

### Q: 如何删除部署

**A**:
1. 在Vercel仪表板删除项目
2. 在GitHub删除仓库
3. 或者在GitHub设置中禁用Vercel授权

---

## 📚 有用的链接

- Vercel文档: https://vercel.com/docs
- GitHub帮助: https://docs.github.com
- 本项目GitHub: https://github.com/zhangnana0524-cell/renewal-dashboard

---

## 🎉 大功告成！

现在你有了一个:
- ✅ 在线可访问的看板
- ✅ 自动化部署流程
- ✅ 实时更新的应用
- ✅ 可分享的链接

**分享你的看板给团队**:
```
https://renewal-dashboard-xxxxx.vercel.app
```

**现在就开始吧！** 🚀
