import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CreateWorkspaceModal } from '@/components/modals/create-workspace-modal'
import { Plus, Users, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workspaces - SyncSlate',
  description: 'Manage your workspaces',
}

const workspaces = [
  { 
    id: 'acme-corp', 
    name: 'Acme Corp', 
    members: 12,
    description: 'Main workspace for Acme Corporation',
    role: 'Owner',
  },
  { 
    id: 'startup-inc', 
    name: 'Startup Inc', 
    members: 5,
    description: 'Workspace for Startup Inc team',
    role: 'Admin',
  },
]

export default function WorkspacesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Workspaces</h1>
          <p className="text-muted-foreground">
            Manage all your workspaces and teams
          </p>
        </div>
        <CreateWorkspaceModal>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </CreateWorkspaceModal>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-primary">{workspace.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {workspace.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{workspace.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{workspace.members} members</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard?workspace=${workspace.id}`} className="flex-1">
                  <Button variant="default" className="w-full">
                    Open
                  </Button>
                </Link>
                <Link href={`/settings/workspace?workspace=${workspace.id}`}>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
