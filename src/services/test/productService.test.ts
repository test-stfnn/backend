import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../productService';
import { Product } from '../../models/productModel';

// We will mock fs/promises so we don't do real disk I/O in tests
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('Product Service', () => {
  // Sample product array to use in tests
  const mockProducts: Product[] = [
    { id: 1, name: 'Test Product 1', category: 'A1', price: 100, quantity: 1 },
    { id: 2, name: 'Test Product 2', category: 'B2', price: 200, quantity: 2 },
    { id: 3, name: 'Test Product 3', category: 'C3', price: 300, quantity: 3 },
  ];

  const emptyProducts: Product[] = [
  ];

  // Helper to mock fs.readFile returning our mock product array
  const mockReadFile = (products: Product[]) => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(products));
  };

  beforeEach(() => {
    // Clear mocks before each test so old calls don’t interfere
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products when page and limit are not specified', async () => {
      mockReadFile(mockProducts);

      const products = await getAllProducts();
      expect(products).toEqual(mockProducts);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should return paginated products when page and limit are specified', async () => {
      mockReadFile(mockProducts);

      // Suppose we request page=2, limit=1 => we want the 2nd product only
      const products = await getAllProducts(2, 1);
      expect(products).toEqual([mockProducts[1]]);
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('addProduct', () => {
    it('should add a new product and return it with an assigned id', async () => {
      mockReadFile(mockProducts);

      // Mock writeFile (we don't care about its actual content here, just that it was called)
      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const newProductData = { name: 'New Product', category: 'D4', price: 999, quantity: 1 };
      const createdProduct = await addProduct(newProductData);

      // We expect the new product to have id = 4 (since our mock has 1,2,3)
      expect(createdProduct).toEqual({ id: 4, ...newProductData });
      // Check that fs.writeFile was called with updated data
      expect(fs.writeFile).toHaveBeenCalledTimes(1);

      // Optionally, verify the content that was written
      const writtenData = JSON.parse((fs.writeFile as jest.Mock).mock.calls[0][1]);
      expect(writtenData.length).toBe(4);
      expect(writtenData[3]).toEqual({ id: 4, ...newProductData });
    });
    it('should add a new product and return it with an assigned id of 1 if json file is empty', async () => {
      mockReadFile(emptyProducts);

      // Mock writeFile (we don't care about its actual content here, just that it was called)
      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const newProductData = { name: 'New Product', category: 'D4', price: 999, quantity: 1 };
      const createdProduct = await addProduct(newProductData);

      // We expect the new product to have id = 4 (since our mock has 1,2,3)
      expect(createdProduct).toEqual({ id: 1, ...newProductData });
      // Check that fs.writeFile was called with updated data
      expect(fs.writeFile).toHaveBeenCalledTimes(1);

      // Optionally, verify the content that was written
      const writtenData = JSON.parse((fs.writeFile as jest.Mock).mock.calls[0][1]);
      expect(writtenData.length).toBe(1);
      expect(writtenData[0]).toEqual({ id: 1, ...newProductData });
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product and return the updated product', async () => {
      // For update, we read the products first
      mockReadFile(mockProducts);
      // Then we also expect a second read inside update?
      // Actually, your code calls `getAllProducts()` inside updateProduct,
      // so let's mock readFile again for that second call:
      mockReadFile(mockProducts);

      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const updated = await updateProduct(2, { price: 250 });
      expect(updated).toEqual({ id: 2, name: 'Test Product 2', category: 'B2', price: 250, quantity: 2 });
      expect(fs.writeFile).toHaveBeenCalledTimes(1);

      // Check the actual data passed to fs.writeFile
      const writtenData = JSON.parse((fs.writeFile as jest.Mock).mock.calls[0][1]);
      expect(writtenData[1]).toEqual({ id: 2, name: 'Test Product 2', category: 'B2', price: 250, quantity: 2});
    });

    it('should return null if the product to be updated is not found', async () => {
      mockReadFile(mockProducts);
      // Same reasoning: second read for getAllProducts call
      mockReadFile(mockProducts);

      const updated = await updateProduct(999, { price: 123 });
      expect(updated).toBeNull();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product and return true', async () => {
      // For delete, we read the products first
      mockReadFile(mockProducts);
      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await deleteProduct(2);
      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledTimes(1);

      // Check the new array that was written (should exclude product with id=2)
      const writtenData = JSON.parse((fs.writeFile as jest.Mock).mock.calls[0][1]);
      expect(writtenData.length).toBe(2);
      expect(writtenData.find((p: Product) => p.id === 2)).toBeUndefined();
    });

    it('should return false if the product does not exist', async () => {
      mockReadFile(mockProducts);

      const result = await deleteProduct(999);
      expect(result).toBe(false);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
