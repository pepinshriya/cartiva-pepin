import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';

const CATEGORIES = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'sports', label: 'Sports' },
];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  image: '',
  inStock: true,
};

const ProductDialog = ({ open, onClose, onSubmit, product }) => {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category || '',
        image: product.image || '',
        inStock: product.inStock ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [product, open]);

  const handleChange = (field) => (e) => {
    const value = field === 'inStock' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Product name is required';
    }
    if (!form.price || Number(form.price) <= 0) {
      errs.price = 'Price must be greater than 0';
    }
    if (!form.category) {
      errs.category = 'Category is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      });
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Name"
            required
            size="small"
            value={form.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            size="small"
            value={form.description}
            onChange={handleChange('description')}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Price"
              required
              type="number"
              size="small"
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              value={form.price}
              onChange={handleChange('price')}
              error={Boolean(errors.price)}
              helperText={errors.price}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Original Price (optional)"
              type="number"
              size="small"
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              value={form.originalPrice}
              onChange={handleChange('originalPrice')}
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            label="Category"
            required
            select
            size="small"
            value={form.category}
            onChange={handleChange('category')}
            error={Boolean(errors.category)}
            helperText={errors.category}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Image URL"
            size="small"
            value={form.image}
            onChange={handleChange('image')}
            placeholder="https://example.com/image.jpg"
          />

          <FormControlLabel
            control={<Switch checked={form.inStock} onChange={handleChange('inStock')} />}
            label="In Stock"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: '#1e293b',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#334155' },
            }}
          >
            {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Add Product'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ProductDialog;
