// src/lib/database/helpers.ts

import { databases } from '$lib/appwrite';
import { ID, Permission, Role, Query } from 'appwrite';
import type { Models } from 'appwrite';
import type { 
  User, Task, ReminderItem, Meeting, Category, Notification,
  BaseItem, ItemType, Priority, Status 
} from '$lib/types/database';

const DATABASE_ID = 'focusflow-db'; // You'll need to create this in Appwrite console

// Type helpers to properly cast Appwrite Documents
type AppwriteUser = Models.Document & User;
type AppwriteTask = Models.Document & Task;
type AppwriteReminder = Models.Document & ReminderItem;
type AppwriteMeeting = Models.Document & Meeting;
type AppwriteCategory = Models.Document & Category;
type AppwriteNotification = Models.Document & Notification;

// User operations
export class UserService {
  static async create(userData: Omit<User, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteUser> {
    return await databases.createDocument(
      DATABASE_ID,
      'users',
      ID.unique(),
      userData,
      [
        Permission.read(Role.user(userData.googleId || '')),
        Permission.write(Role.user(userData.googleId || ''))
      ]
    ) as AppwriteUser;
  }

  static async getById(userId: string): Promise<AppwriteUser> {
    return await databases.getDocument(DATABASE_ID, 'users', userId) as AppwriteUser;
  }

  static async update(userId: string, data: Partial<User>): Promise<AppwriteUser> {
    return await databases.updateDocument(DATABASE_ID, 'users', userId, data) as AppwriteUser;
  }

  static async getByEmail(email: string): Promise<AppwriteUser[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'users',
      [Query.equal('email', email)]
    );
    return response.documents as AppwriteUser[];
  }
}

// Task operations
export class TaskService {
  static async create(taskData: Omit<Task, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteTask> {
    return await databases.createDocument(
      DATABASE_ID,
      'tasks',
      ID.unique(),
      taskData,
      [
        Permission.read(Role.user(taskData.userId)),
        Permission.write(Role.user(taskData.userId))
      ]
    ) as AppwriteTask;
  }

  static async getById(taskId: string): Promise<AppwriteTask> {
    return await databases.getDocument(DATABASE_ID, 'tasks', taskId) as AppwriteTask;
  }

  static async update(taskId: string, data: Partial<Task>): Promise<AppwriteTask> {
    return await databases.updateDocument(DATABASE_ID, 'tasks', taskId, data) as AppwriteTask;
  }

  static async delete(taskId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, 'tasks', taskId);
  }

  static async getByUser(userId: string, status?: Status[]): Promise<AppwriteTask[]> {
    const queries = [Query.equal('userId', userId)];
    if (status && status.length > 0) {
      queries.push(Query.equal('status', status));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      'tasks',
      queries
    );
    return response.documents as AppwriteTask[];
  }

  static async getByDateRange(userId: string, startDate: string, endDate: string): Promise<AppwriteTask[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'tasks',
      [
        Query.equal('userId', userId),
        Query.greaterThanEqual('startDateTime', startDate),
        Query.lessThanEqual('startDateTime', endDate)
      ]
    );
    return response.documents as AppwriteTask[];
  }

  static async getDependentTasks(taskId: string, userId: string): Promise<AppwriteTask[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'tasks',
      [
        Query.equal('userId', userId),
        Query.contains('dependencies', taskId)
      ]
    );
    return response.documents as AppwriteTask[];
  }

  static async updateProgress(taskId: string, progress: number): Promise<AppwriteTask> {
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending';
    return await databases.updateDocument(DATABASE_ID, 'tasks', taskId, {
      progress,
      status,
      ...(progress === 100 && { endDateTime: new Date().toISOString() })
    }) as AppwriteTask;
  }
}

// Reminder operations
export class ReminderService {
  static async create(reminderData: Omit<ReminderItem, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteReminder> {
    return await databases.createDocument(
      DATABASE_ID,
      'reminders',
      ID.unique(),
      reminderData,
      [
        Permission.read(Role.user(reminderData.userId)),
        Permission.write(Role.user(reminderData.userId))
      ]
    ) as AppwriteReminder;
  }

  static async getById(reminderId: string): Promise<AppwriteReminder> {
    return await databases.getDocument(DATABASE_ID, 'reminders', reminderId) as AppwriteReminder;
  }

  static async update(reminderId: string, data: Partial<ReminderItem>): Promise<AppwriteReminder> {
    return await databases.updateDocument(DATABASE_ID, 'reminders', reminderId, data) as AppwriteReminder;
  }

  static async delete(reminderId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, 'reminders', reminderId);
  }

