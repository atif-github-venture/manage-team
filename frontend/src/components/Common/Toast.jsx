import { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbar } from '../../store/slices/uiSlice';

export default function Toast() {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state) => state.ui.snackbar);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(hideSnackbar());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}