import {
  Card, CardContent, Typography, Box, LinearProgress, Chip,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const statusConfig = {
  critical: { color: '#ef4444', bgColor: '#fef2f2', label: 'Critical' },
  low: { color: '#f59e0b', bgColor: '#fffbeb', label: 'Low Stock' },
};

const InventoryAlerts = ({ alerts }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AlertTriangle size={20} color="#64748b" />
          <Typography variant="h6" fontWeight={600}>
            Inventory Alerts
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {alerts.map((item) => {
            const cfg = statusConfig[item.status];
            const stockPercent = Math.min((item.stock / item.threshold) * 100, 100);

            return (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: cfg.bgColor,
                  border: `1px solid ${cfg.color}20`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={cfg.label}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: 10,
                      bgcolor: cfg.color,
                      color: '#fff',
                      borderRadius: 1,
                      height: 22,
                      flexShrink: 0,
                      ml: 1,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={stockPercent}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: `${cfg.color}20`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: cfg.color,
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ color: cfg.color, flexShrink: 0 }}
                  >
                    {item.stock} / {item.threshold}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
