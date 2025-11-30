'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MobileSidebar } from '@/components/mobile-sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CreateWorkspaceModal } from '@/components/modals/create-workspace-modal'
import { ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const workspaces = [
  { id: 'acme-corp', name: 'Acme Corp' },
  { id: 'startup-inc', name: 'Startup Inc' },
]

export function TopBar() {
  const router = useRouter()
  const [currentWorkspace, setCurrentWorkspace] = useState(workspaces[0])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
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

  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId)
    if (workspace) {
      setCurrentWorkspace(workspace)
      router.push(`/dashboard?workspace=${workspaceId}`)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      router.push('/login')
      toast.success('Successfully signed out')
    } catch (error: any) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileSidebar />
      
      <div className="flex items-center flex-1 gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-primary" asChild>
            <Button variant="outline" className="gap-2">
              {currentWorkspace.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-primary">Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="text-primary"
                onClick={() => handleWorkspaceChange(workspace.id)}
              >
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/workspaces" className="text-primary">
                Manage workspaces
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <CreateWorkspaceModal>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-primary">
                Create workspace
              </DropdownMenuItem>
            </CreateWorkspaceModal>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
