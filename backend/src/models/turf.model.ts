import mongoose, { Schema,Types , Document } from "mongoose";

interface CloudinaryImage {
  url: string;
  public_id: string;
}
export interface ITurf extends Document{
    owner: Types.ObjectId,
    turfName: string,
    description: string,
    location:{
        type:"Point",
        coordinates:[number,number],
        address:string,
        city:string
    },
    sportsType: string[],
    openingTime:string,
    closingTime:string,
    slotDuration:number,
    pricePerSlot:number,
    amenities:string[],
    images:CloudinaryImage[],
    rating:number,
    totalReviews:number,
    status:'active'|'inactive',

}

const turfSchema = new Schema<ITurf>({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    turfName:{
        type: String,
        required: true,
        maxLength: 150,
        trim:true,
    },
    description:{
        type:String,
        required: true,
        minLength: 20,
        maxLength:500,
        trim: true
    },
    location:{
        type:{
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates:{
            type:[Number],   // for store longitude and latitude
            required: true
        },
        address:{
            type:String,
            required: true,
            trim:true
        },
        city:{
            type: String,
            required: true,
            trim: true
        }
    },
    sportsType:{
        type: [String],
        required: true,
        enum : ["Cricket", "Football", "Basketball", "Badminton"],
    },
    openingTime:{
        type : String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    closingTime:{
        type : String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    slotDuration:{
        type : Number,
        required: true,
        enum: [30,60,90,120],
    },
    pricePerSlot:{
        type: Number,
        required: true,
        min: 0
    },
    amenities:[
        {
            type: String,
            required: true
        }
    ],
    images: [
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
],
    rating:{
        type:Number,
        default: 0,
        min: 0,
        max : 5,
    },
    totalReviews:{
        type:Number,
        default: 0
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    }
},{
    timestamps:true,
})

turfSchema.index({
    location: "2dsphere"
});
const Turf = mongoose.model<ITurf>("Turf", turfSchema);
export default Turf;
