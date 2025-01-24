import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validateRequest =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => detail.message),
      });
    } else {
      next();
    }
  };
