// Default meetings and tasks that all users can see
// These are sample data to help users understand the app

export interface DefaultMeeting {
  id: string
  user_id: string | null // null means it's a default meeting for all users
  title: string
  raw_notes: string | null
  ai_summary: string | null
  meeting_date: string | null
  created_at: string
  participants?: string[] | null
  decisions_count?: number | null
  tasks_count?: number | null
  status?: string | null
}

export interface DefaultTask {
  id: string
  user_id: string | null // null means it's a default task for all users
  meeting_id: string | null
  title: string
  status: string
  deadline: string | null
  owner?: string | null
  created_at: string
}

// Default meetings that all users can see
export const defaultMeetings: DefaultMeeting[] = [
  {
    id: 'default-meeting-1',
    user_id: null,
    title: 'Q4 Planning Session',
    raw_notes: `Meeting: Q4 Planning Session
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
    ai_summary: `This Q4 planning session reviewed strong Q3 performance (15% above revenue targets) and established key initiatives for the upcoming quarter. The team identified resource gaps in engineering and marketing, decided to launch a new product in March, and committed to addressing client presentation scheduling. Five action items were assigned with clear ownership and deadlines.`,
    meeting_date: '2024-01-15',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'],
    decisions_count: 3,
    tasks_count: 5,
    status: 'completed',
  },
  {
    id: 'default-meeting-2',
    user_id: null,
    title: 'Product Review Meeting',
    raw_notes: `Meeting: Product Review Meeting
Date: January 14, 2024
Attendees: Jane Smith, Alice Brown, Charlie Wilson, Mike Torres, Sarah Chen

Discussion Points:
- Review current product features
- Discuss user feedback
- Plan new feature releases
- Address technical debt
- Review design system updates`,
    ai_summary: `The product review meeting covered current features, user feedback, and upcoming releases. The team discussed technical debt and design system improvements.`,
    meeting_date: '2024-01-14',
    created_at: new Date('2024-01-14T10:00:00').toISOString(),
    participants: ['Jane Smith', 'Alice Brown', 'Charlie Wilson', 'Mike Torres', 'Sarah Chen'],
    decisions_count: 5,
    tasks_count: 8,
    status: 'completed',
  },
  {
    id: 'default-meeting-3',
    user_id: null,
    title: 'Team Standup',
    raw_notes: `Meeting: Team Standup
Date: January 14, 2024
Attendees: John Doe, Jane Smith, Bob Johnson, Alice Brown, Charlie Wilson, Mike Torres, Sarah Chen, Alex Kim

Discussion Points:
- Daily progress updates
- Blockers and challenges
- Upcoming priorities
- Resource needs`,
    ai_summary: `Daily standup covered progress updates, blockers, and upcoming priorities. Team identified resource needs and action items.`,
    meeting_date: '2024-01-14',
    created_at: new Date('2024-01-14T09:00:00').toISOString(),
    participants: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Mike Torres', 'Sarah Chen', 'Alex Kim'],
    decisions_count: 2,
    tasks_count: 4,
    status: 'completed',
  },
]

// Default tasks that all users can see
export const defaultTasks: DefaultTask[] = [
  {
    id: 'default-task-1',
    user_id: null,
    meeting_id: 'default-meeting-1',
    title: 'Post job listings for senior engineers',
    status: 'Not Started',
    deadline: new Date('2024-01-20').toISOString(),
    owner: 'Jane Smith',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
  {
    id: 'default-task-2',
    user_id: null,
    meeting_id: 'default-meeting-1',
    title: 'Prepare revised marketing budget proposal',
    status: 'In Progress',
    deadline: new Date('2024-01-22').toISOString(),
    owner: 'Bob Johnson',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
  {
    id: 'default-task-3',
    user_id: null,
    meeting_id: 'default-meeting-1',
    title: 'Create client presentation schedule',
    status: 'Not Started',
    deadline: new Date('2024-01-18').toISOString(),
    owner: 'Alice Brown',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
  {
    id: 'default-task-4',
    user_id: null,
    meeting_id: 'default-meeting-1',
    title: 'Update product roadmap with Q4 initiatives',
    status: 'Not Started',
    deadline: new Date('2024-01-25').toISOString(),
    owner: 'John Doe',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
  {
    id: 'default-task-5',
    user_id: null,
    meeting_id: 'default-meeting-1',
    title: 'Send meeting summary to all stakeholders',
    status: 'Done',
    deadline: new Date('2024-01-16').toISOString(),
    owner: 'Charlie Wilson',
    created_at: new Date('2024-01-15T14:00:00').toISOString(),
  },
  {
    id: 'default-task-6',
    user_id: null,
    meeting_id: 'default-meeting-2',
    title: 'Review Q3 performance metrics',
    status: 'Not Started',
    deadline: new Date('2024-01-22').toISOString(),
    owner: 'Charlie Wilson',
    created_at: new Date('2024-01-14T10:00:00').toISOString(),
  },
  {
    id: 'default-task-7',
    user_id: null,
    meeting_id: 'default-meeting-2',
    title: 'Design new feature mockups',
    status: 'In Progress',
    deadline: new Date('2024-01-19').toISOString(),
    owner: 'Jane Smith',
    created_at: new Date('2024-01-14T10:00:00').toISOString(),
  },
  {
    id: 'default-task-8',
    user_id: null,
    meeting_id: 'default-meeting-3',
    title: 'Conduct user research interviews',
    status: 'In Progress',
    deadline: new Date('2024-01-23').toISOString(),
    owner: 'Alice Brown',
    created_at: new Date('2024-01-14T09:00:00').toISOString(),
  },
  {
    id: 'default-task-9',
    user_id: null,
    meeting_id: 'default-meeting-3',
    title: 'Update team on project status',
    status: 'Done',
    deadline: new Date('2024-01-15').toISOString(),
    owner: 'John Doe',
    created_at: new Date('2024-01-14T09:00:00').toISOString(),
  },
]

