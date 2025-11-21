import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckSquare, Users, TrendingUp } from 'lucide-react'
import { getWorkspaceData } from '@/lib/workspace-data'

export const metadata: Metadata = {
  title: 'Dashboard - SyncSlate',
  description: 'Meeting intelligence dashboard',
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { workspace?: string }
}) {
  const workspaceId = searchParams.workspace || 'acme-corp'
  const workspace = getWorkspaceData(workspaceId)

  const stats = [
    {
      title: 'Total Meetings',
      value: workspace.stats.totalMeetings,
      change: workspace.stats.meetingsChange,
      icon: Calendar,
    },
    {
      title: 'Active Tasks',
      value: workspace.stats.activeTasks,
      change: workspace.stats.tasksChange,
      icon: CheckSquare,
    },
    {
      title: 'Team Members',
      value: workspace.stats.teamMembers,
      change: workspace.stats.membersChange,
      icon: Users,
    },
    {
      title: 'Completion Rate',
      value: workspace.stats.completionRate,
      change: workspace.stats.completionChange,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your meeting intelligence and accountability
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Recent Meetings</CardTitle>
            <CardDescription>Your latest meeting activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspace.recentMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none text-primary">{meeting.title}</p>
                    <p className="text-sm text-muted-foreground">{meeting.date}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{meeting.participants} participants</div>
                    <div>{meeting.decisions} decisions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspace.upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none text-primary">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.meeting} • {task.owner}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.due}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
