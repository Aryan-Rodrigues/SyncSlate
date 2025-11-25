'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Upload, Filter, Loader2 } from 'lucide-react'
import { UploadNotesModal } from '@/components/modals/upload-notes-modal'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SupabaseMeeting {
  id: string
  user_id: string
  title: string
  raw_notes: string | null
  ai_summary: string | null
  meeting_date: string | null
  created_at: string
  participants?: string[] | null
  decisions_count?: number | null
  tasks_count?: number | null
  status?: string | null
}

export default function MeetingsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [meetings, setMeetings] = useState<SupabaseMeeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchMeetings = async () => {
    try {
      setIsLoading(true)
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Fetch meetings from Supabase
      const { data: meetingsData, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setMeetings(meetingsData || [])
    } catch (error: any) {
      console.error('Error fetching meetings:', error)
      toast.error('Failed to load meetings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [router])

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.meeting_date?.includes(searchQuery) ||
    meeting.created_at?.includes(searchQuery)
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Meetings</h1>
          <p className="text-muted-foreground">
            View and manage all your meeting records
          </p>
        </div>
        <UploadNotesModal onSuccess={fetchMeetings}>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Notes
          </Button>
        </UploadNotesModal>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="text-primary" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meeting</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-center text-sidebar-foreground">Decisions</TableHead>
              <TableHead className="text-center text-sidebar-foreground">Tasks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading meetings...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/meetings/${meeting.id}`} className="font-medium hover:underline text-primary">
                      {meeting.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-primary">{formatDate(meeting.meeting_date || meeting.created_at)}</div>
                      <div className="text-muted-foreground">{formatTime(meeting.created_at)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-primary">
                      {meeting.participants && meeting.participants.length > 0
                        ? meeting.participants.length > 2
                          ? `${meeting.participants.slice(0, 2).join(', ')}, +${meeting.participants.length - 2} more`
                          : meeting.participants.join(', ')
                        : 'No participants'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{meeting.decisions_count || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{meeting.tasks_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-primary">
                      {meeting.status || 'completed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No meetings match your search' : 'No meetings yet. Upload your first meeting notes!'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
