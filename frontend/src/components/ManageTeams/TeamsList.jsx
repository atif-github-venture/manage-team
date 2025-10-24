import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    IconButton,
    Chip,
    Stack,
} from '@mui/material';
import { Add, Edit, Delete, People, LocationOn } from '@mui/icons-material';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import TeamModal from './TeamModal';
import TeamMembersModal from './TeamMembersModal';
import teamService from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useConstants } from '../../context/ConstantsContext';

export default function TeamsList() {
    const { constants } = useConstants();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [membersModalOpen, setMembersModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const { isAdmin } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        setLoading(true);
        try {
            const response = await teamService.getAllTeams();
            setTeams(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load teams', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTeam(null);
        setModalOpen(true);
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setModalOpen(true);
    };

    const handleDelete = (team) => {
        setTeamToDelete(team);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await teamService.deleteTeam(teamToDelete._id);
            setTeams(teams.filter((t) => t._id !== teamToDelete._id));
            enqueueSnackbar('Team deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete team', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setTeamToDelete(null);
        }
    };

    const handleSave = (team) => {
        if (editingTeam) {
            setTeams(teams.map((t) => (t._id === team._id ? team : t)));
        } else {
            setTeams([...teams, team]);
        }
        setModalOpen(false);
    };

    const handleViewMembers = (team) => {
        setSelectedTeam(team);
        setMembersModalOpen(true);
    };

    if (loading) return <Loading message="Loading teams..." />;

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h4" gutterBottom fontWeight={600}>
                            Manage Teams
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create, update, and manage teams and their members
                        </Typography>
                    </div>
                    {isAdmin && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                            Add Team
                        </Button>
                    )}
                </Box>

                <Grid container spacing={3}>
                    {teams.map((team) => (
                        <Grid item xs={12} md={6} lg={4} key={team._id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {team.teamName}
                                        </Typography>
                                        <Chip
                                            label={`${team.members?.length || 0} members`}
                                            size="small"
                                            color="primary"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {team.description || 'No description'}
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                        {team.jiraProject && (
                                            <Chip label={`Jira: ${team.jiraProject}`} size="small" variant="outlined" />
                                        )}
                                        {team.location && constants && (
                                            <Chip
                                                icon={<LocationOn />}
                                                label={
                                                    team.location === constants.LOCATIONS.US ? 'United States' :
                                                        team.location === constants.LOCATIONS.INDIA ? 'India' :
                                                            'Global'
                                                }
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                            />
                                        )}
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                    <Button
                                        size="small"
                                        startIcon={<People />}
                                        onClick={() => handleViewMembers(team)}
                                    >
                                        View Members
                                    </Button>
                                    {isAdmin && (
                                        <Box>
                                            <IconButton size="small" color="primary" onClick={() => handleEdit(team)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(team)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {teams.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No teams found. {isAdmin && 'Click "Add Team" to create one.'}
                        </Typography>
                    </Paper>
                )}

                <TeamModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    team={editingTeam}
                    onSave={handleSave}
                />

                <TeamMembersModal
                    open={membersModalOpen}
                    onClose={() => setMembersModalOpen(false)}
                    team={selectedTeam}
                    onUpdate={loadTeams}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete Team"
                    message={`Are you sure you want to delete "${teamToDelete?.teamName}"? This will remove all team members.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Container>
    );
}