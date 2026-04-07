#!/usr/bin/env bash
# ============================================================
# 将数据库备份导入到服务器
# 用法: ./scripts/db-import.sh <备份文件路径>
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env.production"

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
info()  { echo -e "${CYAN}[→]${NC} $1"; }

# 检查参数
BACKUP_FILE="${1:-}"
if [[ -z "$BACKUP_FILE" || ! -f "$BACKUP_FILE" ]]; then
  error "用法: ./scripts/db-import.sh <备份文件路径>"
fi

# 加载生产环境变量
if [[ ! -f "$ENV_FILE" ]]; then
  error "未找到 $ENV_FILE"
fi

set -a
source "$ENV_FILE"
set +a

SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/dll-store}"
POSTGRES_USER="${POSTGRES_USER:-medusa}"
POSTGRES_DB="${POSTGRES_DB:-medusa_db}"

SSH_CMD="ssh -p $SERVER_PORT -o ConnectTimeout=10"
SSH_TARGET="$SERVER_USER@$SERVER_HOST"
SCP_CMD="scp -P $SERVER_PORT -o ConnectTimeout=10"

REMOTE_TMP="/tmp/dll-db-backup.dump"

# 上传备份文件
FILE_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
info "上传数据库备份到服务器 ($FILE_SIZE)..."
$SCP_CMD "$BACKUP_FILE" "$SSH_TARGET:$REMOTE_TMP"
log "上传完成"

# 在服务器上导入
info "将备份导入服务器数据库..."

$SSH_CMD "$SSH_TARGET" << REMOTE_SCRIPT
set -euo pipefail

cd "$DEPLOY_PATH"

# 将备份文件复制到 postgres 容器
docker cp "$REMOTE_TMP" dll_postgres:/tmp/db-backup.dump

# 执行恢复（--clean 先删除再创建，--if-exists 避免不存在的对象报错）
docker exec dll_postgres pg_restore \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  /tmp/db-backup.dump || true

# 清理容器内临时文件
docker exec dll_postgres rm -f /tmp/db-backup.dump

# 清理服务器临时文件
rm -f "$REMOTE_TMP"

echo "数据库恢复完成"
REMOTE_SCRIPT

log "数据库导入完成"

# 重启 medusa 以加载新数据
info "重启 Medusa 服务..."
$SSH_CMD "$SSH_TARGET" "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml restart medusa"
log "Medusa 已重启"
