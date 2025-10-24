import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Box,
    Stack,
    IconButton,
    Paper,
    Grid,
    Chip
} from '@mui/material';
import { Close, ContentCopy, Email, AutoAwesome } from '@mui/icons-material';

export const MemberDetailDialog = ({ member, open, onClose, onCopy }) => {
    if (!member) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {member.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {member.email}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{
                            p: 2,
                            textAlign: 'center',
                            bgcolor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(102, 126, 234, 0.15)'
                                : 'rgba(102, 126, 234, 0.1)',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2
                        }}>
                            <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 700 }}>
                                {member.metrics.issuesCompleted}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Issues Completed
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{
                            p: 2,
                            textAlign: 'center',
                            bgcolor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(240, 147, 251, 0.15)'
                                : 'rgba(240, 147, 251, 0.1)',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2
                        }}>
                            <Typography variant="h3" sx={{ color: '#f093fb', fontWeight: 700 }}>
                                {member.metrics.storyPoints}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Story Points
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{
                            p: 2,
                            textAlign: 'center',
                            bgcolor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(67, 233, 123, 0.15)'
                                : 'rgba(67, 233, 123, 0.1)',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2
                        }}>
                            <Typography variant="h3" sx={{ color: '#43e97b', fontWeight: 700 }}>
                                {member.metrics.utilization.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Utilization
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper sx={{
                            p: 2,
                            textAlign: 'center',
                            bgcolor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(250, 112, 154, 0.15)'
                                : 'rgba(250, 112, 154, 0.1)',
                            border: '2px solid',
                            borderColor: 'divider',
                            borderRadius: 2
                        }}>
                            <Typography variant="h3" sx={{ color: '#fa709a', fontWeight: 700 }}>
                                {member.metrics.storyBurnRate.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Burn Rate
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper sx={{
                    p: 2.5,
                    mb: 3,
                    bgcolor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(102, 126, 234, 0.15)'
                        : 'rgba(102, 126, 234, 0.1)',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                }}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                        <Box sx={{
                            p: 1,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex'
                        }}>
                            <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                            AI Work Summary
                        </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                        {member.aiSummary}
                    </Typography>
                </Paper>

                <Typography variant="subtitle1" fontWeight={700} mb={2} color="primary.main">
                    Completed Tickets ({member.tickets.length})
                </Typography>
                <Stack spacing={1.5}>
                    {member.tickets.map((ticket, index) => (
                        <Paper
                            key={index}
                            sx={{
                                p: 2,
                                borderLeft: 4,
                                borderColor: 'primary.main',
                                borderRadius: 2,
                                bgcolor: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(102, 126, 234, 0.1)'
                                    : 'rgba(102, 126, 234, 0.05)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: (theme) => theme.palette.mode === 'dark'
                                        ? 'rgba(102, 126, 234, 0.15)'
                                        : 'rgba(102, 126, 234, 0.1)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <Typography variant="body2" fontWeight={700} color="primary.main" mb={0.5}>
                                {ticket.key}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {ticket.summary}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    startIcon={<ContentCopy />}
                    onClick={onCopy}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        }
                    }}
                >
                    Copy Details
                </Button>
                <Button onClick={onClose} variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const EmailDialog = ({
                                open,
                                onClose,
                                onSend,
                                sending,
                                emailInputMode,
                                setEmailInputMode,
                                emailRecipients,
                                setEmailRecipients,
                                selectedDistList,
                                setSelectedDistList,
                                distributionLists
                            }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Email />
                    <Typography variant="h6" fontWeight={700}>
                        Send Insights via Email
                    </Typography>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Button
                            variant={emailInputMode === 'manual' ? 'contained' : 'outlined'}
                            onClick={() => setEmailInputMode('manual')}
                            size="small"
                            sx={{
                                ...(emailInputMode === 'manual' && {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                })
                            }}
                        >
                            Enter Manually
                        </Button>
                        <Button
                            variant={emailInputMode === 'list' ? 'contained' : 'outlined'}
                            onClick={() => setEmailInputMode('list')}
                            size="small"
                            sx={{
                                ...(emailInputMode === 'list' && {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                })
                            }}
                        >
                            Select Distribution List
                        </Button>
                    </Stack>

                    {emailInputMode === 'manual' ? (
                        <>
                            <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
                                Enter email addresses separated by commas
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="email1@example.com, email2@example.com"
                                value={emailRecipients}
                                onChange={(e) => setEmailRecipients(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" mb={1} fontWeight={500}>
                                Select a distribution list
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                label="Distribution List"
                                value={selectedDistList}
                                onChange={(e) => setSelectedDistList(e.target.value)}
                            >
                                {distributionLists.length === 0 ? (
                                    <MenuItem disabled>No distribution lists available</MenuItem>
                                ) : (
                                    distributionLists.map((list) => (
                                        <MenuItem key={list._id} value={list._id}>
                                            {list.name} ({list.emails.length} recipients)
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                            {selectedDistList && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {distributionLists.find(dl => dl._id === selectedDistList)?.description}
                                </Typography>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={onSend}
                    disabled={sending}
                    startIcon={<Email />}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        }
                    }}
                >
                    {sending ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};