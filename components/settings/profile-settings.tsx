'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ChangeAvatarModal } from '@/components/modals/change-avatar-modal'
import { toast } from 'sonner'

export function ProfileSettings() {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Profile Information</CardTitle>
          <CardDescription>Update your personal details and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={() => setIsAvatarModalOpen(true)}>
                Change avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. Max size 2MB
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-primary" htmlFor="first-name">First name</Label>
              <Input id="first-name" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label className="text-primary" htmlFor="last-name">Last name</Label>
              <Input id="last-name" defaultValue="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-primary" htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@company.com" />
          </div>

          <div className="space-y-2">
            <Label className="text-primary" htmlFor="title">Job title</Label>
            <Input id="title" defaultValue="Product Manager" />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              className="text-primary" 
              variant="outline"
              onClick={async () => {
                setIsSaving(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                toast.success('Profile updated successfully')
                setIsSaving(false)
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                setIsSaving(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                toast.success('Profile updated successfully')
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
          <CardTitle className="text-primary">Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-primary" htmlFor="current-password">Current password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label className="text-primary" htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label className="text-primary" htmlFor="confirm-password">Confirm new password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={async () => {
                setIsSavingPassword(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                toast.success('Password updated successfully')
                setIsSavingPassword(false)
              }}
              disabled={isSavingPassword}
            >
              {isSavingPassword ? 'Updating...' : 'Update password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangeAvatarModal open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen} />
    </div>
  )
}
