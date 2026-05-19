'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Calendar, Plus, Tag, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getScenarioById, getResources, deleteScenario, removeResourceFromScenario } from '@/lib/storage'
import type { Scenario, Resource } from '@/types'

export default function ScenarioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [allResources, setAllResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    setScenario(getScenarioById(id))
    setAllResources(getResources())
    setLoading(false)
  }, [params.id])

  const handleDelete = () => {
    if (confirm('确定要删除这个场景吗？')) {
      deleteScenario(params.id as string)
      router.push('/')
    }
  }

  const handleRemoveResource = (resourceId: string) => {
    if (confirm('确定要移除这个资源吗？')) {
      removeResourceFromScenario(params.id as string, resourceId)
      // 刷新数据
      setScenario(getScenarioById(params.id as string))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">场景不存在</h2>
          <p className="text-muted-foreground mb-4">该场景可能已被删除</p>
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 按阶段分组资源
  const resourcesByStage = scenario.stages.map((stage) => ({
    stage,
    resources: scenario.resources
      .filter((sr) => sr.stageId === stage.id)
      .map((sr) => allResources.find((r) => r.id === sr.resourceId))
      .filter(Boolean) as Resource[],
  }))

  // 未分配阶段的资源
  const unassignedResources = scenario.resources
    .filter((sr) => !sr.stageId)
    .map((sr) => allResources.find((r) => r.id === sr.resourceId))
    .filter(Boolean) as Resource[]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{scenario.icon || '📁'}</span>
              <div>
                <h1 className="text-2xl font-bold">{scenario.name}</h1>
                <p className="text-muted-foreground">{scenario.description}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/scenarios/${scenario.id}/add-resource`}>
              <Plus className="h-4 w-4 mr-2" />
                添加资源
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/scenarios/${scenario.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            创建于 {new Date(scenario.createdAt).toLocaleDateString('zh-CN')}
          </div>
          {scenario.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {scenario.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: scenario.color ? `${scenario.color}20` : 'var(--accent)',
              color: scenario.color || 'var(--accent-foreground)',
            }}
          >
            {scenario.type === 'advanced' ? '高级场景' : '基础场景'}
          </div>
        </div>

        {/* Stages & Resources */}
        <div className="space-y-6">
          {resourcesByStage.map(({ stage, resources }) => (
            <div key={stage.id}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: stage.color || 'var(--muted)' }}
                />
                <h2 className="text-lg font-semibold">{stage.name}</h2>
                {stage.description && (
                  <span className="text-sm text-muted-foreground">{stage.description}</span>
                )}
                <span className="text-sm text-muted-foreground">({resources.length} 个资源)</span>
              </div>

              {resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => (
                    <Card key={resource.id} className="group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{resource.icon || '🌐'}</span>
                            <div>
                              <h3 className="font-medium">{resource.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveResource(resource.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {resource.category}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <p>暂无资源</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}

          {/* Unassigned Resources */}
          {unassignedResources.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">未分配资源 ({unassignedResources.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unassignedResources.map((resource) => (
                  <Card key={resource.id} className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{resource.icon || '🌐'}</span>
                          <div>
                            <h3 className="font-medium">{resource.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Resources */}
          {scenario.resources.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-semibold mb-2">暂无资源</h3>
                <p className="text-muted-foreground mb-4">向这个场景添加资源，开始组织你的工作流</p>
                <Button asChild>
                  <Link href={`/scenarios/${scenario.id}/add-resource`}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加资源
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
