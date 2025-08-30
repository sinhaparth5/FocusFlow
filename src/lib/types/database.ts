export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  email: string;
  name: string;
  googleId?: string;
  avatar?: string;
  timezone: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultView: 'calendar' | 'gantt' | 'list';
  workingHours: {
    start: string;
    end: string;
  };
  weekStart: 0 | 1;
  notifications: {
    email: boolean;
    push: boolean;
    reminderMinutes: number[];
  };
}

export type ItemType = 'task' | 'reminder' | 'meeting';
export type Priority = 'low' | 'medium' | 'urgent';
export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface BaseItem {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  title: string;
  description?: string;
  type: ItemType;
  priority: Priority;
  status: Status;
  startDateTime: string;
  endDateTime?: string;
  allDay: boolean;
  timezone: string;
  googleCalendarEventId?: string;
  googleMeetUrl?: string;
  reminders: Reminder[];
  attachments: string[];
}

export interface Task extends BaseItem {
  type: 'task';
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  subtasks: string[];
  parentTaskId?: string;
  progress: number;
  assignedTo?: string[];
}

export interface ReminderItem extends BaseItem {
  type: 'reminder';
  recurringPattern?: RecurringPattern;
  snoozeUntil?: string;
  isRecurring: boolean;
}

export interface Meeting extends BaseItem {
  type: 'meeting';
  location?: string;
  meetingType: 'in-person' | 'online' | 'hybrid';
  attendees: Attendee[];
  agenda?: string;
  meetingRoom?: string;
  googleMeetSettings?: GoogleMeetSettings;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string;
  occurrences?: number;
}

export interface Reminder {
  id: string;
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
  isActive: boolean;
}

export interface Attendee {
  email: string;
  name?: string;
  responseStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
  isOptional: boolean;
  userId?: string;
}

export interface GoogleMeetSettings {
  createMeet: boolean;
  allowDailIn: boolean;
  enableRecording: boolean;
  moderationEnabled: boolean;
}

export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  REMINDERS: 'reminders',
  MEETINGS: 'meetings',
  RECURRING_INSTANCES: 'recurring_instances',
  NOTIFICATIONS: 'notifications',
  CATEGORIES: 'categories'
} as const;

export interface Category {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  isDefault: boolean;
}

export interface RecurringInstance {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  originalItemId: string;
  userId: string;
  instanceDate: string;
  status: 'active' | 'modified' | 'cancelled';
  modifications?: Partial<BaseItem>;
}

export interface Notification {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  itemId: string;
  type: 'reminder' | 'overdue' | 'upcoming' | 'meeting_reminder';
  title: string;
  message: string;
  scheduledFor: string;
  sentAt?: string;
  isRead: boolean;
  priority: Priority;
}

