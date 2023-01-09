import "reflect-metadata";
import express from "express";
import projectRouter from "./router/projectRouter";
import locationRouter from "./router/locationRouter";
import empRouter from "./router/empRouter";
import AppDataSource from "../ormconfig";
const app = express();
app.use(express.json());

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
