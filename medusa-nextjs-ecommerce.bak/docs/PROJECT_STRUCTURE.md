# 项目结构说明

```
medusa-nextjs-ecommerce/
│
├── backend/                          # Medusa 商务引擎后端
│   ├── src/
│   │   ├── index.ts                 # 主入口，自定义API
│   │   ├── api/
│   │   │   └── payment.ts           # 支付相关API端点
│   │   ├── models/                  # 自定义数据模型
│   │   ├── services/                # 业务逻辑服务
│   │   ├── subscribers/             # 事件订阅者
│   │   ├── loaders/                 # 初始化加载器
│   │   └── admin/                   # Admin面板扩展
│   ├── medusa-config.js             # Medusa核心配置
│   ├── package.json                 # 后端依赖
│   ├── tsconfig.json                # TypeScript配置
│   └── Dockerfile                   # Docker打包配置
│
├── frontend/                         # Next.js 前端应用
│   ├── app/
│   │   ├── layout.tsx               # 根布局
│   │   ├── globals.css              # 全局样式
│   │   ├── [locale]/
│   │   │   ├── layout.tsx           # 国际化布局
│   │   │   ├── page.tsx             # 首页
│   │   │   ├── products/
│   │   │   │   ├── page.tsx         # 产品列表
│   │   │   │   └── [handle]/page.tsx # 产品详情
│   │   │   ├── cart/
│   │   │   │   └── page.tsx         # 购物车页面
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx         # 结账步骤1
│   │   │   │   ├── payment/page.tsx # 结账支付
│   │   │   │   └── confirm/page.tsx # 订单确认
│   │   │   └── orders/
│   │   │       ├── page.tsx         # 订单列表
│   │   │       └── [orderId]/page.tsx # 订单详情
│   │   │
│   │   ├── api/                     # BFF API路由
│   │   │   ├── products/route.ts    # 产品接口
│   │   │   ├── cart/route.ts        # 购物车接口
│   │   │   ├── orders/route.ts      # 订单接口
│   │   │   ├── payment/
│   │   │   │   ├── stripe/intent.ts # Stripe支付
│   │   │   │   └── paypal/orders.ts # PayPal支付
│   │   │   └── webhooks/            # 支付webhook
│   │   │       ├── stripe.ts
│   │   │       └── paypal.ts
│   │   │
│   │   └── i18n-config.ts           # 国际化配置
│   │
│   ├── components/                  # React组件库
│   │   ├── Header.tsx               # 顶部导航
│   │   ├── ProductCard.tsx          # 产品卡片
│   │   ├── ProductGallery.tsx       # 产品图库
│   │   ├── VariantSelector.tsx      # 变体选择器
│   │   ├── CartSummary.tsx          # 购物车摘要
│   │   ├── CheckoutForm.tsx         # 结账表单
│   │   ├── PaymentMethods.tsx       # 支付方式选择
│   │   └── LanguageSwitcher.tsx     # 语言切换器
│   │
│   ├── lib/                         # 工具函数库
│   │   ├── medusa.ts                # Medusa API调用
│   │   ├── stripe.ts                # Stripe工具函数
│   │   ├── paypal.ts                # PayPal工具函数
│   │   ├── currency.ts              # 货币转换
│   │   └── formats.ts               # 格式化工具
│   │
│   ├── hooks/                       # 自定义React Hook
│   │   ├── useCart.ts               # 购物车管理
│   │   ├── usePayment.ts            # 支付处理
│   │   ├── useInventory.ts          # 库存管理
│   │   └── useOrder.ts              # 订单管理
│   │
│   ├── locales/                     # 国际化翻译文件
│   │   ├── en.json                  # 英文翻译
│   │   ├── zh.json                  # 中文翻译
│   │   ├── ja.json                  # 日文翻译
│   │   └── de.json                  # 德文翻译
│   │
│   ├── package.json                 # 前端依赖
│   ├── tsconfig.json                # TypeScript配置
│   ├── next.config.js               # Next.js配置
│   └── Dockerfile                   # Docker打包配置
│
├── docs/                            # 文档
│   ├── API.md                       # API文档
│   ├── DEPLOYMENT.md                # 部署指南
│   └── DATABASE.md                  # 数据库文档
│
├── README.md                        # 项目说明
├── QUICKSTART.md                    # 快速开始
├── .env.example                     # 环境变量示例
├── .env.local                       # 本地环境变量
├── .gitignore                       # Git忽略规则
├── docker-compose.yml               # Docker编排配置
└── package.json                     # 根项目配置
```

