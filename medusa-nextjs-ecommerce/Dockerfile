FROM node:22-alpine

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 复制源码
COPY . .

# 构建项目
RUN npm run build

EXPOSE 9000

CMD ["npx", "medusa", "start"]
