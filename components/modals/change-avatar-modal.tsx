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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, X } from 'lucide-react'

interface ChangeAvatarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeAvatarModal({ open, onOpenChange }: ChangeAvatarModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, or GIF)')
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSave = () => {
    if (selectedFile) {
      // Here you would upload the file to your backend
      console.log('[v0] Uploading avatar:', selectedFile)
      // After successful upload, close the modal
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. JPG, GIF or PNG. Max size 2MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              {previewUrl ? (
                <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Preview" />
              ) : (
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              )}
            </Avatar>

            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
              </div>
              <input
                id="avatar-upload"
                type="file"
                className="sr-only"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
              />
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedFile}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
