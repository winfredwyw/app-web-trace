// ============================================
// 资源（网站/工具/服务）
// ============================================
export type ResourceType = 'website' | 'tool' | 'service'

export interface Resource {
  id: string
  name: string
  url: string
  description: string
  icon?: string
  category: string
  tags: string[]
  type: ResourceType
  thumbnail?: string
  rating?: number
  usageCount?: number
  createdAt: string
  updatedAt: string
}

// ============================================
// 阶段（场景内的工作流阶段）
// ============================================
export interface Stage {
  id: string
  name: string
  description?: string
  order: number
  color?: string
}

// ============================================
// 场景与资源关联
// ============================================
export interface ScenarioResource {
  id: string
  resourceId: string
  stageId?: string
  order: number
  notes?: string
}

// ============================================
// 场景
// ============================================
export type ScenarioType = 'basic' | 'advanced'

export interface Scenario {
  id: string
  name: string
  description: string
  icon?: string
  tags: string[]
  type: ScenarioType
  color?: string
  stages: Stage[]
  resources: ScenarioResource[]
  createdAt: string
  updatedAt: string
}

// ============================================
// 存储数据结构
// ============================================
export interface AppData {
  scenarios: Scenario[]
  resources: Resource[]
  version: string
  lastUpdated: string
}

// ============================================
// 表单类型
// ============================================
export interface CreateScenarioFormData {
  name: string
  description: string
  icon?: string
  tags: string[]
  color?: string
}

export interface CreateResourceFormData {
  name: string
  url: string
  description: string
  icon?: string
  category: string
  tags: string[]
  type: ResourceType
}

// ============================================
// 常量定义
// ============================================
export const RESOURCE_CATEGORIES: readonly string[] = [
  'AI 工具',
  '设计工具',
  '开发工具',
  '部署服务',
  '数据分析',
  '营销工具',
  '协作工具',
  '学习资源',
  '其他',
] as const

export const STAGE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
] as const
