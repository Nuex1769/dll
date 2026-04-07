#!/usr/bin/env bash
# ============================================================
# DLL 电商 — 一键部署脚本
# 用法:
#   ./deploy.sh              部署代码并启动服务
#   ./deploy.sh --sync-db    部署 + 同步数据库
#   ./deploy.sh --db-only    仅同步数据库
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.production"

# ---------- 颜色输出 ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info()  { echo -e "${CYAN}[→]${NC} $1"; }

# ---------- 解析参数 ----------
SYNC_DB=false
DB_ONLY=false

for arg in "$@"; do
  case $arg in
    --sync-db)  SYNC_DB=true ;;
    --db-only)  DB_ONLY=true; SYNC_DB=true ;;
    --help|-h)
      echo "用法: ./deploy.sh [选项]"
      echo "  --sync-db    部署后同步本地数据库到服务器"
      echo "  --db-only    仅同步数据库（不重新部署代码）"
      echo "  --help       显示帮助信息"
      exit 0
      ;;
    *) error "未知参数: $arg" ;;
  esac
done

# ---------- 检查 .env.production ----------
if [[ ! -f "$ENV_FILE" ]]; then
  error "未找到 $ENV_FILE，请先创建并填写服务器信息"
fi

# 加载环境变量
set -a
source "$ENV_FILE"
set +a

# ---------- 校验必填项 ----------
if [[ "${SERVER_HOST:-}" == "your_server_ip" || -z "${SERVER_HOST:-}" ]]; then
  error "请在 .env.production 中设置 SERVER_HOST（服务器 IP 地址）"
fi

SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/dll-store}"

# ---------- 自动生成空密钥 ----------
generate_secret() {
  openssl rand -hex 32
}

UPDATED=false

if [[ -z "${JWT_SECRET:-}" ]]; then
  JWT_SECRET=$(generate_secret)
  sed -i.bak "s/^JWT_SECRET=$/JWT_SECRET=$JWT_SECRET/" "$ENV_FILE"
  UPDATED=true
  log "已自动生成 JWT_SECRET"
fi

if [[ -z "${COOKIE_SECRET:-}" ]]; then
  COOKIE_SECRET=$(generate_secret)
  sed -i.bak "s/^COOKIE_SECRET=$/COOKIE_SECRET=$COOKIE_SECRET/" "$ENV_FILE"
  UPDATED=true
  log "已自动生成 COOKIE_SECRET"
fi

if [[ -z "${POSTGRES_PASSWORD:-}" ]]; then
  POSTGRES_PASSWORD=$(generate_secret)
  sed -i.bak "s/^POSTGRES_PASSWORD=$/POSTGRES_PASSWORD=$POSTGRES_PASSWORD/" "$ENV_FILE"
  UPDATED=true
  log "已自动生成 POSTGRES_PASSWORD"
fi

# 清理 sed 备份文件
rm -f "$ENV_FILE.bak"

if [[ "$UPDATED" == true ]]; then
  warn "密钥已写入 .env.production，请妥善保管"
  # 重新加载
  set -a
  source "$ENV_FILE"
  set +a
fi

# ---------- SSH 配置 ----------
SSH_CMD="ssh -p $SERVER_PORT -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"
SSH_TARGET="$SERVER_USER@$SERVER_HOST"
SCP_CMD="scp -P $SERVER_PORT -o ConnectTimeout=10"

# ---------- 检查 SSH 连通性 ----------
info "检查服务器 SSH 连通性..."
if ! $SSH_CMD "$SSH_TARGET" "echo ok" &>/dev/null; then
  error "无法连接到 $SSH_TARGET:$SERVER_PORT，请检查 SSH 配置"
fi
log "SSH 连接成功: $SSH_TARGET"

# ---------- 检查服务器 Docker ----------
info "检查服务器 Docker 环境..."
if ! $SSH_CMD "$SSH_TARGET" "command -v docker &>/dev/null && docker compose version &>/dev/null"; then
  error "服务器未安装 Docker 或 Docker Compose。请先在服务器上安装：
    curl -fsSL https://get.docker.com | sh
    sudo systemctl enable --now docker"
fi
log "Docker 环境就绪"

