#!/usr/bin/env bash
# ============================================================
# 导出本地 PostgreSQL 数据库
# 用法: ./scripts/db-export.sh [输出文件路径]
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info()  { echo -e "${CYAN}[→]${NC} $1"; }

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 输出文件
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${1:-$BACKUP_DIR/db-backup-${TIMESTAMP}.dump}"

# 数据库连接信息（默认本地开发环境）
DB_USER="${DB_USER:-medusa}"
DB_NAME="${DB_NAME:-medusa_db}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

info "导出本地数据库: ${DB_NAME}@${DB_HOST}:${DB_PORT}"

# 检查 pg_dump 是否可用
if command -v pg_dump &>/dev/null; then
  PGPASSWORD="${DB_PASSWORD:-password}" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    --no-owner \
    --no-acl \
    -f "$OUTPUT_FILE"
else
  # 尝试通过 Docker 容器导出
  info "本地未安装 pg_dump，尝试通过 Docker 容器导出..."
  docker exec dll_postgres pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -Fc \
    --no-owner \
    --no-acl \
    > "$OUTPUT_FILE"
fi

FILE_SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
log "数据库导出完成: $OUTPUT_FILE ($FILE_SIZE)"

# 返回文件路径供其他脚本使用
echo "$OUTPUT_FILE"
