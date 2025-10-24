import { Paper, Typography, Box, Chip } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const COLORS = {
    ptoHours: '#F44336',
    timeRemaining: '#FF9800',
    remainingBandwidth: '#4CAF50',
    overCapacity: '#9C27B0',
};

// Gradient definitions for bars
const GRADIENTS = {
    ptoHours: { start: '#F44336', end: '#E53935' },
    timeRemaining: { start: '#FF9800', end: '#FB8C00' },
    remainingBandwidth: { start: '#4CAF50', end: '#43A047' },
    overCapacity: { start: '#9C27B0', end: '#8E24AA' },
};

// Custom shape for bars with rounded corners on all sides
const RoundedBar = (props) => {
    const { fill, x, y, width, height } = props;
    const radius = 4; // Corner radius

    if (height <= 0) return null;

    return (
        <g>
            <path
                d={`
                    M ${x + radius},${y}
                    L ${x + width - radius},${y}
                    Q ${x + width},${y} ${x + width},${y + radius}
                    L ${x + width},${y + height - radius}
                    Q ${x + width},${y + height} ${x + width - radius},${y + height}
                    L ${x + radius},${y + height}
                    Q ${x},${y + height} ${x},${y + height - radius}
                    L ${x},${y + radius}
                    Q ${x},${y} ${x + radius},${y}
                    Z
                `}
                fill={fill}
                stroke="none"
            />
        </g>
    );
};

// Custom annotation for available bandwidth (curly bracket)
const CurlyBracket = ({ x, y, height, width }) => {
    if (height <= 5) return null; // Don't show for very small segments

    const bracketX = x + width + 5;
    const startY = y;
    const endY = y + height;
    const midY = y + height / 2;
    const curve = 8;

    return (
        <g>
            <path
                d={`
                    M ${bracketX},${startY}
                    Q ${bracketX + curve},${startY + 5} ${bracketX + curve},${startY + 15}
                    L ${bracketX + curve},${midY - 8}
                    Q ${bracketX + curve},${midY - 3} ${bracketX + curve + 3},${midY}
                    Q ${bracketX + curve},${midY + 3} ${bracketX + curve},${midY + 8}
                    L ${bracketX + curve},${endY - 15}
                    Q ${bracketX + curve},${endY - 5} ${bracketX},${endY}
                `}
                fill="none"
                stroke="#43A047"
                strokeWidth={2}
                strokeLinecap="round"
            />
            <text
                x={bracketX + curve + 8}
                y={midY}
                textAnchor="start"
                fontSize={11}
                fontWeight={600}
                fill="#43A047"
                dominantBaseline="middle"
            >
                Available
            </text>
        </g>
    );
};

// Custom layer to add curly brackets
const CustomBarWithBracket = (props) => {
    const { data, ...rest } = props;

    return (
        <g>
            {data.map((entry, index) => {
                const bandwidthHeight = entry['Remaining Bandwidth'];
                if (bandwidthHeight > 0) {
                    // Calculate Y position for bandwidth segment
                    const ptoHeight = entry['PTO Hours'] || 0;
                    const timeRemainingHeight = entry['Time Remaining'] || 0;
                    const chartHeight = 400; // Approximate chart height
                    const barWidth = 40; // Approximate bar width
                    const spacing = 60; // Approximate spacing between bars

                    const xPos = 60 + (index * spacing); // Approximate X position
                    const scale = chartHeight / (entry.totalWorkingHours || 1);
                    const yOffset = 50; // Chart top offset

                    const bracketY = yOffset + ((entry.totalWorkingHours - ptoHeight - timeRemainingHeight - bandwidthHeight) * scale);
                    const bracketHeight = bandwidthHeight * scale;

                    return (
                        <CurlyBracket
                            key={`bracket-${index}`}
                            x={xPos}
                            y={bracketY}
                            height={bracketHeight}
                            width={barWidth}
                        />
                    );
                }
                return null;
            })}
        </g>
    );
};

