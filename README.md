# Web Trace - 场景化互联网资源组织系统

基于真实使用场景组织互联网资源的平台，帮助你构建完整的工作流。

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS 4.0 + shadcn/ui
- **存储**: LocalStorage (MVP 阶段)
- **部署**: Docker + Docker Compose

## 功能特性

- ✅ 场景管理 (CRUD)
- ✅ 资源管理 (CRUD)
- ✅ 阶段化工作流
- ✅ 场景与资源关联
- ✅ 标签和搜索
- ✅ Docker 容器化部署

## 快速开始

### 方式一：本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3003

### 方式二：Docker 部署

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问 http://localhost:3003

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── scenarios/          # 场景页面
│   ├── resources/          # 资源页面
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── layout/             # 布局组件
│   └── features/           # 功能组件
├── lib/                    # 工具库
│   ├── storage.ts          # LocalStorage 封装
│   └── utils.ts            # 通用工具
├── types/                  # TypeScript 类型定义
└── data/                   # Mock 数据
```

## 可用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产启动
npm start

# 类型检查
npm run type-check

# Lint
npm run lint

# 格式化
npm run format
```

## Docker 相关命令

```bash
# 构建镜像
docker build -t web-trace .

# 运行容器
docker run -p 3003:3000 --name web-trace web-trace

# 使用 docker-compose
docker-compose up -d --build
docker-compose logs -f
docker-compose down
```

## 核心概念

### 场景 (Scenario)
场景是核心组织单位，代表一个完整的工作流或目标。

- 例如：独立开发者发布 SaaS、AI 内容创作
- 场景可以包含多个阶段
- 场景可以关联多个资源

### 阶段 (Stage)
阶段是场景内的工作流步骤，帮助你按流程组织资源。

- 例如：设计 → 开发 → 部署 → 增长

### 资源 (Resource)
资源是具体的网站、工具或服务，是场景的组成部分。

- 例如：Figma、Cursor、GitHub、Vercel

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 数据存储

MVP 阶段数据存储在浏览器 LocalStorage 中，不会上传到任何服务器。

未来版本支持：
- 云端同步
- 数据导出/导入
- 多设备同步

## License

MIT
