import { Box } from '@mui/material';
import StatCard from '../dashboard/StatCard';

const ReportSummaryCards = ({ summary }) => {
  if (!summary || !summary.length) return null;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
        gap: 2.5,
        mb: 3,
      }}
    >
      {summary.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </Box>
  );
};

export default ReportSummaryCards;
