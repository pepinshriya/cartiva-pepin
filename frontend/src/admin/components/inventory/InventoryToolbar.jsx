import { TextField, FormControlLabel, Switch, Box } from '@mui/material';
import { Search, AlertTriangle } from 'lucide-react';

const InventoryToolbar = ({ search, onSearchChange, lowStockOnly, onLowStockChange }) => {
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
        placeholder="Search inventory…"
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94a3b8' }} />,
          },
        }}
        sx={{ minWidth: { sm: 260 }, flex: { sm: 1 } }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={lowStockOnly}
            onChange={(e) => onLowStockChange(e.target.checked)}
            size="small"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 14, color: '#64748b' }}>
            <AlertTriangle size={15} />
            Low stock only
          </Box>
        }
        sx={{ m: 0, whiteSpace: 'nowrap' }}
      />
    </Box>
  );
};

export default InventoryToolbar;
