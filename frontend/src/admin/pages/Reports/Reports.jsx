import { Box, Typography, Alert, Button, Snackbar } from '@mui/material';
import { BarChart3, RefreshCw } from 'lucide-react';

import ReportToolbar from '../../components/reports/ReportToolbar';
import ReportSummaryCards from '../../components/reports/ReportSummaryCards';
import SalesReportTable from '../../components/reports/SalesReportTable';
import InventoryReportTable from '../../components/reports/InventoryReportTable';
import CustomerReportTable from '../../components/reports/CustomerReportTable';
import ExportMenu from '../../components/reports/ExportMenu';
import SalesChart from '../../components/dashboard/SalesChart';
import useReports from '../../hooks/useReports';

const Reports = () => {
  const {
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    data,
    summary,
    chartData,
    loading,
    error,
    snackbar,
    closeSnackbar,
    exporting,
    handleExport,
    refresh,
  } = useReports();

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
          <BarChart3 size={22} />
          Reports
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

      <ReportToolbar
        reportType={reportType}
        onReportTypeChange={setReportType}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onRefresh={refresh}
        onExportClick={() => {}}
        loading={loading}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <ExportMenu onExport={handleExport} exporting={exporting} />
      </Box>

      <ReportSummaryCards summary={summary} />

      {reportType === 'sales' && chartData.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <SalesChart data={chartData} />
        </Box>
      )}

      {reportType === 'sales' && (
        <SalesReportTable data={data} loading={loading} />
      )}
      {reportType === 'inventory' && (
        <InventoryReportTable data={data} loading={loading} />
      )}
      {reportType === 'customers' && (
        <CustomerReportTable data={data} loading={loading} />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports;
