import { Metadata } from 'next'
import { IntegrationSettings } from '@/components/settings/integration-settings'

export const metadata: Metadata = {
  title: 'Integration Settings - SyncSlate',
  description: 'Manage your third-party integrations',
}

export default function IntegrationSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Integration Settings</h1>
        <p className="text-muted-foreground">
          Connect and manage third-party services
        </p>
      </div>

      <IntegrationSettings />
    </div>
  )
}
