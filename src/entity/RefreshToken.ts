import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
class RefreshToken{
    constructor(user:User, jwtId:string, expiryDate:Date) {
        this.user = user;
        this.jwtId = jwtId;
        this.expiryDate = expiryDate;
    }


    @PrimaryGeneratedColumn("uuid")
    id:string;
    @ManyToOne(type=>User, user => user.refreshTokens)
    user:User;

    @Column()
    jwtId:string;

    @Column({default:false})
    used:boolean;

    @Column({default:false})
    invalidated:boolean;

    @Column()
    expiryDate:Date;

    //Metadata
    @CreateDateColumn()
    creationDate:Date;

    @UpdateDateColumn()
    updateDate:Date;
}

export{
    RefreshToken
}