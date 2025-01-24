import { Router } from "express";
import * as ProductController from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { productSchema } from "../validators/productValidator";

const router = Router();

router.get("/", ProductController.getAllProducts);
router.post("/", validateRequest(productSchema), ProductController.addProduct);
router.put("/:id", validateRequest(productSchema), ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const productRoutes = router;
