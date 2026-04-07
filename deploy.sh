#!/usr/bin/env bash
# ============================================================
# DLL e-commerce -- one-click deploy script
# Flow: local build -> push to ACR -> server pull & start
#
# Usage:
#   ./deploy.sh              build + push + deploy
#   ./deploy.sh --sync-db    deploy + sync database
#   ./deploy.sh --db-only    sync database only
#   ./deploy.sh --skip-build skip build, just deploy (use existing images)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"

# ---------- colors ----------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!!]${NC} $1"; }
error() { echo -e "${RED}[ERR]${NC} $1"; exit 1; }
info()  { echo -e "${CYAN}[->]${NC} $1"; }

# ---------- parse args ----------
SYNC_DB=false
DB_ONLY=false
SKIP_BUILD=false

for arg in "$@"; do
  case ${arg} in
    --sync-db)    SYNC_DB=true ;;
    --db-only)    DB_ONLY=true; SYNC_DB=true ;;
    --skip-build) SKIP_BUILD=true ;;
    --help|-h)
      echo "Usage: ./deploy.sh [options]"
      echo "  --sync-db      deploy then sync local db to server"
      echo "  --db-only      sync database only (no redeploy)"
      echo "  --skip-build   skip local build, deploy with existing images"
      echo "  --help         show this help"
      exit 0
      ;;
    *) error "unknown argument: ${arg}" ;;
  esac
done

# ---------- load .env.production ----------
if [[ ! -f "${ENV_FILE}" ]]; then
  error "not found: ${ENV_FILE}"
fi

