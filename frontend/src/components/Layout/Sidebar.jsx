import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Email as EmailIcon, QueryBuilder } from '@mui/icons-material';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    IconButton,
    Typography,
    Avatar,
    Tooltip,
    Button
} from '@mui/material';
import {
    Home,
    TrendingUp,
    CalendarToday,
    Insights,
    Groups,
    People,
    BeachAccess,
    Assessment,
    ChevronLeft,
    ChevronRight,
    Logout,
    History,
    Event,
    Build,
    Settings,
    Person,
    GroupWork,
    FiberManualRecord,
    DataObject,
} from '@mui/icons-material';
import { toggleSidebarCollapse } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 70;

// Icon colors mapping
const iconColors = {
    '/home': '#4CAF50', // Green
    '/time-trend/associate': '#2196F3', // Blue
    '/time-trend/team': '#9C27B0', // Purple
    '/teamwork-insights': '#FF9800', // Orange
    '/future-capacity': '#00BCD4', // Cyan
    '/manage-teams': '#E91E63', // Pink
    '/team-pto': '#FF5722', // Deep Orange
    '/holidays': '#FFC107', // Amber
    '/distribution-lists': '#2196F3', // Blue
    '/team-jqls': '#00897B', // Teal
    '/manage-users': '#3F51B5', // Indigo
    '/audit-logs': '#607D8B', // Blue Grey
};

const mainMenuItems = [
    { path: '/home', label: 'Home', icon: <Home /> },
];

const timeTrendSection = {
    title: 'Time Trend',
    items: [
        { path: '/time-trend/associate', label: 'Associate View', icon: <Person /> },
        { path: '/time-trend/team', label: 'Team View', icon: <GroupWork /> },
    ],
};

const reportingAndForecast = {
    title: 'Analysis & Forecast',
    items: [
        { path: '/teamwork-insights', label: 'Teamwork Insights - Done', icon: <Insights /> },
        { path: '/future-capacity', label: 'Future Capacity', icon: <Assessment /> },
    ],
};

const setupSection = {
    title: 'Setup',
    items: [
        { path: '/manage-teams', label: 'Manage Teams', icon: <Groups /> },
        { path: '/team-pto', label: 'Team PTO', icon: <BeachAccess /> },
        { path: '/holidays', label: 'Company Holidays', icon: <Event /> },
        { path: '/team-jqls', label: 'Team JQLs', icon: <DataObject /> },
        { path: '/distribution-lists', label: 'Distribution Lists', icon: <EmailIcon /> },
    ],
};

const settingsSection = {
    title: 'Settings',
    adminOnly: true,
    items: [
        { path: '/manage-users', label: 'Manage Users', icon: <People /> },
        { path: '/audit-logs', label: 'Audit Logs', icon: <History /> },
    ],
};

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
    const darkMode = useSelector((state) => state.ui.darkMode);
    const { user, logout, isAdmin } = useAuth();
    const [isHovered, setIsHovered] = useState(false);

    const isExpanded = isHovered || !collapsed;

    const handleToggleCollapse = () => {
        dispatch(toggleSidebarCollapse());
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    const getIconColor = (path, active) => {
        // if (active) {
        //     return '#FFFFFF'; // White when active
        // }
        return iconColors[path] || '#757575'; // Default grey if no color defined
    };

    const renderNavItem = (item) => (
        <ListItem key={item.path} disablePadding>
            <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                    px: 2,
                    borderRadius: isExpanded ? 2 : 0,
                    mx: isExpanded ? 1 : 0,
                    mb: isExpanded ? 0.5 : 0,
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: isExpanded ? 40 : 0,
                        justifyContent: 'center',
                        color: getIconColor(item.path, isActive(item.path))
                    }}
                >
                    {!isExpanded ? (
                        <Tooltip title={item.label} placement="right">
                            {item.icon}
                        </Tooltip>
                    ) : (
                        item.icon
                    )}
                </ListItemIcon>
                {isExpanded && <ListItemText primary={item.label} />}
            </ListItemButton>
        </ListItem>
    );

    const renderSection = (section) => (
        <Box key={section.title} sx={{ mb: 2 }}>
            {/* Section Header */}
            {isExpanded ? (
                <Typography
                    variant="overline"
                    sx={{
                        px: 3,
                        py: 1,
                        display: 'block',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        letterSpacing: 1.2,
                    }}
                >
                    {section.title}
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <FiberManualRecord sx={{ fontSize: 8, color: 'text.secondary' }} />
                </Box>
            )}

            {/* Section Items */}
            <List disablePadding>
                {section.items.map((item) => renderNavItem(item))}
            </List>
        </Box>
    );

    return (
        <Drawer
            variant="permanent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s ease, box-shadow 0.3s ease',
                    overflowX: 'hidden',
                    border: 'none',
                    boxShadow: isExpanded
                        ? '8px 0 24px rgba(0, 0, 0, 0.15)'
                        : '4px 0 12px rgba(0, 0, 0, 0.1)',
                    top: '84px',
                    height: 'calc(100vh - 104px)',
                    borderRadius: '0 24px 24px 0',
                    background: darkMode
                        ? 'linear-gradient(to bottom, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.98))'
                        : 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
                    backdropFilter: 'blur(10px)',
                    zIndex: (theme) => theme.zIndex.drawer,
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Collapse Toggle Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: isExpanded ? 'flex-end' : 'center',
                        p: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '0 20px 0 0',
                    }}
                >
                    <IconButton
                        onClick={handleToggleCollapse}
                        size="small"
                        sx={{ color: 'white' }}
                    >
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                </Box>

                <Divider />

                {/* User Info Section */}
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: darkMode
                            ? 'rgba(102, 126, 234, 0.2)'
                            : 'rgba(102, 126, 234, 0.1)',
                        justifyContent: isExpanded ? 'flex-start' : 'center',
                    }}
                >
                    {!isExpanded ? (
                        <Tooltip title={user?.fullName || user?.email} placement="right">
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 35,
                                    height: 35,
                                }}
                            >
                                {user?.firstName?.[0] || 'U'}
                            </Avatar>
                        </Tooltip>
                    ) : (
                        <>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                {user?.firstName?.[0] || 'U'}
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={600} noWrap>
                                    {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {user?.role === 'admin' ? 'Administrator' : 'Viewer'}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>

                <Divider />

                {/* Navigation Items */}
                <List sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
                    {/* Home */}
                    {mainMenuItems.map((item) => renderNavItem(item))}

                    {/* Time Trend Section */}
                    {renderSection(timeTrendSection)}

                    {/* Other Nav Items */}
                    {renderSection(reportingAndForecast)}

                    <Divider sx={{ my: 2 }} />

                    {/* Setup Section */}
                    {renderSection(setupSection)}

                    {/* Settings Section - Admin Only */}
                    {isAdmin && renderSection(settingsSection)}
                </List>

                <Divider />

                {/* Logout Section */}
                <Box
                    sx={{
                        p: 2,
                        background: darkMode
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        borderRadius: '0 0 20px 0',
                    }}
                >
                    {!isExpanded ? (
                        <Tooltip title="Logout" placement="right">
                            <IconButton
                                onClick={logout}
                                size="small"
                                color="error"
                                sx={{ width: '100%' }}
                            >
                                <Logout />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Button
                            onClick={logout}
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<Logout />}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}