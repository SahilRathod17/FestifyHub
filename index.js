import express from "express";
import Connection from "./database/db.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import Routes from "./routes/route.js";

const app = express();
//dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT || 8000;

Connection(username, password);
app.listen(port, '0.0.0.0', () =>
  console.log(`Server is running successfully on PORT ${port}`)
);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", Routes);
