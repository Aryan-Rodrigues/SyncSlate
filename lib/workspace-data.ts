export interface WorkspaceData {
  id: string
  name: string
  members: number
  stats: {
    totalMeetings: string
    meetingsChange: string
    activeTasks: string
    tasksChange: string
    teamMembers: string
    membersChange: string
    completionRate: string
    completionChange: string
  }
  recentMeetings: Array<{
    id: number
    title: string
    date: string
    participants: number
    decisions: number
  }>
  upcomingTasks: Array<{
    id: number
    title: string
    meeting: string
    due: string
    owner: string
  }>
}

export const workspaceData: Record<string, WorkspaceData> = {
  'acme-corp': {
    id: 'acme-corp',
    name: 'Acme Corp',
    members: 12,
    stats: {
      totalMeetings: '24',
      meetingsChange: '+12% from last month',
      activeTasks: '18',
      tasksChange: '6 due this week',
      teamMembers: '12',
      membersChange: '2 new this month',
      completionRate: '87%',
      completionChange: '+5% from last month',
    },
    recentMeetings: [
      { id: 1, title: 'Q4 Planning', date: '2024-01-15', participants: 5, decisions: 3 },
      { id: 2, title: 'Product Review', date: '2024-01-14', participants: 8, decisions: 5 },
      { id: 3, title: 'Team Standup', date: '2024-01-14', participants: 12, decisions: 2 },
      { id: 4, title: 'Client Meeting', date: '2024-01-13', participants: 4, decisions: 4 },
    ],
    upcomingTasks: [
      { id: 1, title: 'Update product roadmap', meeting: 'Q4 Planning', due: '2024-01-20', owner: 'John Doe' },
      { id: 2, title: 'Review design mockups', meeting: 'Product Review', due: '2024-01-18', owner: 'Jane Smith' },
      { id: 3, title: 'Prepare client presentation', meeting: 'Client Meeting', due: '2024-01-17', owner: 'Bob Johnson' },
    ],
  },
  'startup-inc': {
    id: 'startup-inc',
    name: 'Startup Inc',
    members: 5,
    stats: {
      totalMeetings: '8',
      meetingsChange: '+60% from last month',
      activeTasks: '12',
      tasksChange: '3 due this week',
      teamMembers: '5',
      membersChange: '1 new this month',
      completionRate: '92%',
      completionChange: '+8% from last month',
    },
    recentMeetings: [
      { id: 1, title: 'Investor Pitch Prep', date: '2024-01-15', participants: 3, decisions: 5 },
      { id: 2, title: 'Sprint Planning', date: '2024-01-14', participants: 5, decisions: 4 },
      { id: 3, title: 'Marketing Strategy', date: '2024-01-12', participants: 4, decisions: 3 },
    ],
    upcomingTasks: [
      { id: 1, title: 'Finalize pitch deck', meeting: 'Investor Pitch Prep', due: '2024-01-18', owner: 'Sarah Chen' },
      { id: 2, title: 'Launch landing page', meeting: 'Marketing Strategy', due: '2024-01-19', owner: 'Mike Torres' },
      { id: 3, title: 'Complete user testing', meeting: 'Sprint Planning', due: '2024-01-21', owner: 'Alex Kim' },
    ],
  },
}

export function getWorkspaceData(workspaceId: string): WorkspaceData {
  return workspaceData[workspaceId] || workspaceData['acme-corp']
}
