# 🛍️ Medusa + Next.js 生产级电商独立站模板

一套完整的、生产就绪的电商解决方案，基于 **Medusa** 商务引擎 和 **Next.js 15** 前端框架。

## ✨ 核心特性

### 📦 商业功能
- ✅ 产品管理（变体、SKU、库存）
- ✅ 购物车和结账流程
- ✅ 订单管理和追踪
- ✅ **库存预留机制**（防超卖）
- ✅ **多币种定价**（USD/CNY/EUR/JPY）
- ✅ **多语言支持**（中文/英文/日文/德文）
- ✅ 国际配送地址管理

### 💳 支付集成
- ✅ **Stripe** - 信用卡/借记卡
- ✅ **PayPal** - 国际支付
- ✅ **Apple Pay** - 移动支付（通过 Stripe）
- ✅ Webhook 处理 + 异步确认

### 🎯 技术优势
- **Next.js 15** App Router (SSR/ISR/SSG)
- **Medusa v2** - 企业级商务引擎
- **PostgreSQL** - 可靠的数据存储
- **Redis** - 缓存和队列
- **TypeScript** - 类型安全
- **Docker Compose** - 一键启动
- **Vercel Ready** - 无缝部署

## 📂 项目结构

```
medusa-nextjs-ecommerce/
├── backend/                     # Medusa 后端
│   ├── src/
│   │   ├── api/                # API 路由
│   │   ├── models/             # 数据模型
│   │   ├── services/           # 业务逻辑
│   │   ├── subscribers/        # 事件监听
│   │   ├── loaders/            # 初始化加载器
│   │   └── admin/              # Admin 扩展
│   ├── package.json
│   ├── tsconfig.json
│   └── medusa-config.js        # Medusa 配置
│
├── frontend/                    # Next.js 前端
│   ├── app/
│   │   ├── [locale]/           # 国际化路由
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── orders/
│   │   ├── api/                # BFF API 路由
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── payment/
│   │   │   └── webhooks/
│   │   └── layout.tsx
│   ├── components/             # React 组件
│   ├── lib/                    # 工具函数
│   ├── locales/                # i18n 翻译文件
│   ├── hooks/                  # 自定义 Hook
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── docker-compose.yml          # 本地开发
├── .env.example               # 环境变量示例
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+ (如使用 docker-compose)
- Stripe/PayPal 账户

### 1️⃣ 安装依赖

```bash
# 安装后端依赖
cd backend && npm install

# 安装前端依赖
cd ../frontend && npm install
```

### 2️⃣ 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local 填入你的配置：
# - DATABASE_URL
# - STRIPE_API_KEY / STRIPE_WEBHOOK_SECRET
# - PAYPAL_CLIENT_ID / PAYPAL_SECRET
# - MEDUSA_ADMIN_URL
# - 等等...
```

### 3️⃣ 启动开发环境

```bash
# 使用 Docker Compose (推荐)
docker-compose up

# 或者分别启动：

# 终端1: 启动 Medusa 后端
cd backend
npm run dev

# 终端2: 启动 Next.js 前端
cd frontend
npm run dev
```

### 4️⃣ 访问应用

| 应用 | URL | 用途 |
|------|-----|------|
| 店铺首页 | http://localhost:3000 | 客户购物前台 |
| Medusa Admin | http://localhost:7001 | 后台管理系统 |

## 📋 核心代码示例

### 后端：创建产品（Medusa Service）

```typescript
// backend/src/services/product.service.ts
import { ProductService } from "@medusajs/medusa"

class ExtendedProductService extends ProductService {
  async createProductWithTranslations(data: any) {
    const product = await this.create({
      title: data.title_en,
      description: data.description_en,
      handle: data.handle,
      metadata: {
        translations: {
          zh: {
            title: data.title_zh,
            description: data.description_zh,
          },
          en: {
            title: data.title_en,
            description: data.description_en,
          },
        },
      },
    })
    return product
  }
}
```

### 前端：产品详情页

```typescript
// frontend/app/[locale]/products/[handle]/page.tsx
import { getProduct } from "@/lib/medusa"
import { ProductGallery } from "@/components/ProductGallery"
import { VariantSelector } from "@/components/VariantSelector"

export default async function ProductPage({
  params: { handle, locale },
}: {
  params: { handle: string; locale: string }
}) {
  const product = await getProduct(handle, locale)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductGallery images={product.images} />
      <div>
        <h1>{product.translations[locale]?.title}</h1>
        <VariantSelector variants={product.variants} />
      </div>
    </div>
  )
}
```

### API：结账支付

```typescript
// frontend/app/api/payment/stripe/intent.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  })
}
```

## 🔐 安全特性

- ✅ CORS 政策配置
- ✅ CSRF 令牌验证
- ✅ 环境变量隔离
- ✅ 数据库连接加密
- ✅ API 密钥管理
- ✅ Webhook 签名验证

## 📊 库存管理

### 预留机制
```
添加到购物车 → 库存未锁定
开始结账 → 库存预留 (15分钟)
完成支付 → 库存确认并减少
超时 → 自动释放预留
```

### 数据库约束
```sql
-- 防止库存数值异常
ALTER TABLE inventory_levels ADD CONSTRAINT check_quantities
CHECK (available_quantity + reserved_quantity + incoming_quantity >= 0);
```

## 🌍 多语言支持

支持语言：
- 🇨🇳 中文 (zh-CN)
- 🇺🇸 英文 (en-US)
- 🇯🇵 日文 (ja-JP)
- 🇩🇪 德文 (de-DE)

路由示例：
- `/zh/products` - 中文产品列表
- `/en/checkout` - 英文结账页面

## 💱 多币种支持

支持货币：
- 🇺🇸 USD (美元)
- 🇨🇳 CNY (人民币)
- 🇪🇺 EUR (欧元)
- 🇯🇵 JPY (日元)

实现方式：
- 产品价格多存储
- Stripe/PayPal 原生支持
- 动态汇率计算

## 🚢 部署指南

### 部署后端到 Medusa Cloud

```bash
npm install -g @medusajs/cli

medusa deploy
```

### 部署前端到 Vercel

```bash
npm install -g vercel

vercel deploy --prod
```

### 使用 Docker 自托管

```bash
docker-compose -f docker-compose.yml up -d
```

## 📖 API 文档

完整的 API 文档位于 [docs/API.md](docs/API.md)

### 主要端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/products` | 获取产品列表 |
| GET | `/api/products/[handle]` | 获取产品详情 |
| POST | `/api/cart` | 创建购物车 |
| POST | `/api/orders` | 创建订单 |
| POST | `/api/payment/stripe/intent` | 创建 Stripe Payment Intent |
| POST | `/api/webhooks/stripe` | Stripe Webhook |

## 🔧 配置关键文件

### Medusa 配置
- `backend/medusa-config.js` - Medusa 核心设置
- `backend/src/index.ts` - 插件和提供商配置

### Next.js 配置
- `frontend/next.config.js` - 优化和中间件
- `frontend/app/i18n-config.ts` - 国际化配置

## 🧪 测试

```bash
# 后端测试
cd backend && npm run test

# 前端测试
cd frontend && npm run test
```

## 📞 支持和社区

- [Medusa 文档](https://docs.medusajs.com)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 Issues](https://github.com/yourusername/medusa-nextjs-ecommerce/issues)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## ⭐ 相关资源

- [Medusa 官方文档](https://docs.medusajs.com)
- [Next.js 经最佳实践](https://nextjs.org/learn)
- [Stripe 集成指南](https://stripe.com/docs)
- [PayPal 开发者](https://developer.paypal.com)

**祝您项目顺利！ 🚀**
