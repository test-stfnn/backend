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
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as MockResponse;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if validation passes', () => {

    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(0).optional(),
    });

    req.body = { name: 'John Doe', age: 30 };

    validateRequest(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should respond with 400 and validation details if validation fails', () => {

    const schema = Joi.object({
      name: Joi.string().required(),
    });

    req.body = {};

    validateRequest(schema)(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array),
      })
    );
  });

  it('should list all validation errors when abortEarly is false', () => {

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    req.body = {};

    validateRequest(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.details.length).toBeGreaterThanOrEqual(2);
  });
});
