'use client'

import Link from 'next/link'
import { ExternalLink, Tag } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Resource } from '@/types'

interface ResourceCardProps {
  resource: Resource
  onDelete?: () => void
}

export function ResourceCard({ resource, onDelete }: ResourceCardProps) {
  return (
    <Card className="h-full flex flex-col group">
      <CardContent className="p-4 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{resource.icon || '🌐'}</span>
            <div>
              <h3 className="font-semibold">{resource.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-0.5 rounded bg-muted">{resource.category}</span>
            <span className="px-2 py-0.5 rounded bg-muted">
              {resource.type === 'website' ? '网站' : resource.type === 'tool' ? '工具' : '服务'}
            </span>
          </div>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{resource.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/resources/${resource.id}/edit`}>编辑</Link>
        </Button>
        {onDelete && (
          <Button variant="destructive" className="flex-1" onClick={onDelete}>
            删除
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
