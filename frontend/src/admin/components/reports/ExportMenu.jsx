import { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';

const ExportMenu = ({ onExport, exporting }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    handleClose();
    onExport(format);
  };

  const options = [
    { format: 'csv', label: 'Export as CSV', icon: FileText },
    { format: 'excel', label: 'Export as Excel', icon: FileSpreadsheet },
    { format: 'pdf', label: 'Export as PDF', icon: File },
  ];

  return (
    <>
      <Button
        variant="contained"
        startIcon={
          exporting ? <CircularProgress size={16} color="inherit" /> : <Download size={16} />
        }
        onClick={handleClick}
        disabled={Boolean(exporting)}
        sx={{
          bgcolor: '#1e293b',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          '&:hover': { bgcolor: '#334155' },
        }}
      >
        {exporting ? `Exporting ${exporting.toUpperCase()}…` : 'Export'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 200, mt: 0.5 } } }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.format} onClick={() => handleExport(opt.format)} dense>
            <ListItemIcon sx={{ minWidth: 32, color: '#64748b' }}>
              <opt.icon size={18} />
            </ListItemIcon>
            <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 14 }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ExportMenu;