# ---------- 仅同步数据库 ----------
if [[ "$DB_ONLY" == true ]]; then
  info "仅同步数据库模式..."
  bash "$SCRIPT_DIR/scripts/db-sync.sh"
  log "数据库同步完成"
  exit 0
fi

# ---------- 同步代码到服务器 ----------
info "同步项目文件到服务器 $DEPLOY_PATH ..."

$SSH_CMD "$SSH_TARGET" "mkdir -p $DEPLOY_PATH"

rsync -avz --progress \
  -e "ssh -p $SERVER_PORT" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.medusa' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  --exclude '.git' \
  --exclude 'backups' \
  --exclude 'medusa-nextjs-ecommerce.bak' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --delete \
  "$SCRIPT_DIR/" "$SSH_TARGET:$DEPLOY_PATH/"

log "代码同步完成"

# ---------- 生成服务器端 .env 文件 ----------
info "生成服务器端环境变量..."

# CORS 使用服务器 IP
STORE_CORS="http://${SERVER_HOST}:8000"
ADMIN_CORS="http://${SERVER_HOST}:9000"
AUTH_CORS="http://${SERVER_HOST}:9000,http://${SERVER_HOST}:8000"

cat > /tmp/dll-prod.env << EOF
# DLL 生产环境 — 由 deploy.sh 自动生成
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}

POSTGRES_USER=${POSTGRES_USER:-medusa}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB:-medusa_db}

STORE_CORS=${STORE_CORS}
ADMIN_CORS=${ADMIN_CORS}
AUTH_CORS=${AUTH_CORS}

STRIPE_API_KEY=${STRIPE_API_KEY:-}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}
NEXT_PUBLIC_STRIPE_KEY=${NEXT_PUBLIC_STRIPE_KEY:-}

NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:-}
NEXT_PUBLIC_BASE_URL=http://${SERVER_HOST}:8000
NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION:-us}
EOF

$SCP_CMD /tmp/dll-prod.env "$SSH_TARGET:$DEPLOY_PATH/.env"
rm -f /tmp/dll-prod.env

log "环境变量已上传"

# ---------- 构建并启动服务 ----------
info "在服务器上构建并启动服务（可能需要几分钟）..."

$SSH_CMD "$SSH_TARGET" "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml up -d --build" 2>&1 | tail -20

log "服务启动命令已执行"

# ---------- 等待健康检查 ----------
info "等待服务启动..."

MAX_WAIT=120
WAITED=0

while [[ $WAITED -lt $MAX_WAIT ]]; do
  # 检查 medusa 容器是否运行中
  STATUS=$($SSH_CMD "$SSH_TARGET" "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml ps --format '{{.Service}} {{.State}}' 2>/dev/null" || echo "")

  MEDUSA_UP=$(echo "$STATUS" | grep -c "medusa.*running" || true)
  STORE_UP=$(echo "$STATUS" | grep -c "storefront.*running" || true)

  if [[ "$MEDUSA_UP" -ge 1 && "$STORE_UP" -ge 1 ]]; then
    break
  fi

  sleep 5
  WAITED=$((WAITED + 5))
  echo -n "."
done
echo ""

if [[ $WAITED -ge $MAX_WAIT ]]; then
  warn "服务启动超时，请手动检查："
  warn "  $SSH_CMD $SSH_TARGET 'cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml logs --tail 50'"
else
  log "所有服务已启动"
fi

# ---------- 同步数据库（可选）----------
if [[ "$SYNC_DB" == true ]]; then
  info "开始同步数据库..."
  bash "$SCRIPT_DIR/scripts/db-sync.sh"
  log "数据库同步完成"
fi

# ---------- 输出访问信息 ----------
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DLL 电商部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  店面:     ${CYAN}http://${SERVER_HOST}:8000${NC}"
echo -e "  管理后台: ${CYAN}http://${SERVER_HOST}:9000/app${NC}"
echo ""
echo -e "  服务器路径: ${DEPLOY_PATH}"
echo ""
echo -e "  常用命令（在服务器上）："
echo -e "    查看日志:   cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml logs -f"
echo -e "    重启服务:   cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml restart"
echo -e "    停止服务:   cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml down"
echo ""
