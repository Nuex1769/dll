# DLL — Smart Helmets & Cycling Gear

DLL 智能头盔电商独立站项目，基于 Medusa v2 无头商务框架 + Next.js 15 前端。

---

## 项目结构

```
DLL/
├── medusa-nextjs-ecommerce/          # Medusa 后端 (核心商务引擎)
├── medusa-nextjs-ecommerce-storefront/ # Next.js 前端 (消费者店铺)
├── medusa-nextjs-ecommerce.bak/      # 备份 (原始未修改版本)
└── README.md                         # 本文件
```

---

## 1. medusa-nextjs-ecommerce（后端）

Medusa v2 无头商务后端，提供 API 服务和管理后台。

| 项目 | 详情 |
|------|------|
| 框架 | Medusa v2 (2.13.1) |
| 端口 | `localhost:9000` |
| 管理后台 | `http://localhost:9000/app` |
| 数据库 | PostgreSQL 15 (Homebrew) |
| 缓存 | Redis 7 (Homebrew) |
| 管理员 | `admin@dll.com` / `admin123` |

### 核心功能

- 产品管理（CRUD、变体、价格、库存）
- 订单管理（创建、履约、退款）
- 多区域支持（Europe/EUR、North America/USD、Asia Pacific/CNY）
- 支付集成（Stripe 待配置）
- 客户管理（注册、登录、地址）
- 折扣与促销
- 内置管理后台 UI

### 配置文件

| 文件 | 说明 |
|------|------|
| `.env` | 环境变量（数据库连接、CORS、API Key 等）|
| `medusa-config.ts` | Medusa 核心配置（模块、插件）|
| `package.json` | 依赖和脚本 |

### 启动

```bash
cd medusa-nextjs-ecommerce

# 确保 PostgreSQL 和 Redis 正在运行
brew services start postgresql@15
brew services start redis

npm run dev
```

---

## 2. medusa-nextjs-ecommerce-storefront（前端）

面向消费者的 Next.js 店铺前端，已完成 DLL 品牌全站重构。

| 项目 | 详情 |
|------|------|
| 框架 | Next.js 15.3.9 + React 19 |
| 端口 | `localhost:8000` |
| 样式 | Tailwind CSS + DLL 自定义色彩系统 |
| 字体 | Inter (Google Fonts) |
| 设计参考 | [unit1gear.com](https://www.unit1gear.com/) |

### 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页（Hero + 产品展示 + 卖点 + 评价）|
| `/smart-helmet` | 智能头盔集合页（Hero + 产品 + 技术特性 + FAQ）|
| `/store` | 全部商品 |
| `/products/[handle]` | 产品详情 |
| `/categories/[...category]` | 分类页 |
| `/about` | 关于我们 |
| `/support` | 帮助中心 |
| `/business-partnership` | 商务合作 |
| `/cart` | 购物车 |
| `/checkout` | 结账 |
| `/account` | 用户账户 |

### 品牌设计系统

```
色彩:
  背景:     #FFFFFF / #F4F4F4
  主文字:   #282828
  次要文字: #696969
  按钮:     #282828 (bg) + #F9F9F9 (text)
  边框:     #E5E5E5
  强调色:   #C17A2A (导航激活态)

按钮组件:
  .dll-btn-primary   — 黑底白字圆角
  .dll-btn-secondary — 白底黑字带边框
  .dll-btn-outline   — 透明白边框（深色背景用）
```

### 关键组件

| 组件 | 路径 | 说明 |
|------|------|------|
| 公告栏 | `src/modules/layout/components/announcement-bar/` | 深色背景轮播公告 |
| 导航菜单 | `src/modules/layout/components/nav-links/` | 6 项固定菜单 + 激活态 |
| 区域切换 | `src/modules/layout/components/nav-region-button/` | 国家/货币下拉 |
| Hero | `src/modules/home/components/hero/` | 全屏深色背景 |
| 产品卡片 | `src/modules/products/components/product-preview/` | 图片 + 标题 + 价格 |

### 多区域 / 多货币

| 区域 | 货币 | 国家 |
|------|------|------|
| Europe | EUR | DK, FR, DE, IT, ES, SE, GB |
| North America | USD | US, CA |
| Asia Pacific | CNY | CN, JP, KR, AU, SG |

### 配置文件

| 文件 | 说明 |
|------|------|
| `.env.local` | Medusa API URL、Publishable API Key |
| `tailwind.config.js` | DLL 色彩系统、动画、字体 |
| `src/styles/globals.css` | CSS 变量、按钮组件 |

### 启动

```bash
cd medusa-nextjs-ecommerce-storefront
npm run dev
# 访问 http://localhost:8000
```

---

## 3. medusa-nextjs-ecommerce.bak（备份）

原始未修改的 Medusa Starter 模板备份，包含默认的后端和前端代码，用于参考对比。

> 此目录不需要运行，仅作为原始代码参考。

---

## 快速启动

```bash
# 1. 启动基础服务
brew services start postgresql@15
brew services start redis

# 2. 启动后端
cd /Users/chainfish/Desktop/www/MyProject/DLL/medusa-nextjs-ecommerce
npm run dev

# 3. 启动前端（新终端窗口）
cd /Users/chainfish/Desktop/www/MyProject/DLL/medusa-nextjs-ecommerce-storefront
npm run dev

# 4. 访问
# 店铺前端:  http://localhost:8000
# 管理后台:  http://localhost:9000/app
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 商务引擎 | Medusa v2 (2.13.1) |
| 前端框架 | Next.js 15.3.9 |
| UI 框架 | React 19.0.4 |
| 样式 | Tailwind CSS |
| UI 组件 | Headless UI, @medusajs/ui |
| 数据库 | PostgreSQL 15 |
| 缓存 | Redis 7 |
| 包管理 | npm |
| 运行环境 | Node.js |

---

## 待办事项

- [ ] 上传 DLL 真实产品数据和图片
- [ ] 创建 Smart Helmet / Accessories 产品分类
- [ ] 配置 Stripe 生产环境支付密钥
- [ ] 实现全站多语言翻译（i18n）
- [ ] SEO 优化（sitemap, robots.txt, 结构化数据）
- [ ] 配置自定义域名和部署
- [ ] Hero 区域替换为真实产品视频/大图
- [ ] 邮件通知配置（订单确认、发货通知）
