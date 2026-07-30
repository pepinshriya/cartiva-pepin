import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { ArrowUpDown } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const UpdateStatusDialog = ({ open, onClose, onConfirm, order, loading }) => {
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && order) {
      setNewStatus(order.status || '');
      setNote('');
      setError('');
    }
  }, [open, order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) {
      setError('Please select a status');
      return;
    }
    if (newStatus === order?.status) {
      setError('New status must be different from current');
      return;
    }
    onConfirm(newStatus, note);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowUpDown size={20} color="#3b82f6" />
          Update Status
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {order && (
            <Typography variant="body2" color="text.secondary">
              Order <strong>{order.orderId}</strong> — Current: <strong>{order.status}</strong>
            </Typography>
          )}

          <FormControl size="small" required>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => {
                setNewStatus(e.target.value);
                setError('');
              }}
              error={Boolean(error)}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s} disabled={s === order?.status}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}

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
              bgcolor: '#3b82f6',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#2563eb' },
            }}
          >
            {loading ? 'Updating…' : 'Update Status'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UpdateStatusDialog;
