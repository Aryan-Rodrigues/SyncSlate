'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Upload, Loader2, CheckCircle2 } from 'lucide-react'
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
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [summaryResult, setSummaryResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null)
      setSummaryResult(null)
      setIsSummarizing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (notesTextareaRef.current) {
        notesTextareaRef.current.value = ''
      }
    }
  }, [open])

  // Function to read file contents
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = (e) => {
        reject(new Error('Failed to read file'))
      }
      
      // Only read text files for now (PDF and DOCX would need additional libraries)
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file)
      } else {
        reject(new Error('Only .txt files are supported. Please paste your content in the text area.'))
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // If it's a text file, read and populate the textarea
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      try {
        const content = await readFileContent(file)
        if (notesTextareaRef.current) {
          notesTextareaRef.current.value = content
        }
        toast.success('File loaded successfully')
      } catch (error: any) {
        toast.error(error.message || 'Failed to read file')
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } else {
      toast.info('Only .txt files can be read automatically. For other formats, please paste the content manually.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('You must be logged in to upload meetings')
      return
    }

    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('meeting-title') as string
    const date = formData.get('meeting-date') as string
    const participants = formData.get('participants') as string
    let rawNotes = (formData.get('notes') as string)?.trim() || ''

    // If no notes in textarea but file is selected, try to read file
    if (!rawNotes && selectedFile) {
      try {
        rawNotes = await readFileContent(selectedFile)
      } catch (error: any) {
        toast.error(error.message || 'Failed to read file. Please paste content manually.')
        return
      }
    }
    
    // Validate required fields
    if (!title?.trim()) {
      toast.error('Please enter a meeting title')
      return
    }
    
    if (!date) {
      toast.error('Please select a meeting date')
      return
    }
    
    if (!rawNotes || rawNotes.trim().length < 10) {
      toast.error('Please provide meeting notes or transcript (at least 10 characters)')
      return
    }

    setIsLoading(true)
    setIsSummarizing(false)
    setSummaryResult(null)

    try {
      // Parse participants into array
      const participantsArray = participants
        ? participants.split(',').map(p => p.trim()).filter(p => p.length > 0)
        : null

      // Insert meeting into Supabase first (without summary)
      const { data: meetingData, error: insertError } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          title,
          raw_notes: rawNotes,
          ai_summary: null, // Will be updated after summarization
          meeting_date: date,
          participants: participantsArray,
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

      // Call the summarize API to generate AI summary using Gemini
      setIsSummarizing(true)
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
            participants: participantsArray,
          }),
        })

        if (!summarizeResponse.ok) {
          const errorData = await summarizeResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Summarization failed: ${summarizeResponse.statusText}`)
        }

        const summaryData = await summarizeResponse.json()
        
        // Handle different response formats from the Edge Function
        const summary = summaryData.summary || summaryData.ai_summary || summaryData.text || summaryData.content
        
        if (summary) {
          // Update the meeting with the AI summary
          const { error: updateError } = await supabase
            .from('meetings')
            .update({ ai_summary: summary })
            .eq('id', meetingData.id)

          if (updateError) {
            console.error('Error updating meeting with summary:', updateError)
            toast.warning('Summary generated but failed to save. Meeting was created.')
          } else {
            setSummaryResult(summary)
            toast.success('Meeting uploaded and summarized successfully!')
          }
        } else {
          console.warn('No summary in response:', summaryData)
          toast.warning('Meeting uploaded, but summary was not generated')
        }
      } catch (summaryError: any) {
        // If summarization fails, the meeting is still created
        console.error('Error summarizing meeting:', summaryError)
        toast.warning(`Meeting uploaded, but summary generation failed: ${summaryError.message}`)
      } finally {
        setIsSummarizing(false)
      }

      // Don't close modal immediately if we have a summary to show
      if (!summaryResult) {
        form.reset()
        setOpen(false)
        
        // Trigger refresh callback if provided
        if (onSuccess) {
          onSuccess()
        } else {
          router.refresh()
        }
      }
    } catch (error: any) {
      console.error('Error uploading meeting:', error)
      toast.error(error?.message || 'Failed to upload meeting. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Meeting Notes</DialogTitle>
          <DialogDescription>
            Add notes or transcript from a meeting to generate AI-powered insights using Gemini
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting title *</Label>
            <Input
              id="meeting-title"
              name="meeting-title"
              placeholder="Q4 Planning Session"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Meeting date *</Label>
            <Input
              id="meeting-date"
              name="meeting-date"
              type="date"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Participants (comma-separated)</Label>
            <Input
              id="participants"
              name="participants"
              placeholder="John Doe, Jane Smith, ..."
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or Transcript *</Label>
            <Textarea
              id="notes"
              name="notes"
              ref={notesTextareaRef}
              placeholder="Paste your meeting notes or transcript here... (or upload a .txt file below)"
              rows={8}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              * Required: Either paste notes above or upload a .txt file below
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Or upload a file (.txt only)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                name="file"
                ref={fileInputRef}
                type="file"
                accept=".txt"
                className="cursor-pointer"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Show summary result if available */}
          {summaryResult && (
            <div className="space-y-2 p-4 bg-muted rounded-lg border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <Label className="text-base font-semibold">AI Summary Generated</Label>
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
                {summaryResult}
              </div>
            </div>
          )}

          {/* Show loading state for summarization */}
          {isSummarizing && (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Generating AI summary with Gemini...
              </span>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading || isSummarizing}
            >
              {summaryResult ? 'Close' : 'Cancel'}
            </Button>
            {!summaryResult && (
              <Button 
                type="submit" 
                disabled={isLoading || isSummarizing || !user}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : isSummarizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  'Upload & Summarize'
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
