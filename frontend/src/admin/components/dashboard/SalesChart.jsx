import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useMediaQuery } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <Box
      sx={{
        bgcolor: '#1e293b',
        color: '#fff',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        fontSize: 13,
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Typography key={entry.name} variant="caption" sx={{ display: 'block' }}>
          {entry.name === 'revenue'
            ? `Revenue: $${entry.value.toLocaleString()}`
            : `Orders: ${entry.value}`}
        </Typography>
      ))}
    </Box>
  );
};

const SalesChart = ({ data }) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Revenue & Orders Overview
        </Typography>

        <Box sx={{ width: '100%', height: isMobile ? 260 : 340 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={28}
                iconType="rect"
                formatter={(value) => (
                  <span style={{ color: '#64748b', fontSize: 13 }}>
                    {value === 'revenue' ? 'Revenue' : 'Orders'}
                  </span>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={isMobile ? 12 : 20}
                name="revenue"
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={isMobile ? 12 : 20}
                name="orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
