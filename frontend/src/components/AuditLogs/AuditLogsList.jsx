import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    TextField,
    MenuItem,
    Grid,
    Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { Refresh } from '@mui/icons-material';
import Loading from '../Common/Loading';
import api from '../../services/api';
import { useSnackbar } from 'notistack';

const ACTION_COLORS = {
    CREATE: 'success',
    UPDATE: 'info',
    DELETE: 'error',
    LOGIN: 'primary',
    LOGOUT: 'default',
    VIEW: 'default',
    EXPORT: 'warning',
};

export default function AuditLogsList() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        action: '',
        resourceType: '',
        startDate: null,
        endDate: null,
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadLogs();
    }, [page, rowsPerPage]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
            };

            if (filters.action) params.action = filters.action;
            if (filters.resourceType) params.resourceType = filters.resourceType;
            if (filters.startDate) params.startDate = format(filters.startDate, 'yyyy-MM-dd');
            if (filters.endDate) params.endDate = format(filters.endDate, 'yyyy-MM-dd');

            const response = await api.get('/audit-logs', { params });
            setLogs(response.data.data || []);
            setTotal(response.data.pagination?.total || 0);
        } catch (error) {
            enqueueSnackbar('Failed to load audit logs', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleApplyFilters = () => {
        setPage(0);
        loadLogs();
    };

    const handleClearFilters = () => {
        setFilters({
            action: '',
            resourceType: '',
            startDate: null,
            endDate: null,
        });
        setPage(0);
        setTimeout(loadLogs, 100);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading && logs.length === 0) {
        return <Loading message="Loading audit logs..." />;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Audit Logs
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Track all system activities and changes
                        </Typography>
                    </div>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadLogs}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Filters
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Action"
                                value={filters.action}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                            >
                                <MenuItem value="">All Actions</MenuItem>
                                <MenuItem value="CREATE">Create</MenuItem>
                                <MenuItem value="UPDATE">Update</MenuItem>
                                <MenuItem value="DELETE">Delete</MenuItem>
                                <MenuItem value="LOGIN">Login</MenuItem>
                                <MenuItem value="LOGOUT">Logout</MenuItem>
                                <MenuItem value="VIEW">View</MenuItem>
                                <MenuItem value="EXPORT">Export</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Resource Type"
                                value={filters.resourceType}
                                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                            >
                                <MenuItem value="">All Resources</MenuItem>
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="Team">Team</MenuItem>
                                <MenuItem value="TeamMember">Team Member</MenuItem>
                                <MenuItem value="Holiday">Holiday</MenuItem>
                                <MenuItem value="PTO">PTO</MenuItem>
                                <MenuItem value="EmailSchedule">Email Schedule</MenuItem>
                                <MenuItem value="Settings">Settings</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={filters.startDate}
                                    onChange={(date) => handleFilterChange('startDate', date)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={filters.endDate}
                                    onChange={(date) => handleFilterChange('endDate', date)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleApplyFilters}
                                    disabled={loading}
                                >
                                    Apply
                                </Button>
                                <Button variant="outlined" onClick={handleClearFilters}>
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Timestamp</strong></TableCell>
                                <TableCell><strong>User</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                                <TableCell><strong>Resource</strong></TableCell>
                                <TableCell><strong>Details</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>IP Address</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography color="text.secondary" sx={{ py: 3 }}>
                                            No audit logs found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log._id}>
                                        <TableCell>
                                            {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            {log.userId?.firstName && log.userId?.lastName
                                                ? `${log.userId.firstName} ${log.userId.lastName}`
                                                : log.userId?.email || 'System'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.action}
                                                size="small"
                                                color={ACTION_COLORS[log.action] || 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>{log.resourceType}</TableCell>
                                        <TableCell sx={{ maxWidth: 300 }}>
                                            <Typography variant="body2" noWrap>
                                                {log.details || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.status}
                                                size="small"
                                                color={log.status === 'success' ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {log.ipAddress || '-'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
        </Container>
    );
}