import {
  TextField, Select, MenuItem, InputLabel, FormControl, Box,
} from '@mui/material';
import { Search } from 'lucide-react';

const STATUSES = ['', 'ACTIVE', 'INACTIVE', 'BLOCKED'];

const CustomerToolbar = ({ search, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search by name, email, or ID…"
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94a3b8' }} />,
          },
        }}
        sx={{ minWidth: { sm: 280 }, flex: { sm: 1 } }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {STATUSES.filter(Boolean).map((s) => (
            <MenuItem key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomerToolbar;
