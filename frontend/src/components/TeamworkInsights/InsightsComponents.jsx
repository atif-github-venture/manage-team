import { Card, CardContent, Typography, Box, Stack, Grid, Chip, Paper } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

export const MetricCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <Card sx={{
        height: '100%',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
        }
    }}>
        <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                    color: 'white',
                    display: 'flex',
                    boxShadow: `0 4px 14px ${color}40`
                }}>
                    <Icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    {label}
                </Typography>
            </Stack>
            <Typography variant="h3" fontWeight={700} sx={{ color: color, mb: 0.5 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

export const MemberCard = ({ member, onClick }) => (
    <Card
        sx={{
            height: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3,
            border: '2px solid transparent',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                borderColor: '#667eea',
            }
        }}
        onClick={onClick}
    >
        <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Box>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {member.email}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 1,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex'
                }}>
                    <AutoAwesome sx={{ color: 'white', fontSize: 20 }} />
                </Box>
            </Stack>

            <Grid container spacing={1} mb={2}>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.issuesCompleted} Issues`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.storyPoints} Points`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.utilization.toFixed(1)}% Util`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.storyBurnRate.toFixed(2)} Rate`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.ptoHours || 0}h PTO`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Chip
                        label={`${member.metrics.holidayHours || 0}h Holiday`}
                        size="small"
                        sx={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
                            color: 'white',
                            fontWeight: 600
                        }}
                    />
                </Grid>
            </Grid>

            <Paper sx={{
                p: 1.5,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(102, 126, 234, 0.1)'
                    : 'rgba(102, 126, 234, 0.05)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
            }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6
                    }}
                >
                    {member.aiSummary}
                </Typography>
            </Paper>
        </CardContent>
    </Card>
);

export const TeamSummarySection = ({ teamSummary }) => (
    <Paper sx={{
        p: 3,
        mb: 4,
        bgcolor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(102, 126, 234, 0.15)'
            : 'rgba(102, 126, 234, 0.1)',
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
    }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Box sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
            }}>
                <AutoAwesome sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary.main">
                AI Team Summary
            </Typography>
        </Stack>
        <Typography variant="body1" sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            color: 'text.primary'
        }}>
            {teamSummary}
        </Typography>
    </Paper>
);