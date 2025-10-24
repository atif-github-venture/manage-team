import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import teamService from '../../services/teamService';
import { useSnackbar } from 'notistack';
import { useConstants } from '../../context/ConstantsContext';

export default function TeamModal({ open, onClose, team, onSave }) {
    const { constants } = useConstants();
    const [formData, setFormData] = useState({
        teamId: '',
        teamName: '',
        description: '',
        jiraProject: '',
        location: 'US',
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (team) {
            setFormData({
                teamId: team.teamId || '',
                teamName: team.teamName || '',
                description: team.description || '',
                jiraProject: team.jiraProject || '',
                location: team.location || 'US',
            });
        } else {
            setFormData({
                teamId: '',
                teamName: '',
                description: '',
                jiraProject: '',
                location: 'US',
            });
        }
    }, [team, open]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.teamId || !formData.teamName) {
            enqueueSnackbar('Team ID and Name are required', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let response;
            if (team) {
                response = await teamService.updateTeam(team._id, formData);
            } else {
                response = await teamService.createTeam(formData);
            }

            onSave(response.data);
            enqueueSnackbar(
                `Team ${team ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${team ? 'update' : 'create'} team`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{team ? 'Edit Team' : 'Add Team'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Team ID"
                    value={formData.teamId}
                    onChange={(e) => handleChange('teamId', e.target.value)}
                    margin="normal"
                    required
                    disabled={!!team}
                />
                <TextField
                    fullWidth
                    label="Team Name"
                    value={formData.teamName}
                    onChange={(e) => handleChange('teamName', e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                />
                <TextField
                    fullWidth
                    label="Jira Project Key"
                    value={formData.jiraProject}
                    onChange={(e) => handleChange('jiraProject', e.target.value)}
                    margin="normal"
                    placeholder="e.g., PROJ"
                />
                <TextField
                    fullWidth
                    select
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    margin="normal"
                    required
                >
                    {constants && Object.entries(constants.LOCATIONS).map(([key, value]) => (
                        <MenuItem key={value} value={value}>
                            {key === 'US' ? 'United States' : key === 'INDIA' ? 'India' : 'Global'}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}