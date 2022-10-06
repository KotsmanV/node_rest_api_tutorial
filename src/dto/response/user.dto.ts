class UserDto{
    constructor(id:number,username:string, email:string,age:number){
        this.id = id;
        this.username = username;
        this.email = email;
        this.age = age;
    }

    id:number;
    username: string;
    email: string;
    age:number;
}

export{
    UserDto
}