export const DATABASE_CONFIG = {
  name: 'TaskManagerDB',
  collections: {
    [COLLECTIONS.USERS]: {
      name: 'Users',
      permissions: ['read("any")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'email', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'googleId', type: 'string', size: 255, required: false },
        { key: 'avatar', type: 'url', required: false },
        { key: 'timezone', type: 'string', size: 100, required: true },
        { key: 'preferences', type: 'json', required: true }
      ],
      indexes: [
        { key: 'email', type: 'key', attributes: ['email'] },
        { key: 'googleId', type: 'key', attributes: ['googleId'] }
      ]
    },
    [COLLECTIONS.TASKS]: {
      name: 'Tasks',
      permissions: ['read("user:[USER_ID]")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'userId', type: 'string', size: 36, required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'type', type: 'enum', elements: ['task'], required: true },
        { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
        { key: 'status', type: 'enum', elements: ['pending', 'in-progress', 'completed', 'cancelled'], required: true },
        { key: 'startDateTime', type: 'datetime', required: true },
        { key: 'endDateTime', type: 'datetime', required: false },
        { key: 'allDay', type: 'boolean', required: true },
        { key: 'timezone', type: 'string', size: 100, required: true },
        { key: 'tags', type: 'json', required: false },
        { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
        { key: 'reminders', type: 'json', required: false },
        { key: 'attachments', type: 'json', required: false },
        { key: 'estimatedHours', type: 'float', required: false },
        { key: 'actualHours', type: 'float', required: false },
        { key: 'dependencies', type: 'json', required: false },
        { key: 'subtasks', type: 'json', required: false },
        { key: 'parentTaskId', type: 'string', size: 36, required: false },
        { key: 'progress', type: 'integer', min: 0, max: 100, required: true },
        { key: 'assignedTo', type: 'json', required: false }
      ],
      indexes: [
        { key: 'userId', type: 'key', attributes: ['userId'] },
        { key: 'status', type: 'key', attributes: ['status'] },
        { key: 'priority', type: 'key', attributes: ['priority'] },
        { key: 'startDateTime', type: 'key', attributes: ['startDateTime'] },
        { key: 'userStatus', type: 'key', attributes: ['userId', 'status'] }
      ]
    },
    [COLLECTIONS.REMINDERS]: {
      name: 'Reminders',
      permissions: ['read("user:[USER_ID]")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'userId', type: 'string', size: 36, required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'type', type: 'enum', elements: ['reminder'], required: true },
        { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
        { key: 'status', type: 'enum', elements: ['pending', 'completed', 'cancelled'], required: true },
        { key: 'startDateTime', type: 'datetime', required: true },
        { key: 'allDay', type: 'boolean', required: true },
        { key: 'timezone', type: 'string', size: 100, required: true },
        { key: 'tags', type: 'json', required: false },
        { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
        { key: 'reminders', type: 'json', required: false },
        { key: 'recurringPattern', type: 'json', required: false },
        { key: 'snoozeUntil', type: 'datetime', required: false },
        { key: 'isRecurring', type: 'boolean', required: true }
      ],
      indexes: [
        { key: 'userId', type: 'key', attributes: ['userId'] },
        { key: 'status', type: 'key', attributes: ['status'] },
        { key: 'startDateTime', type: 'key', attributes: ['startDateTime'] },
        { key: 'isRecurring', type: 'key', attributes: ['isRecurring'] }
      ]
    },
    [COLLECTIONS.MEETINGS]: {
      name: 'Meetings',
      permissions: ['read("user:[USER_ID]")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'userId', type: 'string', size: 36, required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'type', type: 'enum', elements: ['meeting'], required: true },
        { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true },
        { key: 'status', type: 'enum', elements: ['pending', 'in-progress', 'completed', 'cancelled'], required: true },
        { key: 'startDateTime', type: 'datetime', required: true },
        { key: 'endDateTime', type: 'datetime', required: true },
        { key: 'allDay', type: 'boolean', required: true },
        { key: 'timezone', type: 'string', size: 100, required: true },
        { key: 'tags', type: 'json', required: false },
        { key: 'googleCalendarEventId', type: 'string', size: 255, required: false },
        { key: 'googleMeetUrl', type: 'url', required: false },
        { key: 'reminders', type: 'json', required: false },
        { key: 'location', type: 'string', size: 255, required: false },
        { key: 'meetingType', type: 'enum', elements: ['in-person', 'online', 'hybrid'], required: true },
        { key: 'attendees', type: 'json', required: false },
        { key: 'agenda', type: 'string', size: 5000, required: false },
        { key: 'meetingRoom', type: 'string', size: 255, required: false },
        { key: 'googleMeetSettings', type: 'json', required: false }
      ],
      indexes: [
        { key: 'userId', type: 'key', attributes: ['userId'] },
        { key: 'status', type: 'key', attributes: ['status'] },
        { key: 'startDateTime', type: 'key', attributes: ['startDateTime'] },
        { key: 'meetingType', type: 'key', attributes: ['meetingType'] }
      ]
    },
    [COLLECTIONS.CATEGORIES]: {
      name: 'Categories',
      permissions: ['read("user:[USER_ID]")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'userId', type: 'string', size: 36, required: true },
        { key: 'name', type: 'string', size: 100, required: true },
        { key: 'color', type: 'string', size: 7, required: true }, // Hex color
        { key: 'icon', type: 'string', size: 50, required: false },
        { key: 'isDefault', type: 'boolean', required: true }
      ],
      indexes: [
        { key: 'userId', type: 'key', attributes: ['userId'] }
      ]
    },
    [COLLECTIONS.NOTIFICATIONS]: {
      name: 'Notifications',
      permissions: ['read("user:[USER_ID]")', 'write("user:[USER_ID]")'],
      attributes: [
        { key: 'userId', type: 'string', size: 36, required: true },
        { key: 'itemId', type: 'string', size: 36, required: true },
        { key: 'type', type: 'enum', elements: ['reminder', 'overdue', 'upcoming', 'meeting_reminder'], required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'message', type: 'string', size: 1000, required: true },
        { key: 'scheduledFor', type: 'datetime', required: true },
        { key: 'sentAt', type: 'datetime', required: false },
        { key: 'isRead', type: 'boolean', required: true },
        { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high', 'urgent'], required: true }
      ],
      indexes: [
        { key: 'userId', type: 'key', attributes: ['userId'] },
        { key: 'isRead', type: 'key', attributes: ['isRead'] },
        { key: 'scheduledFor', type: 'key', attributes: ['scheduledFor'] }
      ]
    }
  }
} as const;
