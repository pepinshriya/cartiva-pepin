import { Chip } from '@mui/material';

const ProductStatusChip = ({ inStock }) => {
  return (
    <Chip
      label={inStock ? 'In Stock' : 'Out of Stock'}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: 11,
        borderRadius: 1.5,
        color: inStock ? '#10b981' : '#ef4444',
        borderColor: inStock ? '#10b981' : '#ef4444',
        bgcolor: inStock ? '#ecfdf5' : '#fef2f2',
      }}
    />
  );
};

export default ProductStatusChip;
