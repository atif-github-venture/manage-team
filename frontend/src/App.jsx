import { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

import { AuthProvider } from './context/AuthContext.jsx';
import { ConstantsProvider } from './context/ConstantsContext.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import LandingPage from './components/Home/LandingPage';
import AssociateView from './components/TimeTrend/AssociateView';
import TeamView from './components/TimeTrend/TeamView';
import HolidaysList from './components/Holidays/HolidaysList';
import InsightsView from './components/TeamworkInsights/InsightsView';
import TeamsList from './components/ManageTeams/TeamsList';
import UsersList from './components/ManageUsers/UsersList';
import PTOView from './components/TeamPTO/PTOView';
import CapacityView from './components/FutureCapacity/CapacityView';
import AuditLogsList from './components/AuditLogs/AuditLogsList';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { getTheme } from './styles/theme';
import DistributionListsPage from './components/DistributionLists/DistributionListsPage';
import TeamJQLs from './components/TeamJQLs/TeamJQLs';

function App() {
    const darkMode = useSelector((state) => state.ui.darkMode);
    const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <ConstantsProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/" element={<ProtectedRoute />}>
                                <Route index element={<Navigate to="/home" replace />} />
                                <Route path="home" element={<LandingPage />} />
                                <Route path="time-trend/associate" element={<AssociateView />} />
                                <Route path="time-trend/team" element={<TeamView />} />
                                <Route path="holidays" element={<HolidaysList />} />
                                <Route path="teamwork-insights" element={<InsightsView />} />
                                <Route path="manage-teams" element={<TeamsList />} />
                                <Route path="manage-users" element={<UsersList />} />
                                <Route path="team-pto" element={<PTOView />} />
                                <Route path="/distribution-lists" element={<DistributionListsPage />} />
                                <Route path="future-capacity" element={<CapacityView />} />
                                <Route path="audit-logs" element={<AuditLogsList />} />
                                <Route path="/team-jqls" element={<TeamJQLs />} />
                            </Route>
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>
                    </AuthProvider>
                </ConstantsProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;