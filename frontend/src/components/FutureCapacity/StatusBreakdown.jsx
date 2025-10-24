import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
    PlayCircleOutline,
    RadioButtonUnchecked,
    FiberManualRecord,
    Block,
    BugReport,
    RateReview
} from '@mui/icons-material';

const StatusCard = ({ icon: Icon, title, count, color }) => (
    <Card sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }
    }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        p: 1.5,
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
            <Typography variant="h3" fontWeight={700} color={color}>
                {count}
            </Typography>
        </CardContent>
    </Card>
);

export default function StatusBreakdown({ statusBreakdown }) {
    return (
        <>
            <Typography variant="h5" fontWeight={600} mb={2}>
                📋 Issues by Status
            </Typography>
            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={PlayCircleOutline}
                        title="In Progress"
                        count={statusBreakdown.inProgress}
                        color="#2196F3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={RadioButtonUnchecked}
                        title="To Do"
                        count={statusBreakdown.toDo}
                        color="#9E9E9E"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={FiberManualRecord}
                        title="Open"
                        count={statusBreakdown.open}
                        color="#607D8B"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={Block}
                        title="Blocked"
                        count={statusBreakdown.blocked}
                        color="#F44336"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={BugReport}
                        title="Ready for QA"
                        count={statusBreakdown.readyForQA}
                        color="#FF9800"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <StatusCard
                        icon={RateReview}
                        title="In Code Review"
                        count={statusBreakdown.inCodeReview}
                        color="#00BCD4"
                    />
                </Grid>
            </Grid>
        </>
    );
}