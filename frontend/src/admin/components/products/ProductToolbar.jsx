import { TextField, Select, MenuItem, InputLabel, FormControl, Button, Box } from '@mui/material';
import { Plus, Search } from 'lucide-react';

const CATEGORIES = [
  '',
  'clothing',
  'accessories',
  'footwear',
  'outerwear',
  'electronics',
  'beauty',
  'groceries',
  'sports',
];

const ProductToolbar = ({ search, onSearchChange, category, onCategoryChange, onAdd }) => {
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
        placeholder="Search products…"
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

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES.filter(Boolean).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<Plus size={18} />}
        onClick={onAdd}
        sx={{
          bgcolor: '#1e293b',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          px: 3,
          whiteSpace: 'nowrap',
          '&:hover': { bgcolor: '#334155' },
        }}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default ProductToolbar;
