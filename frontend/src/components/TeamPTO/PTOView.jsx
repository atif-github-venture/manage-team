import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Chip,
    Stack,
    Avatar,
    InputAdornment,
} from '@mui/material';
import { Add, Edit, Delete, Search, Person, CalendarMonth, Category } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import PTOModal from './PTOModal';
import teamService from '../../services/teamService';
import ptoService from '../../services/ptoService';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';

const TYPE_COLORS = {
    vacation: 'success',
    sick: 'error',
    personal: 'info',
    other: 'default',
};

const TYPE_LABELS = {
    vacation: 'Vacation',
    sick: 'Sick Leave',
    personal: 'Personal',
    other: 'Other',
};

export default function PTOView() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [ptos, setPtos] = useState([]);
    const [filteredPtos, setFilteredPtos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPTO, setEditingPTO] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ptoToDelete, setPtoToDelete] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        month: null,
        type: '',
    });
    const { isAdmin } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            loadPTOs();
        }
    }, [selectedTeam]);

    useEffect(() => {
        applyFilters();
    }, [ptos, filters]);

    const loadTeams = async () => {
        try {
            const response = await teamService.getAllTeams();
            setTeams(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load teams', { variant: 'error' });
        }
    };

    const loadPTOs = async () => {
        setLoading(true);
        try {
            const response = await ptoService.getPTOsByTeam(selectedTeam);
            console.log('PTOs response:', response.data);
            const sorted = (response.data || []).sort((a, b) =>
                new Date(b.startDate) - new Date(a.startDate)
            );
            setPtos(sorted);
        } catch (error) {
            console.error('Load PTOs error:', error);
            enqueueSnackbar('Failed to load PTOs', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...ptos];

        // Filter by name
        if (filters.name) {
            filtered = filtered.filter((pto) => {
                const fullName = `${pto.userId?.firstName || ''} ${pto.userId?.lastName || ''}`.toLowerCase();
                return fullName.includes(filters.name.toLowerCase());
            });
        }

        // Filter by month
        if (filters.month) {
            const monthStart = startOfMonth(filters.month);
            const monthEnd = endOfMonth(filters.month);
            filtered = filtered.filter((pto) => {
                const ptoStart = new Date(pto.startDate);
                const ptoEnd = new Date(pto.endDate);
                return (
                    (ptoStart >= monthStart && ptoStart <= monthEnd) ||
                    (ptoEnd >= monthStart && ptoEnd <= monthEnd) ||
                    (ptoStart <= monthStart && ptoEnd >= monthEnd)
                );
            });
        }

        // Filter by type
        if (filters.type) {
            filtered = filtered.filter((pto) => pto.type === filters.type);
        }

        setFilteredPtos(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            month: null,
            type: '',
        });
    };

    const handleAdd = () => {
        setEditingPTO(null);
        setModalOpen(true);
    };

    const handleEdit = (pto) => {
        setEditingPTO(pto);
        setModalOpen(true);
    };

    const handleDelete = (pto) => {
        setPtoToDelete(pto);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await ptoService.deletePTO(ptoToDelete._id);
            setPtos(ptos.filter((p) => p._id !== ptoToDelete._id));
            enqueueSnackbar('PTO deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete PTO', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setPtoToDelete(null);
        }
    };

    const handleSave = (pto) => {
        if (editingPTO) {
            setPtos(ptos.map((p) => (p._id === pto._id ? pto : p)));
        } else {
            setPtos([pto, ...ptos]);
        }
        setModalOpen(false);
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getCumulativePTOByPerson = () => {
        const personMap = {};

        filteredPtos.forEach((pto) => {
            const userId = pto.userId?._id;
            const firstName = pto.userId?.firstName || '';
            const lastName = pto.userId?.lastName || '';
            const duration = pto.duration || 0;

            if (userId) {
                if (!personMap[userId]) {
                    personMap[userId] = {
                        firstName,
                        lastName,
                        totalHours: 0,
                    };
                }
                personMap[userId].totalHours += duration;
            }
        });

        return Object.values(personMap).sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
    };

    const cumulativePTOs = getCumulativePTOByPerson();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <div>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Team PTO
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage paid time off for team members
                        </Typography>
                    </div>
                    {selectedTeam && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                            Add PTO
                        </Button>
                    )}
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <TextField
                        select
                        fullWidth
                        label="Select Team"
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Select a team</em>
                        </MenuItem>
                        {teams.map((team) => (
                            <MenuItem key={team._id} value={team._id}>
                                {team.teamName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Paper>

                {selectedTeam && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Search by Name"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Filter by Month"
                                        views={['month', 'year']}
                                        value={filters.month}
                                        onChange={(date) => handleFilterChange('month', date)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CalendarMonth />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Filter by Type"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Category />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    <MenuItem value="vacation">Vacation</MenuItem>
                                    <MenuItem value="sick">Sick Leave</MenuItem>
                                    <MenuItem value="personal">Personal</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={clearFilters}
                                    sx={{ height: '56px' }}
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {selectedTeam && cumulativePTOs.length > 0 && (
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Cumulative PTO Hours
                        </Typography>
                        <Grid container spacing={2}>
                            {cumulativePTOs.map((person, index) => {
                                const totalPeople = cumulativePTOs.length;
                                const peoplePerRow = Math.min(totalPeople, 8);
                                const gridSize = 12 / peoplePerRow;

                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={gridSize} key={index}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 2,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                borderLeft: 4,
                                                borderColor: 'primary.main',
                                            }}
                                        >
                                            <Typography variant="body1" fontWeight={600} noWrap>
                                                {person.firstName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {person.lastName}
                                            </Typography>
                                            <Typography variant="h5" color="primary" fontWeight={700}>
                                                {person.totalHours} hrs
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Paper>
                )}

                {loading && <Loading message="Loading PTOs..." />}

                {!loading && selectedTeam && (
                    <Stack spacing={2}>
                        {filteredPtos.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    {ptos.length === 0
                                        ? 'No PTOs found for this team'
                                        : 'No PTOs match the current filters'}
                                </Typography>
                            </Paper>
                        ) : (
                            filteredPtos.map((pto) => (
                                <Paper
                                    key={pto._id}
                                    elevation={1}
                                    sx={{
                                        p: 2.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2.5,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            elevation: 3,
                                            boxShadow: 3,
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    {/* Avatar */}
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            bgcolor: 'primary.main',
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {getInitials(pto.userId?.firstName, pto.userId?.lastName)}
                                    </Avatar>

                                    {/* Main Content */}
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Typography variant="h6" fontWeight={600} noWrap>
                                                {pto.userId?.firstName} {pto.userId?.lastName}
                                            </Typography>
                                            <Chip
                                                label={TYPE_LABELS[pto.type]}
                                                size="small"
                                                color={TYPE_COLORS[pto.type]}
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>From:</strong> {format(new Date(pto.startDate), 'MMM dd, yyyy')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>To:</strong> {format(new Date(pto.endDate), 'MMM dd, yyyy')}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Duration:</strong> {pto.duration || 0} hrs
                                            </Typography>
                                        </Box>

                                        {pto.message && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mt: 1,
                                                    fontStyle: 'italic',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {pto.message}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Actions */}
                                    {isAdmin && (
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEdit(pto)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'primary.lighter',
                                                    },
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(pto)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'error.lighter',
                                                    },
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Paper>
                            ))
                        )}
                    </Stack>
                )}

                {!loading && !selectedTeam && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Please select a team to view PTOs
                        </Typography>
                    </Paper>
                )}

                <PTOModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    pto={editingPTO}
                    teamId={selectedTeam}
                    onSave={handleSave}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete PTO"
                    message="Are you sure you want to delete this PTO entry?"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Container>
    );
}