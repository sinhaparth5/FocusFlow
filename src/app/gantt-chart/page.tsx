'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Filter, 
  Calendar, 
  MoreVertical, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  User,
  Clock,
} from 'lucide-react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

// Mock Gantt component since gantt-task-react isn't available
interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  project: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  dependencies?: string[];
}

interface GanttBarProps {
  task: Task;
  startDate: Date;
  totalDays: number;
  onTaskClick: (task: Task) => void;
  isSelected: boolean;
}

const GanttBar: React.FC<GanttBarProps> = ({ task, startDate, totalDays, onTaskClick, isSelected }) => {
  const taskStartDays = dayjs(task.start).diff(dayjs(startDate), 'day');
  const taskDurationDays = dayjs(task.end).diff(dayjs(task.start), 'day') + 1;
  
  const leftPercentage = (taskStartDays / totalDays) * 100;
  const widthPercentage = (taskDurationDays / totalDays) * 100;

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'delayed':
        return 'bg-gradient-to-r from-red-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="relative h-8 group">
      <div
        className={`absolute h-6 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        } ${getStatusGradient(task.status)}`}
        style={{
          left: `${leftPercentage}%`,
          width: `${widthPercentage}%`,
        }}
        onClick={() => onTaskClick(task)}
      >
        {/* Progress overlay */}
        <div
          className="h-full bg-white bg-opacity-30 rounded-lg"
          style={{ width: `${100 - task.progress}%`, marginLeft: `${task.progress}%` }}
        />
        
        {/* Task label */}
        <div className="absolute left-2 top-0 h-full flex items-center">
          <span className="text-white text-xs font-medium truncate">
            {task.name}
          </span>
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute bottom-8 left-0 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
          {task.name} - {task.progress}%
        </div>
      </div>
    </div>
  );
};

const GanttChartPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Mock data for Gantt chart
  const tasks: Task[] = useMemo(() => [
    {
      id: 'task-1',
      name: 'Project Planning',
      start: dayjs().toDate(),
      end: dayjs().add(5, 'day').toDate(),
      progress: 100,
      project: 'Web Platform',
      assignee: 'Alice Johnson',
      priority: 'high',
      status: 'completed',
    },
    {
      id: 'task-2',
      name: 'Design System Implementation',
      start: dayjs().add(3, 'day').toDate(),
      end: dayjs().add(12, 'day').toDate(),
      progress: 75,
      project: 'Web Platform',
      assignee: 'Bob Smith',
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: 'task-3',
      name: 'API Development',
      start: dayjs().add(8, 'day').toDate(),
      end: dayjs().add(18, 'day').toDate(),
      progress: 45,
      project: 'Backend Services',
      assignee: 'Carol Williams',
      priority: 'medium',
      status: 'in-progress',
    },
    {
      id: 'task-4',
      name: 'Mobile App UI',
      start: dayjs().add(15, 'day').toDate(),
      end: dayjs().add(25, 'day').toDate(),
      progress: 20,
      project: 'Mobile Development',
      assignee: 'David Brown',
      priority: 'medium',
      status: 'in-progress',
    },
    {
      id: 'task-5',
      name: 'Testing & QA',
      start: dayjs().add(20, 'day').toDate(),
      end: dayjs().add(30, 'day').toDate(),
      progress: 0,
      project: 'Quality Assurance',
      assignee: 'Eva Martinez',
      priority: 'high',
      status: 'not-started',
    },
    {
      id: 'task-6',
      name: 'Marketing Campaign',
      start: dayjs().add(25, 'day').toDate(),
      end: dayjs().add(35, 'day').toDate(),
      progress: 10,
      project: 'Marketing',
      assignee: 'Frank Wilson',
      priority: 'low',
      status: 'in-progress',
    },
  ], []);

  // Calculate timeline bounds
  const startDate = useMemo(() => {
    const dates = tasks.map(task => task.start);
    return new Date(Math.min(...dates.map(d => d.getTime())));
  }, [tasks]);

  const endDate = useMemo(() => {
    const dates = tasks.map(task => task.end);
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }, [tasks]);

  const totalDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;

  // Generate timeline headers
  const generateTimelineHeaders = () => {
    const headers = [];
    let current = dayjs(startDate);
    
    while (current.isBefore(dayjs(endDate)) || current.isSame(dayjs(endDate))) {
      if (viewMode === 'day') {
        headers.push(current.format('MMM DD'));
        current = current.add(1, 'day');
      } else if (viewMode === 'week') {
        headers.push(`Week ${current.week()}`);
        current = current.add(1, 'week');
      } else {
        headers.push(current.format('MMM YYYY'));
        current = current.add(1, 'month');
      }
    }
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task.id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-600" />;
      case 'delayed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Pause className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Project Gantt Chart
        </h1>
        <p className="text-gray-600 text-lg">
          Visualize project timelines, dependencies, and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {tasks.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {tasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Avg Progress</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length)}%
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Project Timeline</h2>
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg">
                    Export to PDF
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
                    Sync with Calendar
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg">
                    Print Timeline
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200">
            <div className="w-64 p-4 bg-gray-50 border-r border-gray-200 font-semibold">
              Task Name
            </div>
            <div className="flex-1 flex">
              {timelineHeaders.map((header, index) => (
                <div key={index} className="flex-1 p-4 text-center text-sm font-medium border-r border-gray-100 bg-gray-50">
                  {header}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          {tasks.map((task) => (
            <div key={task.id} className="flex border-b border-gray-100 hover:bg-blue-50 transition-colors">
              {/* Task Info */}
              <div className="w-64 p-4 border-r border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {getInitials(task.assignee)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-gray-500">{task.project}</p>
                  </div>
                </div>
              </div>

              {/* Gantt Bar Area */}
              <div className="flex-1 p-4 relative">
                <GanttBar
                  task={task}
                  startDate={startDate}
                  totalDays={totalDays}
                  onTaskClick={handleTaskClick}
                  isSelected={selectedTask === task.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Task Details</h3>
            
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-xl transition-all cursor-pointer ${
                    selectedTask === task.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{task.name}</h4>
                    <div className="flex gap-2">
                      {getStatusIcon(task.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {task.assignee}
                    </span>
                    <span>{dayjs(task.start).format('MMM DD')} - {dayjs(task.end).format('MMM DD')}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          task.progress === 100
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length)}%` }}
                    />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(tasks.reduce((acc, task) => acc + task.progress, 0) / tasks.length)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold">{dayjs(startDate).format('MMM DD, YYYY')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-semibold">{dayjs(endDate).format('MMM DD, YYYY')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{totalDays} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="font-semibold">{new Set(tasks.map(t => t.assignee)).size} members</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            
            <div className="space-y-3">
              {[
                { status: 'completed', label: 'Completed', color: 'from-emerald-500 to-green-600' },
                { status: 'in-progress', label: 'In Progress', color: 'from-blue-500 to-purple-600' },
                { status: 'not-started', label: 'Not Started', color: 'from-gray-400 to-gray-500' },
                { status: 'delayed', label: 'Delayed', color: 'from-red-500 to-pink-600' },
              ].map(({ status, label, color }) => {
                const count = tasks.filter(t => t.status === status).length;
                const percentage = (count / tasks.length) * 100;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
                      <span className="text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-500">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChartPage;