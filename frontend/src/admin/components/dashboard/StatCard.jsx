import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, ShoppingCart, Package, Users, AlertTriangle, Star } from 'lucide-react';

const iconMap = {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Star,
};

const StatCard = ({ label, value, change, changeType, icon, color, bgColor }) => {
  const IconComponent = iconMap[icon];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: bgColor,
              color: color,
            }}
          >
            {IconComponent && <IconComponent size={22} />}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.3 }}>
              {value}
            </Typography>
            {change && (
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{
                  color: changeType === 'positive' ? '#10b981' : '#ef4444',
                  mt: 0.25,
                }}
              >
                {change}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
