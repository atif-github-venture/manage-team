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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Link as MuiLink,
    Tooltip,
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
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import teamService from '../../services/teamService';
import timeTrendService from '../../services/timeTrendService';
import { useSnackbar } from 'notistack';

export default function AssociateView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [associates, setAssociates] = useState([]);
    const [selectedAssociate, setSelectedAssociate] = useState('');
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            loadAssociates(selectedTeam);
        }
    }, [selectedTeam]);

    const loadTeams = async () => {
        try {
            const response = await teamService.getAllTeams();
            setTeams(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load teams', { variant: 'error' });
        }
    };

    const loadAssociates = async (teamId) => {
        try {
            const response = await teamService.getTeamMembers(teamId);
            setAssociates(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load team members', { variant: 'error' });
        }
    };

    const handleDisplay = async () => {
        if (!selectedTeam || !selectedAssociate) {
            enqueueSnackbar('Please select team and associate', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await timeTrendService.getAssociateView({
                teamId: selectedTeam,
                associateId: selectedAssociate,
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

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';

        if (statusLower.includes('done') || statusLower.includes('closed') || statusLower.includes('resolved')) {
            return 'success';
        }
        if (statusLower.includes('in progress') || statusLower.includes('in development')) {
            return 'primary';
        }
        if (statusLower.includes('review') || statusLower.includes('testing') || statusLower.includes('qa')) {
            return 'info';
        }
        if (statusLower.includes('blocked') || statusLower.includes('on hold')) {
            return 'error';
        }
        if (statusLower.includes('to do') || statusLower.includes('open') || statusLower.includes('backlog')) {
            return 'default';
        }
        if (statusLower.includes('ready')) {
            return 'warning';
        }

        return 'default';
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

    const metricTiles = [
        {
            icon: Assignment,
            title: 'Total Issues',
            value: data?.metrics?.totalIssues || 0,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
        },
        {
            icon: TrendingUp,
            title: 'Total Story Points',
            value: data?.metrics?.totalStoryPoints || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f093fb'
        },
        {
            icon: Timer,
            title: 'Time Spent (hrs)',
            value: data?.metrics?.totalTimeSpent || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
        },
        {
            icon: Speed,
            title: 'Utilization %',
            value: `${data?.metrics?.utilization || 0}%`,
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#fa709a',
            tooltip: 'This is calculated as Time Spent (hrs) / Working Hours × 100'
        },
        {
            icon: Schedule,
            title: 'Original Estimate (hrs)',
            value: data?.metrics?.totalEstimate || 0,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#43e97b'
        },
        {
            icon: WorkOutline,
            title: 'Working Hours',
            value: data?.metrics?.totalWorkingHours || 0,
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            color: '#30cfd0'
        },
        {
            icon: BeachAccess,
            title: 'PTO Hours',
            value: `${data?.metrics?.totalPtoHours || 0}h`,
            gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: '#FF6B6B',
            tooltip: 'Total approved PTO hours in the selected period'
        },
        {
            icon: EventAvailable,
            title: 'Holiday Hours',
            value: `${data?.metrics?.totalHolidayHours || 0}h`,
            gradient: 'linear-gradient(135deg, #FEC163 0%, #DE4313 100%)',
            color: '#FEC163',
            tooltip: 'Company holiday hours in the selected period'
        },
        {
            icon: ShowChart,
            title: 'Story Burn Rate',
            value: data?.metrics?.storyBurnRate || 0,
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#a8edea',
            tooltip: 'This is calculated as Total Story Points / Time Spent (hrs)'
        },
        {
            icon: CompareArrows,
            title: 'Time Actual/Original',
            value: data?.metrics?.timeActualVsOriginal || 0,
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: '#ff9a9e'
        },
    ];

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
                            Time Trend - Associate View
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            View individual associate performance metrics and ticket details
                        </Typography>
                    </Box>
                </Box>

                <Paper sx={{ p: 3, mb: 3, boxSizing: 'border-box', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Select Team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setSelectedAssociate('');
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
                            <TextField
                                select
                                fullWidth
                                label="Select Associate"
                                value={selectedAssociate}
                                onChange={(e) => {
                                    setSelectedAssociate(e.target.value);
                                    setData(null);
                                }}
                                disabled={!selectedTeam}
                            >
                                {associates.map((associate) => (
                                    <MenuItem key={associate._id} value={associate._id}>
                                        {associate.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
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

                {loading && <Loading message="Fetching data from Jira..." />}

                {data && !loading && (
                    <>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {metricTiles.map((tile, index) => (
                                <Grid item xs={12} sm={6} md={2.4} key={index}>
                                    <MetricCard {...tile} />
                                </Grid>
                            ))}
                        </Grid>

                        <Paper sx={{
                            p: 3,
                            width: '100%',
                            boxSizing: 'border-box',
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            borderRadius: 3
                        }}>
                            <Typography variant="h5" gutterBottom fontWeight={700} color="primary.main">
                                Ticket Details ({data.issues?.length || 0} issues)
                            </Typography>
                            {data.issues && data.issues.length > 0 ? (
                                <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 1200 }} size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow sx={{
                                                bgcolor: (theme) => theme.palette.mode === 'dark'
                                                    ? 'rgba(102, 126, 234, 0.15)'
                                                    : 'rgba(102, 126, 234, 0.08)'
                                            }}>
                                                <TableCell width="10%"><strong>Ticket ID</strong></TableCell>
                                                <TableCell width="23%"><strong>Summary</strong></TableCell>
                                                <TableCell width="8%"><strong>Type</strong></TableCell>
                                                <TableCell width="10%"><strong>Status</strong></TableCell>
                                                <TableCell width="7%"><strong>Story Points</strong></TableCell>
                                                <TableCell width="8%"><strong>Time Spent</strong></TableCell>
                                                <TableCell width="12%"><strong>Labels</strong></TableCell>
                                                <TableCell width="8%"><strong>Created</strong></TableCell>
                                                <TableCell width="8%"><strong>Updated</strong></TableCell>
                                                <TableCell width="8%"><strong>Due Date</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.issues.map((issue) => (
                                                <TableRow
                                                    key={issue.id}
                                                    hover
                                                    sx={{
                                                        '&:hover': {
                                                            bgcolor: (theme) => theme.palette.mode === 'dark'
                                                                ? 'rgba(102, 126, 234, 0.1)'
                                                                : 'rgba(102, 126, 234, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <MuiLink
                                                            href={issue.url || issue.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            underline="hover"
                                                            sx={{
                                                                fontWeight: 600,
                                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent'
                                                            }}
                                                        >
                                                            {issue.key}
                                                        </MuiLink>
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 350 }}>
                                                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                            {issue.summary}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={issue.issueType}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={issue.status}
                                                            size="small"
                                                            color={getStatusColor(issue.status)}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {issue.storyPoints || '-'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {issue.timeSpentHours?.toFixed(2) || 0} hrs
                                                    </TableCell>
                                                    <TableCell>
                                                        {issue.labels && issue.labels.length > 0 ? (
                                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                                {issue.labels.map((label, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={label}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{ fontSize: '0.7rem' }}
                                                                    />
                                                                ))}
                                                            </Box>
                                                        ) : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" noWrap>
                                                            {issue.created
                                                                ? format(new Date(issue.created), 'MMM dd, yyyy')
                                                                : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" noWrap>
                                                            {issue.updated
                                                                ? format(new Date(issue.updated), 'MMM dd, yyyy')
                                                                : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" noWrap>
                                                            {issue.dueDate
                                                                ? format(new Date(issue.dueDate), 'MMM dd, yyyy')
                                                                : '-'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        No issues found for the selected period
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </>
                )}

                {!loading && !data && (
                    <Paper sx={{ p: 4, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <Typography color="text.secondary">
                            Select a team, associate, and date range to view performance metrics
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}