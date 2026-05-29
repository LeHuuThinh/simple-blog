FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Cần thiết cho một số thư viện C++ gốc
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy các file lock để cài đặt package
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci || npm install

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt telemetry của Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Bắt buộc phải có file .env (ở môi trường CI/CD) hoặc biến môi trường truyền vào để build. 
# Tuy nhiên do dùng biến môi trường public đôi khi cần lúc build, Next.js standalone sẽ lo việc này.
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Chạy app dưới tư cách user non-root để an toàn bảo mật
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# "standalone" mode của Next.js copy những file tối giản nhất cần thiết
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Khởi động server
CMD ["node", "server.js"]