load_env() {
  local file="$1"
  while IFS='=' read -r key value; do
    [[ -z "${key}" || "${key}" =~ ^[[:space:]]*# ]] && continue
    key=$(echo "${key}" | xargs)
    value=$(echo "${value}" | xargs)
    export "${key}"="${value}"
  done < "${file}"
}
load_env "${ENV_FILE}"

# ---------- validate ----------
[[ -z "${SERVER_HOST:-}" ]] && error "please set SERVER_HOST in .env.production"
[[ -z "${REGISTRY:-}" ]]    && error "please set REGISTRY in .env.production"
[[ -z "${NAMESPACE:-}" ]]   && error "please set NAMESPACE in .env.production"

SERVER_USER="${SERVER_USER:-root}"
SERVER_PORT="${SERVER_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/dll-store}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

MEDUSA_IMAGE="${REGISTRY}/${NAMESPACE}/dll-medusa:${IMAGE_TAG}"
STOREFRONT_IMAGE="${REGISTRY}/${NAMESPACE}/dll-storefront:${IMAGE_TAG}"

# ---------- auto-generate secrets ----------
generate_secret() { openssl rand -hex 32; }

UPDATED=false

for KEY in JWT_SECRET COOKIE_SECRET POSTGRES_PASSWORD; do
  if [[ -z "${!KEY:-}" ]]; then
    VALUE=$(generate_secret)
    export "${KEY}"="${VALUE}"
    sed -i.bak "s/^${KEY}=\$/${KEY}=${VALUE}/" "${ENV_FILE}"
    UPDATED=true
    log "auto-generated ${KEY}"
  fi
done

rm -f "${ENV_FILE}.bak"

if [[ "${UPDATED}" == true ]]; then
  warn "secrets written to .env.production -- keep it safe"
  load_env "${ENV_FILE}"
fi

# ---------- SSH ----------
SSH_CMD="ssh -p ${SERVER_PORT} -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"
SSH_TARGET="${SERVER_USER}@${SERVER_HOST}"
SCP_CMD="scp -P ${SERVER_PORT} -o ConnectTimeout=10"

info "checking SSH connectivity..."
if ! ${SSH_CMD} "${SSH_TARGET}" "echo ok" &>/dev/null; then
  error "cannot connect to ${SSH_TARGET}:${SERVER_PORT} -- check SSH config"
fi
log "SSH connected: ${SSH_TARGET}"

# ---------- db-only mode ----------
if [[ "${DB_ONLY}" == true ]]; then
  info "db-only mode..."
  bash "${SCRIPT_DIR}/scripts/db-sync.sh"
  log "database sync done"
  exit 0
fi

# ============================================================
# Phase 1: Local Build & Push
# ============================================================

if [[ "${SKIP_BUILD}" == false ]]; then
  info "logging in to ACR..."
  docker login "${REGISTRY}" || error "ACR login failed. Run: docker login ${REGISTRY}"

  # -- build medusa --
  info "building medusa image (linux/amd64)..."
  docker build \
    --platform linux/amd64 \
    -f "${SCRIPT_DIR}/medusa-nextjs-ecommerce/Dockerfile.prod" \
    -t "${MEDUSA_IMAGE}" \
    "${SCRIPT_DIR}/medusa-nextjs-ecommerce"
  log "medusa image built"

  # -- build storefront --
  info "building storefront image (linux/amd64)..."
  docker build \
    --platform linux/amd64 \
    -f "${SCRIPT_DIR}/medusa-nextjs-ecommerce-storefront/Dockerfile.prod" \
    -t "${STOREFRONT_IMAGE}" \
    --build-arg "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:-}" \
    --build-arg "NEXT_PUBLIC_BASE_URL=http://${SERVER_HOST}:8000" \
    --build-arg "NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION:-us}" \
    --build-arg "NEXT_PUBLIC_STRIPE_KEY=${NEXT_PUBLIC_STRIPE_KEY:-}" \
    --build-arg "MEDUSA_BACKEND_URL=http://medusa:9000" \
    "${SCRIPT_DIR}/medusa-nextjs-ecommerce-storefront"
  log "storefront image built"

  # -- push --
  info "pushing images to ACR..."
  docker push "${MEDUSA_IMAGE}"
  docker push "${STOREFRONT_IMAGE}"
  log "images pushed"
else
  info "skipping build (--skip-build)"
fi

# ============================================================
# Phase 2: Server Deploy
# ============================================================

info "preparing server..."
${SSH_CMD} "${SSH_TARGET}" "mkdir -p ${DEPLOY_PATH}"

# -- generate server .env --
STORE_CORS="http://${SERVER_HOST}:8000"
ADMIN_CORS="http://${SERVER_HOST}:9000"
AUTH_CORS="http://${SERVER_HOST}:9000,http://${SERVER_HOST}:8000"

ENV_CONTENT="# DLL production env -- generated by deploy.sh at $(date)
REGISTRY=${REGISTRY}
NAMESPACE=${NAMESPACE}
IMAGE_TAG=${IMAGE_TAG}

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
NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION:-us}"

echo "${ENV_CONTENT}" | ${SSH_CMD} "${SSH_TARGET}" "cat > ${DEPLOY_PATH}/.env"
log "server .env generated"

# -- upload docker-compose.prod.yml --
${SCP_CMD} "${SCRIPT_DIR}/docker-compose.prod.yml" "${SSH_TARGET}:${DEPLOY_PATH}/docker-compose.prod.yml"
log "docker-compose.prod.yml uploaded"

# -- login & pull on server --
info "pulling images on server..."
${SSH_CMD} "${SSH_TARGET}" "
  docker login ${REGISTRY} -u ${REGISTRY_USER:-} --password-stdin <<< '${REGISTRY_PASSWORD:-}' 2>/dev/null || true
  cd ${DEPLOY_PATH}
  docker compose -f docker-compose.prod.yml pull medusa storefront
"
log "images pulled"

# -- start services --
info "starting services..."
${SSH_CMD} "${SSH_TARGET}" "cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml up -d" 2>&1 | tail -20
log "services started"

# ---------- health check ----------
info "waiting for services..."

MAX_WAIT=120
WAITED=0

while [[ ${WAITED} -lt ${MAX_WAIT} ]]; do
  STATUS=$(${SSH_CMD} "${SSH_TARGET}" "cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml ps --format '{{.Service}} {{.State}}' 2>/dev/null" || echo "")

  MEDUSA_UP=$(echo "${STATUS}" | grep -c "medusa.*running" || true)
  STORE_UP=$(echo "${STATUS}" | grep -c "storefront.*running" || true)

  if [[ "${MEDUSA_UP}" -ge 1 && "${STORE_UP}" -ge 1 ]]; then
    break
  fi

  sleep 5
  WAITED=$((WAITED + 5))
  echo -n "."
done
echo ""

if [[ ${WAITED} -ge ${MAX_WAIT} ]]; then
  warn "startup timeout -- check logs on server:"
  warn "  ssh ${SSH_TARGET} 'cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml logs --tail 50'"
else
  log "all services running"
fi

# ---------- sync db (optional) ----------
if [[ "${SYNC_DB}" == true ]]; then
  info "syncing database..."
  bash "${SCRIPT_DIR}/scripts/db-sync.sh"
  log "database sync done"
fi

# ---------- summary ----------
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DLL Deploy Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  Storefront:  ${CYAN}http://${SERVER_HOST}:8000${NC}"
echo -e "  Admin Panel: ${CYAN}http://${SERVER_HOST}:9000/app${NC}"
echo ""
echo -e "  Images:"
echo -e "    ${MEDUSA_IMAGE}"
echo -e "    ${STOREFRONT_IMAGE}"
echo ""
echo -e "  Server path: ${DEPLOY_PATH}"
echo ""
echo -e "  Commands (on server):"
echo -e "    logs:    cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml logs -f"
echo -e "    restart: cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml restart"
echo -e "    stop:    cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml down"
echo ""
