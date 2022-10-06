import { UserDto } from "./user.dto";

class AuthenticationDto{
    constructor(user:UserDto){
        this.user = user;
    }

    token:string;
    refreshToken:string;
    user:UserDto;
}

export{
    AuthenticationDto
}