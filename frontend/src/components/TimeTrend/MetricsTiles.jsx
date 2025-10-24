import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
    Assignment,
    TrendingUp,
    Timer,
    Schedule,
    WorkOutline,
    Speed,
    ShowChart,
    CompareArrows,
    BeachAccess,
    EventAvailable
} from '@mui/icons-material';

export default function MetricsTiles({ metrics }) {
    const tiles = [
        {
            title: 'Total Issues',
            value: metrics?.totalIssues || 0,
            icon: Assignment,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
        },
        {
            title: 'Total Story Points',
            value: metrics?.totalStoryPoints || 0,
            icon: TrendingUp,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
        },
        {
            title: 'Time Spent (hrs)',
            value: metrics?.totalTimeSpent || 0,
            icon: Timer,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
        },
        {
            title: 'Original Estimate (hrs)',
            value: metrics?.totalOriginalEstimate || metrics?.totalEstimate || 0,
            icon: Schedule,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
        },
        {
            title: 'Working Hours',
            value: metrics?.totalWorkingHours || 0,
            icon: WorkOutline,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#fa709a'
        },
        {
            title: 'PTO Hours',
            value: `${metrics?.totalPtoHours || 0}h`,
            icon: BeachAccess,
            gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: '#FF6B6B'
        },
        {
            title: 'Holiday Hours',
            value: `${metrics?.totalHolidayHours || 0}h`,
            icon: EventAvailable,
            gradient: 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
            color: '#FEC163'
        },
        {
            title: 'Utilization %',
            value: `${metrics?.utilization || 0}%`,
            icon: Speed,
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            color: '#30cfd0'
        },
        {
            title: 'Story Burn Rate',
            value: metrics?.storyBurnRate || 0,
            icon: ShowChart,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#a8edea'
        },
        {
            title: 'Time Actual/Original',
            value: metrics?.timeActualVsOriginal || 0,
            icon: CompareArrows,
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: '#ff9a9e'
        },
    ];

    return (
        <Grid container spacing={2}>
            {tiles.map((tile, index) => {
                const Icon = tile.icon;
                return (
                    <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            background: tile.gradient,
                                            display: 'flex',
                                            mr: 2,
                                            boxShadow: `0 4px 14px ${tile.color}40`
                                        }}
                                    >
                                        <Icon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {tile.title}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: tile.color,
                                        mb: 0.5
                                    }}
                                >
                                    {tile.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}