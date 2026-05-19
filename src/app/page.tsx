'use client'

import { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { ScenarioCard } from '@/components/features/scenario/scenario-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getScenarios, getResources } from '@/lib/storage'
import type { Scenario, Resource } from '@/types'

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setScenarios(getScenarios())
    setResources(getResources())
  }, [])

  const filteredScenarios = scenarios.filter(
    (scenario) =>
      scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">场景</h1>
              <p className="text-muted-foreground mt-1">
                基于真实使用场景组织互联网资源
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索场景..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild>
                <Link href="/scenarios/new">
                  <Plus className="h-4 w-4 mr-2" />
                  新建场景
                </Link>
              </Button>
            </div>
          </div>

          {/* Scenarios Grid */}
          {filteredScenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} resources={resources} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold mb-2">暂无场景</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {searchQuery ? '没有找到匹配的场景，尝试其他搜索词' : '创建第一个场景，开始组织你的互联网资源'}
              </p>
              <Button asChild>
                <Link href="/scenarios/new">
                  <Plus className="h-4 w-4 mr-2" />
                  创建场景
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
