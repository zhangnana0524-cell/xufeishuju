# ✅ 部署前检查清单

在开始部署前，请确认以下内容:

## 📋 账户准备

- [ ] 有GitHub账户 (https://github.com)
  - 用户名: `zhangnana0524-cell`
  
- [ ] 有Vercel账户 (https://vercel.com)
  - 可以直接用GitHub登录

## 🔑 凭证准备

- [ ] 知道GitHub密码
  
  如果不记得:
  - [ ] 访问 https://github.com/settings/tokens
  - [ ] 点击 "Generate new token (classic)"
  - [ ] 勾选 "repo" 权限
  - [ ] 生成并保存token
  
## 💻 本地准备

在终端运行检查:

```bash
# 检查Node.js是否安装
node --version
# 应该显示 v16+ 的版本

# 检查npm是否安装
npm --version
# 应该显示 v7+ 的版本

# 检查git是否安装
git --version
# 应该显示git版本

# 检查项目目录
cd /Users/wuwei/Documents/renewal-dashboard
ls -la | grep -E "^d.*src|^-.*package.json|^-.*vite.config"
# 应该看到 src/, package.json, vite.config.js
```

## 🚀 部署前最后检查

```bash
cd /Users/wuwei/Documents/renewal-dashboard

# 检查git状态
git status
# 应该显示: "On branch main, nothing to commit"

# 检查构建是否成功
npm run build
# 应该显示: "✓ built in X.XXs"

# 查看dist目录
ls -la dist/
# 应该显示生成的文件
```

## ✨ 所有检查都通过了?

那就可以开始部署了! 🎉

### 快速部署 (3步)

1. **创建GitHub仓库**
   - 访问: https://github.com/new
   - 名称: `renewal-dashboard`
   - Visibility: Public
   - 创建

2. **推送代码**
   ```bash
   cd /Users/wuwei/Documents/renewal-dashboard
   git remote set-url origin https://github.com/zhangnana0524-cell/renewal-dashboard.git
   git push -u origin main
   ```

3. **部署到Vercel**
   - 访问: https://vercel.com/new
   - 用GitHub登录
   - 选择 renewal-dashboard
   - 点击 Deploy

---

## 📝 部署过程中可能遇到的问题

### "Authentication failed"
- 检查用户名: `zhangnana0524-cell`
- 检查密码/token是否正确
- 尝试重新生成GitHub token

### "Repository not found"
- 确保GitHub仓库已创建
- 确保仓库名是 `renewal-dashboard`
- 检查URL是否正确: `https://github.com/zhangnana0524-cell/renewal-dashboard.git`

### "Push rejected"
- 确保本地有最新提交
- 运行 `git log` 确认有提交
- 尝试 `git push --force-with-lease` (谨慎使用)

### Vercel部署失败
- 查看Vercel仪表板的部署日志
- 检查是否有构建错误
- 确保framework正确识别为Vite
- 尝试从Vercel重新部署

---

## 🎯 如果一切都准备好了

**执行这3个命令，你的看板就会上线!**

```bash
# 1. 设置GitHub远程
git remote set-url origin https://github.com/zhangnana0524-cell/renewal-dashboard.git

# 2. 推送代码
git push -u origin main

# 3. 在Vercel部署
# (访问 https://vercel.com/new 完成)
```

---

**准备好了?** 让我们开始吧! 🚀
