import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
} from '@mui/material';
import userService from '../../services/userService';
import { useSnackbar } from 'notistack';

export default function UserModal({ open, onClose, user, onSave }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'viewer',
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: '',
                role: user.role || 'viewer',
                active: user.active !== undefined ? user.active : true,
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'viewer',
                active: true,
            });
        }
    }, [user, open]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email) {
            enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
            return;
        }

        if (!user && !formData.password) {
            enqueueSnackbar('Password is required for new users', { variant: 'warning' });
            return;
        }

        if (formData.password && formData.password.length < 8) {
            enqueueSnackbar('Password must be at least 8 characters', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let response;

            if (user) {
                // Update user details (without password)
                const { password, ...updatePayload } = formData;
                response = await userService.updateUser(user._id, updatePayload);

                // If password was provided, update it separately
                if (password) {
                    await userService.resetUserPassword(user._id, password);
                    enqueueSnackbar('Password updated successfully', { variant: 'success' });
                }
            } else {
                // Create new user (includes password)
                response = await userService.createUser(formData);
            }

            onSave(response.data);
            enqueueSnackbar(
                response.message || `User ${user ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${user ? 'update' : 'create'} user`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    margin="normal"
                    required
                    disabled={!!user}
                />
                <TextField
                    fullWidth
                    label={user ? 'New Password (leave blank to keep current)' : 'Password'}
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    margin="normal"
                    required={!user}
                    helperText="Minimum 8 characters"
                />
                <TextField
                    select
                    fullWidth
                    label="Role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    margin="normal"
                >
                    <MenuItem value="viewer">Viewer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <FormControlLabel
                    control={
                        <Switch
                            checked={formData.active}
                            onChange={(e) => handleChange('active', e.target.checked)}
                        />
                    }
                    label="Active"
                    sx={{ mt: 2 }}
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