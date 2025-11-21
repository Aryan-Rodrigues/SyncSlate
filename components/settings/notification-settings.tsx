'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailMeetings: true,
    emailTasks: true,
    emailDeadlines: true,
    emailOverdue: true,
    appDecisions: true,
    appMentions: true,
    appComments: false,
  })
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Email Notifications</CardTitle>
          <CardDescription>Manage when you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground" htmlFor="email-meetings">New meetings</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when meeting notes are uploaded
              </p>
            </div>
            <Switch 
              id="email-meetings" 
              checked={settings.emailMeetings}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailMeetings: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground" htmlFor="email-tasks">Task assignments</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you're assigned a new task
              </p>
            </div>
            <Switch 
              id="email-tasks" 
              checked={settings.emailTasks}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailTasks: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-deadlines">Upcoming deadlines</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders for tasks due soon
              </p>
            </div>
            <Switch 
              id="email-deadlines" 
              checked={settings.emailDeadlines}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailDeadlines: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-overdue">Overdue tasks</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about tasks past their deadline
              </p>
            </div>
            <Switch 
              id="email-overdue" 
              checked={settings.emailOverdue}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailOverdue: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">In-App Notifications</CardTitle>
          <CardDescription>Manage in-app notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-decisions">Key decisions</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about important decisions made in meetings
              </p>
            </div>
            <Switch 
              id="app-decisions" 
              checked={settings.appDecisions}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, appDecisions: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-mentions">Mentions</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone mentions you
              </p>
            </div>
            <Switch 
              id="app-mentions" 
              checked={settings.appMentions}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, appMentions: checked }))}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-comments">Comments</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about comments on your tasks
              </p>
            </div>
            <Switch 
              id="app-comments" 
              checked={settings.appComments}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, appComments: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={async () => {
            await new Promise(resolve => setTimeout(resolve, 500))
            toast.success('Notification settings saved')
          }}
        >
          Save Settings
        </Button>
      </div>
    </div>
  )
}
