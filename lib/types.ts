// Common types used across the application

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface Workspace {
  id: string
  name: string
  description?: string
  members: number
  role: 'Owner' | 'Admin' | 'Member'
}

export interface Meeting {
  id: number
  title: string
  date: string
  time: string
  participants: string[]
  decisions: number
  tasks: number
  status: 'completed' | 'scheduled' | 'cancelled'
  rawNotes?: string
  aiSummary?: string
}

export interface Task {
  id: number
  title: string
  meeting: string
  owner: string
  ownerInitials: string
  deadline: string
  status: 'not-started' | 'in-progress' | 'done'
}

export interface Decision {
  id: number
  meeting: string
  text: string
  impact: 'high' | 'medium' | 'low'
}

export interface Notification {
  id: number
  type: 'overdue' | 'reminder' | 'assigned' | 'completed'
  title: string
  message: string
  time: string
  read: boolean
}

export interface Integration {
  id: number
  name: string
  description: string
  status: 'connected' | 'not-connected'
  logo?: string
}

