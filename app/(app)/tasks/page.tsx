'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Task } from '@/lib/types'
import { defaultTasks } from '@/lib/default-data'

interface SupabaseTask {
  id: string
  user_id: string | null // null for default tasks
  meeting_id: string | null
  title: string
  status: string
  deadline: string | null
  owner?: string | null
  created_at: string
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<SupabaseTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Fetch tasks from Supabase
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Combine user tasks with default tasks
      const allTasks = [
        ...(tasksData || []),
        ...defaultTasks,
      ].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })

      setTasks(allTasks)
    } catch (error: any) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [router])

  const columns = useMemo(() => {
    const statuses: Array<'not-started' | 'in-progress' | 'done'> = ['not-started', 'in-progress', 'done']
    return statuses.map(status => ({
      id: status,
      title: status === 'not-started' ? 'Not Started' : status === 'in-progress' ? 'In Progress' : 'Done',
      tasks: tasks.filter(task => {
        // Map Supabase status to UI status
        const taskStatus = task.status.toLowerCase().replace(' ', '-')
        return taskStatus === status || 
               (status === 'in-progress' && (task.status === 'In Progress' || task.status === 'in-progress'))
      }),
    }))
  }, [tasks])

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    // Map UI status to Supabase status format
    const supabaseStatus = newStatus === 'in-progress' ? 'In Progress' : 
                          newStatus === 'not-started' ? 'Not Started' : 
                          'Done'

    // Check if this is a default task (user_id is null)
    const task = tasks.find(t => t.id === taskId)
    if (task && task.user_id === null) {
      // For default tasks, just update the UI optimistically (no database update)
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: supabaseStatus } : t
      ))
      toast.success('Task status updated (sample task)')
      return
    }

    // Optimistically update UI for user's own tasks
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: supabaseStatus } : t
    ))

    try {
      // Update task in Supabase (only for user's own tasks)
      const { error } = await supabase
        .from('tasks')
        .update({ status: supabaseStatus })
        .eq('id', taskId)
        .eq('user_id', user?.id)

      if (error) {
        throw error
      }

      toast.success('Task status updated')
    } catch (error: any) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task status')
      // Revert optimistic update
      fetchTasks()
    }
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
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {column.tasks.map((task) => {
                    // Get owner initials
                    const ownerInitials = task.owner 
                      ? task.owner.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : 'NA'
                    
                    // Format deadline
                    const deadline = task.deadline 
                      ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'No deadline'

                    return (
                      <Card 
                        key={task.id} 
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                        onDoubleClick={() => {
                          // Cycle through statuses on double click
                          const statuses: Task['status'][] = ['not-started', 'in-progress', 'done']
                          const currentStatus = task.status.toLowerCase().replace(' ', '-')
                          const currentIndex = statuses.indexOf(currentStatus as Task['status'])
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
                          {task.meeting_id && (
                            <div className="text-xs text-muted-foreground">
                              Meeting ID: {task.meeting_id}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            {task.owner && (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {ownerInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-primary">{task.owner}</span>
                              </div>
                            )}
                            <Badge variant="outline" className="text-xs text-primary">
                              {deadline}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {column.tasks.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                      No tasks
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
