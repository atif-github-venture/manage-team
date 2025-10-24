import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Link as MuiLink,
    Box,
} from '@mui/material';
import { format } from 'date-fns';

const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';

    if (statusLower.includes('done') || statusLower.includes('closed') || statusLower.includes('resolved')) {
        return 'success';
    }
    if (statusLower.includes('in progress') || statusLower.includes('in development')) {
        return 'primary';
    }
    if (statusLower.includes('review') || statusLower.includes('testing') || statusLower.includes('qa')) {
        return 'info';
    }
    if (statusLower.includes('blocked') || statusLower.includes('on hold')) {
        return 'error';
    }
    if (statusLower.includes('to do') || statusLower.includes('open') || statusLower.includes('backlog')) {
        return 'default';
    }
    if (statusLower.includes('ready')) {
        return 'warning';
    }

    return 'default';
};

export default function TicketsTable({ issues }) {
    if (!issues || issues.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography color="text.secondary">
                    No issues found for the selected period
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, width: '100%', boxSizing: 'border-box', bgcolor: 'background.paper' }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
                🎫 Issue Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Detailed breakdown of all issues in the selected period ({issues.length} issues)
            </Typography>

            <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 1200 }} size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell width="8%"><strong>Ticket ID</strong></TableCell>
                            <TableCell width="30%"><strong>Summary</strong></TableCell>
                            <TableCell width="10%"><strong>Assignee</strong></TableCell>
                            <TableCell width="7%"><strong>Type</strong></TableCell>
                            <TableCell width="10%"><strong>Status</strong></TableCell>
                            <TableCell width="6%" align="center"><strong>Story Points</strong></TableCell>
                            <TableCell width="7%" align="right"><strong>Estimate</strong></TableCell>
                            <TableCell width="7%" align="right"><strong>Time Spent</strong></TableCell>
                            <TableCell width="7%" align="right"><strong>Remaining</strong></TableCell>
                            <TableCell width="8%"><strong>Created</strong></TableCell>
                            <TableCell width="8%"><strong>Due Date</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.map((issue) => (
                            <TableRow key={issue.id} hover>
                                <TableCell>
                                    <MuiLink
                                        href={issue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="hover"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {issue.key}
                                    </MuiLink>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 500, minWidth: 300 }}>
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                        {issue.summary}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap>
                                        {issue.assignee}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={issue.issueType}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={issue.status}
                                        size="small"
                                        color={getStatusColor(issue.status)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {issue.storyPoints || '-'}
                                </TableCell>
                                <TableCell align="right">
                                    {issue.originalEstimate ? `${issue.originalEstimate.toFixed(1)}h` : '-'}
                                </TableCell>
                                <TableCell align="right">
                                    {issue.timeSpent ? `${issue.timeSpent.toFixed(1)}h` : '0h'}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: issue.timeRemaining > 0 ? 'warning.main' : 'success.main',
                                            fontWeight: 500
                                        }}
                                    >
                                        {issue.timeRemaining ? `${issue.timeRemaining.toFixed(1)}h` : '0h'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap>
                                        {issue.created
                                            ? format(new Date(issue.created), 'MMM dd, yyyy')
                                            : '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" noWrap>
                                        {issue.dueDate
                                            ? format(new Date(issue.dueDate), 'MMM dd, yyyy')
                                            : '-'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Summary Footer */}
            <Box sx={{
                mt: 3,
                p: 2,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'grey.50',
                borderRadius: 1
            }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>Total Issues:</strong> {issues.length} |
                    <strong> Total Story Points:</strong> {issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0)} |
                    <strong> Total Estimate:</strong> {issues.reduce((sum, i) => sum + (i.originalEstimate || 0), 0).toFixed(1)}h |
                    <strong> Total Time Spent:</strong> {issues.reduce((sum, i) => sum + (i.timeSpent || 0), 0).toFixed(1)}h |
                    <strong> Total Remaining:</strong> {issues.reduce((sum, i) => sum + (i.timeRemaining || 0), 0).toFixed(1)}h
                </Typography>
            </Box>
        </Paper>
    );
}