
// This is a utility function that wraps asynchronous route handlers in Express.js to handle errors gracefully. It takes a function `fn` as an argument and returns a new function that executes `fn` and catches any errors that occur during its execution. If an error is caught, it passes the error to the next middleware using `next(error)`.
// as well as this utility fn use to handle the error while writing routes in controller file. and avoid to write a code for error handling in every route handler. It helps to keep the code clean and maintainable.


import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn:Function) => async (req:Request,res:Response,next:NextFunction)=>{

    try {

        await fn(req,res,next)

    }catch (error) {
        next(error)
    }

}

export {asyncHandler}
