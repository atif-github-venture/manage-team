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
import holidayService from '../../services/holidayService';
import { useSnackbar } from 'notistack';

export default function HolidayModal({ open, onClose, holiday, onSave }) {
    const [formData, setFormData] = useState({
        holidayName: '',
        date: new Date(),
        location: 'US',
        description: '',
        hours: 8,
        isRecurring: false,
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (holiday) {
            setFormData({
                holidayName: holiday.holidayName,
                date: new Date(holiday.date),
                location: holiday.location,
                description: holiday.description || '',
                hours: holiday.hours || 8,
                isRecurring: holiday.isRecurring || false,
            });
        } else {
            setFormData({
                holidayName: '',
                date: new Date(),
                location: 'US',
                description: '',
                hours: 8,
                isRecurring: false,
            });
        }
    }, [holiday, open]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.holidayName || !formData.date || !formData.location) {
            enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                year: formData.date.getFullYear(),
            };

            let response;
            if (holiday) {
                response = await holidayService.updateHoliday(holiday._id, payload);
            } else {
                response = await holidayService.createHoliday(payload);
            }

            onSave(response.data);
            enqueueSnackbar(
                `Holiday ${holiday ? 'updated' : 'created'} successfully`,
                { variant: 'success' }
            );
            onClose();
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || `Failed to ${holiday ? 'update' : 'create'} holiday`,
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{holiday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Holiday Name"
                    value={formData.holidayName}
                    onChange={(e) => handleChange('holidayName', e.target.value)}
                    margin="normal"
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Date"
                        value={formData.date}
                        onChange={(date) => handleChange('date', date)}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal', required: true } }}
                    />
                </LocalizationProvider>
                <TextField
                    select
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    margin="normal"
                    required
                >
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="Global">Global</MenuItem>
                </TextField>
                <TextField
                    select
                    fullWidth
                    label="Hours"
                    value={formData.hours}
                    onChange={(e) => handleChange('hours', e.target.value)}
                    margin="normal"
                    required
                >
                    <MenuItem value={2}>2 hours</MenuItem>
                    <MenuItem value={4}>4 hours</MenuItem>
                    <MenuItem value={6}>6 hours</MenuItem>
                    <MenuItem value={8}>8 hours (Full Day)</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
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