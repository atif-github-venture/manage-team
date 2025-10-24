import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    Tooltip,
    Chip,
} from '@mui/material';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import teamService from '../../services/teamService';
import timeTrendService from '../../services/timeTrendService';
import { useSnackbar } from 'notistack';

export default function TeamView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const response = await teamService.getAllTeams();
            setTeams(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load teams', { variant: 'error' });
        }
    };

    const handleDisplay = async () => {
        if (!selectedTeam) {
            enqueueSnackbar('Please select a team', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await timeTrendService.getTeamMonthlyView({
                teamId: selectedTeam,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
            });
            setData(response.data);
            enqueueSnackbar('Data loaded successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to load data', {
                variant: 'error',
            });
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Transform members data for chart
    const getChartData = () => {
        if (!data || !data.members) return [];

        return Object.entries(data.members).map(([name, metrics]) => ({
            name: name,
            storyPoints: metrics.totalStoryPoints || 0,
            totalIssues: metrics.totalIssues || 0,
            utilization: parseFloat((metrics.utilization || 0).toFixed(2)),
            timeSpent: parseFloat((metrics.totalTimeSpent || 0).toFixed(2)),
        }));
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{
                    p: 2.5,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0,0,0,0.5)'
                        : '0 8px 32px rgba(0,0,0,0.15)',
                    minWidth: 200
                }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{
                        color: 'primary.main',
                        borderBottom: '2px solid',
                        borderColor: 'primary.main',
                        pb: 1,
                        mb: 1.5
                    }}>
                        {label}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: entry.color,
                                    boxShadow: `0 0 8px ${entry.color}80`
                                }} />
                                <Typography variant="body2" sx={{ color: entry.color }}>
                                    {entry.name}:
                                </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: entry.color }}>
                                {entry.value}
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    const MetricCard = ({ icon: Icon, title, value, gradient, color, tooltip }) => (
        <Tooltip title={tooltip || ''} arrow placement="top" disableHoverListener={!tooltip}>
            <Card sx={{
                cursor: tooltip ? 'help' : 'default',
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: 3,
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
                                background: gradient,
                                display: 'flex',
                                mr: 2,
                                boxShadow: `0 4px 14px ${color}40`
                            }}
                        >
                            <Icon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{ fontWeight: 500 }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: color,
                            mb: 0.5
                        }}
                    >
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </Tooltip>
    );

    const cumulativeMetricTiles = data?.cumulative ? [
        {
            icon: Assignment,
            title: 'Total Issues',
            value: data.cumulative.totalIssues || 0,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
        },
        {
            icon: TrendingUp,
            title: 'Total Story Points',
            value: data.cumulative.totalStoryPoints || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
        },
        {
            icon: Timer,
            title: 'Time Spent (hrs)',
            value: data.cumulative.totalTimeSpent?.toFixed(2) || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
        },
        {
            icon: Speed,
            title: 'Utilization %',
            value: `${data.cumulative.utilization || 0}%`,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#fa709a',
            tooltip: 'Team average: Time Spent / Working Hours × 100'
        },
        {
            icon: Schedule,
            title: 'Original Estimate (hrs)',
            value: data.cumulative.totalEstimate?.toFixed(2) || 0,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
        },
        {
            icon: WorkOutline,
            title: 'Working Hours',
            value: data.cumulative.totalWorkingHours?.toFixed(2) || 0,
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            color: '#30cfd0'
        },
        {
            icon: BeachAccess,
            title: 'PTO Hours',
            value: `${data.cumulative.totalPtoHours?.toFixed(2) || 0}h`,
            gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: '#FF6B6B',
            tooltip: 'Total approved PTO hours for all team members'
        },
        {
            icon: EventAvailable,
            title: 'Holiday Hours',
            value: `${data.cumulative.totalHolidayHours?.toFixed(2) || 0}h`,
            gradient: 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
            color: '#FEC163',
            tooltip: 'Company holiday hours for all team members'
        },
        {
            icon: ShowChart,
            title: 'Story Burn Rate',
            value: data.cumulative.storyBurnRate || 0,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#a8edea',
            tooltip: 'Team average: Story Points / Time Spent'
        },
        {
            icon: CompareArrows,
            title: 'Time Actual/Original',
            value: data.cumulative.timeActualVsOriginal || 0,
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: '#ff9a9e'
        },
    ] : [];

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{
                        width: 6,
                        height: 50,
                        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3
                    }} />
                    <Box>
                        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main">
                            Time Trend - Team View
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            View team performance metrics and member comparisons
                        </Typography>
                    </Box>
                </Box>

                <Paper sx={{ p: 3, mb: 3, boxSizing: 'border-box', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Select Team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setData(null);
                                }}
                            >
                                {teams.map((team) => (
                                    <MenuItem key={team._id} value={team._id}>
                                        {team.teamName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={setEndDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleDisplay}
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                    }
                                }}
                            >
                                Display
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {loading && <Loading message="Fetching team data from Jira..." />}

                {data && !loading && (
                    <>
                        {/* Cumulative Metrics */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                {teams.find(t => t._id === selectedTeam)?.teamName || 'Team'}
                            </Typography>
                            <Chip
                                label="Cumulative Metrics"
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {cumulativeMetricTiles.map((tile, index) => (
                                <Grid item xs={12} sm={6} md={2.4} key={index}>
                                    <MetricCard {...tile} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Member Comparison Chart */}
                        <Paper sx={{
                            p: 3,
                            width: '100%',
                            boxSizing: 'border-box',
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            borderRadius: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <Typography variant="h5" fontWeight={700} color="primary.main">
                                    {teams.find(t => t._id === selectedTeam)?.teamName || 'Team'}
                                </Typography>
                                <Chip
                                    label="Performance Comparison"
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Hover over bars to see detailed metrics for each team member
                            </Typography>
                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart
                                    data={getChartData()}
                                    margin={{ top: 20, right: 30, left: 80, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        height={80}
                                        interval={0}
                                        tick={(props) => {
                                            const { x, y, payload } = props;
                                            const names = payload.value.split(' ');
                                            const firstName = names[0] || '';
                                            const lastName = names.slice(1).join(' ') || '';

                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <text
                                                        x={0}
                                                        y={0}
                                                        dy={16}
                                                        textAnchor="middle"
                                                        fill="currentColor"
                                                        fontSize={12}
                                                        fontWeight={600}
                                                    >
                                                        {firstName}
                                                    </text>
                                                    {lastName && (
                                                        <text
                                                            x={0}
                                                            y={0}
                                                            dy={30}
                                                            textAnchor="middle"
                                                            fill="currentColor"
                                                            fontSize={12}
                                                            fontWeight={600}
                                                        >
                                                            {lastName}
                                                        </text>
                                                    )}
                                                </g>
                                            );
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            value: 'Story Points / Issues / Time (hrs)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            offset: 10,
                                            style: { fontWeight: 600, fill: 'currentColor', textAnchor: 'middle' }
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{
                                            value: 'Utilization %',
                                            angle: 90,
                                            position: 'insideRight',
                                            style: { fontWeight: 600, fill: 'currentColor' }
                                        }}
                                    />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />
                                    <Legend
                                        verticalAlign="top"
                                        wrapperStyle={{ paddingBottom: '20px' }}
                                        iconType="circle"
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="storyPoints"
                                        fill="#2196F3"
                                        name="Story Points"
                                        radius={[6, 6, 0, 0]}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="totalIssues"
                                        fill="#9C27B0"
                                        name="Total Issues"
                                        radius={[6, 6, 0, 0]}
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="utilization"
                                        fill="#FF9800"
                                        name="Utilization %"
                                        radius={[6, 6, 0, 0]}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="timeSpent"
                                        fill="#4CAF50"
                                        name="Time Spent (hrs)"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </>
                )}

                {!loading && !data && (
                    <Paper sx={{ p: 4, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <Typography color="text.secondary">
                            Select a team and date range to view team performance metrics
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}