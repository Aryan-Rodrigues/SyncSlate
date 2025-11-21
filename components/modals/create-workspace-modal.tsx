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
import { useRouter } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'

export function CreateWorkspaceModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [workspaceName, setWorkspaceName] = useState('')
  const [workspaceDescription, setWorkspaceDescription] = useState('')
  const router = useRouter()

  const handleNext = () => {
    if (step === 1 && workspaceName) {
      setStep(2)
    }
  }

  const handleCreate = () => {
    // In a real app, this would create the workspace via API
    console.log('[v0] Creating workspace:', { workspaceName, workspaceDescription })
    setOpen(false)
    // Reset state
    setTimeout(() => {
      setStep(1)
      setWorkspaceName('')
      setWorkspaceDescription('')
    }, 300)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleClose = () => {
    setOpen(false)
    // Reset state after dialog closes
    setTimeout(() => {
      setStep(1)
      setWorkspaceName('')
      setWorkspaceDescription('')
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Set up a new workspace for your team' : 'Invite your team members'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`flex-1 h-px ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
        </div>

        {step === 1 && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                placeholder="Acme Corp"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="workspace-description"
                placeholder="What's this workspace for?"
                rows={3}
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!workspaceName}>
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">{workspaceName}</p>
              {workspaceDescription && (
                <p className="text-sm text-muted-foreground mt-1">{workspaceDescription}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invite-emails">Invite team members (optional)</Label>
              <Textarea
                id="invite-emails"
                placeholder="Enter email addresses, one per line"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                You can also invite team members later from workspace settings
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleCreate}>
                Create workspace
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
