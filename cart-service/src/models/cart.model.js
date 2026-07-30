const TABLE_NAME = process.env.TABLE_NAME || 'Cart';

const CartModel = {
  TABLE_NAME,
  requiredFields: ['userId'],
  fieldTypes: {
    userId: 'string',
    items: 'array',
    totalPrice: 'number',
  },
};

module.exports = CartModel;
