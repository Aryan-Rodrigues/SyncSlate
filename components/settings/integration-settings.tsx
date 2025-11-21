'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const integrations = [
  {
    id: 1,
    name: 'Slack',
    description: 'Send meeting summaries and task notifications to Slack',
    status: 'connected' as const,
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/slack%20logo-9pSfjJMFvprsaQErOCuSFBgzrjd6Sz.jpg',
  },
  {
    id: 2,
    name: 'Google Calendar',
    description: 'Sync meetings with your Google Calendar',
    status: 'not-connected' as const,
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Calendar%20Logo%20%281%29-bSbHWjr7vq8Ta411HQNOg0Vm2M8qet.png',
  },
  {
    id: 3,
    name: 'Zoom',
    description: 'Auto-import meeting transcripts from Zoom',
    status: 'not-connected' as const,
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Zoom%20Logo-8RNwVADgabuZ67zoU35OWbBTzLXjAL.png',
  },
  {
    id: 4,
    name: 'Jira',
    description: 'Create and sync Jira issues from action items',
    status: 'not-connected' as const,
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jira%20Logo-OhoEozVWZJoEX1Ku6tBuhgRHJrdLK6.png',
  },
]

export function IntegrationSettings() {
  const [integrationStates, setIntegrationStates] = useState(integrations)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Available Integrations</CardTitle>
          <CardDescription>
            Connect external services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrationStates.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={integration.logo || "/placeholder.svg"}
                  alt={integration.name}
                  className="h-10 w-10 rounded"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary">{integration.name}</h3>
                    {integration.status === 'connected' && (
                      <Badge variant="default">Connected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.status === 'connected' ? (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIntegrationStates(prev => prev.map(i => 
                      i.id === integration.id 
                        ? { ...i, status: 'not-connected' as const }
                        : i
                    ))
                    toast.success(`${integration.name} disconnected`)
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIntegrationStates(prev => prev.map(i => 
                      i.id === integration.id 
                        ? { ...i, status: 'connected' as const }
                        : i
                    ))
                    toast.success(`${integration.name} connected successfully`)
                  }}
                >
                  Connect
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
