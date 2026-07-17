import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";


export const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.params) req.params = parsed.params as any;
      if (parsed.query) req.query = parsed.query as any;

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return next(new ApiError(400, message));
      }
      return next(err);
    }
  };


  