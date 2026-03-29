# 部署指南

完整的、生产级的部署步骤。

## 目录

- [预备工作](#预备工作)
- [Vercel 部署（推荐）](#vercel-部署推荐)
- [Docker 自托管](#docker-自托管)
- [环境配置](#环境配置)
- [监控和日志](#监控和日志)

---

## 预备工作

### 1. 准备域名和SSL

- 注册域名（如 yourstore.com）
- 获取SSL证书（Let's Encrypt 免费）
- 配置DNS记录

### 2. 获取第三方服务Key

**Stripe**
1. 访问 [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. 创建账户并验证邮箱
3. 获取 API Key 和 Webhook Secret

**PayPal**
1. 访问 [https://developer.paypal.com](https://developer.paypal.com)
2. 创建应用
3. 获取 Client ID 和 Secret

### 3. 准备数据库

- PostgreSQL 14+
- Redis 7+
- 或使用云托管服务如 Docker

---

## Vercel 部署（推荐）

### 前端部署到 Vercel

**步骤1: 连接 GitHub**
```bash
# 将项目推到 GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/store.git
git push -u origin main
```

**步骤2: 在 Vercel 导入项目**
1. 访问 [https://vercel.com](https://vercel.com)
2. 登录 Vercel 账户
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库

**步骤3: 配置环境变量**
```
NEXT_PUBLIC_MEDUSA_URL=https://api.yourstore.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
NEXT_PUBLIC_BASE_URL=https://yourstore.com
STRIPE_SECRET_KEY=sk_live_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

**步骤4: 部署**
```bash
# Vercel 自动从 main 分支部署
git push origin main
```

---

## Docker 自托管

### 选项 1: 使用 Render 或 Railway

**Render 部署**

1. **创建 PostgreSQL 数据库**
   - Render Dashboard → New → PostgreSQL
   - 记下连接字符串

2. **创建 Redis 缓存**
   - Render Dashboard → New → Redis
   - 记下连接字符串

3. **部署后端**
   - Render Dashboard → New → Web Service
   - 连接 GitHub 仓库
   - 构建命令: `cd backend && npm install && npm run build`
   - 启动命令: `cd backend && npm start`
   - 设置环境变量
   - 部署

4. **部署前端**
   - Render Dashboard → New → Web Service
   - 连接 GitHub 仓库
   - 构建命令: `cd frontend && npm install && npm run build`
   - 启动命令: `cd frontend && npm start`
   - 设置环境变量
   - 部署

### 选项 2: 使用 Docker Compose 在 VPS

**步骤1: 租赁 VPS**
- 推荐: DigitalOcean, Linode, AWS EC2
- 系统: Ubuntu 22.04 LTS
- 配置: 2GB RAM, 50GB SSD

**步骤2: 安装 Docker**
```bash
# 连接到 VPS
ssh root@your_vps_ip

# 更新系统
apt-get update && apt-get upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

**步骤3: 部署应用**
```bash
# 克隆仓库
git clone https://github.com/yourusername/store.git
cd store

# 创建环境文件
cp .env.example .env.production
# 编辑 .env.production，填入生产环境的值

# 启动容器
docker-compose -f docker-compose.yml up -d

# 验证状态
docker-compose ps
```

**步骤4: 配置 Nginx 反向代理**
```bash
apt-get install -y nginx

# 创建 Nginx 配置
cat > /etc/nginx/sites-enabled/store.conf << 'EOF'
upstream backend {
    server localhost:9000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourstore.com www.yourstore.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourstore.com www.yourstore.com;

    ssl_certificate /etc/letsencrypt/live/yourstore.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourstore.com/privkey.pem;

    # 前端
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 测试 Nginx 配置
nginx -t

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

**步骤5: 配置 SSL 证书**
```bash
# 安装 Certbot
apt-get install -y certbot python3-certbot-nginx

# 获取证书
certbot certonly --standalone -d yourstore.com -d www.yourstore.com

# 自动续期
systemctl start certbot.timer
systemctl enable certbot.timer
```

---

## 环境配置

### 生产环境环境变量

**后端** (backend/.env.production)
```env
DATABASE_URL=postgresql://user:pass@db-host:5432/medusa_db
REDIS_URL=redis://cache-host:6379
NODE_ENV=production
JWT_SECRET=<long-random-string>
COOKIE_SECRET=<long-random-string>

STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx

MEDUSA_ADMIN_ONBOARDING_TYPE=continue
STORE_CORS=https://yourstore.com
ADMIN_CORS=https://admin.yourstore.com
```

**前端** (frontend/.env.production)
```env
NEXT_PUBLIC_MEDUSA_URL=https://api.yourstore.com
NEXT_PUBLIC_BASE_URL=https://yourstore.com
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
STRIPE_SECRET_KEY=sk_live_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

### 数据库备份

**自动备份脚本**
```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +"%Y_%m_%d_%H_%M_%S")
BACKUP_DIR="/backups/medusa"

mkdir -p $BACKUP_DIR

# 备份 PostgreSQL
docker-compose exec -T postgres pg_dump -U medusa medusa_db | \
  gzip > $BACKUP_DIR/medusa_db_$TIMESTAMP.sql.gz

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

```bash
# 添加 cron 任务（每天凌晨2点备份）
crontab -e
# 添加行: 0 2 * * * /path/to/backup.sh
```

---

## 监控和日志

### Sentry 错误追踪

```bash
# 1. 创建 Sentry 账户
# 访问 https://sentry.io

# 2. 创建项目
# 选择 Node.js（后端）和 React（前端）

# 3. 安装包
# 后端
npm install @sentry/node

# 前端
npm install @sentry/react

# 4. 配置
# 后端: src/index.ts
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 日志管理

**使用 CloudWatch (AWS) 或 Papertrail**

```bash
# 后端日志导出
docker-compose logs medusa > logs/medusa_$(date +%Y%m%d).log

# 实时日志监控
docker-compose logs -f medusa
```

### 健康检查

```bash
# 检查后端
curl https://api.yourstore.com/store/health

# 检查前端
curl https://yourstore.com/api/health
```

---

## 性能优化清单

- ✅ 启用 CDN（CloudFront / Cloudflare）
- ✅ 压缩资源（Gzip）
- ✅ 图片优化和缓存
- ✅ 数据库索引优化
- ✅ Redis 缓存配置
- ✅ API 速率限制
- ✅ 监控服务器负载

---

## 故障排除

### 常见问题

| 问题 | 解决方案 |
|------|--------|
| 503 Service Unavailable | 检查容器状态: `docker-compose ps` |
| 数据库连接失败 | 验证 DATABASE_URL 和网络连接 |
| Stripe Webhook 失败 | 验证 Webhook Secret 和 IP 白名单 |
| 前端白屏 | 检查浏览器控制台错误，查看 Vercel 日志 |

### 查看日志

```bash
# 后端日志
docker-compose logs medusa

# 前端日志
docker-compose logs frontend

# 数据库日志
docker-compose logs postgres
```

---

## 安全建议

1. **定期更新依赖**
   ```bash
   npm audit fix
   npm update
   ```

2. **启用防火墙**
   ```bash
   ufw enable
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

3. **设置强密码**
   - JWT Secret: 256位随机字符串
   - Database Password: 随机强密码

4. **定期备份**
   - 每日自动备份数据库
   - 保留30天备份历史

5. **监控异常**
   - 设置 Sentry 告警
   - 监控 API 性能

---

祝部署顺利！🚀
