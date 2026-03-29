# 🚀 快速开始指南

5分钟内启动完整的电商系统。

## 前置要求

- ✅ Node.js 18+
- ✅ Docker & Docker Compose
- ✅ Git
- ✅ Stripe 账户（免费）
- ✅ PayPal 账户（免费可选）

## 分钟1-2: 克隆并配置

```bash
# 1. 克隆项目
git clone <repo-url>
cd medusa-nextjs-ecommerce

# 2. 复制环境变量
cp .env.example .env.local

# 3. 编辑 .env.local（关键步骤！）
# 填入你的 Stripe/PayPal Key
```

### 需要填的关键变量

```env
# Stripe（从 https://dashboard.stripe.com 获取）
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx

# PayPal（可选）
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

## 分钟3-5: 启动

### 方式1: Docker Compose（最简单 🎯）

```bash
# 一键启动所有服务
docker-compose up

# 看到这样的输出表示成功：
# medusa_backend | ⠋ Starting Medusa Server
# medusa_frontend | ▲ Next.js 15.x
```

### 方式2: 本地开发

```bash
# 终端1: 启动后端
cd backend
npm install
npm run dev
# 访问: http://localhost:9000

# 终端2: 启动前端
cd frontend
npm install
npm run dev
# 访问: http://localhost:3000
```

---

## 访问应用

| 应用 | URL | 用户名 | 密码 |
|------|-----|--------|------|
| 🛍️ 店铺首页 | http://localhost:3000 | - | - |
| 🛒 产品列表 | http://localhost:3000/en/products | - | - |
| 🔧 Medusa Admin | http://localhost:7001 | admin@medusa-test.com | medusa |
| 💳 API 文档 | http://localhost:9000/docs | - | - |

---

## 快速测试

### 1️⃣ 浏览产品

```bash
# 访问产品列表
curl http://localhost:3000/api/products?locale=en&currency=USD
```

### 2️⃣ 创建购物车

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"currency_code": "USD"}'

# 返回:
# { "cart_id": "cart_xxxx", ... }
```

### 3️⃣ 测试支付（Stripe）

使用测试卡号: **4242 4242 4242 4242**

### 4️⃣ 查看订单

```bash
curl http://localhost:3000/api/orders/order_xxxx
```

---

## 🎨 自定义你的商店

### 1. 更改商店名称

编辑 `frontend/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "你的商店名称",
  description: "你的商店描述",
}
```

### 2. 添加产品（通过 Medusa Admin）

1. 访问 http://localhost:7001
2. 登录（admin@medusa-test.com / medusa）
3. 点击 "Products" → "Add Product"
4. 填写产品信息

### 3. 修改样式

编辑 `frontend/app/globals.css` 修改颜色主题

### 4. 配置多币种

编辑 `backend/medusa-config.js`：
```javascript
regions: [
  {
    name: "中国",
    currency_code: "CNY",
    countries: ["CN"],
  },
  {
    name: "美国",
    currency_code: "USD",
    countries: ["US"],
  },
]
```

---

## 📱 多语言支持

系统已支持：🇨🇳 中文、🇺🇸 英文、🇯🇵 日文、🇩🇪 德文

访问不同语言：
- http://localhost:3000/en/products （英文）
- http://localhost:3000/zh/products （中文）
- http://localhost:3000/ja/products （日文）
- http://localhost:3000/de/products （德文）

---

## 💳 支付方式测试

### Stripe 测试流程

1. 访问 http://localhost:3000/checkout
2. 在支付页面使用以下测试卡：

| 卡号 | 有效期 | CVC | 结果 |
|------|--------|-----|------|
| 4242 4242 4242 4242 | 12/25 | 123 | ✅ 支付成功 |
| 4000 0000 0000 9995 | 12/25 | 123 | ❌ 支付拒绝 |
| 4000 0000 0000 3010 | 12/25 | 123 | ⚠️ 需要账户验证 |

### PayPal 测试流程

1. 点击 "使用 PayPal 支付"
2. 使用 PayPal 沙箱账户登录
3. 确认交易

---

## 🐞 常见问题

### ❌ Docker 无法启动

```bash
# 检查Docker状态
docker ps

# 如果没输出，启动Docker
docker daemon

# 重新启动容器
docker-compose down
docker-compose up
```

### ❌ 前端无法连接后端

```bash
# 检查后端是否运行
curl http://localhost:9000/store/health

# 如果失败，查看日志
docker-compose logs medusa
```

### ❌ 数据库连接失败

```bash
# 检查PostgreSQL
docker-compose logs postgres

# 重置数据库
docker-compose down -v
docker-compose up
```

---

## 📚 下一步

- 📖 [API 文档](./docs/API.md) - 完整API参考
- 🚢 [部署指南](./docs/DEPLOYMENT.md) - 上线步骤
- 🎨 [自定义指南](./docs/CUSTOMIZATION.md) - 深度定制
- 📊 [数据库设计](./docs/DATABASE.md) - 数据模型详解

---

## 🆘 获取帮助

- GitHub Issues: [报告问题](https://github.com/yourusername/store/issues)
- 文档: [完整文档](https://docs.medusajs.com)
- 社区: [Medusa Discord](https://discord.gg/medusa)

---

## ⭐ 下一阶段

### 已完成 ✅
- ✅ 基础电商功能
- ✅ 多币种支持
- ✅ 多语言支持
- ✅ Stripe/PayPal集成
- ✅ 库存管理

### 建议添加 🎯
- 📧 Email营销集成
- 📊 Google Analytics
- 🔔 推送通知
- 💬 实时客服chat
- 📦 物流跟踪API集成
- 🎁 优惠券和折扣系统
- 👥 用户账户系统
- ⭐ 产品评价系统

---

## 📄 许可证

MIT License - 免费商用

---

**祝你的电商生意蒸蒸日上！🚀**
