
// Basically in this we are creating a custom error class called `ApiError` that extends the built-in `Error` class in JavaScript. This class is used to represent API errors in a structured way, allowing you to specify an HTTP status code and an error message when creating an instance of the class. The `ApiError` class can be used throughout your application to handle and communicate errors consistently.



class ApiError extends Error {
    public statusCode: number;
    errors: any[];
    data: any;
    success: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        
        if(stack){
            this.stack = stack;
        }else{
            // Error.captureStackTrace is specific to Node.js/V8
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            } else {
                this.stack = new Error(message).stack; // Fallback for non-Node environments
            }
        }

    }
}

export { ApiError };