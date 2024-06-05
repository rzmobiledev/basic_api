import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Router
import userRoutes from "./routes";

dotenv.config();
const app: Express = express();
const port = Number(process.env.HOSTPORT);
const host = String(process.env.HOST);

app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => res.send({home: "Welcome Home"}));
app.use("/api", userRoutes);

app.listen(port, host, () => console.log(`Server running on port ${port}`))