'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function UploadNotesModal({ 
  children, 
  onSuccess 
}: { 
  children: React.ReactNode
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Meeting Notes</DialogTitle>
          <DialogDescription>
            Add notes or transcript from a meeting to generate insights
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting title</Label>
            <Input
              id="meeting-title"
              placeholder="Q4 Planning Session"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Meeting date</Label>
            <Input
              id="meeting-date"
              type="date"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              placeholder="John Doe, Jane Smith, ..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or Transcript</Label>
            <Textarea
              id="notes"
              placeholder="Paste your meeting notes or transcript here..."
              rows={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Or upload a file</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !user}
              onClick={async (e) => {
                e.preventDefault()
                
                if (!user) {
                  toast.error('You must be logged in to upload meetings')
                  return
                }

                const form = e.currentTarget.closest('form')
                if (!form) return

                const formData = new FormData(form)
                const title = formData.get('meeting-title') as string
                const rawNotes = formData.get('notes') as string
                const date = formData.get('meeting-date') as string
                
                if (!title || !rawNotes || !date) {
                  toast.error('Please fill in all required fields')
                  return
                }

                setIsLoading(true)

                try {
                  // Insert meeting into Supabase first (without summary)
                  const { data: meetingData, error: insertError } = await supabase
                    .from('meetings')
                    .insert({
                      user_id: user.id,
                      title,
                      raw_notes: rawNotes,
                      ai_summary: null, // Will be updated after summarization
                      meeting_date: date,
                    })
                    .select()
                    .single()

                  if (insertError) {
                    throw insertError
                  }

                  if (!meetingData) {
                    throw new Error('Failed to create meeting')
                  }

                  // Get the session token for the API call
                  const { data: { session } } = await supabase.auth.getSession()
                  const accessToken = session?.access_token

                  // Call the summarize API to generate AI summary
                  try {
                    const summarizeResponse = await fetch('/api/summarize', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
                      },
                      body: JSON.stringify({
                        meeting_id: meetingData.id,
                        raw_notes: rawNotes,
                        title,
                        meeting_date: date,
                      }),
                    })

                    if (summarizeResponse.ok) {
                      const summaryData = await summarizeResponse.json()
                      
                      // Update the meeting with the AI summary
                      if (summaryData.summary) {
                        await supabase
                          .from('meetings')
                          .update({ ai_summary: summaryData.summary })
                          .eq('id', meetingData.id)
                      }
                    } else {
                      console.warn('Summarization failed, but meeting was created')
                    }
                  } catch (summaryError) {
                    // If summarization fails, the meeting is still created
                    console.error('Error summarizing meeting:', summaryError)
                    toast.info('Meeting uploaded, but summary generation is pending')
                  }

                  toast.success('Meeting uploaded successfully!')
                  setOpen(false)
                  form.reset()
                  
                  // Trigger refresh callback if provided
                  if (onSuccess) {
                    onSuccess()
                  } else {
                    // Fallback to page refresh
                    router.refresh()
                  }
                } catch (error: any) {
                  console.error('Error uploading meeting:', error)
                  toast.error(error?.message || 'Failed to upload meeting. Please try again.')
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              {isLoading ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
