import { UserDto } from "./user.dto";

class AuthenticationDto{
    constructor(user:UserDto, token:string, refreshToken:string){
        this.user = user;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    token:string;
    refreshToken:string;
    user:UserDto;
}

export{
    AuthenticationDto
}