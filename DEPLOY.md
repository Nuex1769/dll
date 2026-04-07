# DLL 电商 — 服务器部署指南

## 前置条件

- 一台 Linux 服务器 (CentOS/Ubuntu/Debian)
- 已安装 Docker 和 Docker Compose
- 已安装 Git
- 开放端口: 8000 (店面)、9000 (后台管理)

### 安装 Docker (如果未安装)

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
```

---

## 部署步骤

### Step 1: 拉取代码

```bash
cd /opt
git clone <你的仓库地址> dll-store
cd dll-store
```

### Step 2: 创建 .env 文件

```bash
cat > .env << 'EOF'
# 安全密钥
JWT_SECRET=51194cdeb1f767484d553aa7fb3c825e465c39a5ca3115558dd24d434d66640f
COOKIE_SECRET=ca70f633c7f9f78e177d3c4d8bd53dbb9c811de357e6f62494f36495fcd5b870

# 数据库
POSTGRES_USER=medusa
POSTGRES_PASSWORD=59c9c057416a16dd3f59e800defd8279526278a5c5cb90b4fe5893ef23f07a77
POSTGRES_DB=medusa_db

# CORS (改成你的服务器 IP)
STORE_CORS=http://39.108.176.164:8000
ADMIN_CORS=http://39.108.176.164:9000
AUTH_CORS=http://39.108.176.164:9000,http://39.108.176.164:8000

# Stripe (可选)
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_KEY=

# Medusa
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_383c3e202b5e9da847c6b3896207d5625dd2db7e35e83aea942a55de858e8f22
NEXT_PUBLIC_BASE_URL=http://39.108.176.164:8000
NEXT_PUBLIC_DEFAULT_REGION=us
EOF
```

### Step 3: 构建并启动

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

首次构建需要 5-10 分钟 (下载镜像 + npm install + 编译)。

### Step 4: 查看构建进度

```bash
docker compose -f docker-compose.prod.yml logs -f
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

## 更新部署

```bash
cd /opt/dll-store
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

只重建改动的服务:

```bash
docker compose -f docker-compose.prod.yml up -d --build medusa      # 只重建后端
docker compose -f docker-compose.prod.yml up -d --build storefront   # 只重建前端
```

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

### 上传到服务器

```bash
scp /tmp/db-backup.dump root@39.108.176.164:/tmp/
```

### 服务器上导入

```bash
docker cp /tmp/db-backup.dump dll_postgres:/tmp/db-backup.dump

docker exec dll_postgres pg_restore \
  -U medusa -d medusa_db \
  --clean --if-exists --no-owner --no-acl \
  /tmp/db-backup.dump

# 清理 + 重启
docker exec dll_postgres rm /tmp/db-backup.dump
rm /tmp/db-backup.dump
docker compose -f docker-compose.prod.yml restart medusa
```

---

## 常用运维命令

```bash
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
