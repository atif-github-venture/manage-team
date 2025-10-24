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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import teamService from '../../services/teamService';
import ptoService from '../../services/ptoService';
import { useSnackbar } from 'notistack';

export default function PTOModal({ open, onClose, pto, teamId, onSave }) {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        teamId: teamId || '',
        startDate: new Date(),
        endDate: new Date(),
        duration: '',
        type: 'vacation',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (open && teamId) {
            loadMembers();
        }
    }, [open, teamId]);

    useEffect(() => {
        if (pto) {
            setFormData({
                userId: pto.userId?._id || pto.userId || '',
                teamId: pto.teamId || teamId || '',
                startDate: new Date(pto.startDate),
                endDate: new Date(pto.endDate),
                duration: pto.duration || '',
                type: pto.type || 'vacation',
                message: pto.message || '',
            });
        } else {
            setFormData({
                userId: '',
                teamId: teamId || '',
                startDate: new Date(),
                endDate: new Date(),
                duration: '',
                type: 'vacation',
                message: '',
            });
        }
    }, [pto, open, teamId]);

    const loadMembers = async () => {
        try {
            const response = await teamService.getTeamMembers(teamId);
            console.log('Team members response:', response.data);
            setMembers(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to load team members', { variant: 'error' });
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.userId || !formData.startDate || !formData.endDate || !formData.duration) {
            enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
            return;
        }

        if (formData.endDate < formData.startDate) {
            enqueueSnackbar('End date must be after or equal to start date', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let response;
            if (pto) {
                response = await ptoService.updatePTO(pto._id, formData);
            } else {
                response = await ptoService.createPTO(formData);
            }

            onSave(response.data);
            enqueueSnackbar(
                `PTO ${pto ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${pto ? 'update' : 'create'} PTO`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            disableEnforceFocus
            disableAutoFocus
        >
            <DialogTitle>{pto ? 'Edit PTO' : 'Add PTO'}</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    fullWidth
                    label="Team Member"
                    value={formData.userId || ''}
                    onChange={(e) => handleChange('userId', e.target.value)}
                    margin="normal"
                    required
                    SelectProps={{
                        displayEmpty: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    <MenuItem value="" disabled>
                        <em>Select a team member</em>
                    </MenuItem>
                    {members.map((member) => (
                        <MenuItem
                            key={member._id || member.userId}
                            value={member.userId || member._id}
                        >
                            {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
                        </MenuItem>
                    ))}
                </TextField>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Start Date"
                        value={formData.startDate}
                        onChange={(date) => handleChange('startDate', date)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: 'normal',
                                required: true
                            }
                        }}
                    />
                    <DatePicker
                        label="End Date"
                        value={formData.endDate}
                        onChange={(date) => handleChange('endDate', date)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: 'normal',
                                required: true
                            }
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth
                    label="Duration (hours)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    margin="normal"
                    required
                    placeholder="e.g., 8 for full day, 4 for half day"
                    helperText="Enter total hours for this PTO (e.g., 8 hours = 1 day, 16 hours = 2 days)"
                />
                <TextField
                    select
                    fullWidth
                    label="Type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    margin="normal"
                >
                    <MenuItem value="vacation">Vacation</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label="Message (optional)"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    margin="normal"
                    multiline
                    rows={2}
                />
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