# ============================================
# 构建阶段
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源码
COPY . .

# 确保 public 目录存在（兼容没有 public 目录的情况）
RUN mkdir -p public

# 构建应用
RUN npm run build

# ============================================
# 生产阶段
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# 设置生产环境
ENV NODE_ENV production
ENV PORT 3000

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
