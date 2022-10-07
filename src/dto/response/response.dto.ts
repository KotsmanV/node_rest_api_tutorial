interface ApiResponse{
    errors:string[],
    data:object,
    statusCode:number
}

class ApiResponse implements ApiResponse{
    constructor(statusCode:number, data?:any, errors?:string[], ){
        this.data = data;
        this.errors = errors ? errors : [];
        this.statusCode = statusCode;
    }
}

export{
    ApiResponse
}