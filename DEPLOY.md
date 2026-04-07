# DLL 电商 - 部署指南

## 架构

```
本地 Mac                         阿里云 ACR                     生产服务器
+-----------------+              +---------------+              +------------------+
| docker build    | -- push -->  | dll-medusa    | -- pull -->  | docker compose   |
| docker push     |              | dll-storefront|              | postgres + redis |
+-----------------+              +---------------+              +------------------+
```

**流程**: 本地构建镜像 -> 推送到阿里云 ACR -> 服务器拉取镜像启动

---

## 前置条件

### 本地
- Docker Desktop (已安装)
- SSH 免密登录到服务器 (`ssh-copy-id root@39.108.176.164`)

### 服务器
- Docker + Docker Compose
- 开放端口: 8000 (店面)、9000 (后台管理)

```bash
# 安装 Docker (如果未安装)
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
```

### 阿里云 ACR
- 已开通容器镜像服务: https://cr.console.aliyun.com/
- 命名空间: `dll-store`
- 需要在 ACR 控制台创建两个镜像仓库: `dll-medusa` 和 `dll-storefront`

---

## 一键部署

### Step 1: 配置 .env.production

填写 `REGISTRY_PASSWORD` (阿里云 ACR 密码):

```bash
# 在项目根目录
vim .env.production
# 填入 REGISTRY_PASSWORD=你的ACR密码
```

### Step 2: 执行部署

```bash
./deploy.sh
```

脚本会自动完成:
1. 本地构建 medusa + storefront Docker 镜像
2. 推送到阿里云 ACR
3. SSH 到服务器上传 .env 和 docker-compose.prod.yml
4. 服务器拉取镜像并启动所有服务
5. 健康检查确认服务正常

### 部署选项

```bash
./deploy.sh              # 完整部署 (构建+推送+启动)
./deploy.sh --skip-build # 跳过构建, 直接部署已有镜像
./deploy.sh --sync-db    # 部署 + 同步本地数据库
./deploy.sh --db-only    # 仅同步数据库
```

---

## 手动部署 (在服务器上操作)

如果不用一键脚本, 可以手动操作:

### Step 1: 本地构建并推送镜像

```bash
# 登录 ACR
docker login crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com

# 构建
docker build -f medusa-nextjs-ecommerce/Dockerfile.prod \
  -t crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com/dll-store/dll-medusa:latest \
  medusa-nextjs-ecommerce

docker build -f medusa-nextjs-ecommerce-storefront/Dockerfile.prod \
  -t crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com/dll-store/dll-storefront:latest \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_383c3e202b5e9da847c6b3896207d5625dd2db7e35e83aea942a55de858e8f22 \
  --build-arg NEXT_PUBLIC_BASE_URL=http://39.108.176.164:8000 \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION=us \
  --build-arg MEDUSA_BACKEND_URL=http://medusa:9000 \
  medusa-nextjs-ecommerce-storefront

# 推送
docker push crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com/dll-store/dll-medusa:latest
docker push crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com/dll-store/dll-storefront:latest
```

### Step 2: 服务器上创建目录和配置

```bash
ssh root@39.108.176.164

mkdir -p /opt/dll-store
cd /opt/dll-store

# 创建 .env
cat > .env << 'EOF'
REGISTRY=crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com
NAMESPACE=dll-store
IMAGE_TAG=latest

JWT_SECRET=51194cdeb1f767484d553aa7fb3c825e465c39a5ca3115558dd24d434d66640f
COOKIE_SECRET=ca70f633c7f9f78e177d3c4d8bd53dbb9c811de357e6f62494f36495fcd5b870

POSTGRES_USER=medusa
POSTGRES_PASSWORD=59c9c057416a16dd3f59e800defd8279526278a5c5cb90b4fe5893ef23f07a77
POSTGRES_DB=medusa_db

STORE_CORS=http://39.108.176.164:8000
ADMIN_CORS=http://39.108.176.164:9000
AUTH_CORS=http://39.108.176.164:9000,http://39.108.176.164:8000

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_KEY=

NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_383c3e202b5e9da847c6b3896207d5625dd2db7e35e83aea942a55de858e8f22
NEXT_PUBLIC_BASE_URL=http://39.108.176.164:8000
NEXT_PUBLIC_DEFAULT_REGION=us
EOF
```

### Step 3: 上传 docker-compose.prod.yml

```bash
# 在本地执行
scp docker-compose.prod.yml root@39.108.176.164:/opt/dll-store/
```

### Step 4: 拉取镜像并启动

```bash
# 在服务器上
cd /opt/dll-store

# 登录 ACR
docker login crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com

# 拉取并启动
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### Step 5: 确认服务状态

```bash
docker compose -f docker-compose.prod.yml ps
```

4 个容器都是 `running` 即部署成功:

```
NAME             STATUS
dll_postgres     running (healthy)
dll_redis        running (healthy)
dll_medusa       running
dll_storefront   running
```

---

## 访问地址

| 服务 | 地址 |
|------|------|
| 店面 | http://39.108.176.164:8000 |
| 管理后台 | http://39.108.176.164:9000/app |

---

## 同步本地数据库到服务器

### 本地导出

```bash
# 方式 A: 本地直接安装了 PostgreSQL
PGPASSWORD=password pg_dump \
  -h localhost -p 5432 -U medusa -d medusa_db \
  -Fc --no-owner --no-acl -f /tmp/db-backup.dump

# 方式 B: 本地用 Docker 运行 PostgreSQL
docker exec dll_postgres pg_dump \
  -U medusa -d medusa_db -Fc --no-owner --no-acl > /tmp/db-backup.dump
```

### 上传并导入

```bash
scp /tmp/db-backup.dump root@39.108.176.164:/tmp/

ssh root@39.108.176.164 << 'EOF'
docker cp /tmp/db-backup.dump dll_postgres:/tmp/db-backup.dump
docker exec dll_postgres pg_restore \
  -U medusa -d medusa_db \
  --clean --if-exists --no-owner --no-acl \
  /tmp/db-backup.dump
docker exec dll_postgres rm /tmp/db-backup.dump
rm /tmp/db-backup.dump
cd /opt/dll-store && docker compose -f docker-compose.prod.yml restart medusa
EOF
```

---

## 更新部署

```bash
# 本地: 重新构建并推送
./deploy.sh

# 或仅更新某个服务 (在服务器上):
cd /opt/dll-store
docker compose -f docker-compose.prod.yml pull medusa
docker compose -f docker-compose.prod.yml up -d medusa
```

---

## 常用运维命令

```bash
ssh root@39.108.176.164
cd /opt/dll-store

# 状态
docker compose -f docker-compose.prod.yml ps

# 日志
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f medusa --tail 100

# 重启
docker compose -f docker-compose.prod.yml restart
docker compose -f docker-compose.prod.yml restart medusa

# 停止
docker compose -f docker-compose.prod.yml down

# 进入容器调试
docker exec -it dll_medusa sh
docker exec -it dll_postgres psql -U medusa -d medusa_db

# 资源占用
docker stats
```

---

## 故障排查

| 问题 | 排查命令 |
|------|----------|
| 容器启动失败 | `docker compose -f docker-compose.prod.yml logs medusa --tail 50` |
| 数据库连不上 | `docker exec dll_postgres psql -U medusa -d medusa_db -c "SELECT 1"` |
| 前端连不上后端 | `curl http://localhost:9000/health` |
| 端口被占用 | `ss -tlnp \| grep -E '8000\|9000'` |
| 镜像拉取失败 | `docker login crpi-6mehpm60e0gv1ghr.cn-shenzhen.personal.cr.aliyuncs.com` |
