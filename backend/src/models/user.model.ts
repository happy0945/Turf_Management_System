import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    emailId: string;
    password: string;
    contactNumber: string;
    role: string;
    avatar:string
}

const userSchema = new Schema<IUser>({

    fullName:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    contactNumber:{
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin','owner'],
        default: 'user'
    },
    avatar:{
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    }

},{
    timestamps:true
})

const User = mongoose.model<IUser>("User", userSchema);

export default User;
