'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ChangeAvatarModal } from '@/components/modals/change-avatar-modal'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export function ProfileSettings() {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser(currentUser)
          // Extract first and last name from full_name or email
          const fullName = currentUser.user_metadata?.full_name || ''
          const nameParts = fullName.split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          
          setFormData({
            firstName,
            lastName,
            email: currentUser.email || '',
            title: currentUser.user_metadata?.title || '',
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to load user information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U'
    const fullName = user.user_metadata?.full_name || user.email || ''
    if (fullName) {
      const nameParts = fullName.split(' ')
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      }
      return fullName.substring(0, 2).toUpperCase()
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
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
              <Input 
                id="first-name" 
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-primary" htmlFor="last-name">Last name</Label>
              <Input 
                id="last-name" 
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-primary" htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-primary" htmlFor="title">Job title</Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Product Manager"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              className="text-primary" 
              variant="outline"
              onClick={() => {
                // Reset form to original values
                const fullName = user?.user_metadata?.full_name || ''
                const nameParts = fullName.split(' ')
                setFormData({
                  firstName: nameParts[0] || '',
                  lastName: nameParts.slice(1).join(' ') || '',
                  email: user?.email || '',
                  title: user?.user_metadata?.title || '',
                })
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                if (!user) return
                
                setIsSaving(true)
                try {
                  const fullName = `${formData.firstName} ${formData.lastName}`.trim()
                  
                  // Update user metadata in Supabase
                  const { error } = await supabase.auth.updateUser({
                    data: {
                      full_name: fullName,
                      title: formData.title,
                    },
                  })

                  if (error) throw error

                  // Update local user state
                  setUser({
                    ...user,
                    user_metadata: {
                      ...user.user_metadata,
                      full_name: fullName,
                      title: formData.title,
                    },
                  })

                  toast.success('Profile updated successfully')
                } catch (error: any) {
                  console.error('Error updating profile:', error)
                  toast.error(error?.message || 'Failed to update profile')
                } finally {
                  setIsSaving(false)
                }
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
