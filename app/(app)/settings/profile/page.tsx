import { Metadata } from 'next'
import { ProfileSettings } from '@/components/settings/profile-settings'

export const metadata: Metadata = {
  title: 'Profile Settings - SyncSlate',
  description: 'Manage your profile and account settings',
}

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>

      <ProfileSettings />
    </div>
  )
}
