import dotenv from "dotenv";
import app from "./app";
import AppDataSource from "../ormconfig";
import { DataSource } from "typeorm";

/* To access the .env file */
dotenv.config();
let port = process.env.port;

const connect=async (AppDataSource:DataSource) => {
  await AppDataSource.initialize()
  .then(() => {
    console.log("Database Connected");
    /* To use AppDataSource across the project*/
    app.set("appDataSource", AppDataSource);

    app.listen(port, () => {
      console.log(`Running at port ${port}`);
    });

  })
  .catch((err) => console.log("database connection failed", err));
}
connect(AppDataSource);

