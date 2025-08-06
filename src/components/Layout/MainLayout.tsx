'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Notifications,
  Settings,
  AccountCircle,
  Logout,
  Person,
  FolderOpen,
  Task,
  PendingActions,
  CheckCircle,
  Warning,
  Schedule,
  NotificationsActive,
  BarChart,
  EventNote,
  Search,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon'; // Import SvgIconProps

const drawerWidth = 280;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement<SvgIconProps>; // Update to specify SvgIconProps
  badge?: number;
  path?: string;
  children?: MenuItem[];
}

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState<string[]>(['projects', 'tasks']);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = (itemId: string) => {
    setExpanded(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = () => {
    // Close mobile drawer on navigation
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Assignment />,
      badge: 3,
      children: [
        { id: 'project-1', label: 'Web Development', icon: <FolderOpen />, badge: 8, path: '/projects/web-development' },
        { id: 'project-2', label: 'Mobile App', icon: <FolderOpen />, badge: 12, path: '/projects/mobile-app' },
        { id: 'project-3', label: 'Marketing Campaign', icon: <FolderOpen />, badge: 5, path: '/projects/marketing' },
      ],
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <Task />,
      badge: 25,
      children: [
        { id: 'upcoming-tasks', label: 'Upcoming Tasks', icon: <Schedule />, badge: 12, path: '/tasks/upcoming' },
        { id: 'in-progress', label: 'In Progress', icon: <PendingActions />, badge: 8, path: '/tasks/in-progress' },
        { id: 'completed', label: 'Completed', icon: <CheckCircle />, badge: 45, path: '/tasks/completed' },
        { id: 'overdue', label: 'Overdue', icon: <Warning />, badge: 3, path: '/tasks/overdue' },
      ],
    },
    {
      id: 'gantt',
      label: 'Gantt Chart',
      icon: <BarChart />,
      path: '/gantt-chart',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <EventNote />,
      badge: 7,
      path: '/calendar',
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: <NotificationsActive />,
      badge: 4,
      path: '/reminders',
    },
  ];

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = pathname === item.path ||
                      (item.children && item.children.some(child => pathname === child.path));
    const isExpanded = expanded.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    // For items with children (no direct path)
    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleExpandClick(item.id)}
              sx={{
                minHeight: 48,
                pl: depth > 0 ? 4 : 2,
                pr: 2,
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                backgroundColor: isSelected ? 'rgba(103, 126, 234, 0.1)' : 'transparent',
                color: isSelected ? '#677eea' : 'text.primary',
                position: 'relative',
                '&:hover': {
                  backgroundColor: isSelected ? 'rgba(103, 126, 234, 0.15)' : 'rgba(103, 126, 234, 0.05)',
                },
                '&::before': isSelected ? {
                  content: '""',
                  position: 'absolute',
                  left: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 20,
                  backgroundColor: '#677eea',
                  borderRadius: '0 2px 2px 0',
                } : {},
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center', color: 'inherit' }}>
                  {React.cloneElement(item.icon, {
                    style: { fontSize: '1.1rem' },
                  })}
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flexGrow: 1, 
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.875rem',
                  }}
                >
                  {item.label}
                </Typography>

                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: isSelected ? 'rgba(103, 126, 234, 0.2)' : 'rgba(103, 126, 234, 0.1)',
                      color: isSelected ? '#677eea' : 'primary.main',
                      mr: 1,
                    }}
                  />
                )}

                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </ListItemButton>
          </ListItem>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    // For items with paths (actual links)
    const isCurrentPath = pathname === item.path;
    
    return (
      <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
        <Link href={item.path!} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton
            onClick={handleNavigation}
            sx={{
              minHeight: 48,
              pl: depth > 0 ? 4 : 2,
              pr: 2,
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              backgroundColor: isCurrentPath ? 'rgba(103, 126, 234, 0.1)' : 'transparent',
              color: isCurrentPath ? '#677eea' : 'text.primary',
              position: 'relative',
              '&:hover': {
                backgroundColor: isCurrentPath ? 'rgba(103, 126, 234, 0.15)' : 'rgba(103, 126, 234, 0.05)',
              },
              '&::before': isCurrentPath ? {
                content: '""',
                position: 'absolute',
                left: -8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: 20,
                backgroundColor: '#677eea',
                borderRadius: '0 2px 2px 0',
              } : {},
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center', color: 'inherit' }}>
                {React.cloneElement(item.icon, {
                  style: { fontSize: '1.1rem' },
                })}
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: isCurrentPath ? 600 : 500,
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Typography>

              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: isCurrentPath ? 'rgba(103, 126, 234, 0.2)' : 'rgba(103, 126, 234, 0.1)',
                    color: isCurrentPath ? '#677eea' : 'primary.main',
                  }}
                />
              )}
            </Box>
          </ListItemButton>
        </Link>
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
      {/* Brand Section */}
      <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
        <Box sx={{ p: 2.5, pb: 1.5, cursor: 'pointer' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              background: 'linear-gradient(135deg, #677eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            FocusFlow
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Project Management
          </Typography>
        </Box>
      </Link>
      
      <Divider sx={{ mx: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
      
      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1, overflowY: 'auto' }}>
        <List>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>
      
      <Divider sx={{ mx: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
      
      {/* Settings Link */}
      <Box sx={{ p: 1 }}>
        <Link href="/settings" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton
            onClick={handleNavigation}
            sx={{
              minHeight: 48,
              px: 2,
              borderRadius: 1,
              transition: 'all 0.2s ease',
              backgroundColor: pathname === '/settings' ? 'rgba(103, 126, 234, 0.1)' : 'transparent',
              color: pathname === '/settings' ? '#677eea' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(103, 126, 234, 0.05)',
                transform: 'translateX(2px)',
              },
            }}
          >
            <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
              <Settings sx={{ fontSize: '1.1rem', color: 'inherit' }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Settings
            </Typography>
          </ListItemButton>
        </Link>
      </Box>
    </Box>
  );

  // Profile menu handlers
  const handleProfileClick = () => {
    router.push('/profile');
    handleProfileMenuClose();
  };

  const handleSettingsClick = () => {
    router.push('/settings');
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Project Management Dashboard
          </Typography>
          
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Search />
          </IconButton>
          
          <Badge badgeContent={12} color="error" sx={{ mr: 2 }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
          </Badge>
          
          <IconButton
            edge="end"
            aria-label="account menu"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#fafbfc',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;