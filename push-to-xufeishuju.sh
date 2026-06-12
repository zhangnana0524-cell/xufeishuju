#!/bin/bash

# 推送脚本 - 推送到 xufeishuju 仓库
# 使用方法: bash push-to-xufeishuju.sh

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         正在推送代码到 xufeishuju 仓库...                    ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 检查git状态
echo "📋 检查Git状态..."
git status

echo ""
echo "🔧 配置信息:"
echo "  用户名: zhangnana0524-cell"
echo "  仓库: xufeishuju"
echo "  分支: main"
echo ""

# 确认推送
read -p "确认推送? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消推送"
    exit 1
fi

echo ""
echo "📤 正在推送代码..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功!"
    echo ""
    echo "🎉 现在可以在Vercel部署了"
    echo "   访问: https://vercel.com/new"
    echo "   选择: xufeishuju"
    echo "   部署"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "💡 可能的原因:"
    echo "  1. GitHub凭证错误"
    echo "  2. xufeishuju仓库不存在"
    echo "  3. 网络连接问题"
    echo ""
    echo "📝 请检查:"
    echo "  • 仓库是否在: https://github.com/zhangnana0524-cell/xufeishuju"
    echo "  • GitHub账户是否是 zhangnana0524-cell"
    echo "  • 仓库是否是 Public"
    exit 1
fi
