import "reflect-metadata";
import express from "express";
import projectRouter from "./router/projectRouter";
import locationRouter from "./router/locationRouter";
import empRouter from "./router/empRouter";
import { DataSource } from "typeorm";

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.HOST,
  database: process.env.DB,
  username: process.env.USER,
  password: process.env.PASSWORD,
  port: 1433,
  extra: {
    validateConnection: false,
    trustServerCertificate: true,
  },
  synchronize: true,
  // logging: true,
  entities: ["src/entities/*{.ts,.js}"],
});

AppDataSource.initialize()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("database connection failed", err));

app.set("appDataSource", AppDataSource);
app.use("/employee", empRouter);
app.use("/location", locationRouter);
app.use("/project", projectRouter);

app.use("*", (req, res) => {
  res.status(404).end("Page Not Found");
});

app.listen(9000, () => {
  console.log(`Running at port 9000`);
});
