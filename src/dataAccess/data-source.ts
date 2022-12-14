import "reflect-metadata"
import { DataSource } from "typeorm"
import { RefreshToken } from "../entity/RefreshToken"
import { User } from "../entity/User"

export const AppDataSource = new DataSource({
    type:"sqlite",
    database:"node_api_tutorial_DB2.db",
    synchronize: true,
    logging: false,
    entities: [User,RefreshToken],
    migrations: [],
    subscribers: [],
})


