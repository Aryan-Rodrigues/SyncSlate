'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { ArrowLeft, RefreshCw, Save, CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getMeetingById, getTasksByMeeting, getDecisionsByMeeting, mockTeamMembers } from '@/lib/mock-data'

export default function MeetingDetailPage() {
  const params = useParams()
  const meetingId = Number(params.id)
  const meeting = getMeetingById(meetingId)
  
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({})
  const [selectedOwner, setSelectedOwner] = useState<Record<number, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [actionItems, setActionItems] = useState(getTasksByMeeting(meetingId))
  const [decisions] = useState(getDecisionsByMeeting(meetingId))

  useEffect(() => {
    if (meeting) {
      const tasks = getTasksByMeeting(meetingId)
      setActionItems(tasks)
      // Initialize status and owner from tasks
      const initialStatus: Record<number, string> = {}
      const initialOwner: Record<number, string> = {}
      tasks.forEach(task => {
        initialStatus[task.id] = task.status
        initialOwner[task.id] = task.owner
      })
      setSelectedStatus(initialStatus)
      setSelectedOwner(initialOwner)
    }
  }, [meetingId, meeting])

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

  const rawNotes = meeting.rawNotes || `Meeting: ${meeting.title}\nDate: ${meeting.date}\nAttendees: ${meeting.participants.join(', ')}`
  const aiSummary = meeting.aiSummary || `Summary for ${meeting.title}`

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
            <p className="text-muted-foreground">{meeting.date} at {meeting.time}</p>
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
              setIsSaving(true)
              // Placeholder: In a real app, this would save the changes
              await new Promise(resolve => setTimeout(resolve, 1000))
              toast.success('Changes saved successfully')
              setIsSaving(false)
            }}
            disabled={isSaving}
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
                {decisions.map((decision) => (
                  <div key={decision.id} className="flex items-start gap-2">
                    <Badge variant={decision.impact === 'high' ? 'destructive' : 'secondary'} className="mt-0.5">
                      {decision.impact}
                    </Badge>
                    <p className="text-sm flex-1">{decision.text}</p>
                  </div>
                ))}
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
              {actionItems.map((item) => (
                <div key={item.id} className="space-y-2 pb-4 border-b last:border-0">
                  <p className="text-sm font-medium">{item.task}</p>
                  <div className="grid gap-2">
                    <Select
                      value={selectedOwner[item.id] || item.owner}
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
                      value={selectedStatus[item.id] || item.status}
                      onValueChange={(value) => {
                        setSelectedStatus({ ...selectedStatus, [item.id]: value })
                        setActionItems(prev => prev.map(task => 
                          task.id === item.id ? { ...task, status: value as 'not-started' | 'in-progress' | 'done' } : task
                        ))
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <CalendarIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        defaultValue={item.deadline}
                        className="h-8 text-xs pl-7"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
