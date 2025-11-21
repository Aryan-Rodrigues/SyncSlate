// Mock data for MVP demonstration
import { Meeting, Task, Decision, Notification } from './types'

export const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Q4 Planning Session',
    date: '2024-01-15',
    time: '2:00 PM',
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'],
    decisions: 3,
    tasks: 5,
    status: 'completed',
    rawNotes: `Meeting: Q4 Planning Session
Date: January 15, 2024
Attendees: John Doe, Jane Smith, Bob Johnson, Alice Brown, Charlie Wilson

Discussion Points:
- Review Q3 performance metrics
- Set Q4 revenue targets
- Discuss new product initiatives
- Address resource allocation concerns
- Plan for upcoming client presentations

Key Points Raised:
- Revenue exceeded targets by 15%
- Need additional engineering resources
- New product launch scheduled for March
- Client feedback has been positive
- Marketing budget needs adjustment`,
    aiSummary: `This Q4 planning session reviewed strong Q3 performance (15% above revenue targets) and established key initiatives for the upcoming quarter. The team identified resource gaps in engineering and marketing, decided to launch a new product in March, and committed to addressing client presentation scheduling. Five action items were assigned with clear ownership and deadlines.`,
  },
  {
    id: 2,
    title: 'Product Review Meeting',
    date: '2024-01-14',
    time: '10:00 AM',
    participants: ['Jane Smith', 'Alice Brown', 'Charlie Wilson', 'Mike Torres', 'Sarah Chen'],
    decisions: 5,
    tasks: 8,
    status: 'completed',
  },
  {
    id: 3,
    title: 'Team Standup',
    date: '2024-01-14',
    time: '9:00 AM',
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Mike Torres', 'Sarah Chen', 'Alex Kim'],
    decisions: 2,
    tasks: 4,
    status: 'completed',
  },
  {
    id: 4,
    title: 'Client Presentation',
    date: '2024-01-13',
    time: '3:00 PM',
    participants: ['John Doe', 'Jane Smith', 'Client Team'],
    decisions: 4,
    tasks: 6,
    status: 'completed',
  },
  {
    id: 5,
    title: 'Sprint Planning',
    date: '2024-01-16',
    time: '11:00 AM',
    participants: ['Jane Smith', 'Bob Johnson', 'Alice Brown', 'Mike Torres'],
    decisions: 3,
    tasks: 7,
    status: 'scheduled',
  },
]

export const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Post job listings for senior engineers',
    meeting: 'Q4 Planning Session',
    owner: 'Jane Smith',
    ownerInitials: 'JS',
    deadline: '2024-01-20',
    status: 'not-started',
  },
  {
    id: 2,
    title: 'Prepare revised marketing budget proposal',
    meeting: 'Q4 Planning Session',
    owner: 'Bob Johnson',
    ownerInitials: 'BJ',
    deadline: '2024-01-22',
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'Create client presentation schedule',
    meeting: 'Q4 Planning Session',
    owner: 'Alice Brown',
    ownerInitials: 'AB',
    deadline: '2024-01-18',
    status: 'not-started',
  },
  {
    id: 4,
    title: 'Update product roadmap with Q4 initiatives',
    meeting: 'Q4 Planning Session',
    owner: 'John Doe',
    ownerInitials: 'JD',
    deadline: '2024-01-25',
    status: 'not-started',
  },
  {
    id: 5,
    title: 'Send meeting summary to all stakeholders',
    meeting: 'Q4 Planning Session',
    owner: 'Charlie Wilson',
    ownerInitials: 'CW',
    deadline: '2024-01-16',
    status: 'done',
  },
  {
    id: 6,
    title: 'Review Q3 performance metrics',
    meeting: 'Product Review Meeting',
    owner: 'Charlie Wilson',
    ownerInitials: 'CW',
    deadline: '2024-01-22',
    status: 'not-started',
  },
  {
    id: 7,
    title: 'Design new feature mockups',
    meeting: 'Product Review Meeting',
    owner: 'Jane Smith',
    ownerInitials: 'JS',
    deadline: '2024-01-19',
    status: 'in-progress',
  },
  {
    id: 8,
    title: 'Conduct user research interviews',
    meeting: 'Team Standup',
    owner: 'Alice Brown',
    ownerInitials: 'AB',
    deadline: '2024-01-23',
    status: 'in-progress',
  },
  {
    id: 9,
    title: 'Update team on project status',
    meeting: 'Team Standup',
    owner: 'John Doe',
    ownerInitials: 'JD',
    deadline: '2024-01-15',
    status: 'done',
  },
  {
    id: 10,
    title: 'Prepare client presentation',
    meeting: 'Client Presentation',
    owner: 'Bob Johnson',
    ownerInitials: 'BJ',
    deadline: '2024-01-13',
    status: 'done',
  },
]

export const mockDecisions: Decision[] = [
  {
    id: 1,
    meeting: 'Q4 Planning Session',
    text: 'Hire 2 additional senior engineers by end of February',
    impact: 'high',
  },
  {
    id: 2,
    meeting: 'Q4 Planning Session',
    text: 'Increase marketing budget by 20% for Q4',
    impact: 'medium',
  },
  {
    id: 3,
    meeting: 'Q4 Planning Session',
    text: 'Schedule client presentations for weeks 3-4 of quarter',
    impact: 'medium',
  },
  {
    id: 4,
    meeting: 'Product Review Meeting',
    text: 'Launch new feature in beta by end of Q1',
    impact: 'high',
  },
  {
    id: 5,
    meeting: 'Product Review Meeting',
    text: 'Implement new design system across all products',
    impact: 'medium',
  },
  {
    id: 6,
    meeting: 'Client Presentation',
    text: 'Move to monthly billing cycle for new clients',
    impact: 'high',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'overdue',
    title: 'Task overdue',
    message: 'Create client presentation schedule is past its deadline',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Upcoming deadline',
    message: 'Post job listings for senior engineers is due tomorrow',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'assigned',
    title: 'New task assigned',
    message: 'You were assigned: Review Q3 performance metrics',
    time: '1 day ago',
    read: false,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Upcoming deadline',
    message: 'Design new feature mockups is due in 3 days',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'completed',
    title: 'Task completed',
    message: 'Send meeting summary to all stakeholders was marked as done',
    time: '2 days ago',
    read: true,
  },
  {
    id: 6,
    type: 'assigned',
    title: 'New task assigned',
    message: 'You were assigned: Prepare client presentation',
    time: '3 days ago',
    read: true,
  },
]

export const mockTeamMembers = [
  'John Doe',
  'Jane Smith',
  'Bob Johnson',
  'Alice Brown',
  'Charlie Wilson',
  'Mike Torres',
  'Sarah Chen',
  'Alex Kim',
]

// Helper functions
export function getMeetingById(id: number): Meeting | undefined {
  return mockMeetings.find(m => m.id === id)
}

export function getTasksByMeeting(meetingId: number): Task[] {
  const meeting = getMeetingById(meetingId)
  if (!meeting) return []
  return mockTasks.filter(t => t.meeting === meeting.title)
}

export function getDecisionsByMeeting(meetingId: number): Decision[] {
  const meeting = getMeetingById(meetingId)
  if (!meeting) return []
  return mockDecisions.filter(d => d.meeting === meeting.title)
}

export function getTasksByStatus(status: Task['status']): Task[] {
  return mockTasks.filter(t => t.status === status)
}

