'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Add,
  PlayArrow,
  Pause,
  Done,
  Error,
  MoreVert,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types
type TaskStatus = 'completed' | 'in-progress' | 'pending' | 'overdue';
type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  priority: Priority;
  project: string;
  assignee: string;
  progress: number;
}

interface ChartData {
  month: string;
  completed: number;
  created: number;
  pending: number;
}

interface StatusConfig {
  color: 'success' | 'primary' | 'error' | 'default';
  icon: typeof Done | typeof PlayArrow | typeof Error | typeof Pause; // Specific icon types
}

interface PriorityConfig {
  color: 'error' | 'warning' | 'success' | 'default';
}

// Define type for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const Dashboard: React.FC = () => {
  // State management
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  // Mock data - in production, this would come from API
  const stats = useMemo(() => ({
    totalTasks: 156,
    completedTasks: 98,
    overdueTasks: 8,
    upcomingTasks: 50,
  }), []);

  const chartData: ChartData[] = useMemo(() => [
    { month: 'Jan', completed: 45, created: 60, pending: 15 },
    { month: 'Feb', completed: 52, created: 48, pending: 12 },
    { month: 'Mar', completed: 48, created: 55, pending: 18 },
    { month: 'Apr', completed: 61, created: 58, pending: 10 },
    { month: 'May', completed: 55, created: 62, pending: 20 },
    { month: 'Jun', completed: 67, created: 65, pending: 8 },
  ], []);

  const tasks: Task[] = useMemo(() => [
    {
      id: '1',
      title: 'Design system implementation',
      status: 'in-progress',
      dueDate: '2024-08-15',
      priority: 'high',
      project: 'Web Platform',
      assignee: 'Alice Johnson',
      progress: 75,
    },
    {
      id: '2',
      title: 'API documentation review',
      status: 'pending',
      dueDate: '2024-08-12',
      priority: 'medium',
      project: 'Backend Services',
      assignee: 'Bob Smith',
      progress: 0,
    },
    {
      id: '3',
      title: 'Security audit completion',
      status: 'completed',
      dueDate: '2024-08-10',
      priority: 'high',
      project: 'Infrastructure',
      assignee: 'Carol Williams',
      progress: 100,
    },
    {
      id: '4',
      title: 'Client presentation prep',
      status: 'overdue',
      dueDate: '2024-08-05',
      priority: 'high',
      project: 'Sales',
      assignee: 'David Brown',
      progress: 30,
    },
    {
      id: '5',
      title: 'Mobile app testing',
      status: 'in-progress',
      dueDate: '2024-08-18',
      priority: 'medium',
      project: 'Mobile Development',
      assignee: 'Eva Martinez',
      progress: 60,
    },
  ], []);

  // Utility functions with proper typing
  const getStatusConfig = useCallback((status: TaskStatus): StatusConfig => {
    const configs: Record<TaskStatus, StatusConfig> = {
      'completed': { color: 'success', icon: Done },
      'in-progress': { color: 'primary', icon: PlayArrow },
      'overdue': { color: 'error', icon: Error },
      'pending': { color: 'default', icon: Pause },
    };
    return configs[status];
  }, []);

  const getPriorityColor = useCallback((priority: Priority): PriorityConfig['color'] => {
    const colors: Record<Priority, PriorityConfig['color']> = {
      'high': 'error',
      'medium': 'warning',
      'low': 'success',
    };
    return colors[priority];
  }, []);

  const getInitials = useCallback((name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase(), []);

  const getProgressColor = useCallback((progress: number) => {
    if (progress === 100) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    if (progress > 50) return 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)';
    return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
  }, []);

  // Event handlers
  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTask(prev => prev === taskId ? null : taskId);
  }, []);

  const handleAddTask = useCallback(() => {
    console.log('Add new task');
  }, []);

  // Components
  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: typeof Assignment | typeof CheckCircle | typeof Schedule | typeof Warning; // Specific icon types
    gradient: string;
    iconColor: string;
  }> = ({ title, value, icon: Icon, gradient, iconColor }) => (
    <Card sx={{ 
      background: 'white',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: gradient,
      },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: gradient,
          }}>
            <Icon sx={{ fontSize: 32, color: iconColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ 
          p: 2, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: 2,
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'text.primary', 
            mb: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FocusFlow Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Track your productivity and manage tasks efficiently
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={Assignment}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            iconColor="white"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={CheckCircle}
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            iconColor="white"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Upcoming"
            value={stats.upcomingTasks}
            icon={Schedule}
            gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
            iconColor="white"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={Warning}
            gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            iconColor="white"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ 
            mb: 3,
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary', fontWeight: 600 }}>
                Task Analytics
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b"
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#f59e0b"
                      strokeWidth={4}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Tasks Table */}
          <Card sx={{
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Tasks</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={handleAddTask}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    },
                  }}
                >
                  Add Task
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {['Task', 'Status', 'Priority', 'Assignee', 'Progress', 'Due Date', 'Actions'].map(header => (
                        <TableCell key={header} sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => {
                      const statusConfig = getStatusConfig(task.status);
                      const StatusIcon = statusConfig.icon;
                      const isSelected = selectedTask === task.id;
                      
                      return (
                        <TableRow 
                          key={task.id}
                          onClick={() => handleTaskClick(task.id)}
                          sx={{ 
                            cursor: 'pointer',
                            backgroundColor: isSelected ? alpha('#667eea', 0.08) : 'transparent',
                            '&:hover': { 
                              backgroundColor: alpha('#667eea', 0.04),
                            },
                            transition: 'background-color 0.2s ease',
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {task.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {task.project}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<StatusIcon />}
                              label={task.status.replace('-', ' ')} 
                              color={statusConfig.color}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={task.priority} 
                              color={getPriorityColor(task.priority)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  fontSize: '0.75rem',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                              >
                                {getInitials(task.assignee)}
                              </Avatar>
                              <Typography variant="body2">{task.assignee}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                              <LinearProgress
                                variant="determinate"
                                value={task.progress}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  flexGrow: 1,
                                  backgroundColor: '#f1f5f9',
                                  '& .MuiLinearProgress-bar': {
                                    background: getProgressColor(task.progress),
                                    borderRadius: 4,
                                  }
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                                {task.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {task.dueDate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('More actions for', task.id);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Create New Task', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                  { label: 'New Project', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                  { label: 'Schedule Meeting', gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
                  { label: 'View Reports', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
                ].map((action, index) => (
                  <Button 
                    key={index}
                    variant="contained"
                    fullWidth
                    sx={{
                      background: action.gradient,
                      py: 1.5,
                      justifyContent: 'flex-start',
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;