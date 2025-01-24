import express from "express";
import cors from "cors"; // Import cors package
import { productRoutes } from "./routes/productRoutes";

const app = express();
const PORT = 3000;

// Enable CORS for all origins (you can customize this if needed)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use the product routes
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
