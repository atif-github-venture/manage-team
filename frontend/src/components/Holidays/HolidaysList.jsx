import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    MenuItem,
    Grid,
    Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import HolidayModal from './HolidayModal';
import holidayService from '../../services/holidayService';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function HolidaysList() {
    const [holidays, setHolidays] = useState([]);
    const [filteredHolidays, setFilteredHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedLocation, setSelectedLocation] = useState('US');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedHolidayName, setSelectedHolidayName] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState(null);
    const { isAdmin } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadHolidays();
    }, []);

    useEffect(() => {
        filterHolidays();
    }, [holidays, selectedYear, selectedLocation, selectedMonth, selectedHolidayName]);

    const loadHolidays = async () => {
        setLoading(true);
        try {
            const response = await holidayService.getAllHolidays();
            setHolidays(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load holidays', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filterHolidays = () => {
        let filtered = holidays.filter(
            (h) => h.year === selectedYear && h.location === selectedLocation
        );

        if (selectedMonth !== 'all') {
            filtered = filtered.filter((h) => new Date(h.date).getMonth() === parseInt(selectedMonth));
        }

        if (selectedHolidayName !== 'all') {
            filtered = filtered.filter((h) => h.holidayName === selectedHolidayName);
        }

        setFilteredHolidays(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    const handleAdd = () => {
        setEditingHoliday(null);
        setModalOpen(true);
    };

    const handleEdit = (holiday) => {
        setEditingHoliday(holiday);
        setModalOpen(true);
    };

    const handleDelete = (holiday) => {
        setHolidayToDelete(holiday);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await holidayService.deleteHoliday(holidayToDelete._id);
            setHolidays(holidays.filter((h) => h._id !== holidayToDelete._id));
            enqueueSnackbar('Holiday deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete holiday', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setHolidayToDelete(null);
        }
    };

    const handleSave = (holiday) => {
        if (editingHoliday) {
            setHolidays(holidays.map((h) => (h._id === holiday._id ? holiday : h)));
        } else {
            setHolidays([...holidays, holiday]);
        }
        setModalOpen(false);
    };

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
    const months = [
        { value: 'all', label: 'All Months' },
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' },
    ];

    const uniqueHolidayNames = ['all', ...new Set(
        holidays
            .filter((h) => h.year === selectedYear && h.location === selectedLocation)
            .map((h) => h.holidayName)
    )].sort();

    if (loading) return <Loading message="Loading holidays..." />;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Company Holidays
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage holidays for different locations and years
                        </Typography>
                    </div>
                    {isAdmin && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                            Add Holiday
                        </Button>
                    )}
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Location"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <MenuItem value="US">United States</MenuItem>
                                <MenuItem value="India">India</MenuItem>
                                <MenuItem value="Global">Global</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="Holiday Name"
                                value={selectedHolidayName}
                                onChange={(e) => setSelectedHolidayName(e.target.value)}
                            >
                                <MenuItem value="all">All Holidays</MenuItem>
                                {uniqueHolidayNames.filter(name => name !== 'all').map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Holiday Name</strong></TableCell>
                                <TableCell><strong>Location</strong></TableCell>
                                <TableCell><strong>Description</strong></TableCell>
                                {isAdmin && <TableCell align="right"><strong>Actions</strong></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredHolidays.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                                        <Typography color="text.secondary" sx={{ py: 3 }}>
                                            No holidays found for the selected filters
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredHolidays.map((holiday) => (
                                    <TableRow key={holiday._id}>
                                        <TableCell>
                                            {format(new Date(holiday.date), 'MMM dd, yyyy (EEEE)')}
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {holiday.holidayName} ({holiday.hours || 8} hrs)
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={holiday.location}
                                                size="small"
                                                color={
                                                    holiday.location === 'US'
                                                        ? 'primary'
                                                        : holiday.location === 'India'
                                                            ? 'secondary'
                                                            : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{holiday.description || '-'}</TableCell>
                                        {isAdmin && (
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEdit(holiday)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(holiday)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <HolidayModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    holiday={editingHoliday}
                    onSave={handleSave}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete Holiday"
                    message={`Are you sure you want to delete "${holidayToDelete?.holidayName}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Container>
    );
}