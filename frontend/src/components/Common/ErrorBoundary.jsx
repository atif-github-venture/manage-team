import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        p: 3,
                    }}
                >
                    <Paper
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            textAlign: 'center',
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
                        />
                        <Typography variant="h5" gutterBottom>
                            Something went wrong
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;