  static async getByUser(userId: string, includeSnoozed = false): Promise<AppwriteReminder[]> {
    let queries = [Query.equal('userId', userId)];
    
    if (!includeSnoozed) {
      // Since Appwrite doesn't support OR queries in client SDK, we'll handle this differently
      // For now, we'll get all reminders and filter in memory
      const response = await databases.listDocuments(
        DATABASE_ID,
        'reminders',
        queries
      );
      
      const now = new Date().toISOString();
      const filteredDocs = (response.documents as AppwriteReminder[]).filter(reminder => 
        !reminder.snoozeUntil || reminder.snoozeUntil < now
      );
      
      return filteredDocs;
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      'reminders',
      queries
    );
    return response.documents as AppwriteReminder[];
  }

  static async getUpcoming(userId: string, hours = 24): Promise<AppwriteReminder[]> {
    const now = new Date();
    const futureTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));

    const response = await databases.listDocuments(
      DATABASE_ID,
      'reminders',
      [
        Query.equal('userId', userId),
        Query.equal('status', 'pending'),
        Query.greaterThan('startDateTime', now.toISOString()),
        Query.lessThan('startDateTime', futureTime.toISOString())
      ]
    );
    return response.documents as AppwriteReminder[];
  }

  static async snooze(reminderId: string, snoozeUntil: string): Promise<AppwriteReminder> {
    return await databases.updateDocument(DATABASE_ID, 'reminders', reminderId, {
      snoozeUntil
    }) as AppwriteReminder;
  }
}

// Meeting operations
export class MeetingService {
  static async create(meetingData: Omit<Meeting, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteMeeting> {
    return await databases.createDocument(
      DATABASE_ID,
      'meetings',
      ID.unique(),
      meetingData,
      [
        Permission.read(Role.user(meetingData.userId)),
        Permission.write(Role.user(meetingData.userId))
      ]
    ) as AppwriteMeeting;
  }

  static async getById(meetingId: string): Promise<AppwriteMeeting> {
    return await databases.getDocument(DATABASE_ID, 'meetings', meetingId) as AppwriteMeeting;
  }

  static async update(meetingId: string, data: Partial<Meeting>): Promise<AppwriteMeeting> {
    return await databases.updateDocument(DATABASE_ID, 'meetings', meetingId, data) as AppwriteMeeting;
  }

  static async delete(meetingId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, 'meetings', meetingId);
  }

  static async getByUser(userId: string): Promise<AppwriteMeeting[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'meetings',
      [Query.equal('userId', userId)]
    );
    return response.documents as AppwriteMeeting[];
  }

  static async getByDateRange(userId: string, startDate: string, endDate: string): Promise<AppwriteMeeting[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'meetings',
      [
        Query.equal('userId', userId),
        Query.greaterThanEqual('startDateTime', startDate),
        Query.lessThanEqual('startDateTime', endDate)
      ]
    );
    return response.documents as AppwriteMeeting[];
  }

  static async getTodaysMeetings(userId: string): Promise<AppwriteMeeting[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    return await this.getByDateRange(userId, startOfDay, endOfDay);
  }

  static async getUpcomingMeetings(userId: string, hours = 2): Promise<AppwriteMeeting[]> {
    const now = new Date();
    const futureTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));

    const response = await databases.listDocuments(
      DATABASE_ID,
      'meetings',
      [
        Query.equal('userId', userId),
        Query.notEqual('status', 'cancelled'),
        Query.greaterThan('startDateTime', now.toISOString()),
        Query.lessThan('startDateTime', futureTime.toISOString())
      ]
    );
    return response.documents as AppwriteMeeting[];
  }
}

// Category operations
export class CategoryService {
  static async create(categoryData: Omit<Category, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteCategory> {
    return await databases.createDocument(
      DATABASE_ID,
      'categories',
      ID.unique(),
      categoryData,
      [
        Permission.read(Role.user(categoryData.userId)),
        Permission.write(Role.user(categoryData.userId))
      ]
    ) as AppwriteCategory;
  }

  static async getByUser(userId: string): Promise<AppwriteCategory[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'categories',
      [Query.equal('userId', userId)]
    );
    return response.documents as AppwriteCategory[];
  }

  static async createDefaultCategories(userId: string): Promise<AppwriteCategory[]> {
    const defaultCategories = [
      { name: 'Work', color: '#3B82F6', icon: 'briefcase', isDefault: true },
      { name: 'Personal', color: '#10B981', icon: 'user', isDefault: true },
      { name: 'Health', color: '#F59E0B', icon: 'heart', isDefault: true },
      { name: 'Learning', color: '#8B5CF6', icon: 'book', isDefault: true }
    ];

    const createdCategories: AppwriteCategory[] = [];
    
    for (const category of defaultCategories) {
      const created = await this.create({ ...category, userId });
      createdCategories.push(created);
    }

    return createdCategories;
  }
}

