import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Typography,
    Chip,
    Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import distributionListService from '../../services/distributionListService';
import teamService from '../../services/teamService';

export default function DistributionListModal({ open, onClose, distributionList, isAdmin }) {
    const [formData, setFormData] = useState({
        name: '',
        purpose: '',
        emails: '',
        status: 'active',
        teamId: '',
        description: '',
    });
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    const isEditMode = Boolean(distributionList);

    useEffect(() => {
        loadTeams();
    }, []);

    useEffect(() => {
        if (distributionList) {
            setFormData({
                name: distributionList.name || '',
                purpose: distributionList.purpose || '',
                emails: distributionList.emails?.join('\n') || '',
                status: distributionList.status || 'active',
                teamId: distributionList.teamId?._id || '',
                description: distributionList.description || '',
            });
        } else {
            resetForm();
        }
    }, [distributionList, open]);

    const loadTeams = async () => {
        try {
            const response = await teamService.getAllTeams();
            setTeams(response.data || []);
        } catch (error) {
            console.error('Failed to load teams:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            purpose: '',
            emails: '',
            status: 'active',
            teamId: '',
            description: '',
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.purpose.trim()) {
            newErrors.purpose = 'Purpose is required';
        }

        if (!formData.emails.trim()) {
            newErrors.emails = 'At least one email is required';
        } else {
            const emailArray = formData.emails
                .split(/[\n,;]+/)
                .map(e => e.trim())
                .filter(e => e);

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const invalidEmails = emailArray.filter(email => !emailRegex.test(email));

            if (invalidEmails.length > 0) {
                newErrors.emails = `Invalid email format: ${invalidEmails.join(', ')}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const emailArray = formData.emails
                .split(/[\n,;]+/)
                .map(e => e.trim())
                .filter(e => e);

            const payload = {
                name: formData.name.trim(),
                purpose: formData.purpose.trim(),
                emails: emailArray,
                status: formData.status,
                teamId: formData.teamId || null,
                description: formData.description.trim(),
            };

            if (isEditMode) {
                await distributionListService.update(distributionList._id, payload);
                enqueueSnackbar('Distribution list updated successfully', { variant: 'success' });
            } else {
                await distributionListService.create(payload);
                enqueueSnackbar('Distribution list created successfully', { variant: 'success' });
            }

            onClose(true);
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} distribution list`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: undefined,
            });
        }
    };

    const handleStatusChange = (event) => {
        setFormData({
            ...formData,
            status: event.target.checked ? 'active' : 'inactive',
        });
    };

    const getEmailCount = () => {
        if (!formData.emails.trim()) return 0;
        return formData.emails
            .split(/[\n,;]+/)
            .map(e => e.trim())
            .filter(e => e).length;
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditMode ? 'Edit Distribution List' : 'Add Distribution List'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            required
                            disabled={isEditMode && !isAdmin}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Purpose"
                            value={formData.purpose}
                            onChange={handleChange('purpose')}
                            error={Boolean(errors.purpose)}
                            helperText={errors.purpose}
                            required
                            disabled={isEditMode && !isAdmin}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email Addresses"
                            value={formData.emails}
                            onChange={handleChange('emails')}
                            error={Boolean(errors.emails)}
                            helperText={errors.emails || 'Enter email addresses separated by commas, semicolons, or new lines'}
                            multiline
                            rows={4}
                            required
                            disabled={isEditMode && !isAdmin}
                        />
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                label={`${getEmailCount()} email${getEmailCount() !== 1 ? 's' : ''}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description (Optional)"
                            value={formData.description}
                            onChange={handleChange('description')}
                            multiline
                            rows={2}
                            disabled={isEditMode && !isAdmin}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Team (Optional)</InputLabel>
                            <Select
                                value={formData.teamId}
                                onChange={handleChange('teamId')}
                                label="Team (Optional)"
                                disabled={isEditMode && !isAdmin}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {teams.map((team) => (
                                    <MenuItem key={team._id} value={team._id}>
                                        {team.teamName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.status === 'active'}
                                    onChange={handleStatusChange}
                                    disabled={isEditMode && !isAdmin}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Status: <strong>{formData.status === 'active' ? 'Active' : 'Inactive'}</strong>
                                </Typography>
                            }
                        />
                    </Grid>

                    {isEditMode && !isAdmin && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="warning.main">
                                Note: Only administrators can modify distribution lists.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || (isEditMode && !isAdmin)}
                >
                    {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}