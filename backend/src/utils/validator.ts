
import validator from 'validator';
import { ApiError } from './ApiError.js';

interface UserData {
    fullName: string;
    emailId: string;
    password: string;
    contactNumber: string;
}

const validate = (data:UserData) =>{

    const mandatoryFields = ['fullName','emailId', 'password']

    const isAllowed = mandatoryFields.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed){
        throw new ApiError(400, "Missing mandatory fields");
    }
    
    if(!validator.isEmail(data.emailId)){
        throw new ApiError(400, "Invalid email format");
    }
    if(!validator.isStrongPassword(data.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    ){
        throw new ApiError(
            400,
            "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
        );
    }
}

export default validate;