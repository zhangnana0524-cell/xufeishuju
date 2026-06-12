#!/bin/bash

# 快速推送脚本
# 使用方法: bash push.sh

echo "📤 推送代码到GitHub..."
echo ""

# 确认GitHub仓库已创建
read -p "✓ 你已在GitHub创建了 renewal-dashboard 仓库吗? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 请先在 https://github.com/new 创建仓库"
    exit 1
fi

# 推送代码
echo ""
echo "🔗 配置GitHub远程仓库..."
git remote set-url origin https://github.com/zhangnana0524-cell/renewal-dashboard.git

echo "📤 推送代码..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "🎉 下一步：部署到Vercel"
    echo "   访问: https://vercel.com/new"
    echo "   选择你的 renewal-dashboard 仓库"
    echo "   点击 Deploy"
    echo ""
    echo "或者用CLI一键部署:"
    echo "   vercel"
else
    echo "❌ 推送失败，请检查GitHub仓库设置"
    exit 1
fi
