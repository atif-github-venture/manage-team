import { useDispatch, useSelector } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Tooltip
} from '@mui/material';
import {
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { toggleDarkMode } from '../../store/slices/uiSlice';

export default function Header() {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.ui);

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderRadius: '0 0 32px 32px'
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Team Management & Capacity View
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Notifications">
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                        <IconButton color="inherit" onClick={handleToggleDarkMode}>
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}