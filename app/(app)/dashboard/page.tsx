import { Metadata } from 'next'
import { DashboardContent } from './dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard - SyncSlate',
  description: 'Meeting intelligence dashboard',
}

export default function DashboardPage() {
  return <DashboardContent />
}

