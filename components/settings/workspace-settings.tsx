'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const members = [
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Owner', initials: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Admin', initials: 'JS' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@company.com', role: 'Member', initials: 'BJ' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@company.com', role: 'Member', initials: 'AB' },
]

export function WorkspaceSettings() {
  const [teamMembers, setTeamMembers] = useState(members)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleInvite = () => {
    if (inviteEmail && !teamMembers.some(m => m.email === inviteEmail)) {
      const newMember = {
        id: teamMembers.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: 'Member' as const,
        initials: inviteEmail.substring(0, 2).toUpperCase(),
      }
      setTeamMembers([...teamMembers, newMember])
      setInviteEmail('')
      toast.success(`Invitation sent to ${inviteEmail}`)
    } else {
      toast.error('Invalid email or member already exists')
    }
  }

  const handleRemoveMember = (id: number) => {
    const member = teamMembers.find(m => m.id === id)
    if (member && member.role !== 'Owner') {
      setTeamMembers(teamMembers.filter(m => m.id !== id))
      toast.success(`${member.name} removed from workspace`)
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Workspace Details</CardTitle>
          <CardDescription>Update workspace name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-primary" htmlFor="workspace-name">Workspace name</Label>
            <Input className="text-foreground" id="workspace-name" defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label className="text-primary" htmlFor="workspace-description">Description</Label>
            <Textarea className="text-foreground"
              id="workspace-description"
              defaultValue="Main workspace for Acme Corporation"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={async () => {
                setIsSaving(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                toast.success('Workspace updated successfully')
                setIsSaving(false)
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                setIsSaving(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                toast.success('Workspace updated successfully')
                setIsSaving(false)
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Team Members</CardTitle>
          <CardDescription>Manage workspace members and roles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Enter email address" 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inviteEmail) {
                  handleInvite()
                }
              }}
            />
            <Button 
              onClick={handleInvite}
              disabled={!inviteEmail}
            >
              Invite
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-primary">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{member.role}</Badge>
                  {member.role !== 'Owner' && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Danger Zone</CardTitle>
          <CardDescription>Irreversible workspace actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <h3 className="font-semibold mb-2 text-foreground">Delete workspace</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete a workspace, there is no going back. All data will be permanently removed.
            </p>
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
                  toast.success('Workspace deleted (mock action)')
                }
              }}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
