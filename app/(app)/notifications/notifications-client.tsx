'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification } from '@/lib/types'

const iconMap = {
  overdue: AlertCircle,
  reminder: Clock,
  assigned: Bell,
  completed: CheckCircle,
}

const iconColors = {
  overdue: 'text-destructive',
  reminder: 'text-yellow-600',
  assigned: 'text-blue-600',
  completed: 'text-green-600',
}

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    )
    toast.success('Notification marked as read')
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    toast.success('All notifications marked as read')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notifications</h1>
          <p className="text-muted-foreground">
            Stay up to date with reminders and updates
          </p>
        </div>
        <Button 
          className="text-primary" 
          variant="outline"
          onClick={markAllAsRead}
          disabled={notifications.every(n => n.read)}
        >
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.read ? 'opacity-60' : 'border-l-4 border-l-primary'}
          >
            <CardContent className="flex items-start gap-4 p-4">
              {(() => {
                const Icon = iconMap[notification.type]
                return <Icon className={`h-5 w-5 mt-0.5 ${iconColors[notification.type]}`} />
              })()}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-primary">{notification.title}</h3>
                  {!notification.read && (
                    <Badge variant="default" className="ml-2">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              {!notification.read && (
                <Button 
                  className="text-primary" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

