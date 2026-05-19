'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getScenarioById, getResources, addResourceToScenario } from '@/lib/storage'
import type { Scenario, Resource } from '@/types'

export default function AddResourceToScenarioPage() {
  const params = useParams()
  const router = useRouter()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [allResources, setAllResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStageId, setSelectedStageId] = useState<string>('')

  useEffect(() => {
    const id = params.id as string
    setScenario(getScenarioById(id))
    setAllResources(getResources())
  }, [params.id])

  if (!scenario) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center">
          <h2 className="mb-2 text-xl font-semibold">场景不存在</h2>
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 获取场景中已有的资源 ID
  const existingResourceIds = new Set(scenario.resources.map((sr) => sr.resourceId))

  // 筛选未添加的资源
  const availableResources = allResources.filter(
    (r) =>
      !existingResourceIds.has(r.id) &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddResource = (resourceId: string) => {
    addResourceToScenario(params.id as string, resourceId, selectedStageId || undefined)
    // 刷新场景数据
    setScenario(getScenarioById(params.id as string))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container flex-1 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/scenarios/${params.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">向「{scenario.name}」添加资源</h1>
            <p className="text-muted-foreground">选择要添加到这个场景的资源</p>
          </div>
        </div>

        {/* Stage Selection */}
        {scenario.stages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">选择阶段（可选）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-md px-4 py-2 transition-colors ${
                    !selectedStageId ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  onClick={() => setSelectedStageId('')}
                >
                  不分配阶段
                </button>
                {scenario.stages.map((stage) => (
                  <button
                    key={stage.id}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 transition-colors ${
                      selectedStageId === stage.id
                        ? 'text-white'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    style={selectedStageId === stage.id ? { backgroundColor: stage.color } : {}}
                    onClick={() => setSelectedStageId(stage.id)}
                  >
                    {stage.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="搜索资源..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild variant="outline">
            <Link href="/resources/new">
              <Plus className="mr-2 h-4 w-4" />
              创建新资源
            </Link>
          </Button>
        </div>

        {/* Resources List */}
        <div className="space-y-3">
          {availableResources.length > 0 ? (
            availableResources.map((resource) => (
              <Card key={resource.id} className="group transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{resource.icon || '🌐'}</span>
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {resource.description}
                      </p>
                    </div>
                    <span className="bg-muted rounded px-2 py-0.5 text-xs">
                      {resource.category}
                    </span>
                  </div>
                  <Button onClick={() => handleAddResource(resource.id)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <div className="mb-4 text-4xl">📦</div>
                <h3 className="mb-2 font-semibold">没有更多资源可添加</h3>
                <p className="text-muted-foreground mb-4">
                  所有资源都已添加到此场景，或者没有匹配的搜索结果
                </p>
                <Button asChild>
                  <Link href="/resources/new">
                    <Plus className="mr-2 h-4 w-4" />
                    创建新资源
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
