'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '场景', icon: Compass },
    { href: '/resources', label: '资源', icon: Globe },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Web Trace</span>
        </div>

        <nav className="flex items-center gap-1 ml-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/resources/new">
              <Plus className="h-4 w-4 mr-2" />
              新建资源
            </Link>
          </Button>
          <Button asChild>
            <Link href="/scenarios/new">
              <Plus className="h-4 w-4 mr-2" />
              新建场景
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
