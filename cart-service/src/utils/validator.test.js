const {
  validateUserId,
  validateCartItem,
  validateProductId,
  validateUpdateQuantity,
  validateCartData,
} = require('./validator');

describe('validateUserId', () => {
  it('should not throw when userId is a valid non-empty string', () => {
    expect(() => validateUserId('user123')).not.toThrow();
  });

  it('should throw when userId is an empty string', () => {
    expect(() => validateUserId('')).toThrow();
  });

  it('should throw when userId is undefined', () => {
    expect(() => validateUserId(undefined)).toThrow();
  });

  it('should throw when userId is not a string (e.g. a number)', () => {
    expect(() => validateUserId(12345)).toThrow();
  });
});

describe('validateCartItem', () => {
  it('should not throw for a valid item', () => {
    expect(() => validateCartItem({ productId: 'p1', quantity: 2 })).not.toThrow();
  });

  it('should throw when productId is missing', () => {
    expect(() => validateCartItem({ quantity: 2 })).toThrow();
  });

  it('should throw when quantity is missing', () => {
    expect(() => validateCartItem({ productId: 'p1' })).toThrow();
  });

  it('should throw when quantity is zero', () => {
    expect(() => validateCartItem({ productId: 'p1', quantity: 0 })).toThrow();
  });

  it('should throw when quantity is negative', () => {
    expect(() => validateCartItem({ productId: 'p1', quantity: -5 })).toThrow();
  });

  it('should throw when quantity is not a number', () => {
    expect(() => validateCartItem({ productId: 'p1', quantity: 'two' })).toThrow();
  });
});

describe('validateProductId', () => {
  it('should not throw for a valid non-empty string', () => {
    expect(() => validateProductId('p1')).not.toThrow();
  });

  it('should throw when productId is empty', () => {
    expect(() => validateProductId('')).toThrow();
  });

  it('should throw when productId is undefined', () => {
    expect(() => validateProductId(undefined)).toThrow();
  });

  it('should throw when productId is not a string', () => {
    expect(() => validateProductId(999)).toThrow();
  });
});

describe('validateUpdateQuantity', () => {
  it('should not throw for a valid positive quantity', () => {
    expect(() => validateUpdateQuantity({ quantity: 3 })).not.toThrow();
  });

  it('should throw when quantity is missing', () => {
    expect(() => validateUpdateQuantity({})).toThrow();
  });

  it('should throw when quantity is zero', () => {
    expect(() => validateUpdateQuantity({ quantity: 0 })).toThrow();
  });

  it('should throw when quantity is negative', () => {
    expect(() => validateUpdateQuantity({ quantity: -1 })).toThrow();
  });

  it('should throw when quantity is not a number', () => {
    expect(() => validateUpdateQuantity({ quantity: 'five' })).toThrow();
  });
});

describe('validateCartData', () => {
  it('should not throw when userId is present', () => {
    expect(() => validateCartData({ userId: 'user123' })).not.toThrow();
  });

  it('should throw when userId is missing', () => {
    expect(() => validateCartData({})).toThrow();
  });

  it('should throw when userId is an empty string', () => {
    expect(() => validateCartData({ userId: '' })).toThrow();
  });
});
