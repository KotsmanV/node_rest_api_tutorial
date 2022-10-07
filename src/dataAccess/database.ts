
import { Connection, createConnection, DataSource, Repository } from "typeorm";
import { AppDataSource } from "./data-source";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";

class Database{
    public static connection: DataSource;
    public static userRepo:Repository<User>;
    public static tokenRepo:Repository<RefreshToken>;

    public static async initializeRepos(db:DataSource){
        this.userRepo = db.getRepository(User);
        this.tokenRepo = db.getRepository(RefreshToken);
    }
}

export {
    Database
}