export default function CapacityChart({ teamMembers }) {
    const chartData = teamMembers?.map((member) => {
        const isOverCapacity = member.timeRemaining > member.availableHours;

        // Split name into two lines
        const nameParts = member.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        return {
            name: firstName,
            lastName: lastName,
            fullName: member.name,
            'PTO Hours': member.ptoHours || 0,
            'Time Remaining': isOverCapacity ? member.availableHours : (member.timeRemaining || 0),
            'Remaining Bandwidth': isOverCapacity ? 0 : (member.remainingBandwidth || 0),
            'Over Capacity': isOverCapacity ? (member.timeRemaining - member.availableHours) : 0,
            totalWorkingHours: member.totalWorkingHours || 0,
            utilizationPercentage: member.utilizationPercentage || 0,
            status: member.status,
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Paper
                    sx={{
                        p: 2.5,
                        minWidth: 280,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.5)'
                            : '0 8px 32px rgba(0,0,0,0.15)'
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{
                        color: 'primary.main',
                        borderBottom: '2px solid',
                        borderColor: 'primary.main',
                        pb: 1,
                        mb: 1.5
                    }}>
                        {data.fullName}
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total Working Hours:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {data.totalWorkingHours}h
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Utilization:
                            </Typography>
                            <Chip
                                label={`${data.utilizationPercentage}%`}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    background: data.utilizationPercentage > 100
                                        ? 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)'
                                        : data.utilizationPercentage > 80
                                            ? 'linear-gradient(135deg, #FF9800 0%, #FFB300 100%)'
                                            : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                                    color: 'white'
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Status:
                            </Typography>
                            <Chip
                                label={data.status}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                        {payload.map((entry, index) => (
                            entry.value > 0 && (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 0.5
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}dd 100%)`,
                                            boxShadow: `0 0 8px ${entry.color}80`
                                        }} />
                                        <Typography variant="body2" sx={{ color: entry.color }}>
                                            {entry.name}:
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: entry.color }}>
                                        {entry.value}h
                                    </Typography>
                                </Box>
                            )
                        ))}
                    </Box>
                </Paper>
            );
        }
        return null;
    };

    const CustomXAxisTick = ({ x, y, payload }) => {
        const data = chartData.find(d => d.name === payload.value);
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize={12}
                    fontWeight={600}
                >
                    {payload.value}
                </text>
                {data?.lastName && (
                    <text
                        x={0}
                        y={0}
                        dy={30}
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize={12}
                        fontWeight={600}
                    >
                        {data.lastName}
                    </text>
                )}
            </g>
        );
    };

    const CustomLegend = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
            {Object.entries(COLORS).map(([key, color]) => {
                const label = key === 'ptoHours' ? 'PTO Hours'
                    : key === 'timeRemaining' ? 'Time Remaining (Assigned)'
                        : key === 'remainingBandwidth' ? 'Remaining Bandwidth (Available)'
                            : 'Over Capacity';

                return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${GRADIENTS[key].start} 0%, ${GRADIENTS[key].end} 100%)`,
                            boxShadow: `0 2px 8px ${color}40`,
                            border: '2px solid',
                            borderColor: 'divider'
                        }} />
                        <Typography variant="body2" fontWeight={500}>
                            {label}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );

    return (
        <Paper sx={{
            p: 3,
            mb: 4,
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 1
            }}>
                <Box sx={{
                    width: 6,
                    height: 40,
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3
                }} />
                <Box>
                    <Typography variant="h5" gutterBottom fontWeight={700} color="primary.main">
                        📈 Team Capacity Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Stacked view showing PTO, assigned work remaining, and available bandwidth per team member
                    </Typography>
                </Box>
            </Box>

            <ResponsiveContainer width="100%" height={450}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
                >
                    {/* Gradient Definitions */}
                    <defs>
                        {Object.entries(GRADIENTS).map(([key, gradient]) => (
                            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradient.start} stopOpacity={1} />
                                <stop offset="100%" stopColor={gradient.end} stopOpacity={0.9} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="name"
                        height={80}
                        interval={0}
                        tick={<CustomXAxisTick />}
                    />
                    <YAxis
                        label={{
                            value: 'Hours',
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontWeight: 600, fill: 'currentColor' }
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }} />
                    <Legend content={<CustomLegend />} />

                    <Bar
                        dataKey="PTO Hours"
                        stackId="a"
                        fill="url(#gradient-ptoHours)"
                        shape={<RoundedBar />}
                    />
                    <Bar
                        dataKey="Time Remaining"
                        stackId="a"
                        fill="url(#gradient-timeRemaining)"
                        shape={<RoundedBar />}
                    />
                    <Bar
                        dataKey="Remaining Bandwidth"
                        stackId="a"
                        fill="url(#gradient-remainingBandwidth)"
                        shape={<RoundedBar />}
                    />
                    <Bar
                        dataKey="Over Capacity"
                        stackId="a"
                        fill="url(#gradient-overCapacity)"
                        shape={<RoundedBar />}
                    />
                </BarChart>
            </ResponsiveContainer>

            <Paper sx={{
                mt: 3,
                p: 2.5,
                bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(102, 126, 234, 0.15) !important'
                    : 'rgba(102, 126, 234, 0.08) !important',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundImage: 'none !important',
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(102, 126, 234, 0.15) !important'
                    : 'rgba(102, 126, 234, 0.08) !important'
            }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    <strong>💡 How to Read:</strong> Each bar represents the total working hours for a team member.
                    <Box component="span" sx={{ color: COLORS.ptoHours, fontWeight: 600 }}> PTO hours</Box> are unavailable.
                    <Box component="span" sx={{ color: COLORS.timeRemaining, fontWeight: 600 }}> Time Remaining</Box> shows work already assigned.
                    <Box component="span" sx={{ color: COLORS.remainingBandwidth, fontWeight: 600 }}> Remaining Bandwidth</Box> shows capacity still available for new work.
                    <Box component="span" sx={{ color: COLORS.overCapacity, fontWeight: 600 }}> Over Capacity</Box> indicates overallocation.
                </Typography>
            </Paper>
        </Paper>
    );
}