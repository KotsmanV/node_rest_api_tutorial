import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { RefreshToken } from "./RefreshToken";

@Entity()
export class User {

    constructor(username?:string, email?:string, password?:string, age?:number){
        if(username)
            this.userName = username;
        if(email)
            this.email = email;
        if(password)
            this.password = password;
        if(age !== undefined && age != 0)
            this.age = age;
    }


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    password:string;
    @Column()
    email: string;

    @Column()
    age: number;

    @OneToMany(type=> RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken;    
}
