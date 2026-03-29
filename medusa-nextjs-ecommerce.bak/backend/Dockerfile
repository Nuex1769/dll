FROM node:18-alpine

WORKDIR /app

# 安装构建工具
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 暴露端口
EXPOSE 9000

# 启动命令
CMD ["npm", "start"]
