import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { WorkspaceSettings } from '@/components/settings/workspace-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { IntegrationSettings } from '@/components/settings/integration-settings'

export const metadata: Metadata = {
  title: 'Settings - SyncSlate',
  description: 'Manage your account and workspace settings',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and workspace preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger className="text-primary" value="profile">Profile</TabsTrigger>
          <TabsTrigger className="text-primary" value="workspace">Workspace</TabsTrigger>
          <TabsTrigger className="text-primary" value="notifications">Notifications</TabsTrigger>
          <TabsTrigger className="text-primary" value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="workspace">
          <WorkspaceSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
