'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { createScenario } from '@/lib/storage'
import type { CreateScenarioFormData } from '@/types'

const ICONS = ['🚀', '✨', '💻', '🎨', '📊', '🌐', '⚡', '🔥', '💡', '🎯', '📦', '🔧']
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function CreateScenarioPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateScenarioFormData>({
    name: '',
    description: '',
    icon: '',
    tags: [],
    color: COLORS[0],
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入场景名称')
      return
    }
    const scenario = createScenario(formData)
    router.push(`/scenarios/${scenario.id}`)
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">创建新场景</h1>
        </div>

        <form onSubmit={handleSubmit}>
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

          {/* 提交按钮 */}
          <div className="flex justify-end gap-4 mt-6">
            <Button asChild variant="outline">
              <Link href="/">取消</Link>
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              创建场景
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
