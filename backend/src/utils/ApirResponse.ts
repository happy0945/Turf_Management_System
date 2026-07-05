
// Respons to api request with status code, message and data. This is a utility class that can be used to send a response to the client in a consistent format. It takes in a status code, data and an optional message. If no message is provided, it defaults to "Success". The success property is always set to true.

class ApiResponse {
    statusCode: number;
    message: string;
    data: any;
    success: boolean;

    constructor(statusCode:number,data:any,message:string="Success"){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = true;
    };
}

export { ApiResponse };