import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { PackagePlus } from 'lucide-react';

const RestockDialog = ({ open, onClose, onConfirm, item, loading }) => {
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity('');
      setNote('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = Number(quantity);
    if (!Number.isInteger(q) || q <= 0) {
      setError('Quantity must be a positive whole number');
      return;
    }
    onConfirm(q, note);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <PackagePlus size={20} color="#10b981" />
          Restock
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {item && (
            <Typography variant="body2" color="text.secondary">
              <strong>{item.productName}</strong> — Current stock: {item.currentStock}
            </Typography>
          )}

          <TextField
            label="Quantity to add"
            required
            type="number"
            size="small"
            autoFocus
            slotProps={{ htmlInput: { min: 1 } }}
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError('');
            }}
            error={Boolean(error)}
            helperText={error}
          />

          <TextField
            label="Note (optional)"
            size="small"
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
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
              bgcolor: '#10b981',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            {loading ? 'Restocking…' : 'Restock'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RestockDialog;
