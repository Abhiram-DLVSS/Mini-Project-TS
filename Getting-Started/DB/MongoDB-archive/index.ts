import express from 'express'
import dotenv from 'dotenv'
import router from './router/router'
import { connectToDatabase } from "./services/database.service"


dotenv.config();
const port = 9000;

const app:express.Application = express();
app.use(express.json());

// app.use('/',router)

connectToDatabase()
    .then(() => {
        app.use("/games", router);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

app.listen(port,()=>{console.log(`Running at localhost:${port}`)})