import { AppDataSource } from "./dataAccess/data-source";
import { User } from "./entity/User";

import * as express from 'express';
import { Request, Response } from 'express';
import { RegisterDto } from "./dto/request/register.dto";
import { Database } from "./dataAccess/database";
import { PasswordHash } from "./security/passwordHasher";
import { AuthenticationDto } from "./dto/response/authentication.dto";
import { UserDto } from "./dto/response/user.dto";
import { DataSource, Repository } from "typeorm";

const app = express();
let userRepo:Repository<User>;
let db:DataSource;

app.use(express.json());
// Database.initialize();

app.get("/", (req: Request, resp: Response) => {
    resp.send("Fuck you!")
});
app.post("/register", async (req: Request, resp: Response) => {
    try {
        const body: RegisterDto = req.body;

        //validate pass
        if (body.password !== body.repeatPassword) {
            throw new Error("Repeat password does not match password!");
        }

        let existingUser = await userRepo.findOne({
            where:{
                email:body.email
            }
        });
        console.log(existingUser);
        //validate singular email
        if (existingUser){
            throw Error(`Email is already in use.`)
        }

        //store user
        let pass = await PasswordHash.hashPassword(body.password);
        const user = new User(
            body.username,
            body.email  ,
            pass,
            body.age
        );
        
        console.log(`userRepo`,userRepo);
        await userRepo.save(user);

        const authResponse:AuthenticationDto = new AuthenticationDto(
            new UserDto(user.id, user.userName, user.email, user.age)
        );

        resp.json(authResponse);

    } catch (error) {
        resp.status(500).json({
            message: `${(error as Error).message}`
        });
    }

})
app.listen(4000, () => console.log("Listening on fuckin' port", 4000));

AppDataSource.initialize().then(async (connection) => {
    db = connection;
    userRepo = await db.getRepository(User);
    console.log(`connection up: `,connection.isInitialized);
    console.log(`userRepo`,userRepo);
}).catch(error => console.log(error))
