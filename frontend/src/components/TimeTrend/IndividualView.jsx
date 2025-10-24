import { useState, useEffect } from 'react';
import {
    Box,
    Container,
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import MetricsTiles from './MetricsTiles';
import teamService from '../../services/teamService';
import timeTrendService from '../../services/timeTrendService';
import { useSnackbar } from 'notistack';

export default function IndividualView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [associates, setAssociates] = useState([]);
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
        if (!selectedTeam) {
            enqueueSnackbar('Please select a team', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const response = await timeTrendService.getIndividualView({
                teamId: selectedTeam,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
            });
            setData(response.data);
            enqueueSnackbar('Data loaded successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to load data', { variant: 'error' });
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Time Trend - Individual View
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    View individual performance metrics for all team members
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
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
                            >
                                Display
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {loading && <Loading message="Fetching individual data..." />}

                {data && !loading && (
                    <>
                        {data.individuals?.map((individual, index) => (
                            <Box key={index} sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    {individual.name}
                                </Typography>
                                <MetricsTiles metrics={individual.metrics} />

                                <Paper sx={{ p: 2, mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                        Tickets
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Ticket ID</TableCell>
                                                    <TableCell>Summary</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Time Spent</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {individual.tickets?.map((ticket) => (
                                                    <TableRow key={ticket.id}>
                                                        <TableCell>{ticket.key}</TableCell>
                                                        <TableCell>{ticket.summary?.substring(0, 50)}...</TableCell>
                                                        <TableCell>{ticket.status}</TableCell>
                                                        <TableCell>{ticket.timeSpent || 0}h</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        ))}
                    </>
                )}
            </Box>
        </Container>
    );
}