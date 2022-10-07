import { AppDataSource } from "./dataAccess/data-source";
import * as express from 'express';
import { Request, Response } from 'express';
import { Database } from "./dataAccess/database";
import { registerUser, login, refreshToken } from "./handlers/account.handler";

const app = express();
app.use(express.json());

app.get("/", (req: Request, resp: Response) => {
    resp.send("Test!")
});

app.post("/register", async (req: Request, resp: Response) => {
    const response = await registerUser(req.body);
    resp.writeHead(response.statusCode);
    resp.write(JSON.stringify(response));
    resp.end();
});

app.post("/login", async (req: Request, resp: Response) => {
    const response = await login(req.body);
    resp.writeHead(response.statusCode);
    resp.write(JSON.stringify(response));
    resp.end();
});

app.post("/refresh/token", async (req: Request, resp: Response) => {
    const response = await refreshToken(req.body);
    resp.writeHead(response.statusCode);
    resp.write(JSON.stringify(response));
    resp.end();
})

app.listen(4000, () => console.log("Listening on port", 4000));

AppDataSource.initialize().then(async (connection) => {
    Database.initializeRepos(connection);
}).catch(error => console.log(error))