## 关键文件说明

### 后端关键目录

| 文件 | 用途 |
|------|------|
| `backend/medusa-config.js` | Medusa核心配置，支付方式、插件配置 |
| `backend/src/index.ts` | 自定义API路由，健康检查、库存API |
| `backend/src/api/payment.ts` | 支付相关API：捕获、退款、可用方式 |

### 前端关键目录

| 文件 | 用途 |
|------|------|
| `frontend/app/[locale]/layout.tsx` | 国际化路由布局，支持多语言 |
| `frontend/app/api/products/route.ts` | 产品API，支持locale和currency参数 |
| `frontend/app/api/payment/stripe/intent.ts` | Stripe Payment Intent创建 |
| `frontend/app/api/payment/paypal/orders.ts` | PayPal订单创建 |
| `frontend/hooks/usePayment.ts` | 支付相关hooks |
| `frontend/hooks/useInventory.ts` | 库存预留hooks |
| `frontend/locales/*.json` | 多语言翻译文件 |

## 数据流

### 产品浏览流程
```
用户 → Next.js 前端 → /api/products → Medusa API
       ↓ (支持 locale/currency 参数)
   返回本地化的产品数据
```

### 购物结账流程
```
1. 创建购物车: POST /api/cart
2. 添加商品: POST /api/cart/{cartId}/line-items  
3. 创建订单: POST /api/orders
4. 创建支付: POST /api/payment/stripe/intent 或 POST /api/payment/paypal/orders
5. 支付成功: Webhook 回调 → 更新订单状态
```

## 服务架构

```
┌─────────────────────────────────────────┐
│  客户端浏览器                           │
└────────────┬────────────────────────────┘
             │ HTTP Request
┌────────────▼────────────────────────────┐
│  Vercel / Nginx (反向代理)              │
└────────────┬────────────────────────────┘
             │
      ┌──────┴───────┐
      │              │
┌─────▼────┐   ┌────▼──────┐
│ Next.js  │   │ Nginx      │
│ 3000     │   │ 80/443     │
├──────────┤   └────┬──────┘
│ BFF API  │        │
│ /api/*   │        │
└─────┬────┘        │
      │             │
      └──────┬──────┘
             │ HTTP API Call
┌────────────▼──────────────────────────┐
│ Medusa Backend (9000)                │
├─────────────────────────────────────┤
│ - Product Service                   │
│ - Cart Service                      │
│ - Order Service                    │
│ - Inventory Service                │
│ - Payment Processor                │
└────────────┬──────────────────────────┘
             │
      ┌──────┴───────────┐
      │                  │
┌─────▼──────┐    ┌──────▼────┐
│ PostgreSQL │    │ Redis      │
│ 5432       │    │ 6379       │
└────────────┘    └────────────┘
```

## 配置优先级

1. **环境变量** (.env.local, .env.production)
2. **配置文件** (next.config.js, medusa-config.js)
3. **代码默认值** (默认常量)

## 性能优化点

- ✅ Next.js Image 组件自动优化
- ✅ ISR (增量静态重新生成) 产品页面
- ✅ Redis 缓存热点数据
- ✅ 数据库索引优化
- ✅ CDN 图片加速
- ✅ 代码分割和懒加载

## 扩展建议

### 添加CMS (内容管理)
- 集成 Strapi / Contentful
- 用于产品描述、营销文案

### 添加搜索
- Elasticsearch / Meilisearch
- 快速产品搜索

### 添加推荐引擎
- 个性化产品推荐
- 相似商品推荐

### 添加营销工具
- Email 营销 (SendGrid, Mailgun)
- SMS 营销 (Twilio)
- Push 通知

---

**完整项目架构已完成！准备开始开发吧 🚀**
