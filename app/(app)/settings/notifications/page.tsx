import { Metadata } from 'next'
import { NotificationSettings } from '@/components/settings/notification-settings'

export const metadata: Metadata = {
  title: 'Notification Settings - SyncSlate',
  description: 'Manage your notification preferences',
}

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Settings</h1>
        <p className="text-muted-foreground">
          Configure how you receive notifications and reminders
        </p>
      </div>

      <NotificationSettings />
    </div>
  )
}
