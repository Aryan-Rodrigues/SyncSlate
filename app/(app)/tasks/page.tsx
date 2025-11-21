'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockTasks } from '@/lib/mock-data'
import type { Task } from '@/lib/types'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const columns = useMemo(() => {
    const statuses: Array<'not-started' | 'in-progress' | 'done'> = ['not-started', 'in-progress', 'done']
    return statuses.map(status => ({
      id: status,
      title: status === 'not-started' ? 'Not Started' : status === 'in-progress' ? 'In Progress' : 'Done',
      tasks: tasks.filter(task => task.status === status),
    }))
  }, [tasks])

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Tasks</h1>
        <p className="text-muted-foreground">
          Track and manage action items from meetings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">{column.title}</h2>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>
            <div className="space-y-3 flex-1">
              {column.tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  onDoubleClick={() => {
                    // Cycle through statuses on double click
                    const statuses: Task['status'][] = ['not-started', 'in-progress', 'done']
                    const currentIndex = statuses.indexOf(task.status)
                    const nextIndex = (currentIndex + 1) % statuses.length
                    handleStatusChange(task.id, statuses[nextIndex])
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium leading-snug text-primary">
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-3">
                    <div className="text-xs text-muted-foreground">
                      {task.meeting}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.ownerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-primary">{task.owner}</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-primary">
                        {task.deadline}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {column.tasks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
