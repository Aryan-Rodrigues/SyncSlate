import { Metadata } from 'next'
import { WorkspaceSettings } from '@/components/settings/workspace-settings'

export const metadata: Metadata = {
  title: 'Workspace Settings - SyncSlate',
  description: 'Manage your workspace settings',
}

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace details and team members
        </p>
      </div>

      <WorkspaceSettings />
    </div>
  )
}
