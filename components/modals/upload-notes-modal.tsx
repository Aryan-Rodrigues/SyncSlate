'use client'

import { useState } from 'react'
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

export function UploadNotesModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

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
              onClick={async (e) => {
                e.preventDefault()
                // Mock upload - simulate processing
                const form = e.currentTarget.closest('form')
                if (form) {
                  const formData = new FormData(form)
                  const title = formData.get('meeting-title') as string
                  const date = formData.get('meeting-date') as string
                  
                  if (title && date) {
                    // Simulate upload
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    // In a real app, this would add the meeting to the list
                    console.log('[Mock] Uploading meeting notes:', { title, date })
                    setOpen(false)
                    // Reset form
                    form.reset()
                  }
                }
              }}
            >
              Upload & Process
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
