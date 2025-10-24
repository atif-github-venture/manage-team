import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import teamService from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function TeamMembersModal({ open, onClose, team, onUpdate }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addMode, setAddMode] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        jiraAccountId: '',
    });
    const { isAdmin, user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const formRef = useRef(null);

    useEffect(() => {
        if (open && team) {
            loadMembers();
        }
    }, [open, team]);

    useEffect(() => {
        // Scroll to form when add/edit mode is activated
        if (addMode && formRef.current) {
            setTimeout(() => {
                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [addMode, editingMember]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const response = await teamService.getTeamMembers(team._id);
            const sortedMembers = (response.data || []).sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setMembers(sortedMembers);
        } catch (error) {
            enqueueSnackbar('Failed to load team members', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({ name: '', email: '', designation: '', jiraAccountId: '' });
        setEditingMember(null);
        setAddMode(true);
    };

    const handleEdit = (member) => {
        console.log('Editing member:', member);
        setFormData({
            name: member.name,
            email: member.email,
            designation: member.designation,
            jiraAccountId: member.jiraAccountId || '',
        });
        setEditingMember(member);
        setAddMode(true);
    };

    const handleDelete = (member) => {
        console.log('Deleting member:', member);
        setMemberToDelete(member);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // Use member's own _id
            const memberId = memberToDelete._id;
            await teamService.deleteTeamMember(team._id, memberId);
            await loadMembers(); // Reload after delete
            enqueueSnackbar('Member removed successfully', { variant: 'success' });
            onUpdate();
        } catch (error) {
            enqueueSnackbar('Failed to remove member', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setMemberToDelete(null);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email || !formData.designation || !formData.jiraAccountId) {
            enqueueSnackbar('All fields are required', { variant: 'warning' });
            return;
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                designation: formData.designation,
                jiraAccountId: formData.jiraAccountId,
            };

            let response;
            if (editingMember) {
                // Use member's own _id
                const memberId = editingMember._id;
                response = await teamService.updateTeamMember(team._id, memberId, payload);
                await loadMembers(); // Reload after update
                enqueueSnackbar('Member updated successfully', { variant: 'success' });
            } else {
                response = await teamService.addTeamMember(team._id, payload);
                await loadMembers(); // Reload after add
                enqueueSnackbar('Member added successfully', { variant: 'success' });
            }
            setAddMode(false);
            onUpdate();
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to save member',
                { variant: 'error' }
            );
        }
    };

    const handleCancel = () => {
        setAddMode(false);
        setEditingMember(null);
        setFormData({ name: '', email: '', designation: '', jiraAccountId: '' });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{team?.teamName} - Team Members</Typography>
                        <IconButton onClick={onClose} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Loading message="Loading members..." />
                    ) : (
                        <>
                            {addMode ? (
                                <Paper sx={{ p: 3, mb: 2 }} ref={formRef}>
                                    <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                        {editingMember ? 'Edit Member' : 'Add New Member'}
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Designation"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Jira Account ID"
                                        value={formData.jiraAccountId}
                                        onChange={(e) => setFormData({ ...formData, jiraAccountId: e.target.value })}
                                        margin="normal"
                                        required
                                    />
                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        <Button variant="contained" onClick={handleSave}>
                                            Save
                                        </Button>
                                        <Button onClick={handleCancel}>Cancel</Button>
                                    </Box>
                                </Paper>
                            ) : (
                                isAdmin && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={handleAdd}
                                        sx={{ mb: 2 }}
                                    >
                                        Add Member
                                    </Button>
                                )
                            )}

                            {members.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                                    No members in this team
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Designation</strong></TableCell>
                                                <TableCell><strong>Jira Account ID</strong></TableCell>
                                                {isAdmin && <TableCell align="right"><strong>Actions</strong></TableCell>}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {members.map((member, index) => (
                                                <TableRow key={member._id || index}>
                                                    <TableCell>{member.name}</TableCell>
                                                    <TableCell>{member.email}</TableCell>
                                                    <TableCell>{member.designation}</TableCell>
                                                    <TableCell>{member.jiraAccountId || '-'}</TableCell>
                                                    {isAdmin && (
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleEdit(member)}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(member)}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Remove Member"
                message={`Are you sure you want to remove ${memberToDelete?.name} from this team?`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialogOpen(false)}
            />
        </>
    );
}