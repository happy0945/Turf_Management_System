import { Request, Response } from 'express';
import Turf from "../models/turf.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/ApirResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { CreateTurfInput } from '../utils/validator/turf.validator.js';
import { uploadManyOnCloudinary } from '../utils/cloudinaryUpload.js';


// =============== Created ==============
const createTurf = asyncHandler(async (req:Request, res:Response)=>{

    const body = req.body as CreateTurfInput
    const files = (req.files as Express.Multer.File[])|| [];

    if(files.length === 0)
        throw new ApiError(400,"At least one image is compulsory")

    const uploadedImages = await uploadManyOnCloudinary(files.map((f)=>f.path))

    if (!uploadedImages.length) {
    throw new ApiError(500, "Image upload failed");
}


    const owner = req.body?._id
    const turf = await Turf.create({
        owner,
        images: uploadedImages,
        ...body
    })
    return res.status(201).json(
        new ApiResponse(
            201,
            turf,
            "Turf Created Successfully"
        )

    );

})
// =============== getAllTurf ===============
const getAllTurf = asyncHandler(async(req:Request, res:Response)=>{
     const turfs = await Turf.find({ status: "active" })
        .select("owner turfName location sportsType pricePerSlot rating images")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            turfs,
            "Turfs fetched successfully."
        )
    );
})
// =============== getTurfById ================
const getTurfById = asyncHandler(async (req:Request,res:Response)=>{

    const { turfId } = req.params
    if (!turfId) {
        throw new ApiError(400, "Invalid Turf ID");
    }

    const turf = await Turf.findOne({
        _id: turfId,
        status:"active",
    }).
    select("turfName description location sportsType openingTime closingTime pricePerSlot rating images amenities owner")
    .populate("owner","fullName, emailId")
    .lean();

    // check if turf is available or not
    if(!turf)
    {
        throw new ApiError(
            404,
            "Turf not Found"
        )
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            "Turf Fetch Successfully"
        )
    );

});
// =============== updateTurf =================
const updateTurf = asyncHandler(async (req:Request,res:Response)=>{

    const turf = await Turf.findById(req.params.id)
    if(!turf)
    {
        throw new ApiError(
            404,
            "Turf not Found"
        )
    }
    // check user have a access to edit turf or not
    // bcz middleware check only authorization agr ye nahi kiya to koi bhi owner dusre ka turf bhi edit kar sakta hai
    if(turf.owner.toString() != req.user?._id.toString())
    {
        new ApiError(
            400,
            "You are not allowed to edit turfs"
        )
    }
    const update = await Turf.findOneAndUpdate(
        {_id:req.params.id},
        {$set:req.body},
        {new:true, runValidators:true}
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            update,
            "Turf Update successfully",
        )
    )

})
// =============== DeleteTurf =================
const deleteTurf = asyncHandler(async (req:Request,res:Response)=>{

    const turf = await Turf.findById(req.params.id)
    if(!turf)
    {
        throw new ApiError(
            404,
            "Turf not Found"
        )
    }
    // check user have a access to edit turf or not
    // bcz middleware check only authorization agr ye nahi kiya to koi bhi owner dusre ka turf bhi edit kar sakta hai
    if(turf.owner.toString() != req.user?._id.toString())
    {
        new ApiError(
            400,
            "You are not allowed to delete turfs"
        )
    }
    await Turf.deleteOne()

    return res.status(200).json(
        new ApiResponse(
            200,
            "Turf delete successfully",
        )
    )


})



export {createTurf,getAllTurf, getTurfById,updateTurf,deleteTurf}
