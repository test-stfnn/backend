import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  category: Joi.string().min(3).max(20).optional(),
  price: Joi.number().positive().optional(),
  quantity: Joi.number().integer().positive().optional(),
});
