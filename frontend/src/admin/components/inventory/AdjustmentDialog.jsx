import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Box, Typography,
} from '@mui/material';
import { Pencil } from 'lucide-react';

const REASONS = [
  'Damaged stock',
  'Inventory count correction',
  'Return processed',
  'Sample / testing',
  'Theft / loss',
  'Supplier error',
  'Other',
];

const AdjustmentDialog = ({ open, onClose, onConfirm, item, loading }) => {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity('');
      setReason('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!Number.isInteger(q) || q === 0) {
      setError('Adjustment must be a non-zero whole number');
      return;
    }
    if (!reason) {
      setError('Please select a reason');
      return;
    }
    onConfirm(q, reason);
  };

  const isReduction = quantity && Number(quantity) < 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Pencil size={20} color="#f59e0b" />
          Manual Adjustment
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {item && (
            <Typography variant="body2" color="text.secondary">
              <strong>{item.productName}</strong> — Current stock: {item.currentStock}
            </Typography>
          )}

          <TextField
            label="Adjustment quantity"
            required
            type="number"
            size="small"
            autoFocus
            slotProps={{ htmlInput: { min: -99999, max: 99999 } }}
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(''); }}
            error={Boolean(error)}
            helperText={
              error ||
              (isReduction
                ? `New stock: ${(item?.currentStock ?? 0) + Number(quantity)}`
                : 'Use positive to increase, negative to decrease')
            }
          />

          <FormControl size="small" required>
            <InputLabel>Reason</InputLabel>
            <Select
              value={reason}
              label="Reason"
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              error={Boolean(error && !reason)}
            >
              {REASONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#f59e0b',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#d97706' },
            }}
          >
            {loading ? 'Saving…' : 'Apply Adjustment'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AdjustmentDialog;
