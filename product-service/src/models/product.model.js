const TABLE_NAME = process.env.TABLE_NAME || 'product';

const ProductModel = {
  TABLE_NAME,
  requiredFields: ['name', 'description', 'category', 'price'],
  fieldTypes: {
    name: 'string',
    description: 'string',
    category: 'string',
    price: 'number',
    imageUrl: 'string',
  },
};

module.exports = ProductModel;
