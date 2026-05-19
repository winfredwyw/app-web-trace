'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { ResourceCard } from '@/components/features/resource/resource-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getResources, deleteResource } from '@/lib/storage'
import type { Resource, RESOURCE_CATEGORIES } from '@/types'

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    setResources(getResources())
  }, [])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个资源吗？')) {
      deleteResource(id)
      setResources(getResources())
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">资源</h1>
            <p className="text-muted-foreground mt-1">管理你的互联网资源库</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索资源..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 rounded-md border bg-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">所有分类</option>
              {RESOURCE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <Button asChild>
              <Link href="/resources/new">
                <Plus className="h-4 w-4 mr-2" />
                新建资源
              </Link>
            </Button>
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDelete={() => handleDelete(resource.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-lg font-semibold mb-2">暂无资源</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {searchQuery || selectedCategory
                  ? '没有找到匹配的资源，尝试其他搜索词'
                  : '添加第一个资源，开始构建你的互联网资源库'}
              </p>
              <Button asChild>
                <Link href="/resources/new">
                  <Plus className="h-4 w-4 mr-2" />
                  创建资源
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
