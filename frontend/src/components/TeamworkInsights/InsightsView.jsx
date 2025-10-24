import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Stack,
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import {
    AutoAwesome,
    ContentCopy,
    Download,
    Email,
    Assignment,
    TrendingUp,
    Timer,
    Speed,
    BeachAccess,
    EventAvailable
} from '@mui/icons-material';
import Loading from '../Common/Loading';
import teamService from '../../services/teamService';
import insightsService from '../../services/insightsService';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { StoryPointsChart, UtilizationChart } from './InsightsCharts';
import { MemberDetailDialog, EmailDialog } from './InsightsDialogs';
import { MetricCard, MemberCard, TeamSummarySection } from './InsightsComponents';

export default function InsightsView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailRecipients, setEmailRecipients] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [distributionLists, setDistributionLists] = useState([]);
    const [selectedDistList, setSelectedDistList] = useState('');
    const [emailInputMode, setEmailInputMode] = useState('manual');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
        loadDistributionLists();
    }, []);

    const loadTeams = async () => {
        try {
            const response = await teamService.getAllTeams();
            const teamsData = response.data || response || [];
            setTeams(Array.isArray(teamsData) ? teamsData : []);
        } catch (error) {
            enqueueSnackbar('Failed to load teams', { variant: 'error' });
            setTeams([]);
        }
    };

    const loadDistributionLists = async () => {
        try {
            const response = await api.get('/distribution-lists', {
                params: { status: 'active' }
            });
            setDistributionLists(response.data?.data || []);
        } catch (error) {
            console.error('Load distribution lists error:', error);
        }
    };

    const handleGenerate = async () => {
        if (!selectedTeam) {
            enqueueSnackbar('Please select a team', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await insightsService.generateTeamworkInsights({
                teamId: selectedTeam,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
            });

            setInsights(response.data);
            enqueueSnackbar('Insights generated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to generate insights',
                { variant: 'error' }
            );
            setInsights(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyHTML = async () => {
        if (!insights) {
            enqueueSnackbar('Please generate insights first', { variant: 'warning' });
            return;
        }

        try {
            const response = await insightsService.exportInsightsHTML(insights);
            await navigator.clipboard.writeText(response.data.html);
            enqueueSnackbar('HTML copied to clipboard', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to copy HTML', { variant: 'error' });
        }
    };

    const handleDownloadHTML = async () => {
        if (!insights) {
            enqueueSnackbar('Please generate insights first', { variant: 'warning' });
            return;
        }

        try {
            const response = await insightsService.exportInsightsHTML(insights);
            const blob = new Blob([response.data.html], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `team-insights-${insights.teamName.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            enqueueSnackbar('HTML downloaded successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to download HTML', { variant: 'error' });
        }
    };

    const handleSendEmail = async () => {
        if (!insights) {
            enqueueSnackbar('Please generate insights first', { variant: 'warning' });
            return;
        }

        let recipients = [];

        if (emailInputMode === 'list' && selectedDistList) {
            const distList = distributionLists.find(dl => dl._id === selectedDistList);
            if (distList) {
                recipients = distList.emails;
            }
        } else {
            if (!emailRecipients.trim()) {
                enqueueSnackbar('Please enter at least one email address', { variant: 'warning' });
                return;
            }
            recipients = emailRecipients.split(',').map(email => email.trim()).filter(email => email);
        }

        if (recipients.length === 0) {
            enqueueSnackbar('No valid email addresses found', { variant: 'warning' });
            return;
        }

        setSendingEmail(true);
        try {
            await insightsService.emailInsights({
                insights,
                recipients,
                teamName: insights.teamName,
                dateRange: {
                    startDate: format(startDate, 'yyyy-MM-dd'),
                    endDate: format(endDate, 'yyyy-MM-dd')
                }
            });

            enqueueSnackbar('Email sent successfully', { variant: 'success' });
            setEmailDialogOpen(false);
            setEmailRecipients('');
            setSelectedDistList('');
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to send email',
                { variant: 'error' }
            );
        } finally {
            setSendingEmail(false);
        }
    };

    const handleCopyMemberDetails = () => {
        if (!selectedMember) return;

        const details = `
Name: ${selectedMember.name}
Email: ${selectedMember.email}
Issues Completed: ${selectedMember.metrics.issuesCompleted}
Story Points: ${selectedMember.metrics.storyPoints}
Utilization: ${selectedMember.metrics.utilization.toFixed(1)}%
Burn Rate: ${selectedMember.metrics.storyBurnRate.toFixed(2)}

AI Summary:
${selectedMember.aiSummary}

Completed Tickets:
${selectedMember.tickets.map(t => `- ${t.key}: ${t.summary}`).join('\n')}
        `.trim();

        navigator.clipboard.writeText(details);
        enqueueSnackbar('Details copied to clipboard', { variant: 'success' });
    };

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
                        <Typography variant="h4" gutterBottom fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
                            ✨ AI-Powered Team Insights
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Generate comprehensive team performance analysis with AI-driven insights
                        </Typography>
                    </Box>
                </Box>

                <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Select Team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setInsights(null);
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
                        <Grid item xs={12} md={3}>
                            <Stack direction="row" spacing={1} height="100%">
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    startIcon={<AutoAwesome />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                        }
                                    }}
                                >
                                    Generate
                                </Button>
                                {insights && (
                                    <>
                                        <Tooltip title="Copy HTML">
                                            <IconButton
                                                onClick={handleCopyHTML}
                                                sx={{
                                                    border: 2,
                                                    borderColor: 'primary.main',
                                                    '&:hover': { bgcolor: 'primary.lighter' }
                                                }}
                                            >
                                                <ContentCopy />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download HTML">
                                            <IconButton
                                                onClick={handleDownloadHTML}
                                                sx={{
                                                    border: 2,
                                                    borderColor: 'primary.main',
                                                    '&:hover': { bgcolor: 'primary.lighter' }
                                                }}
                                            >
                                                <Download />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Send Email">
                                            <IconButton
                                                onClick={() => setEmailDialogOpen(true)}
                                                sx={{
                                                    border: 2,
                                                    borderColor: 'primary.main',
                                                    '&:hover': { bgcolor: 'primary.lighter' }
                                                }}
                                            >
                                                <Email />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {loading && <Loading message="Generating AI insights..." />}

                {insights && !loading && (
                    <>
                        {/* Team Overview Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                📊 Team Overview
                            </Typography>
                            <Chip
                                label={insights.teamName}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        <Grid container spacing={2} mb={4}>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Assignment}
                                    label="Total Issues"
                                    value={insights.teamMetrics.totalIssuesCompleted}
                                    color="#667eea"
                                    subtitle="Completed"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={TrendingUp}
                                    label="Story Points"
                                    value={insights.teamMetrics.totalStoryPoints}
                                    color="#764ba2"
                                    subtitle="Delivered"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Timer}
                                    label="Utilization"
                                    value={`${insights.teamMetrics.teamUtilization.toFixed(1)}%`}
                                    color="#43e97b"
                                    subtitle="Average"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Speed}
                                    label="Burn Rate"
                                    value={insights.teamMetrics.teamBurnRate.toFixed(2)}
                                    color="#fa709a"
                                    subtitle="Points/Hour"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Timer}
                                    label="Time Spent"
                                    value={`${insights.teamMetrics.totalTimeSpent?.toFixed(1) || 0}h`}
                                    color="#2196F3"
                                    subtitle="Total Hours"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Timer}
                                    label="Time Estimate"
                                    value={`${insights.teamMetrics.totalEstimate?.toFixed(1) || 0}h`}
                                    color="#FF5722"
                                    subtitle="Original Estimate"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Timer}
                                    label="Working Hours"
                                    value={`${insights.teamMetrics.totalWorkingHours?.toFixed(1) || 0}h`}
                                    color="#9C27B0"
                                    subtitle="Available"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={BeachAccess}
                                    label="PTO Hours"
                                    value={`${insights.teamMetrics.totalPtoHours?.toFixed(1) || 0}h`}
                                    color="#30cfd0"
                                    subtitle="Team PTO"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={EventAvailable}
                                    label="Holiday Hours"
                                    value={`${insights.teamMetrics.totalHolidayHours?.toFixed(1) || 0}h`}
                                    color="#FF6B6B"
                                    subtitle="Company Holidays"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <MetricCard
                                    icon={Speed}
                                    label="Time Actual/Estimate"
                                    value={insights.teamMetrics.timeActualVsEstimate?.toFixed(2) || 0}
                                    color="#00BCD4"
                                    subtitle="Accuracy Ratio"
                                />
                            </Grid>
                        </Grid>

                        {/* AI Team Summary */}
                        <TeamSummarySection teamSummary={insights.teamSummary} />

                        {/* Charts Section */}
                        <Grid container spacing={3} mb={4}>
                            <StoryPointsChart
                                members={insights.members}
                                totalStoryPoints={insights.teamMetrics.totalStoryPoints}
                            />
                            <UtilizationChart members={insights.members} />
                        </Grid>

                        {/* Individual Contributors */}
                        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
                            👥 Individual Contributions
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Click on any team member to view detailed information
                        </Typography>

                        <Grid container spacing={3}>
                            {insights.members.map((member) => (
                                <Grid item xs={12} sm={6} md={4} key={member.userId}>
                                    <MemberCard
                                        member={member}
                                        onClick={() => setSelectedMember(member)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {!loading && !insights && (
                    <Paper sx={{
                        p: 6,
                        textAlign: 'center',
                        bgcolor: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(102, 126, 234, 0.1)'
                            : 'rgba(102, 126, 234, 0.05)',
                        borderRadius: 3,
                        border: '2px dashed',
                        borderColor: 'primary.main'
                    }}>
                        <AutoAwesome sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" color="text.primary" mb={1} fontWeight={600}>
                            No insights generated yet
                        </Typography>
                        <Typography color="text.secondary">
                            Select a team and date range, then click Generate to view AI-powered insights
                        </Typography>
                    </Paper>
                )}
            </Box>

            <MemberDetailDialog
                member={selectedMember}
                open={!!selectedMember}
                onClose={() => setSelectedMember(null)}
                onCopy={handleCopyMemberDetails}
            />

            <EmailDialog
                open={emailDialogOpen}
                onClose={() => setEmailDialogOpen(false)}
                onSend={handleSendEmail}
                sending={sendingEmail}
                emailInputMode={emailInputMode}
                setEmailInputMode={setEmailInputMode}
                emailRecipients={emailRecipients}
                setEmailRecipients={setEmailRecipients}
                selectedDistList={selectedDistList}
                setSelectedDistList={setSelectedDistList}
                distributionLists={distributionLists}
            />
        </Box>
    );
}