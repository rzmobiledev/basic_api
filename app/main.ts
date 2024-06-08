import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Router
import userRoutes from "./routes";

dotenv.config();  
const app: Express = express();
const port: number = Number(process.env.HOST_PORT);
const hostname: string = String(process.env.HOST_NAME);

app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => res.send({home: "Welcome Home"}));
app.use("/api", userRoutes);

app.listen(port, hostname, () => console.log(`Server running on http://${hostname}:${port}/`))