import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardActionArea,
} from '@mui/material';
import {
    TrendingUp,
    CalendarToday,
    Insights,
    Groups,
    BeachAccess,
    Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const features = [
    {
        title: 'Time Trend Analysis',
        description: 'View associate and team performance metrics, story points, and utilization rates',
        icon: <TrendingUp sx={{ fontSize: 50 }} />,
        path: '/time-trend/associate',
        color: '#1976d2',
    },
    {
        title: 'Company Holidays',
        description: 'Manage holidays for US and India locations across different years',
        icon: <CalendarToday sx={{ fontSize: 50 }} />,
        path: '/holidays',
        color: '#dc004e',
    },
    {
        title: 'Teamwork Insights',
        description: 'AI-powered summaries of team accomplishments and individual contributions',
        icon: <Insights sx={{ fontSize: 50 }} />,
        path: '/teamwork-insights',
        color: '#ff9800',
    },
    {
        title: 'Manage Teams',
        description: 'Create, update, and manage teams and their members',
        icon: <Groups sx={{ fontSize: 50 }} />,
        path: '/manage-teams',
        color: '#4caf50',
    },
    {
        title: 'Team PTO',
        description: 'Track and manage paid time off for all team members',
        icon: <BeachAccess sx={{ fontSize: 50 }} />,
        path: '/team-pto',
        color: '#9c27b0',
    },
    {
        title: 'Future Capacity',
        description: 'Plan upcoming work with capacity charts and bandwidth analysis',
        icon: <Assessment sx={{ fontSize: 50 }} />,
        path: '/future-capacity',
        color: '#00bcd4',
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        background: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, #1e3a5f 0%, #0a1929 100%)'
                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <Typography variant="h3" gutterBottom fontWeight={600}>
                        Welcome to Team Management & Capacity View
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Hello, {user?.firstName || user?.email}! 👋
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                        Your comprehensive platform for tracking team performance, managing resources,
                        and planning future capacity with real-time Jira integration and AI-powered insights.
                    </Typography>
                </Paper>

                <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                    Features
                </Typography>

                <Grid container spacing={3}>
                    {features.map((feature) => (
                        <Grid item xs={12} sm={6} md={4} key={feature.title}>
                            <Card
                                sx={{
                                    height: '100%',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(feature.path)}
                                    sx={{ height: '100%', p: 2 }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                mb: 2,
                                                color: feature.color,
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            align="center"
                                            fontWeight={600}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            align="center"
                                        >
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}