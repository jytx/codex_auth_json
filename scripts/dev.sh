#!/bin/bash
# 开发环境启动脚本
set -e

cd "$(dirname "$0")/.."

LOGS_DIR="logs"
mkdir -p "$LOGS_DIR"

echo "正在启动开发服务器..."
pnpm dev -H 0.0.0.0 2>&1 | tee "$LOGS_DIR/dev.log"