// Generic service for all items (tasks, reminders, meetings)
export class ItemService {
  static async getAllItems(userId: string, startDate?: string, endDate?: string): Promise<(AppwriteTask | AppwriteReminder | AppwriteMeeting)[]> {
    const queries = [Query.equal('userId', userId)];
    
    if (startDate && endDate) {
      queries.push(Query.greaterThanEqual('startDateTime', startDate));
      queries.push(Query.lessThanEqual('startDateTime', endDate));
    }

    // Get all three types of items
    const [tasksResponse, remindersResponse, meetingsResponse] = await Promise.all([
      databases.listDocuments(DATABASE_ID, 'tasks', queries),
      databases.listDocuments(DATABASE_ID, 'reminders', queries),
      databases.listDocuments(DATABASE_ID, 'meetings', queries)
    ]);

    const allItems = [
      ...(tasksResponse.documents as AppwriteTask[]),
      ...(remindersResponse.documents as AppwriteReminder[]),
      ...(meetingsResponse.documents as AppwriteMeeting[])
    ];

    return allItems.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  }

  static async getItemsByStatus(userId: string, status: Status): Promise<(AppwriteTask | AppwriteReminder | AppwriteMeeting)[]> {
    const [tasksResponse, remindersResponse, meetingsResponse] = await Promise.all([
      databases.listDocuments(DATABASE_ID, 'tasks', [
        Query.equal('userId', userId),
        Query.equal('status', status)
      ]),
      databases.listDocuments(DATABASE_ID, 'reminders', [
        Query.equal('userId', userId),
        Query.equal('status', status)
      ]),
      databases.listDocuments(DATABASE_ID, 'meetings', [
        Query.equal('userId', userId),
        Query.equal('status', status)
      ])
    ]);

    return [
      ...(tasksResponse.documents as AppwriteTask[]),
      ...(remindersResponse.documents as AppwriteReminder[]),
      ...(meetingsResponse.documents as AppwriteMeeting[])
    ];
  }

  static async getOverdueItems(userId: string): Promise<(AppwriteTask | AppwriteReminder | AppwriteMeeting)[]> {
    const now = new Date().toISOString();
    
    const [tasksResponse, remindersResponse, meetingsResponse] = await Promise.all([
      databases.listDocuments(DATABASE_ID, 'tasks', [
        Query.equal('userId', userId),
        Query.lessThan('startDateTime', now)
      ]),
      databases.listDocuments(DATABASE_ID, 'reminders', [
        Query.equal('userId', userId),
        Query.lessThan('startDateTime', now)
      ]),
      databases.listDocuments(DATABASE_ID, 'meetings', [
        Query.equal('userId', userId),
        Query.lessThan('endDateTime', now)
      ])
    ]);

    // Filter out completed/cancelled items in memory since Appwrite client SDK has query limitations
    const overdueTasks = (tasksResponse.documents as AppwriteTask[]).filter(task => 
      !['completed', 'cancelled'].includes(task.status)
    );
    
    const overdueReminders = (remindersResponse.documents as AppwriteReminder[]).filter(reminder => 
      !['completed', 'cancelled'].includes(reminder.status)
    );
    
    const overdueMeetings = (meetingsResponse.documents as AppwriteMeeting[]).filter(meeting => 
      !['completed', 'cancelled'].includes(meeting.status)
    );

    return [
      ...overdueTasks,
      ...overdueReminders,
      ...overdueMeetings
    ];
  }
}

// Notification operations
export class NotificationService {
  static async create(notificationData: Omit<Notification, '$id' | '$createdAt' | '$updatedAt'>): Promise<AppwriteNotification> {
    return await databases.createDocument(
      DATABASE_ID,
      'notifications',
      ID.unique(),
      notificationData,
      [
        Permission.read(Role.user(notificationData.userId)),
        Permission.write(Role.user(notificationData.userId))
      ]
    ) as AppwriteNotification;
  }

  static async getUnread(userId: string): Promise<AppwriteNotification[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'notifications',
      [
        Query.equal('userId', userId),
        Query.equal('isRead', false),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as AppwriteNotification[];
  }

  static async markAsRead(notificationId: string): Promise<AppwriteNotification> {
    return await databases.updateDocument(DATABASE_ID, 'notifications', notificationId, {
      isRead: true
    }) as AppwriteNotification;
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const unreadNotifications = await this.getUnread(userId);
    
    await Promise.all(
      unreadNotifications.map(notification => 
        this.markAsRead(notification.$id)
      )
    );
  }

  static async getDue(userId: string): Promise<AppwriteNotification[]> {
    const now = new Date().toISOString();
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      'notifications',
      [
        Query.equal('userId', userId),
        Query.lessThanEqual('scheduledFor', now)
      ]
    );
    
    // Filter out notifications that have already been sent
    const filteredDocs = (response.documents as AppwriteNotification[]).filter(notification => 
      !notification.sentAt
    );
    
    return filteredDocs;
  }

