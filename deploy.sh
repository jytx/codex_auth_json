#!/bin/bash
# 部署脚本：构建并上传到服务器
set -e

# ===== 配置项（按实际情况修改） =====
REMOTE_USER="root"
REMOTE_HOST="your-server-ip"
REMOTE_PATH="/var/www/codex-auth-json"
NGINX_CONF_NAME="codex-auth-json"
SSH_KEY="$HOME/.ssh/id_rsa"   # 私钥路径，按实际修改
# =====================================

# SSH / SCP / rsync 公共参数
SSH_OPTS="-i ${SSH_KEY} -o StrictHostKeyChecking=no"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo ">>> 1. 构建静态文件..."
cd "$PROJECT_DIR"
pnpm build

echo ">>> 2. 创建远程目录..."
ssh ${SSH_OPTS} "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}"

echo ">>> 3. 上传文件..."
rsync -avz --delete -e "ssh ${SSH_OPTS}" "${PROJECT_DIR}/out/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

echo ">>> 4. 上传 Nginx 配置..."
scp ${SSH_OPTS} "${SCRIPT_DIR}/deploy/nginx.conf" "${REMOTE_USER}@${REMOTE_HOST}:/etc/nginx/sites-available/${NGINX_CONF_NAME}"

echo ">>> 5. 启用站点并重载 Nginx..."
ssh ${SSH_OPTS} "${REMOTE_USER}@${REMOTE_HOST}" bash -s <<REMOTE_SCRIPT
set -e
# 创建软链接（如果不存在）
if [ ! -L "/etc/nginx/sites-enabled/${NGINX_CONF_NAME}" ]; then
    ln -s "/etc/nginx/sites-available/${NGINX_CONF_NAME}" "/etc/nginx/sites-enabled/${NGINX_CONF_NAME}"
    echo "已启用 Nginx 站点配置"
fi

# 检查配置语法
nginx -t

# 重载 Nginx
systemctl reload nginx
echo "Nginx 已重载"
REMOTE_SCRIPT

echo ""
echo ">>> 部署完成！"
echo "    访问地址: http://${REMOTE_HOST}"
echo "    请记得修改 nginx.conf 中的 server_name 为你的域名"
