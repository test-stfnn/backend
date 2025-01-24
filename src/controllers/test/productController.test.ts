// productController.test.ts

import { Request, Response } from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../productController';
import * as ProductService from '../../services/productService';

jest.mock('../../services/productService');

describe('Product Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return a list of products with pagination', async () => {

      mockReq.query = { page: '2', limit: '5' };
      const mockProducts = [{ id: 101, name: 'Product 101' }];

      (ProductService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(ProductService.getAllProducts).toHaveBeenCalledWith(2, 5);
      expect(mockRes.json).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        total: mockProducts.length,
        products: mockProducts,
        message: '¡Se cargaron los productos con éxito!',
      });
      expect(mockRes.status).not.toHaveBeenCalledWith(500);
    });

    it('should use default page=1 and limit=10 if not provided', async () => {

      mockReq.query = {};
      const mockProducts = [{ id: 1, name: 'Default Product' }];
      (ProductService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(ProductService.getAllProducts).toHaveBeenCalledWith(1, 10);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if an error is thrown', async () => {
      mockReq.query = { page: '1', limit: '10' };
      (ProductService.getAllProducts as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'An error occurred while fetching products',
      });
    });
  });

  describe('addProduct', () => {
    it('should create a new product and return 201 status', async () => {

      mockReq.body = { name: 'New Product', price: 200 };
      const mockCreatedProduct = { id: 1, ...mockReq.body };

      (ProductService.addProduct as jest.Mock).mockResolvedValue(mockCreatedProduct);

      await addProduct(mockReq as Request, mockRes as Response);

      expect(ProductService.addProduct).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        product: mockCreatedProduct,
        message: '¡Se creó el producto con éxito!',
      });
    });

    it('should handle service error and still throw (or handle) properly', async () => {

      mockReq.body = { name: 'New Product' };
      (ProductService.addProduct as jest.Mock).mockRejectedValue(new Error('Service error'));

      await expect(addProduct(mockReq as Request, mockRes as Response)).rejects.toThrow('Service error');

    });
  });

  describe('updateProduct', () => {
    it('should update an existing product and return 200', async () => {
      // Arrange
      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Updated Name' };
      const mockUpdatedProduct = { id: 123, name: 'Updated Name', price: 150 };

      (ProductService.updateProduct as jest.Mock).mockResolvedValue(mockUpdatedProduct);

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(ProductService.updateProduct).toHaveBeenCalledWith(123, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        product: mockUpdatedProduct,
        message: '¡Se actualizó exitosamente el producto!',
      });
    });

    it('should return 404 if product not found', async () => {

      mockReq.params = { id: '999' };
      mockReq.body = { name: 'Does not matter' };

      (ProductService.updateProduct as jest.Mock).mockResolvedValue(null);

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(ProductService.updateProduct).toHaveBeenCalledWith(999, mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 500 if service throws an error', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Broken update' };
      (ProductService.updateProduct as jest.Mock).mockRejectedValue(new Error('Update error'));

      await updateProduct(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'An error occurred while updating the product',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return 200', async () => {

      mockReq.params = { id: '321' };
      (ProductService.deleteProduct as jest.Mock).mockResolvedValue(true);

      await deleteProduct(mockReq as Request, mockRes as Response);

      expect(ProductService.deleteProduct).toHaveBeenCalledWith(321);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: '¡Se ha eliminado el producto con éxito!',
      });
    });

    it('should return 404 if product is not found', async () => {

      mockReq.params = { id: '999' };
      (ProductService.deleteProduct as jest.Mock).mockResolvedValue(false);

      await deleteProduct(mockReq as Request, mockRes as Response);

      expect(ProductService.deleteProduct).toHaveBeenCalledWith(999);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 500 if service throws an error', async () => {

      mockReq.params = { id: '999' };
      (ProductService.deleteProduct as jest.Mock).mockRejectedValue(new Error('Delete error'));

      await deleteProduct(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Ha ocurrido un error al tratar de eliminar el producto',
      });
    });
  });
});
