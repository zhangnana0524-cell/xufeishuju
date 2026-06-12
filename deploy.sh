#!/bin/bash

# 续费数据看板 - 快速部署脚本
# GitHub用户名: zhangnana0524-cell

set -e  # 遇到错误立即退出

echo "🚀 开始部署续费数据看板..."
echo ""

# 检查Git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

# 初始化Git
echo "📝 Step 1: 初始化Git仓库..."
git init
git config user.email "zhangnana0524@example.com"
git config user.name "zhangnana0524-cell"

# 添加所有文件
echo "📦 Step 2: 提交代码..."
git add .
git commit -m "feat: Initial commit - Renewal Dashboard v1.1.0

- React + Vite 续费数据可视化看板
- 支持Excel文件上传和实时分析
- 自动排除退费/休学学生
- 多维度图表展示（级别、教师、班级）
- 导出CSV数据功能
- 响应式设计，支持移动设备"

# 设置main分支
echo "🔗 Step 3: 连接到GitHub..."
git branch -M main
git remote add origin https://github.com/zhangnana0524-cell/renewal-dashboard.git

# 推送到GitHub
echo "📤 Step 4: 推送代码到GitHub..."
git push -u origin main

echo ""
echo "✅ 代码推送完成！"
echo ""
echo "🎉 现在请访问 https://vercel.com/new"
echo "   1. 使用GitHub登录"
echo "   2. 选择 renewal-dashboard 仓库"
echo "   3. 点击 Deploy"
echo ""
echo "⏱️  部署通常需要 1-2 分钟"
echo "🌐 部署完成后，你会获得一个类似这样的链接:"
echo "   https://renewal-dashboard-xxxx.vercel.app"
echo ""
echo "提示: 也可以运行 'vercel' 命令进行一键自动部署"
