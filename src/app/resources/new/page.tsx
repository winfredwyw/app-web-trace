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
import { createResource } from '@/lib/storage'
import { RESOURCE_CATEGORIES } from '@/types'
import type { CreateResourceFormData, ResourceType } from '@/types'

const ICONS = ['🌐', '💻', '🎨', '📊', '⚡', '🔧', '📦', '✨', '🚀', '💡', '📱', '☁️']
const TYPES: { value: ResourceType; label: string }[] = [
  { value: 'website', label: '网站' },
  { value: 'tool', label: '工具' },
  { value: 'service', label: '服务' },
]

export default function CreateResourcePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateResourceFormData>({
    name: '',
    url: '',
    description: '',
    icon: '',
    category: RESOURCE_CATEGORIES[0],
    tags: [],
    type: 'website',
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入资源名称')
      return
    }
    if (!formData.url.trim()) {
      alert('请输入资源 URL')
      return
    }
    createResource(formData)
    router.push('/resources')
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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container max-w-2xl flex-1 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/resources">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">创建新资源</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 名称 */}
              <div className="space-y-2">
                <Label htmlFor="name">资源名称 *</Label>
                <Input
                  id="name"
                  placeholder="例如：Figma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label htmlFor="url">资源链接 *</Label>
                <Input
                  id="url"
                  placeholder="https://"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              {/* 描述 */}
              <div className="space-y-2">
                <Label htmlFor="description">资源描述</Label>
                <Input
                  id="description"
                  placeholder="简要描述这个资源的用途"
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
                      className={`rounded-lg p-2 text-2xl transition-colors ${
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

              {/* 分类 */}
              <div className="space-y-2">
                <Label htmlFor="category">分类</Label>
                <select
                  id="category"
                  className="bg-background w-full rounded-md border px-3 py-2"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {RESOURCE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 类型 */}
              <div className="space-y-2">
                <Label>类型</Label>
                <div className="flex gap-4">
                  {TYPES.map((type) => (
                    <label key={type.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value as ResourceType })
                        }
                        className="rounded"
                      />
                      <span>{type.label}</span>
                    </label>
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
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
          <div className="mt-6 flex justify-end gap-4">
            <Button asChild variant="outline">
              <Link href="/resources">取消</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              创建资源
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
