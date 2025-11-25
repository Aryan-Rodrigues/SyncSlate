'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ArrowLeft, RefreshCw, Save, CalendarIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { mockTeamMembers } from '@/lib/mock-data'

interface SupabaseMeeting {
  id: string
  user_id: string
  title: string
  raw_notes: string | null
  ai_summary: string | null
  meeting_date: string | null
  created_at: string
}

interface SupabaseTask {
  id: string
  user_id: string
  meeting_id: string | null
  title: string
  status: string
  deadline: string | null
  owner: string | null
  created_at: string
}

export default function MeetingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const meetingId = params.id as string
  
  const [meeting, setMeeting] = useState<SupabaseMeeting | null>(null)
  const [actionItems, setActionItems] = useState<SupabaseTask[]>([])
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({})
  const [selectedOwner, setSelectedOwner] = useState<Record<string, string>>({})
  const [selectedDeadline, setSelectedDeadline] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchMeetingAndTasks = async () => {
      try {
        setIsLoading(true)
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        // Fetch meeting from Supabase
        const { data: meetingData, error: meetingError } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', meetingId)
          .eq('user_id', currentUser.id)
          .single()

        if (meetingError) {
          throw meetingError
        }

        if (!meetingData) {
          toast.error('Meeting not found')
          router.push('/meetings')
          return
        }

        setMeeting(meetingData)

        // Fetch tasks for this meeting
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('meeting_id', meetingId)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (tasksError) {
          throw tasksError
        }

        setActionItems(tasksData || [])
        
        // Initialize status, owner, and deadline from tasks
        const initialStatus: Record<string, string> = {}
        const initialOwner: Record<string, string> = {}
        const initialDeadline: Record<string, string> = {}
        
        (tasksData || []).forEach(task => {
          initialStatus[task.id] = task.status || 'Not Started'
          initialOwner[task.id] = task.owner || ''
          initialDeadline[task.id] = task.deadline || ''
        })
        
        setSelectedStatus(initialStatus)
        setSelectedOwner(initialOwner)
        setSelectedDeadline(initialDeadline)
      } catch (error: any) {
        console.error('Error fetching meeting:', error)
        toast.error('Failed to load meeting')
      } finally {
        setIsLoading(false)
      }
    }

    if (meetingId) {
      fetchMeetingAndTasks()
    }
  }, [meetingId, router])

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-primary mb-2">Meeting not found</h1>
          <Link href="/meetings">
            <Button variant="outline">Back to Meetings</Button>
          </Link>
        </div>
      </div>
    )
  }

  const rawNotes = meeting.raw_notes || `Meeting: ${meeting.title}\nDate: ${meeting.meeting_date || meeting.created_at}`
  const aiSummary = meeting.ai_summary || `Summary for ${meeting.title}`
  const meetingDate = meeting.meeting_date 
    ? new Date(meeting.meeting_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(meeting.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const meetingTime = new Date(meeting.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/meetings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            <p className="text-muted-foreground">{meetingDate} at {meetingTime}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={async () => {
              setIsRegenerating(true)
              // Placeholder: In a real app, this would regenerate the AI summary
              await new Promise(resolve => setTimeout(resolve, 1500))
              toast.success('AI summary regenerated successfully')
              setIsRegenerating(false)
            }}
            disabled={isRegenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
          <Button
            onClick={async () => {
              if (!user || !meeting) return
              
              setIsSaving(true)
              
              try {
                // Update all tasks that have been modified
                const updatePromises = actionItems.map(async (task) => {
                  const status = selectedStatus[task.id] || task.status
                  const owner = selectedOwner[task.id] || task.owner
                  const deadline = selectedDeadline[task.id] || task.deadline
                  
                  // Map UI status to Supabase format
                  const supabaseStatus = status === 'in-progress' ? 'In Progress' : 
                                       status === 'not-started' ? 'Not Started' : 
                                       status === 'done' ? 'Done' : status

                  return supabase
                    .from('tasks')
                    .update({
                      status: supabaseStatus,
                      owner: owner || null,
                      deadline: deadline || null,
                    })
                    .eq('id', task.id)
                    .eq('user_id', user.id)
                })

                await Promise.all(updatePromises)
                toast.success('Changes saved successfully')
              } catch (error: any) {
                console.error('Error saving tasks:', error)
                toast.error('Failed to save changes')
              } finally {
                setIsSaving(false)
              }
            }}
            disabled={isSaving || !user || !meeting}
          >
            <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Raw Notes</CardTitle>
            <CardDescription>Original meeting transcript</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{rawNotes}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
            <CardDescription>Generated meeting summary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{aiSummary}</p>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-3">Key Decisions</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">No decisions recorded yet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>Tasks and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionItems.length > 0 ? (
                actionItems.map((item) => (
                  <div key={item.id} className="space-y-2 pb-4 border-b last:border-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <div className="grid gap-2">
                      <Select
                        value={selectedOwner[item.id] || item.owner || ''}
                        onValueChange={(value) => {
                          setSelectedOwner({ ...selectedOwner, [item.id]: value })
                          setActionItems(prev => prev.map(task => 
                            task.id === item.id ? { ...task, owner: value } : task
                          ))
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTeamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={selectedStatus[item.id] || item.status || 'Not Started'}
                        onValueChange={(value) => {
                          setSelectedStatus({ ...selectedStatus, [item.id]: value })
                          setActionItems(prev => prev.map(task => 
                            task.id === item.id ? { ...task, status: value } : task
                          ))
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <CalendarIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="date"
                          value={selectedDeadline[item.id] || item.deadline || ''}
                          onChange={(e) => {
                            setSelectedDeadline({ ...selectedDeadline, [item.id]: e.target.value })
                            setActionItems(prev => prev.map(task => 
                              task.id === item.id ? { ...task, deadline: e.target.value } : task
                            ))
                          }}
                          className="h-8 text-xs pl-7"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No action items yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
