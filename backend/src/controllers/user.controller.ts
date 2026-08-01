import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import generateAuthToken from '../utils/generateAuthToken.js';
import validate from "../utils/validator/user.validator.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApirResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import redisClient from '../config/redis.js';

// =============== Register ===================
const registerUser = asyncHandler (async (req: Request, res: Response) => {
        
        // validate request body
        validate(req.body);
        
        const { fullName, emailId, password, contactNumber } = req.body;

        // check if email or contact number already exists
        const existingUser = await User.findOne({
            $or: [{ emailId }, { contactNumber }]
        });

        if (existingUser) {
            if (existingUser.emailId === emailId.trim().toLowerCase()) {
                throw new ApiError(409, "Email is already registered. Please login.");
            }
            if (existingUser.contactNumber === contactNumber) {
                throw new ApiError(409, "Contact number is already registered to another account.");
            }
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
                role: user.role,
                avatar: user.avatar,
            }
        
        // set the token in a cookie and send the response
        res.cookie('token',token, {maxAge: 60*60*1000, httpOnly: true, sameSite: 'lax'});
        res.status(201).json(
            new ApiResponse(
                201,{
                    user:reply,
                    token
                },
                "User registered successfully"
            )
        );

    });

//  =============== Login ===================
const loginUser = asyncHandler (async (req:Request,res:Response)=>{
    
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new ApiError(400, "Email and password are required")
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new ApiError(401,"Invalid credentials. User not found.")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ApiError(401,"Invalid credentials. Wrong password.")
        }
        // set the token in a cookie and send the response
        const token = generateAuthToken(user);

        const reply = {
            _id: user._id,
            fullName: user.fullName,
            emailId: user.emailId,
            contactNumber: user.contactNumber,
            role: user.role,
            avatar: user.avatar,
        };
        
        res.cookie('token',token, {maxAge: 60*60*1000, httpOnly: true, sameSite: 'lax'});

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    user:reply,
                    token
                },
                "User logged in successfully"
            )
        );

})

// =============== logoutUser ================
const logoutUser = asyncHandler (async(req:Request, res:Response)=>{

    // Support both cookie token and Bearer header token
    let token: string | undefined = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    if(!token)
        throw new ApiError(400,"No active session found");

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        if (typeof payload.exp === 'number') {
            await redisClient.set(`token:${token}`, 'Blocked');
            await redisClient.expireAt(`token:${token}`, payload.exp);
        }
    } catch {
        // Token might be expired already, that's fine
    }

    // clear cookie and send response
    res.clearCookie('token');
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));

})

// =============== getProfile ================
const getProfile = asyncHandler (async(req:Request, res:Response)=>{
    const user = req.user;
    if(!user) throw new ApiError(401, "Not authenticated");

    const profile = {
        _id: user._id,
        fullName: user.fullName,
        emailId: user.emailId,
        contactNumber: user.contactNumber,
        role: user.role,
        avatar: user.avatar,
    };

    res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
})

// =============== updateProfile ================
const updateProfile = asyncHandler (async(req:Request, res:Response)=>{
    const user = req.user;
    if(!user) throw new ApiError(401, "Not authenticated");

    const { fullName, contactNumber, avatar } = req.body;

    // Check if new contact number is already used by another user
    if (contactNumber && contactNumber !== user.contactNumber) {
        const existingContact = await User.findOne({
            contactNumber,
            _id: { $ne: user._id }
        });
        if (existingContact) {
            throw new ApiError(409, "Contact number is already registered to another account.");
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            ...(fullName && { fullName }),
            ...(contactNumber && { contactNumber }),
            ...(avatar && { avatar }),
        },
        { new: true, select: '-password' }
    );

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
})

const adminRegister = asyncHandler (async (req: Request, res: Response) => {
        
        // validate request body
        validate(req.body);
        
        const { fullName, emailId, password, contactNumber } = req.body;

        // check if user already exist
        const existingUser = await User.findOne({
            $or: [{ emailId }, { contactNumber }]
        });
        if(existingUser){
            throw new ApiError(409,"Email or contact number already registered");
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
                role: user.role,
            }
        
        // set the token in a cookie and send the response
        res.cookie('token',token, {maxAge: 60*60*1000, httpOnly: true, sameSite: 'lax'});
        res.status(201).json(
            new ApiResponse(
                201,{
                    user:reply,
                    token
                },
                "Admin registered successfully"
            )
        );

    });

const deleteProfile = asyncHandler (async (req: Request, res: Response)=>{

    const userId = req.user?._id;
    await User.findByIdAndDelete(userId)
    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Profile deleted successfully"
        )
    )
})

// =============== registerOwner (admin creates an owner account) ================
const registerOwner = asyncHandler(async (req: Request, res: Response) => {
    validate(req.body);
    const { fullName, emailId, password, contactNumber } = req.body;

    const existingUser = await User.findOne({ $or: [{ emailId }, { contactNumber }] });
    if (existingUser) {
        throw new ApiError(409, "Email or contact number already registered");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullName,
        emailId,
        password: hashPassword,
        contactNumber,
        role: "owner",
    });
    const token = generateAuthToken(user);
    const reply = {
        _id: user._id,
        fullName: user.fullName,
        emailId: user.emailId,
        contactNumber: user.contactNumber,
        role: user.role,
    };
    res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'lax' });
    res.status(201).json(
        new ApiResponse(201, { user: reply, token }, "Owner registered successfully")
    );
});

// =============== getAllUsers (Admin only) ================
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

// =============== updateUserRole (Admin only) ================
const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "owner", "admin"].includes(role)) {
        throw new ApiError(400, "Invalid role specified");
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json(
        new ApiResponse(200, { _id: targetUser._id, role: targetUser.role }, `User role updated to ${role}`)
    );
});

// =============== deleteUserByAdmin (Admin only) ================
const deleteUserByAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const targetUser = await User.findByIdAndDelete(userId);
    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    adminRegister,
    registerOwner,
    deleteProfile,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserRole,
    deleteUserByAdmin,
};

