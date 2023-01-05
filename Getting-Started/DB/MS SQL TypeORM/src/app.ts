import "reflect-metadata";
import express from "express";
import router from "./router/router";

const app = express();
app.use(express.json());
const port = process.env.PORT || 9000;

app.use("/", router);

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
