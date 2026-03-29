# API 文档

完整的 API 参考指南。

## 目录

- [产品 API](#产品-api)
- [购物车 API](#购物车-api)
- [订单 API](#订单-api)
- [支付 API](#支付-api)
- [库存 API](#库存-api)

---

## 产品 API

### 获取产品列表

**请求**
```http
GET /api/products?locale=zh&currency=CNY&limit=20&offset=0
```

**查询参数**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `locale` | string | en | 语言: zh/en/ja/de |
| `currency` | string | USD | 货币: USD/CNY/EUR/JPY |
| `limit` | number | 20 | 每页条数 |
| `offset` | number | 0 | 偏移量 |

**响应示例**
```json
{
  "products": [
    {
      "id": "prod_123",
      "handle": "awesome-product",
      "title": "很棒的产品",
      "description": "产品描述",
      "thumbnail": "https://...",
      "variants": [
        {
          "id": "var_123",
          "title": "红色-M码",
          "sku": "SKU123",
          "prices": { "CNY": 23990 },
          "inventory_quantity": 50
        }
      ]
    }
  ],
  "count": 100,
  "offset": 0
}
```

### 获取产品详情

**请求**
```http
GET /api/products/awesome-product?locale=zh
```

**响应示例**
```json
{
  "id": "prod_123",
  "handle": "awesome-product",
  "title": "很棒的产品",
  "images": [],
  "variants": [...],
  "metadata": {...}
}
```

---

## 购物车 API

### 创建购物车

**请求**
```http
POST /api/cart
Content-Type: application/json

{
  "region_id": "",
  "currency_code": "CNY"
}
```

**响应**
```json
{
  "cart_id": "cart_abc123",
  "items": [],
  "subtotal": 0,
  "tax_total": 0,
  "shipping_total": 0,
  "total": 0,
  "currency_code": "CNY"
}
```

### 添加到购物车

**请求**
```http
POST /api/cart/{cartId}/line-items
Content-Type: application/json

{
  "variant_id": "var_123",
  "quantity": 2
}
```

### 获取购物车

**请求**
```http
GET /api/cart/{cartId}
```

### 更新数量

**请求**
```http
PATCH /api/cart/{cartId}/line-items/{lineItemId}
Content-Type: application/json

{
  "quantity": 3
}
```

### 删除商品

**请求**
```http
DELETE /api/cart/{cartId}/line-items/{lineItemId}
```

---

## 订单 API

### 创建订单

**请求**
```http
POST /api/orders
Content-Type: application/json

{
  "cartId": "cart_abc123",
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "shipping_address": {
    "address_1": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "country_code": "US"
  },
  "payment_provider": "stripe"
}
```

**响应**
```json
{
  "order_id": "order_xyz789",
  "display_id": 1001,
  "status": "pending",
  "total": 23990,
  "currency_code": "CNY",
  "items": [...]
}
```

### 获取订单

**请求**
```http
GET /api/orders/{orderId}
```

---

## 支付 API

### Stripe Payment Intent

**请求**
```http
POST /api/payment/stripe/intent
Content-Type: application/json

{
  "amount": 239.90,
  "currency": "CNY",
  "orderId": "order_xyz789"
}
```

**响应**
```json
{
  "clientSecret": "pi_xxx#secret_yyy",
  "publishableKey": "pk_test_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 23990,
  "currency": "cny"
}
```

### PayPal Orders

**请求**
```http
POST /api/payment/paypal/orders
Content-Type: application/json

{
  "amount": 239.90,
  "currency": "CNY",
  "orderId": "order_xyz789"
}
```

**响应**
```json
{
  "orderId": "3BU83352873V31406",
  "status": "CREATED",
  "approveUrl": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "links": [...]
}
```

### 确认支付状态

**请求**
```http
GET /api/payment/stripe/confirm?payment_intent=pi_xxx
```

---

## 库存 API

### 检查库存

**请求**
```http
POST /api/inventory/check
Content-Type: application/json

{
  "items": [
    { "variant_id": "var_123", "quantity": 2 },
    { "variant_id": "var_456", "quantity": 1 }
  ]
}
```

**响应**
```json
{
  "inventory_check": [
    {
      "variant_id": "var_123",
      "requested": 2,
      "available": 50,
      "in_stock": true
    },
    {
      "variant_id": "var_456",
      "requested": 1,
      "available": 0,
      "in_stock": false
    }
  ]
}
```

---

## 错误处理

所有API返回标准错误格式：

```json
{
  "error": "错误信息",
  "code": "ERROR_CODE",
  "details": {}
}
```

### 常见错误码

| 状态码 | 错误码 | 说明 |
|--------|--------|------|
| 400 | INVALID_REQUEST | 请求参数无效 |
| 404 | NOT_FOUND | 资源未找到 |
| 500 | SERVER_ERROR | 服务器错误 |
| 503 | SERVICE_UNAVAILABLE | 服务不可用 |

---

## 速率限制

- **免费层**: 100 requests/minute
- **生产环境**: 根据您的计划调整

---

## 认证

当前API不需要认证。生产环境建议添加API Key认证。

---

## 版本

当前文档适用于 **v1.0.0**
