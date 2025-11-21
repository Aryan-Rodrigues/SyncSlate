import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { CreateWorkspaceModal } from '@/components/modals/create-workspace-modal'

export const metadata: Metadata = {
  title: 'Select Workspace - SyncSlate',
  description: 'Choose your workspace',
}

const workspaces = [
  { id: 'acme-corp', name: 'Acme Corp', members: 12 },
  { id: 'startup-inc', name: 'Startup Inc', members: 5 },
]

export default function WorkspaceSelectorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Select a workspace</h1>
          <p className="text-muted-foreground">
            Choose a workspace to continue to SyncSlate
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href={`/dashboard?workspace=${workspace.id}`}>
              <Card className="hover:border-primary cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle>{workspace.name}</CardTitle>
                  <CardDescription>{workspace.members} members</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          
          <CreateWorkspaceModal>
            <Card className="border-dashed hover:border-primary cursor-pointer transition-colors">
              <CardHeader className="flex flex-col items-center justify-center h-full">
                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                <CardTitle className="text-center">Create workspace</CardTitle>
              </CardHeader>
            </Card>
          </CreateWorkspaceModal>
        </div>
      </div>
    </div>
  )
}
