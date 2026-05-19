'use client'

import type { AppData, Scenario, Resource, CreateScenarioFormData, CreateResourceFormData } from '@/types'
import { MOCK_SCENARIOS, MOCK_RESOURCES } from '@/data/mock-data'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'web-trace-data'
const CURRENT_VERSION = '1.0.0'

// 初始化默认数据
function getDefaultData(): AppData {
  return {
    scenarios: MOCK_SCENARIOS,
    resources: MOCK_RESOURCES,
    version: CURRENT_VERSION,
    lastUpdated: new Date().toISOString(),
  }
}

// 从 LocalStorage 读取数据
export function loadData(): AppData {
  if (typeof window === 'undefined') {
    return getDefaultData()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored) as AppData
      // 版本检查和迁移可以在这里处理
      return data
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
  }

  // 返回默认数据
  return getDefaultData()
}

// 保存数据到 LocalStorage
export function saveData(data: AppData): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save data to localStorage:', error)
  }
}

// 重置数据为默认
export function resetData(): AppData {
  const defaultData = getDefaultData()
  saveData(defaultData)
  return defaultData
}

// ============================================
// 场景操作
// ============================================
export function getScenarios(): Scenario[] {
  const data = loadData()
  return data.scenarios
}

export function getScenarioById(id: string): Scenario | undefined {
  const data = loadData()
  return data.scenarios.find((s) => s.id === id)
}

export function createScenario(formData: CreateScenarioFormData): Scenario {
  const data = loadData()
  const newScenario: Scenario = {
    id: uuidv4(),
    ...formData,
    type: 'basic',
    stages: [],
    resources: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  data.scenarios.push(newScenario)
  saveData(data)
  return newScenario
}

export function updateScenario(id: string, updates: Partial<Scenario>): Scenario | undefined {
  const data = loadData()
  const index = data.scenarios.findIndex((s) => s.id === id)
  if (index === -1) return undefined

  data.scenarios[index] = {
    ...data.scenarios[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveData(data)
  return data.scenarios[index]
}

export function deleteScenario(id: string): boolean {
  const data = loadData()
  const initialLength = data.scenarios.length
  data.scenarios = data.scenarios.filter((s) => s.id !== id)
  saveData(data)
  return data.scenarios.length < initialLength
}

// ============================================
// 资源操作
// ============================================
export function getResources(): Resource[] {
  const data = loadData()
  return data.resources
}

export function getResourceById(id: string): Resource | undefined {
  const data = loadData()
  return data.resources.find((r) => r.id === id)
}

export function createResource(formData: CreateResourceFormData): Resource {
  const data = loadData()
  const newResource: Resource = {
    id: uuidv4(),
    ...formData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  data.resources.push(newResource)
  saveData(data)
  return newResource
}

export function updateResource(id: string, updates: Partial<Resource>): Resource | undefined {
  const data = loadData()
  const index = data.resources.findIndex((r) => r.id === id)
  if (index === -1) return undefined

  data.resources[index] = {
    ...data.resources[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  saveData(data)
  return data.resources[index]
}

export function deleteResource(id: string): boolean {
  const data = loadData()
  const initialLength = data.resources.length
  data.resources = data.resources.filter((r) => r.id !== id)
  // 同时删除场景中关联的此资源
  data.scenarios.forEach((scenario) => {
    scenario.resources = scenario.resources.filter((sr) => sr.resourceId !== id)
  })
  saveData(data)
  return data.resources.length < initialLength
}

// ============================================
// 场景-资源关联操作
// ============================================
export function addResourceToScenario(
  scenarioId: string,
  resourceId: string,
  stageId?: string
): boolean {
  const data = loadData()
  const scenario = data.scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return false

  // 检查是否已存在
  const exists = scenario.resources.some((sr) => sr.resourceId === resourceId)
  if (exists) return false

  scenario.resources.push({
    id: uuidv4(),
    resourceId,
    stageId,
    order: scenario.resources.length,
  })
  scenario.updatedAt = new Date().toISOString()
  saveData(data)
  return true
}

export function removeResourceFromScenario(scenarioId: string, resourceId: string): boolean {
  const data = loadData()
  const scenario = data.scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return false

  const initialLength = scenario.resources.length
  scenario.resources = scenario.resources.filter((sr) => sr.resourceId !== resourceId)
  scenario.updatedAt = new Date().toISOString()
  saveData(data)
  return scenario.resources.length < initialLength
}

export function updateResourceStage(
  scenarioId: string,
  resourceId: string,
  stageId: string | undefined
): boolean {
  const data = loadData()
  const scenario = data.scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return false

  const scenarioResource = scenario.resources.find((sr) => sr.resourceId === resourceId)
  if (!scenarioResource) return false

  scenarioResource.stageId = stageId
  scenario.updatedAt = new Date().toISOString()
  saveData(data)
  return true
}

// ============================================
// 场景-阶段操作
// ============================================
export function addStageToScenario(
  scenarioId: string,
  stageName: string,
  color?: string
): boolean {
  const data = loadData()
  const scenario = data.scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return false

  scenario.stages.push({
    id: uuidv4(),
    name: stageName,
    order: scenario.stages.length,
    color,
  })
  scenario.updatedAt = new Date().toISOString()
  saveData(data)
  return true
}

export function removeStageFromScenario(scenarioId: string, stageId: string): boolean {
  const data = loadData()
  const scenario = data.scenarios.find((s) => s.id === scenarioId)
  if (!scenario) return false

  const initialLength = scenario.stages.length
  scenario.stages = scenario.stages.filter((s) => s.id !== stageId)
  // 同时移除资源对此阶段的关联
  scenario.resources.forEach((sr) => {
    if (sr.stageId === stageId) {
      sr.stageId = undefined
    }
  })
  scenario.updatedAt = new Date().toISOString()
  saveData(data)
  return scenario.stages.length < initialLength
}
