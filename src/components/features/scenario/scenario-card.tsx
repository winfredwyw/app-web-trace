'use client'

import Link from 'next/link'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Scenario, Resource } from '@/types'

interface ScenarioCardProps {
  scenario: Scenario
  resources: Resource[]
}

export function ScenarioCard({ scenario, resources }: ScenarioCardProps) {
  const scenarioResources = scenario.resources
    .map((sr) => resources.find((r) => r.id === sr.resourceId))
    .filter(Boolean) as Resource[]

  const date = new Date(scenario.createdAt).toLocaleDateString('zh-CN')

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scenario.icon || '📁'}</span>
            <div>
              <CardTitle className="text-lg">{scenario.name}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {date}
              </div>
            </div>
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: scenario.color ? `${scenario.color}20` : 'var(--accent)',
              color: scenario.color || 'var(--accent-foreground)',
            }}
          >
            {scenario.type === 'advanced' ? '高级' : '基础'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="mb-3 line-clamp-2">
          {scenario.description}
        </CardDescription>

        {scenario.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {scenario.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {scenario.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{scenario.tags.length - 3}</span>
            )}
          </div>
        )}

        {scenario.stages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {scenario.stages.map((stage) => (
              <div
                key={stage.id}
                className="h-2 flex-1 rounded-full"
                style={{ backgroundColor: stage.color || 'var(--muted)' }}
                title={stage.name}
              />
            ))}
          </div>
        )}

        <div className="mt-3 text-sm text-muted-foreground">
          {scenarioResources.length} 个资源 · {scenario.stages.length} 个阶段
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link href={`/scenarios/${scenario.id}`}>
            查看详情
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
