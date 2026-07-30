import { Box, Typography, Alert, Button } from '@mui/material';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/dashboard/SalesChart';
import RecentOrders from '../../components/dashboard/RecentOrders';
import InventoryAlerts from '../../components/dashboard/InventoryAlerts';
import TopProducts from '../../components/dashboard/TopProducts';
import useDashboard from '../../hooks/useDashboard';

const Dashboard = () => {
  const { stats, revenueAnalytics, recentOrders, topProducts, lowStockProducts, error, refresh } =
    useDashboard();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          <LayoutDashboard size={22} />
          Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshCw size={16} />}
              onClick={refresh}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <SalesChart data={revenueAnalytics} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            maxHeight: { lg: 400 },
            overflowY: 'auto',
          }}
        >
          <InventoryAlerts alerts={lowStockProducts} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.6fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <RecentOrders orders={recentOrders} />
        <TopProducts products={topProducts} />
      </Box>
    </Box>
  );
};

export default Dashboard;
