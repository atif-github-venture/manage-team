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
    Card,
    CardContent,
    CardActions,
    IconButton,
    Chip,
} from '@mui/material';
import { Add, Edit, Delete, Code } from '@mui/icons-material';
import { format } from 'date-fns';
import Loading from '../Common/Loading';
import ConfirmDialog from '../Common/ConfirmDialog';
import JQLModal from './JQLModal';
import teamService from '../../services/teamService';
import jiraQueryService from '../../services/jiraQueryService';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function TeamJQLs() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [jqls, setJqls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingJQL, setEditingJQL] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [jqlToDelete, setJqlToDelete] = useState(null);
    const { isAdmin } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            loadJQLs();
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

    const loadJQLs = async () => {
        setLoading(true);
        try {
            const response = await jiraQueryService.getJQLsByTeam(selectedTeam);
            setJqls(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load JQL queries', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingJQL(null);
        setModalOpen(true);
    };

    const handleEdit = (jql) => {
        setEditingJQL(jql);
        setModalOpen(true);
    };

    const handleDelete = (jql) => {
        setJqlToDelete(jql);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await jiraQueryService.deleteJQL(jqlToDelete._id);
            setJqls(jqls.filter((j) => j._id !== jqlToDelete._id));
            enqueueSnackbar('JQL query deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete JQL query', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setJqlToDelete(null);
        }
    };

    const handleSave = (jql) => {
        if (editingJQL) {
            setJqls(jqls.map((j) => (j._id === jql._id ? jql : j)));
        } else {
            setJqls([jql, ...jqls]);
        }
        setModalOpen(false);
    };

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
                            Team JQLs
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage Jira Query Language (JQL) queries for teams
                        </Typography>
                    </div>
                    {isAdmin && selectedTeam && (
                        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
                            Add JQL
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

                {loading && <Loading message="Loading JQL queries..." />}

                {!loading && selectedTeam && (
                    <Grid container spacing={3}>
                        {jqls.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        No JQL queries found for this team.{' '}
                                        {isAdmin && 'Click "Add JQL" to create one.'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            jqls.map((jql) => (
                                <Grid item xs={12} md={6} key={jql._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'space-between',
                                                    mb: 2,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Code color="primary" />
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {jql.jqlKey}
                                                    </Typography>
                                                </Box>
                                                {isAdmin && (
                                                    <Box>
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEdit(jql)}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(jql)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    whiteSpace: 'pre-line'
                                                }}
                                            >
                                                {jql.description}
                                            </Typography>

                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                                                    borderRadius: 1,
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.85rem',
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                    }}
                                                >
                                                    {jql.jql}
                                                </Typography>
                                            </Paper>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Created: {format(new Date(jql.createdAt), 'MMM dd, yyyy')}
                                                </Typography>
                                                {jql.updatedAt && jql.createdAt !== jql.updatedAt && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Modified: {format(new Date(jql.updatedAt), 'MMM dd, yyyy')}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

                {!loading && !selectedTeam && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Please select a team to view JQL queries
                        </Typography>
                    </Paper>
                )}

                <JQLModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    jql={editingJQL}
                    teamId={selectedTeam}
                    onSave={handleSave}
                />

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete JQL Query"
                    message={`Are you sure you want to delete "${jqlToDelete?.jqlKey}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
            </Box>
        </Container>
    );
}