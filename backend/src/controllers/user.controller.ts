import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import generateAuthToken from '../utils/generateAuthToken.js';
import validate from "../utils/validator/user.validator.js";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApirResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import redisClient from '../config/redis.js';

// =============== Register ===================
const registerUser = asyncHandler (async (req: Request, res: Response) => {
        
        // validate request body
        validate(req.body);
        console.log(req.body);
        
        const { fullName, emailId, password, contactNumber } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({emailId})
        if(existingUser){
            throw new ApiError(409,"Email Already exist");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            emailId,
            password: hashPassword,
            contactNumber,
            role: "user"
        });
        // generate a JWT token for the newly registered user
        const token = generateAuthToken(user);

        const reply = {
                _id: user._id,
                fullName: user.fullName,
                emailId: user.emailId,
                contactNumber: user.contactNumber,
            }
        
        // set the token in a cookie and send the response
        res.cookie('token',token, {maxAge: 60*60*1000});
        res.status(201).json(
            new ApiResponse(
                201,{
                    user:reply,
                    token
                },
                "User register Successfully"
            )
        );

    });

//  =============== Login ===================
const loginUser = asyncHandler (async (req:Request,res:Response)=>{
    

        validate(req.body);
        
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new ApiError(400, "Email and password are required")
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new ApiError(401,"Invalid Credentials")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ApiError(409,"Invalid Credentials")
        }
        // set the token in a cookie and send the response
        const token = generateAuthToken(user);

        const reply = {
            _id: user._id,
            fullName: user.fullName,
            emailId: user.emailId,
            contactNumber: user.contactNumber,
        };
        
        res.cookie('token',token, {maxAge: 60*60*1000});

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user:reply,
                    token
                },
                "User Login Successfully"
            )
        );

})

// =============== logoutUser ================
const logoutUser = asyncHandler (async(req:Request, res:Response)=>{

    const {token} = req.cookies;
    if(!token)
        throw new ApiError(404,"Token not Present");
    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as JwtPayload;

    if (typeof payload.exp !== 'number') {
        throw new ApiError(400, 'Invalid token expiry');
    }

    // set token in redis client (use consistent key)
    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // clear cookie and send response
    res.cookie("token",null,{expires: new Date(Date.now())});
    // res.clearCookie('token');
    res.status(200).json(new ApiResponse(200, null, 'User logged out successfully'));

})

const adminRegister = asyncHandler (async (req: Request, res: Response) => {
        
        // validate request body
        validate(req.body);
        
        const { fullName, emailId, password, contactNumber } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({emailId})
        if(existingUser){
            throw new ApiError(409,"User Already exist");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            emailId,
            password: hashPassword,
            contactNumber,
            role: "admin"
        });
        // generate a JWT token for the newly registered user
        const token = generateAuthToken(user);

        const reply = {
                _id: user._id,
                fullName: user.fullName,
                emailId: user.emailId,
                contactNumber: user.contactNumber,
            }
        
        // set the token in a cookie and send the response
        res.cookie('token',token, {maxAge: 60*60*1000});
        res.status(201).json(
            new ApiResponse(
                201,{
                    user:reply,
                    token
                },
                "Admin register Successfully"
            )
        );

    });

const deleteProfile = asyncHandler (async (req: Request, res: Response)=>{

    const userId = req.user?._id;

    await User.findByIdAndDelete(userId)
    res.send(200).json(
        new ApiResponse(
            201,
            "Profile Deleted Successfully"
        )
    )


})



export { registerUser, loginUser,logoutUser,adminRegister,deleteProfile };
