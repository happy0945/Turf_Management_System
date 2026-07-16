import { Request, Response } from 'express';
import Turf from "../models/turf.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from '../utils/ApirResponse.js';
import { ApiError } from '../utils/ApiError.js';


// =============== Created ==============
const createTurf = asyncHandler(async (req:Request, res:Response)=>{
    const owner = req.body?._id
    const turf = await Turf.create({
        owner,
        ...req.body   // ...req.body accepts all data without doing it manually and adding owner to the response so it clear who added this turf
    })

    // without above method we can create something like this
    //     Turf.create({
    //     turfName:req.body.turfName,
    //     description:req.body.description,
    //     openingTime:req.body.openingTime,
    //     closingTime:req.body.closingTime,
    //     pricePerSlot:req.body.pricePerSlot,
    //     ...
    // });
    return res.status(201).json(
        new ApiResponse(
            201,
            turf,
            "Turf Created Successfully"
        ),

    );

})
// =============== getAllTurf ===============
const getAllTurf = asyncHandler(async(req:Request, res:Response)=>{
    const turfs = await Turf.find({ status: 'active'}) // status : 'active' means find turf which is active it automatically filter all turf
    return res.status(200).json(
        new ApiResponse(
            200,
            turfs,
            "Turf Fetch Successfully"
        )
    )
})
// =============== getTurfById ================
const getTurfById = asyncHandler(async (req:Request,res:Response)=>{

    const turf = await Turf.findById(req.params.id)

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
