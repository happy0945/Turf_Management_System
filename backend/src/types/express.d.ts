import { HydratedDocument } from "mongoose";
import { IUser } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>;
    }
  }
}

export {};