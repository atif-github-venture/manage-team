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
    Chip,
    Tooltip,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import DistributionListModal from './DistributionListModal';
import { useAuth } from '../../hooks/useAuth';
import distributionListService from '../../services/distributionListService';

export default function DistributionListsPage() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const { enqueueSnackbar } = useSnackbar();

    const { isAdmin } = useAuth();

    useEffect(() => {
        loadDistributionLists();
    }, [statusFilter]);

    const loadDistributionLists = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const response = await distributionListService.getAll(params);
            setLists(response.data.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load distribution lists', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedList(null);
        setModalOpen(true);
    };

    const handleEdit = (list) => {
        if (!isAdmin) return;
        setSelectedList(list);
        setModalOpen(true);
    };

    const handleDeleteClick = (list) => {
        if (!isAdmin) return;
        setListToDelete(list);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await distributionListService.delete(listToDelete._id);
            enqueueSnackbar('Distribution list deleted successfully', { variant: 'success' });
            loadDistributionLists();
            setDeleteDialogOpen(false);
            setListToDelete(null);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to delete distribution list', {
                variant: 'error',
            });
        }
    };

    const handleModalClose = (refresh = false) => {
        setModalOpen(false);
        setSelectedList(null);
        if (refresh) {
            loadDistributionLists();
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Distribution Lists
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage email distribution lists for reports and notifications
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        size="large"
                    >
                        Add Distribution List
                    </Button>
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <TextField
                        select
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                </Paper>

                {loading ? (
                    <Loading message="Loading distribution lists..." />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Purpose</strong></TableCell>
                                    <TableCell><strong>Emails</strong></TableCell>
                                    <TableCell><strong>Team</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Created By</strong></TableCell>
                                    {isAdmin && <TableCell align="right"><strong>Actions</strong></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lists.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                No distribution lists found. Click "Add Distribution List" to create one.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    lists.map((list) => (
                                        <TableRow key={list._id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {list.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {list.purpose}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={list.emails.join(', ')}>
                                                    <Chip
                                                        icon={<EmailIcon />}
                                                        label={`${list.emails.length} email${list.emails.length > 1 ? 's' : ''}`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                {list.teamId ? (
                                                    <Chip
                                                        label={list.teamId.teamName}
                                                        size="small"
                                                        color="secondary"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={list.status}
                                                    size="small"
                                                    color={list.status === 'active' ? 'success' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {list.createdBy?.firstName} {list.createdBy?.lastName}
                                                </Typography>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell align="right">
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEdit(list)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteClick(list)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            <DistributionListModal
                open={modalOpen}
                onClose={handleModalClose}
                distributionList={selectedList}
                isAdmin={isAdmin}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Distribution List"
                message={`Are you sure you want to delete "${listToDelete?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setListToDelete(null);
                }}
            />
        </Container>
    );
}