import { Request, Response } from 'express';
import Turf from "../models/turf.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/ApirResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { CreateTurfInput } from '../utils/validator/turf.validator.js';
import { deleteManyFromCloudinary, uploadManyOnCloudinary } from '../utils/cloudinaryUpload.js';


// =============== Created ==============

const createTurf = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateTurfInput;

  const files = (req.files as Express.Multer.File[]) || [];

  if (files.length === 0) {
    throw new ApiError(400, "At least one image is compulsory");
  }

  const uploadedImages = await uploadManyOnCloudinary(
    files.map((file) => file.path)
  );

  if (!uploadedImages.length) {
    throw new ApiError(500, "Image upload failed");
  }

  const turf = await Turf.create({
    owner: req.user!._id, // <-- authenticated user

    turfName: body.turfName,
    description: body.description,

    location: {
      type: "Point",
      coordinates: [body.longitude, body.latitude],
      address: body.address,
      city: body.city,
    },

    sportsType: body.sportsType,
    openingTime: body.openingTime,
    closingTime: body.closingTime,
    slotDuration: body.slotDuration,
    pricePerSlot: body.pricePerSlot,
    amenities: body.amenities,

    images: uploadedImages,
  });

  return res.status(201).json(
    new ApiResponse(201, turf, "Turf created successfully")
  );
});
// =============== getAllTurf ===============
const getAllTurf = asyncHandler(async(req:Request, res:Response)=>{
     const turfs = await Turf.find({ status: "active" })
        .select("owner turfName description location sportsType pricePerSlot slotDuration openingTime closingTime rating images amenities status")
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

// =============== getMyTurfs (Owner only) ===============
const getMyTurfs = asyncHandler(async(req:Request, res:Response)=>{
    const ownerId = req.user!._id;

    const turfs = await Turf.find({ owner: ownerId })
        .select("owner turfName description location sportsType pricePerSlot slotDuration openingTime closingTime rating images amenities status")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, turfs, "Your turfs fetched successfully.")
    );
})
// =============== getTurfById ================
const getTurfById = asyncHandler(async (req:Request,res:Response)=>{

    const { turfId } = req.params
    console.log("TurfId: ", turfId)
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
            turf,
            "Turf Fetch Successfully"
        )
    );

});
// =============== updateTurf =================
const updateTurf = asyncHandler(async (req:Request,res:Response)=>{

    const {id} = req.params
    const body = req.body as CreateTurfInput & {removeImagesId?: string[]};
    const files = (req.files as Express.Multer.File[])|| [];


    const turf = await Turf.findById(id)

    if(!turf)
        throw new ApiError(404,"Turf not Found")

    if(turf.owner.toString() != req.user?._id.toString())
        throw new ApiError(403,"You are not allowed to edit turfs")

    // update the turf
    if(body.turfName !== undefined) turf.turfName = body.turfName
    if(body.description !== undefined) turf.description = body.description
    if(body.sportsType !== undefined) turf.sportsType = body.sportsType
    if(body.amenities !== undefined) turf.amenities = body.amenities
    if(body.openingTime !== undefined) turf.openingTime = body.openingTime
    if(body.closingTime !== undefined) turf.closingTime = body.closingTime
    if(body.pricePerSlot !== undefined) turf.pricePerSlot = body.pricePerSlot
    if(body.slotDuration !== undefined) turf.slotDuration = body.slotDuration

    // nested location fields
    if(body.address !== undefined) turf.location.address = body.address
    if(body.city !== undefined) turf.location.city = body.city
    if(body.longitude !== undefined || body.latitude !== undefined){
        const [currentLongi, currentLatti] = turf.location.coordinates
        turf.location.coordinates = [
            body.latitude ?? currentLatti,
            body.longitude ?? currentLongi
        ]
    }

    // remove old image from cloudinary + array
    if(body.removeImagesId && body.removeImagesId.length > 0){
        const idToRemove = new Set(body.removeImagesId)
        await deleteManyFromCloudinary(Array.from(idToRemove))
        turf.images.filter((img:any)=> !idToRemove.has(img.public_id));
    }

    if(files.length > 0)
    {
        const upload = await uploadManyOnCloudinary(files.map((f)=>f.path))
        turf.images.push(...upload)
    }
    if(turf.images.length === 0)
        throw new ApiError(400, "At least one images is must to upload")

    await turf.save()

    return res.status(200).json(
        new ApiResponse(200,turf,"Turf Update successfully",)
    )

})

// =============== UpdateStatus ================

const updateStatus = asyncHandler(async (req:Request, res:Response)=>{

    const {id} = req.params;
    const {status} = req.body as {status : 'active' | 'inactive'};

    const turf = await Turf.findById(id)
    if(!turf)
        throw new ApiError(404,"Turf not Found")

    const isOwner = turf.owner.toString() == req.user?._id.toString();
    const isAdmin = req.body?.role == "admin";

    if(!isOwner && !isAdmin)
        throw new ApiError(403,"You are not allowed to update the status")

    turf.status = status;
    await turf.save()

    return res.status(200).json(
        new ApiResponse(200, turf, "Turf status updated successfully")
    )

})


// =============== DeleteTurf =================
const deleteTurf = asyncHandler(async (req:Request,res:Response)=>{

    const {id} = req.params
    const turf = await Turf.findById(id)
    if(!turf){
        throw new ApiError(404,"Turf not Found")
    }
    const isOwner = turf.owner.toString() == req.user?._id.toString();
    const isAdmin = req.body?.role == "admin";
    if(!isOwner && !isAdmin)
        throw new ApiError(403,"You are not allowed to update the status")

    const publicId = turf.images.map((img: any)=> img.public_id)

    try {
        await deleteManyFromCloudinary(publicId)
    } catch (error) {
        console.error(`Failed to delete cloudinary images for turf ${id}:`, error);
    }
    await Turf.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200,"Turf delete successfully",)
    )

})



export {createTurf,getAllTurf,getMyTurfs, getTurfById,updateTurf,deleteTurf,updateStatus}
