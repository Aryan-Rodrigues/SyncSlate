'use client'

import { useState } from 'react'
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
import { Search, Upload, Filter } from 'lucide-react'
import { UploadNotesModal } from '@/components/modals/upload-notes-modal'
import { mockMeetings } from '@/lib/mock-data'

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredMeetings = mockMeetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.date.includes(searchQuery)
  )
  
  const formatParticipants = (participants: string[]) => {
    if (participants.length <= 2) {
      return participants.join(', ')
    }
    return `${participants.slice(0, 2).join(', ')}, +${participants.length - 2} more`
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
        <UploadNotesModal>
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
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/meetings/${meeting.id}`} className="font-medium hover:underline text-primary">
                      {meeting.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-primary">{meeting.date}</div>
                      <div className="text-muted-foreground">{meeting.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-primary">
                      {formatParticipants(meeting.participants)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{meeting.decisions}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{meeting.tasks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-primary">
                      {meeting.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No meetings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
