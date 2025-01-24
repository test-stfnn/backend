import { Request, Response } from "express";
import * as ProductService from "../services/productService";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const products = await ProductService.getAllProducts(page, limit);

      res.json({
        page,
        limit,
        total: products.length,
        products,
        message: '¡Se cargaron los productos con éxito!',
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching products" });
    }
  };

export const addProduct = async (req: Request, res: Response) => {
  const newProduct = await ProductService.addProduct(req.body);
  res.status(201).json({
    product: newProduct,
    message: '¡Se creó el producto con éxito!'
  });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedProduct = await ProductService.updateProduct(
      Number(req.params.id),
      req.body
    );
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({
        product: updatedProduct,
        message: '¡Se actualizó exitosamente el producto!'
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the product" });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const success = await ProductService.deleteProduct(Number(req.params.id));
      if (!success) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      console.log({ message: '¡Se ha eliminado el producto con éxito!' });
      res.status(200).send({
        message: '¡Se ha eliminado el producto con éxito!'
      });
    } catch (error) {
      res.status(500).json({ message: "Ha ocurrido un error al tratar de eliminar el producto" });
    }
};
