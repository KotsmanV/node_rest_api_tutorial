
import { Connection, createConnection, DataSource, Repository } from "typeorm";
import { AppDataSource } from "./data-source";
import { User } from "../entity/User";

class Database{
    public static connection: DataSource;
    public static userRepository:Repository<User>;

    public static async initialize(){
        this.connection = await AppDataSource;
        this.userRepository = this.connection.getRepository(User);
    }
}

export {
    Database
}