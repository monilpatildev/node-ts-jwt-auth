import { config } from "dotenv";
config();
import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import initialRoute from "./config/route";
import MongoDBConnection from "./config/db";
import { Server } from "http";

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.json());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error) {
      response
        .status(400)
        .json({ success: false, error: "Invalid JSON syntax." });
    }
    next();
  }
);

const server: Server = app.listen(PORT, () => {
  initialRoute(app);
  MongoDBConnection.connect(`${process.env.MONGODB_URI}`);
  console.log(`Server is running on ${PORT}`);
});
