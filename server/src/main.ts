import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "ws";

import deskRoutes from "./routes/desks.route";
import { generateApiKey } from "generate-api-key";

import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
export const apiKey = generateApiKey({
  method: "uuidv4",
  prefix: process.env.BUILDING_ID || undefined,
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(bodyParser.json());

app.use("/desks", deskRoutes);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

  // axios.get(`${process.env.REST_API_URL}/v1/messages?group_id=6554f8d6f42cee4c65a5d4c7&device_id=656aeaba2b763a192f382b0e&limit=1`, {
  //     headers: {
  //         'Authorization': `Bearer ${process.env.API_TOKEN}`
  //     }
  // })
  //     .then(res => console.log(res.data))
  //     .catch(err => console.log(err));
});

const wss = new Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  setInterval(() => {
    ws.send("Mockovaná zpráva z WebSocket serveru");
  }, 3000);

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});
