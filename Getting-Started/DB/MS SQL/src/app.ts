import express from 'express';
import dotenv from 'dotenv';
import router from './router/router'
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT||9000;

app.use('/',router);

app.listen(port,()=>{console.log(`Running at port ${port}`)})
