#!/usr/bin/env bash
# ============================================================
# 一键同步本地数据库到服务器
# 用法: ./scripts/db-sync.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[→]${NC} $1"; }

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  数据库同步: 本地 → 服务器${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Step 1: 导出本地数据库
info "Step 1/2: 导出本地数据库..."
BACKUP_FILE=$("$SCRIPT_DIR/db-export.sh" | tail -1)

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo -e "\033[0;31m[✗]\033[0m 导出失败"
  exit 1
fi

# Step 2: 导入到服务器
info "Step 2/2: 导入到服务器..."
"$SCRIPT_DIR/db-import.sh" "$BACKUP_FILE"

echo ""
log "数据库同步完成！"
echo ""
