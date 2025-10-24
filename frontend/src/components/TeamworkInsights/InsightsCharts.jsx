import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Grid, Box } from '@mui/material';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

export const StoryPointsChart = ({ members, totalStoryPoints }) => {
    return (
        <Grid item xs={12} md={6}>
            <Paper sx={{
                p: 3,
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                        width: 4,
                        height: 30,
                        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2
                    }} />
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        Story Points Distribution
                    </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
                        <defs>
                            {members.map((entry, index) => (
                                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.95}/>
                                    <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <Pie
                            data={members.map(m => ({
                                name: m.name,
                                value: m.metrics.storyPoints
                            }))}
                            cx="50%"
                            cy="45%"
                            label={false}
                            labelLine={false}
                            outerRadius={100}
                            innerRadius={50}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {members.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${index})`}
                                    stroke="#fff"
                                    strokeWidth={3}
                                />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: '#fff'
                            }}
                            wrapperStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                            }}
                            formatter={(value, name) => [`${value} points`, name]}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{
                                paddingTop: '10px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
    );
};

export const UtilizationChart = ({ members }) => {
    return (
        <Grid item xs={12} md={6}>
            <Paper sx={{
                p: 3,
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: 3
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                        width: 4,
                        height: 30,
                        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2
                    }} />
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        Team Member Utilization
                    </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={members.map(m => ({
                            name: m.name,
                            utilization: m.metrics.utilization
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                        <defs>
                            <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#667eea" stopOpacity={0.95}/>
                                <stop offset="100%" stopColor="#764ba2" stopOpacity={0.7}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                const nameParts = payload.value.split(' ');
                                const firstName = nameParts[0] || '';
                                const lastName = nameParts.slice(1).join(' ') || '';

                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={0}
                                            dy={16}
                                            textAnchor="end"
                                            fill="currentColor"
                                            transform="rotate(-45)"
                                            fontSize={11}
                                            fontWeight={600}
                                        >
                                            <tspan x={0} dy="0">{firstName}</tspan>
                                            {lastName && <tspan x={0} dy="12">{lastName}</tspan>}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <YAxis
                            label={{
                                value: 'Utilization %',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: 12, fill: 'currentColor', fontWeight: 600 }
                            }}
                            tick={{ fontSize: 11, fill: 'currentColor' }}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                color: '#fff'
                            }}
                            wrapperStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                            }}
                            formatter={(value) => [`${value.toFixed(1)}%`, 'Utilization']}
                            labelStyle={{ color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '10px' }}
                            iconType="circle"
                        />
                        <Bar
                            dataKey="utilization"
                            fill="url(#utilizationGradient)"
                            name="Utilization %"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>
    );
};