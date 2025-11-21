import { Metadata } from 'next'
import { NotificationsClient } from './notifications-client'

export const metadata: Metadata = {
  title: 'Notifications - SyncSlate',
  description: 'View your notifications and reminders',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
