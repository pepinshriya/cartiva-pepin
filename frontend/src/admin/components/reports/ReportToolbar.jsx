import {
  Box, TextField, Select, MenuItem, InputLabel, FormControl, Button,
} from '@mui/material';
import { RefreshCw, Download } from 'lucide-react';

const REPORT_TYPES = [
  { value: 'sales', label: 'Sales Report' },
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'customers', label: 'Customer Report' },
];

const ReportToolbar = ({
  reportType, onReportTypeChange,
  startDate, onStartDateChange,
  endDate, onEndDateChange,
  onRefresh, onExportClick, loading,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'flex-end' },
        gap: 2,
        mb: 3,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Report Type</InputLabel>
        <Select
          value={reportType}
          label="Report Type"
          onChange={(e) => onReportTypeChange(e.target.value)}
        >
          {REPORT_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Start Date"
        type="date"
        size="small"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{ minWidth: 160 }}
      />

      <TextField
        label="End Date"
        type="date"
        size="small"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{ minWidth: 160 }}
      />

      <Box sx={{ display: 'flex', gap: 1, ml: { md: 'auto' } }}>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={onRefresh}
          disabled={loading}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={<Download size={16} />}
          onClick={onExportClick}
          disabled={loading}
          sx={{
            bgcolor: '#1e293b',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            '&:hover': { bgcolor: '#334155' },
          }}
        >
          Export
        </Button>
      </Box>
    </Box>
  );
};

export default ReportToolbar;
