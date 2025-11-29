import { Metadata } from 'next'
import { Suspense } from 'react'
import { DashboardContent } from './dashboard-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard - SyncSlate',
  description: 'Meeting intelligence dashboard',
}

function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  )
}

