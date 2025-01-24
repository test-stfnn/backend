import { Product } from "../models/productModel";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(__dirname, "../database/products.json");

export const getAllProducts = async (page: number = 1, limit: number = 1000): Promise<Product[]> => {
  const data = await fs.readFile(dbPath, "utf-8");
  const products: Product[] = JSON.parse(data);

  // Calculate the start index based on the page and limit
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Return the paginated products
  return products.slice(startIndex, endIndex);
};

export const addProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
  const data = await fs.readFile(dbPath, "utf-8");
  const products: Product[] = JSON.parse(data);

  // Calculate the next id based on the highest id in the existing products
  const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  // Create the new product with the calculated id
  const newProduct: Product = { id: nextId, ...productData };

  // Add the new product to the database and save it
  products.push(newProduct);
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2));

  return newProduct;
};

export const updateProduct = async (
  id: number,
  updatedProduct: Partial<Product>
): Promise<Product | null> => {
  const products = await getAllProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updatedProduct };
  await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
  return products[index];
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const products = await getAllProducts();
  const filteredProducts = products.filter((product) => product.id !== id);
  if (filteredProducts.length === products.length) return false;

  await fs.writeFile(dbPath, JSON.stringify(filteredProducts, null, 2));
  return true;
};
