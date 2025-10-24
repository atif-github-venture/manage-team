import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
            light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
            dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
            contrastText: mode === 'dark' ? '#000' : '#fff',
        },
        secondary: {
            main: mode === 'dark' ? '#f48fb1' : '#dc004e',
            light: mode === 'dark' ? '#ffc1e3' : '#e33371',
            dark: mode === 'dark' ? '#bf5f82' : '#9a0036',
            contrastText: mode === 'dark' ? '#000' : '#fff',
        },
        success: {
            main: mode === 'dark' ? '#81c784' : '#4caf50',
            light: mode === 'dark' ? '#a5d6a7' : '#81c784',
            dark: mode === 'dark' ? '#66bb6a' : '#388e3c',
        },
        warning: {
            main: mode === 'dark' ? '#ffb74d' : '#ff9800',
            light: mode === 'dark' ? '#ffd54f' : '#ffb74d',
            dark: mode === 'dark' ? '#ffa726' : '#f57c00',
        },
        error: {
            main: mode === 'dark' ? '#e57373' : '#f44336',
            light: mode === 'dark' ? '#ef5350' : '#e57373',
            dark: mode === 'dark' ? '#ef5350' : '#d32f2f',
        },
        info: {
            main: mode === 'dark' ? '#64b5f6' : '#2196f3',
            light: mode === 'dark' ? '#90caf9' : '#64b5f6',
            dark: mode === 'dark' ? '#42a5f5' : '#1976d2',
        },
        background: {
            default: mode === 'dark' ? '#0a1929' : '#f5f7fa',
            paper: mode === 'dark' ? '#1a2027' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.6,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundImage: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: mode === 'dark' ? 'rgba(97, 97, 97, 0.95)' : 'rgba(97, 97, 97, 0.92)',
                },
            },
        },
    },
});

export default getTheme;