import "reflect-metadata";
import express from "express";
import projectRouter from "./router/projectRouter";
import locationRouter from "./router/locationRouter";
import empRouter from "./router/empRouter";

const app = express();
app.use(express.json());

/* Three routes: Employee, Location and Project */
app.use("/employee", empRouter);
app.use("/location", locationRouter);
app.use("/project", projectRouter);

/* Any Invalid route*/
app.use("*", (req, res) => {
  res.status(404).end("Page Not Found");
});

export default app;