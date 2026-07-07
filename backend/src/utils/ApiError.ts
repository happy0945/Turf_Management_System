class ApiError extends Error {
    public statusCode: number;
    public success: boolean;
    public errors: string[];
    public data: null;

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: string[] = [],
        stack?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace?.(this, this.constructor);
        }
    }
}

export { ApiError };