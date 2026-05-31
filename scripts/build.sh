#!/bin/bash
# 构建脚本
set -e

cd "$(dirname "$0")/.."

LOGS_DIR="logs"
mkdir -p "$LOGS_DIR"

echo "正在构建项目..."
pnpm build 2>&1 | tee "$LOGS_DIR/build.log"
echo "构建完成。"
