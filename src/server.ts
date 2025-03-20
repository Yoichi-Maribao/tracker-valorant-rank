import express from "express";
import { generateOutput } from "./lib/util";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

export const server = () => {
  const app: express.Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(PORT, () => {
    console.log(`start on port ${PORT}...`);
  });

  app.get("/", async (req: express.Request, res: express.Response) => {
    const text = await generateOutput();
    res.send(text);
  });
};
