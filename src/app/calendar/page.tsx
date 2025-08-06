'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Clock,
  Bell,
  User,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Users,
  Coffee,
} from 'lucide-react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

interface Task {
  id: string;
  title: string;
  time: string;
  type: 'task' | 'meeting' | 'reminder' | 'event';
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  location?: string;
  description?: string;
}

interface CalendarEvent {
  id: string;
  date: string;
  tasks: Task[];
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'meetings' | 'reminders'>('all');

  // Mock data for calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => [
    {
      id: 'day-1',
      date: currentDate.format('YYYY-MM-01'),
      tasks: [
        {
          id: 'task-1',
          title: 'Team standup meeting',
          time: '09:00',
          type: 'meeting',
          status: 'pending',
          priority: 'high',
          assignee: 'Alice Johnson',
          location: 'Conference Room A',
        },
        {
          id: 'task-2',
          title: 'Review project proposal',
          time: '14:30',
          type: 'task',
          status: 'in-progress',
          priority: 'medium',
          assignee: 'Bob Smith',
        },
      ],
    },
    {
      id: 'day-5',
      date: currentDate.format('YYYY-MM-05'),
      tasks: [
        {
          id: 'task-3',
          title: 'Client presentation',
          time: '10:00',
          type: 'meeting',
          status: 'pending',
          priority: 'high',
          assignee: 'Carol Williams',
          location: 'Zoom Meeting',
        },
        {
          id: 'task-4',
          title: 'Code review deadline',
          time: '17:00',
          type: 'reminder',
          status: 'pending',
          priority: 'high',
        },
      ],
    },
    {
      id: 'day-12',
      date: currentDate.format('YYYY-MM-12'),
      tasks: [
        {
          id: 'task-5',
          title: 'Sprint planning',
          time: '11:00',
          type: 'meeting',
          status: 'pending',
          priority: 'medium',
          assignee: 'David Brown',
          location: 'Meeting Room B',
        },
        {
          id: 'task-6',
          title: 'Update documentation',
          time: '15:00',
          type: 'task',
          status: 'completed',
          priority: 'low',
          assignee: 'Eva Martinez',
        },
        {
          id: 'task-7',
          title: 'Team lunch',
          time: '12:30',
          type: 'event',
          status: 'pending',
          priority: 'low',
          location: 'Local Restaurant',
        },
      ],
    },
    {
      id: 'day-18',
      date: currentDate.format('YYYY-MM-18'),
      tasks: [
        {
          id: 'task-8',
          title: 'Security audit',
          time: '09:30',
          type: 'task',
          status: 'overdue',
          priority: 'high',
          assignee: 'Frank Wilson',
        },
        {
          id: 'task-9',
          title: 'Performance review',
          time: '16:00',
          type: 'meeting',
          status: 'pending',
          priority: 'medium',
          assignee: 'Grace Lee',
          location: 'HR Office',
        },
      ],
    },
    {
      id: 'day-25',
      date: currentDate.format('YYYY-MM-25'),
      tasks: [
        {
          id: 'task-10',
          title: 'Project milestone review',
          time: '13:00',
          type: 'meeting',
          status: 'pending',
          priority: 'high',
          assignee: 'Henry Chen',
          location: 'Board Room',
        },
        {
          id: 'task-11',
          title: 'Submit monthly report',
          time: '18:00',
          type: 'reminder',
          status: 'pending',
          priority: 'medium',
        },
      ],
    },
  ], [currentDate]);

  const generateCalendarDays = () => {
    const firstDayOfMonth = currentDate.startOf('month');
    const lastDayOfMonth = currentDate.endOf('month');
    const firstDayOfCalendar = firstDayOfMonth.startOf('week');
    const lastDayOfCalendar = lastDayOfMonth.endOf('week');

    const days = [];
    let current = firstDayOfCalendar;

    while (current.isBefore(lastDayOfCalendar) || current.isSame(lastDayOfCalendar)) {
      days.push(current);
      current = current.add(1, 'day');
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getTasksForDate = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    const event = calendarEvents.find(e => e.date === dateString);
    return event ? event.tasks : [];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-3 h-3" />;
      case 'task': return <CheckCircle className="w-3 h-3" />;
      case 'reminder': return <Bell className="w-3 h-3" />;
      case 'event': return <Coffee className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'meeting': return 'from-blue-500 to-cyan-600';
      case 'task': return 'from-emerald-500 to-green-600';
      case 'reminder': return 'from-orange-500 to-red-600';
      case 'event': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Pause className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => 
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')
    );
  };

  const isToday = (date: dayjs.Dayjs) => date.isSame(dayjs(), 'day');
  const isCurrentMonth = (date: dayjs.Dayjs) => date.isSame(currentDate, 'month');

  const filteredTasks = (tasks: Task[]) => {
    if (filterType === 'all') return tasks;
    return tasks.filter(task => {
      if (filterType === 'tasks') return task.type === 'task';
      if (filterType === 'meetings') return task.type === 'meeting';
      if (filterType === 'reminders') return task.type === 'reminder';
      return true;
    });
  };

  const selectedDateTasks = selectedDate 
    ? getTasksForDate(dayjs(selectedDate))
    : [];

  const totalTasks = calendarEvents.reduce((total, event) => total + event.tasks.length, 0);
  const completedTasks = calendarEvents.reduce((total, event) => 
    total + event.tasks.filter(t => t.status === 'completed').length, 0);
  const upcomingMeetings = calendarEvents.reduce((total, event) => 
    total + event.tasks.filter(t => t.type === 'meeting' && t.status !== 'completed').length, 0);
  const pendingReminders = calendarEvents.reduce((total, event) => 
    total + event.tasks.filter(t => t.type === 'reminder' && t.status === 'pending').length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Calendar & Schedule
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your tasks, meetings, and reminders in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Events</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalTasks}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {completedTasks}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Meetings</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {upcomingMeetings}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Reminders</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {pendingReminders}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <Bell className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">
                    {currentDate.format('MMMM YYYY')}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(dayjs())}
                      className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Today
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {(['all', 'tasks', 'meetings', 'reminders'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)} // Error here: type is inferred as string
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                filterType === type
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">
                    <Plus className="w-4 h-4" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayTasks = filteredTasks(getTasksForDate(day));
                  const isSelected = selectedDate === day.format('YYYY-MM-DD');
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.format('YYYY-MM-DD'))}
                      className={`min-h-24 p-2 border border-gray-100 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        isToday(day)
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                          : isSelected
                          ? 'bg-blue-50 border-blue-300'
                          : isCurrentMonth(day)
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-blue-600' : isCurrentMonth(day) ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.format('D')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded bg-gradient-to-r ${getTypeGradient(task.type)} text-white truncate`}
                            title={`${task.time} - ${task.title}`}
                          >
                            <div className="flex items-center gap-1">
                              {getTypeIcon(task.type)}
                              <span className="truncate">{task.title}</span>
                            </div>
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">
                {dayjs(selectedDate).format('MMMM D, YYYY')}
              </h3>
              
              {selectedDateTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded bg-gradient-to-r ${getTypeGradient(task.type)} text-white`}>
                            {getTypeIcon(task.type)}
                          </div>
                          <span className="font-medium text-sm">{task.title}</span>
                        </div>
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </div>
                        
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assignee}
                          </div>
                        )}
                        
                        {task.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {task.location}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for this day</p>
                  <button className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm hover:shadow-md transition-all">
                    Add Event
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            
            <div className="space-y-3">
              {calendarEvents
                .flatMap(event => event.tasks.map(task => ({ ...task, date: event.date })))
                .filter(task => dayjs(task.date).isAfter(dayjs()) && task.status !== 'completed')
                .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
                .slice(0, 5)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded bg-gradient-to-r ${getTypeGradient(task.type)} text-white`}>
                      {getTypeIcon(task.type)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600">
                        {dayjs(task.date).format('MMM D')} at {task.time}
                      </p>
                      {task.assignee && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            {getInitials(task.assignee)}
                          </div>
                          <span className="text-xs text-gray-600">{task.assignee}</span>
                        </div>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Schedule Meeting', icon: Users, gradient: 'from-blue-500 to-cyan-600' },
                { label: 'Add Task', icon: CheckCircle, gradient: 'from-emerald-500 to-green-600' },
                { label: 'Set Reminder', icon: Bell, gradient: 'from-orange-500 to-red-600' },
                { label: 'Create Event', icon: Calendar, gradient: 'from-purple-500 to-pink-600' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r ${action.gradient} text-white rounded-lg hover:shadow-md transition-all`}
                >
                  <action.icon className="w-5 h-5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;