  static async markAsSent(notificationId: string): Promise<AppwriteNotification> {
    return await databases.updateDocument(DATABASE_ID, 'notifications', notificationId, {
      sentAt: new Date().toISOString()
    }) as AppwriteNotification;
  }
}

// Database initialization
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if database exists - Note: databases.get() only works with server SDK
    // For client SDK, we'll try to list documents from a known collection instead
    await databases.listDocuments(DATABASE_ID, 'users', [Query.limit(1)]);
    console.log('Database already exists');
  } catch (error) {
    console.log('Database does not exist, creating...');
    // Database creation needs to be done through Appwrite Console or Server SDK
    throw new Error('Database needs to be created through Appwrite Console first');
  }
}

// Utility functions
export function createDefaultUserPreferences() {
  return {
    defaultView: 'calendar' as const,
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    weekStart: 1 as const, // Monday
    notifications: {
      email: true,
      push: true,
      reminderMinutes: [15, 30, 60]
    }
  };
}

export function generateItemId(): string {
  return ID.unique();
}

export function formatDateForQuery(date: Date): string {
  return date.toISOString();
}

export function getStartOfDay(date: Date): string {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

export function getEndOfDay(date: Date): string {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

export function getStartOfWeek(date: Date, startOnMonday = true): string {
  const start = new Date(date);
  const day = start.getDay();
  const diff = startOnMonday ? (day === 0 ? 6 : day - 1) : day;
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

export function getEndOfWeek(date: Date, startOnMonday = true): string {
  const end = new Date(date);
  const day = end.getDay();
  const diff = startOnMonday ? (day === 0 ? 0 : 7 - day) : 6 - day;
  end.setDate(end.getDate() + diff);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

export function getStartOfMonth(date: Date): string {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return start.toISOString();
}

export function getEndOfMonth(date: Date): string {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

// Validation helpers
export function validateItemData(item: Partial<BaseItem>): string[] {
  const errors: string[] = [];

  if (!item.title?.trim()) {
    errors.push('Title is required');
  }

  if (!item.userId) {
    errors.push('User ID is required');
  }

  if (!item.startDateTime) {
    errors.push('Start date/time is required');
  } else if (isNaN(Date.parse(item.startDateTime))) {
    errors.push('Invalid start date/time format');
  }

  if (item.endDateTime && isNaN(Date.parse(item.endDateTime))) {
    errors.push('Invalid end date/time format');
  }

  if (item.endDateTime && item.startDateTime && 
      new Date(item.endDateTime) <= new Date(item.startDateTime)) {
    errors.push('End date/time must be after start date/time');
  }

  if (item.priority && !['low', 'medium', 'high', 'urgent'].includes(item.priority)) {
    errors.push('Invalid priority value');
  }

  if (item.status && !['pending', 'in-progress', 'completed', 'cancelled'].includes(item.status)) {
    errors.push('Invalid status value');
  }

  return errors;
}

export function validateTaskData(task: Partial<Task>): string[] {
  const baseErrors = validateItemData(task);
  
  if (task.progress !== undefined && (task.progress < 0 || task.progress > 100)) {
    baseErrors.push('Progress must be between 0 and 100');
  }

  if (task.estimatedHours !== undefined && task.estimatedHours < 0) {
    baseErrors.push('Estimated hours cannot be negative');
  }

  if (task.actualHours !== undefined && task.actualHours < 0) {
    baseErrors.push('Actual hours cannot be negative');
  }

  return baseErrors;
}

export function validateMeetingData(meeting: Partial<Meeting>): string[] {
  const baseErrors = validateItemData(meeting);
  
  if (!meeting.endDateTime) {
    baseErrors.push('End date/time is required for meetings');
  }

  if (meeting.meetingType && !['in-person', 'online', 'hybrid'].includes(meeting.meetingType)) {
    baseErrors.push('Invalid meeting type');
  }

  if (meeting.attendees && Array.isArray(meeting.attendees)) {
    meeting.attendees.forEach((attendee, index) => {
      if (!attendee.email) {
        baseErrors.push(`Attendee ${index + 1} email is required`);
      } else if (!/\S+@\S+\.\S+/.test(attendee.email)) {
        baseErrors.push(`Attendee ${index + 1} email is invalid`);
      }
    });
  }

  return baseErrors;
}