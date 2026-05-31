#!/bin/bash
# 生产环境启动脚本
set -e

cd "$(dirname "$0")/.."

LOGS_DIR="logs"
mkdir -p "$LOGS_DIR"

echo "正在启动生产服务器..."
pnpm start 2>&1 | tee "$LOGS_DIR/prod.log"
