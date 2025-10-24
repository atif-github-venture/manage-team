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
} from '@mui/material';
import { Add, Edit, Delete, VpnKey } from '@mui/icons-material';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import UserModal from './UserModal';
import userService from '../../services/userService';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data || []); // Extract data from response
        } catch (error) {
            enqueueSnackbar('Failed to load users', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await userService.deleteUser(userToDelete._id);
            setUsers(users.filter((u) => u._id !== userToDelete._id));
            enqueueSnackbar('User deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete user', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const handleSave = (user) => {
        if (editingUser) {
            setUsers(users.map((u) => (u._id === user._id ? user : u)));
        } else {
            setUsers([...users, user]);
        }
        setModalOpen(false);
        loadUsers(); // Reload to get fresh data
    };

    const handleToggleRole = async (user) => {
        try {
            const newRole = user.role === 'admin' ? 'viewer' : 'admin';
            const response = await userService.updateUserRole(user._id, newRole);
            setUsers(users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
            enqueueSnackbar(response.message || `User role updated to ${newRole}`, { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update role', { variant: 'error' });
        }
    };

    if (loading) return <Loading message="Loading users..." />;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Manage Users
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Admin-only: Manage user accounts and roles
                        </Typography>
                    </div>
                    <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                        Add User
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Last Login</strong></TableCell>
                                <TableCell align="right"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="text.secondary" sx={{ py: 3 }}>
                                            No users found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {user.firstName} {user.lastName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                color={user.role === 'admin' ? 'error' : 'default'}
                                                onClick={() => handleToggleRole(user)}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.active ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={user.active ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLogin
                                                ? format(new Date(user.lastLogin), 'MMM dd, yyyy')
                                                : 'Never'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(user)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <UserModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    user={editingUser}
                    onSave={handleSave}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete User"
                    message={`Are you sure you want to delete "${userToDelete?.email}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Container>
    );
}