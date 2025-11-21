'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Calendar, CheckSquare, FileText } from 'lucide-react'
import Link from 'next/link'
import { mockMeetings, mockTasks, mockDecisions } from '@/lib/mock-data'

export function SearchClient() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        meetings: mockMeetings.map(m => ({
          id: m.id,
          title: m.title,
          date: m.date,
          excerpt: m.aiSummary || `Meeting on ${m.date} with ${m.participants.length} participants`,
        })),
        tasks: mockTasks,
        decisions: mockDecisions,
      }
    }

    const query = searchQuery.toLowerCase()
    
    return {
      meetings: mockMeetings
        .filter(meeting => 
          meeting.title.toLowerCase().includes(query) ||
          meeting.aiSummary?.toLowerCase().includes(query) ||
          meeting.rawNotes?.toLowerCase().includes(query)
        )
        .map(m => ({
          id: m.id,
          title: m.title,
          date: m.date,
          excerpt: m.aiSummary || `Meeting on ${m.date} with ${m.participants.length} participants`,
        })),
      tasks: mockTasks.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.owner.toLowerCase().includes(query) ||
          task.meeting.toLowerCase().includes(query)
      ),
      decisions: mockDecisions.filter(
        decision =>
          decision.text.toLowerCase().includes(query) ||
          decision.meeting.toLowerCase().includes(query)
      ),
    }
  }, [searchQuery])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Search</h1>
        <p className="text-muted-foreground">
          Search across all meetings, tasks, and decisions
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for meetings, tasks, decisions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="text-primary" variant="outline">
          <Filter className="mr-2 h-4 w-4 text-primary" />
          Filters
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-primary">Meetings</CardTitle>
              <Badge className="text-primary" variant="secondary">{filteredResults.meetings.length}</Badge>
            </div>
            <CardDescription>Recent meetings matching your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredResults.meetings.length > 0 ? (
              filteredResults.meetings.map((meeting) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                  <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-primary">{meeting.title}</h3>
                      <Badge className="text-primary" variant="outline">{meeting.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{meeting.excerpt}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No meetings found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-primary">Tasks</CardTitle>
              <Badge className="text-primary" variant="secondary">{filteredResults.tasks.length}</Badge>
            </div>
            <CardDescription>Action items matching your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredResults.tasks.length > 0 ? (
              filteredResults.tasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm text-primary">{task.title}</h3>
                    <Badge variant={task.status === 'in-progress' ? 'default' : 'secondary'} className="capitalize">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{task.owner}</span>
                    <span>Due: {task.deadline}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-primary">Decisions</CardTitle>
              <Badge className="text-primary" variant="secondary">{filteredResults.decisions.length}</Badge>
            </div>
            <CardDescription>Key decisions matching your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredResults.decisions.length > 0 ? (
              filteredResults.decisions.map((decision) => (
                <div key={decision.id} className="rounded-lg border p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant={decision.impact === 'high' ? 'destructive' : 'secondary'}>
                      {decision.impact}
                    </Badge>
                    <p className="text-sm flex-1 text-primary">{decision.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">From: {decision.meeting}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No decisions found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

