// validateRequest.test.ts

import { validateRequest } from '../validateRequest';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type MockResponse = {
  status: jest.MockedFunction<(code: number) => MockResponse>;
  json: jest.MockedFunction<(body: any) => MockResponse>;
} & Partial<Response>;

describe('validateRequest Middleware', () => {
  let req: Partial<Request>;
  let res: MockResponse;
  let next: NextFunction;

  beforeEach(() => {
    // Reset mocks before each test
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(), // allow chaining: res.status(...).json(...)
      json: jest.fn().mockReturnThis(),
    } as unknown as MockResponse;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if validation passes', () => {
    // Example Joi schema
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(0).optional(),
    });

    // Mock request body that passes validation
    req.body = { name: 'John Doe', age: 30 };

    // Call the middleware
    validateRequest(schema)(req as Request, res as Response, next);

    // Expect next() to have been called, no errors
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should respond with 400 and validation details if validation fails', () => {
    // Example Joi schema
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    // Mock request body that fails validation (missing "name")
    req.body = {};

    // Call the middleware
    validateRequest(schema)(req as Request, res as Response, next);

    // Expect next() NOT to have been called
    expect(next).not.toHaveBeenCalled();

    // Check for 400 status
    expect(res.status).toHaveBeenCalledWith(400);

    // Check the JSON response
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array), // we expect an array of error messages
      })
    );
  });

  it('should list all validation errors when abortEarly is false', () => {
    // A schema that expects multiple properties
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    // Provide an empty body so multiple fields are invalid
    req.body = {};

    validateRequest(schema)(req as Request, res as Response, next);

    // Since `abortEarly: false` is used, we should get multiple error messages
    expect(res.status).toHaveBeenCalledWith(400);
    const jsonArg = res.json.mock.calls[0][0]; // The first argument to the first call of res.json
    expect(jsonArg.details.length).toBeGreaterThanOrEqual(2);
  });
});
