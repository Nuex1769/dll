FROM node:22-alpine

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码
COPY . .

# 构建 Next.js
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
