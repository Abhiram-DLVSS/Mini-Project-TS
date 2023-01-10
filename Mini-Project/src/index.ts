import "reflect-metadata";
import express from "express";
import projectRouter from "./router/projectRouter";
import locationRouter from "./router/locationRouter";
import empRouter from "./router/empRouter";
import AppDataSource from "../ormconfig";
import dotenv from "dotenv";

/* To access the .env file */
dotenv.config();
let port = process.env.port;

const app = express();
app.use(express.json());

/* To use AppDataSource across the project*/
app.set("appDataSource", AppDataSource);

/* Three routes: Employee, Location and Project */
app.use("/employee", empRouter);
app.use("/location", locationRouter);
app.use("/project", projectRouter);

/* Any Invalid route*/
app.use("*", (req, res) => {
  res.status(404).end("Page Not Found");
});

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});