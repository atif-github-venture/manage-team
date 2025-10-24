import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 70;

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const collapsed = useSelector((state) => state.ui.sidebarCollapsed);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minHeight: '100vh',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[900]
                            : theme.palette.grey[100],
                    overflow: 'auto'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}