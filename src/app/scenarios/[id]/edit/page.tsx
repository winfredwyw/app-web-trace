'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getScenarioById, updateScenario, addStageToScenario, removeStageFromScenario } from '@/lib/storage'
import type { Scenario, CreateScenarioFormData } from '@/types'

const ICONS = ['🚀', '✨', '💻', '🎨', '📊', '🌐', '⚡', '🔥', '💡', '🎯', '📦', '🔧']
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function EditScenarioPage() {
  const params = useParams()
  const router = useRouter()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [formData, setFormData] = useState<CreateScenarioFormData>({
    name: '',
    description: '',
    icon: '',
    tags: [],
    color: COLORS[0],
  })
  const [tagInput, setTagInput] = useState('')
  const [stageInput, setStageInput] = useState('')

  useEffect(() => {
    const id = params.id as string
    const data = getScenarioById(id)
    if (data) {
      setScenario(data)
      setFormData({
        name: data.name,
        description: data.description,
        icon: data.icon || '',
        tags: data.tags,
        color: data.color || COLORS[0],
      })
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入场景名称')
      return
    }
    updateScenario(params.id as string, formData)
    router.push(`/scenarios/${params.id}`)
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleAddStage = () => {
    const stageName = stageInput.trim()
    if (stageName && scenario) {
      addStageToScenario(params.id as string, stageName, COLORS[scenario.stages.length % COLORS.length])
      setScenario(getScenarioById(params.id as string))
      setStageInput('')
    }
  }

  const handleRemoveStage = (stageId: string) => {
    if (confirm('确定要删除这个阶段吗？与此阶段关联的资源将变为未分配状态。')) {
      removeStageFromScenario(params.id as string, stageId)
      setScenario(getScenarioById(params.id as string))
    }
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2">场景不存在</h2>
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/scenarios/${params.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">编辑场景</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 名称 */}
              <div className="space-y-2">
                <Label htmlFor="name">场景名称 *</Label>
                <Input
                  id="name"
                  placeholder="例如：独立开发者发布 SaaS"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <Label htmlFor="description">场景描述</Label>
                <Input
                  id="description"
                  placeholder="简要描述这个场景的用途"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* 图标选择 */}
              <div className="space-y-2">
                <Label>选择图标</Label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`text-2xl p-2 rounded-lg transition-colors ${
                        formData.icon === icon
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* 颜色选择 */}
              <div className="space-y-2">
                <Label>选择颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <Label>标签</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入标签后按回车"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    添加
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 阶段管理 */}
          <Card>
            <CardHeader>
              <CardTitle>阶段管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 添加阶段 */}
              <div className="flex gap-2">
                <Input
                  placeholder="例如：设计、开发、部署"
                  value={stageInput}
                  onChange={(e) => setStageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddStage()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddStage}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加阶段
                </Button>
              </div>

              {/* 阶段列表 */}
              {scenario.stages.length > 0 && (
                <div className="space-y-2">
                  {scenario.stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color || COLORS[index % COLORS.length] }}
                      />
                      <span className="flex-1 font-medium">{stage.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveStage(stage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {scenario.stages.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  暂无阶段，添加阶段来组织你的工作流
                </div>
              )}
            </CardContent>
          </Card>

          {/* 提交按钮 */}
          <div className="flex justify-end gap-4">
            <Button asChild variant="outline">
              <Link href={`/scenarios/${params.id}`}>取消</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
