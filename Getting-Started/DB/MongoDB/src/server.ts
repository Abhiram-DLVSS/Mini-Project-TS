import express from "express";
import http from 'http';
import mongoose from "mongoose";
import { config } from "./config/config";
import router from './router/router'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}));
mongoose.set('strictQuery', false);

mongoose.connect(config.mongo.url)
.then(()=>{
    console.log("connected")
    StartServer();
})
.catch(error =>{console.log(error)})

const StartServer = ()=>{
    app.use('/',router);
    app.listen(config.server.port);
}