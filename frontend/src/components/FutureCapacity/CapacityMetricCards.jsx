import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
    Assignment,
    TrendingUp,
    Schedule,
    Timer,
    HourglassEmpty,
    WorkOutline,
    BeachAccess,
    EventAvailable
} from '@mui/icons-material';

const MetricCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                        display: 'flex',
                        mr: 2,
                        boxShadow: `0 4px 14px ${color}40`
                    }}
                >
                    <Icon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight={600} color={color} sx={{ mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {subtitle}
            </Typography>
        </CardContent>
    </Card>
);

export default function CapacityMetricCards({ summary }) {
    return (
        <>
            <Typography variant="h5" fontWeight={600} mb={2}>
                📊 Capacity Overview
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={Assignment}
                        title="Total Issues"
                        value={summary.totalIssues}
                        subtitle="In Scope"
                        color="#667eea"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={TrendingUp}
                        title="Story Points"
                        value={summary.totalStoryPoints}
                        subtitle="Total Points"
                        color="#764ba2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={Schedule}
                        title="Total Estimate"
                        value={`${summary.totalOriginalEstimate}h`}
                        subtitle="Original"
                        color="#f093fb"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={Timer}
                        title="Time Spent"
                        value={`${summary.totalTimeSpent}h`}
                        subtitle="Logged"
                        color="#4facfe"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={HourglassEmpty}
                        title="Time Remaining"
                        value={`${summary.totalTimeRemaining}h`}
                        subtitle="To Complete"
                        color="#43e97b"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={WorkOutline}
                        title="Working Hours"
                        value={`${summary.totalWorkingHours}h`}
                        subtitle="Available"
                        color="#fa709a"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={BeachAccess}
                        title="PTO Hours"
                        value={`${summary.totalPtoHours || 0}h`}
                        subtitle="Approved PTOs"
                        color="#30cfd0"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1.5}>
                    <MetricCard
                        icon={EventAvailable}
                        title="Holiday Hours"
                        value={`${summary.totalHolidayHours || 0}h`}
                        subtitle="Company Holidays"
                        color="#FF6B6B"
                    />
                </Grid>
            </Grid>
        </>
    );
}