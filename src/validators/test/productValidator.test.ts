import { productSchema } from '../productValidator';
import Joi from 'joi';

describe('productSchema', () => {
  describe('name field', () => {
    test('should accept valid name', () => {
      const validNames = ['abc', 'Valid Name', '20-characters-long'];
      validNames.forEach(name => {
        const { error } = productSchema.validate({ name });
        expect(error).toBeUndefined();
      });
    });

    test('should reject invalid names', () => {
      const invalidCases = [
        { name: 'ab', expected: 'length must be at least 3' },
        { name: 'a'.repeat(21), expected: 'length must be less than or equal to 20' },
        { name: 123, expected: 'must be a string' },
        { name: '', expected: '"name" is not allowed to be empty' },
        { name: null, expected: 'must be a string' },
      ];

      invalidCases.forEach(({ name, expected }) => {
        const { error } = productSchema.validate({ name });
        expect(error?.details[0].message).toContain(expected);
      });
    });

    test('should be optional', () => {
      const { error } = productSchema.validate({});
      expect(error).toBeUndefined();
    });
  });

  describe('category field', () => {
    // Similar structure to name field tests
    test('should accept valid category', () => {
      const validCategories = ['cat', 'Valid Category', '20-characters-long'];
      validCategories.forEach(category => {
        const { error } = productSchema.validate({ category });
        expect(error).toBeUndefined();
      });
    });

    test('should reject invalid categories', () => {
      const invalidCases = [
        { category: 'ca', expected: 'length must be at least 3' },
        { category: 'a'.repeat(21), expected: 'length must be less than or equal to 20' },
        { category: 123, expected: 'must be a string' },
        { category: '', expected: '"category" is not allowed to be empty' },
        { category: null, expected: 'must be a string' },
      ];

      invalidCases.forEach(({ category, expected }) => {
        const { error } = productSchema.validate({ category });
        expect(error?.details[0].message).toContain(expected);
      });
    });

    test('should be optional', () => {
      const { error } = productSchema.validate({});
      expect(error).toBeUndefined();
    });
  });

  describe('price field', () => {
    test('should accept valid price', () => {
      const validPrices = [1, 10.99, 1000];
      validPrices.forEach(price => {
        const { error } = productSchema.validate({ price });
        expect(error).toBeUndefined();
      });
    });

    test('should reject invalid prices', () => {
      const invalidCases = [
        { price: -5, expected: 'must be a positive number' },
        { price: 0, expected: 'must be a positive number' },
        { price: 'invalid', expected: 'must be a number' },
        { price: null, expected: 'must be a number' },
      ];

      invalidCases.forEach(({ price, expected }) => {
        const { error } = productSchema.validate({ price });
        expect(error?.details[0].message).toContain(expected);
      });
    });

    test('should be optional', () => {
      const { error } = productSchema.validate({});
      expect(error).toBeUndefined();
    });
  });

  describe('quantity field', () => {
    test('should accept valid quantity', () => {
      const validQuantities = [1, 10, 1000];
      validQuantities.forEach(quantity => {
        const { error } = productSchema.validate({ quantity });
        expect(error).toBeUndefined();
      });
    });

    test('should reject invalid quantities', () => {
      const invalidCases = [
        { quantity: -5, expected: 'must be a positive number' },
        { quantity: 0, expected: 'must be a positive number' },
        { quantity: 2.5, expected: 'must be an integer' },
        { quantity: 'invalid', expected: 'must be a number' },
        { quantity: null, expected: 'must be a number' },
      ];

      invalidCases.forEach(({ quantity, expected }) => {
        const { error } = productSchema.validate({ quantity });
        expect(error?.details[0].message).toContain(expected);
      });
    });

    test('should be optional', () => {
      const { error } = productSchema.validate({});
      expect(error).toBeUndefined();
    });
  });

  describe('complete schema validation', () => {
    test('should validate a complete product', () => {
      const validProduct = {
        name: 'Widget',
        category: 'Tools',
        price: 19.99,
        quantity: 10
      };
      const { error } = productSchema.validate(validProduct);
      expect(error).toBeUndefined();
    });

    test('should allow partial objects', () => {
      const partialProduct = { name: 'Partial' };
      const { error } = productSchema.validate(partialProduct);
      expect(error).toBeUndefined();
    });

    test('should reject multiple invalid fields', () => {
      const invalidProduct = {
        name: 'A',          // Too short
        price: -5,          // Negative
        quantity: 'invalid' // Wrong type
      };

      const { error } = productSchema.validate(invalidProduct, { abortEarly: false });
      expect(error?.details).toHaveLength(3);
      expect(error?.details.some(d => d.context?.label === 'name')).toBe(true);
      expect(error?.details.some(d => d.context?.label === 'price')).toBe(true);
      expect(error?.details.some(d => d.context?.label === 'quantity')).toBe(true);
    });
  });
});