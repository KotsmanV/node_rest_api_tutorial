class UserDto{
    constructor(id:number,username:string, email:string,age?:number){
        this.id = id;
        this.username = username;
        this.email = email;
        if(age){
            this.age = age;
        }
    }

    id:number;
    username: string;
    email: string;
    age:number;
}

export{
    UserDto
}