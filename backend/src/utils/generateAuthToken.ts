
import type {IUser} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAuthToken = (user: IUser) => {
    return jwt.sign(
        {
            _id: user._id,
            emailId: user.emailId,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h",
        }
    );
};
export default generateAuthToken;

