import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import CapacityMetricCards from './CapacityMetricCards';
import StatusBreakdown from './StatusBreakdown';
import CapacityChart from './CapacityChart';
import TicketsTable from './TicketsTable';
import teamService from '../../services/teamService';
import capacityService from '../../services/capacityService';
import { useSnackbar } from 'notistack';

export default function CapacityView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const [loading, setLoading] = useState(false);
    const [capacityData, setCapacityData] = useState(null);
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
            const response = await capacityService.calculateFutureCapacity({
                teamId: selectedTeam,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
            });
            setCapacityData(response.data);
            enqueueSnackbar('Capacity data loaded successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to load capacity data',
                { variant: 'error' }
            );
            setCapacityData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
        }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Future Capacity Planning
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Analyze team capacity with estimates, time tracking, PTO, Holidays and remaining bandwidth
                </Typography>

                <Paper sx={{ p: 3, mb: 3, width: '100%', boxSizing: 'border-box' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Select Team"
                                value={selectedTeam}
                                onChange={(e) => {
                                    setSelectedTeam(e.target.value);
                                    setCapacityData(null);
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
                                    label="From Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="To Date"
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
                            >
                                Display
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {loading && <Loading message="Calculating capacity..." />}

                {capacityData && !loading && (
                    <>
                        {/* Metric Cards Section */}
                        <CapacityMetricCards summary={capacityData.summary} />

                        {/* Status Breakdown Section */}
                        <StatusBreakdown statusBreakdown={capacityData.statusBreakdown} />

                        {/* Capacity Chart Section */}
                        <CapacityChart teamMembers={capacityData.teamMembers} />

                        {/* Tickets Table Section */}
                        <TicketsTable issues={capacityData.issues} />
                    </>
                )}

                {!loading && !capacityData && (
                    <Paper sx={{ p: 4, textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                        <Typography color="text.secondary">
                            Select a team and date range to view future capacity planning
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}