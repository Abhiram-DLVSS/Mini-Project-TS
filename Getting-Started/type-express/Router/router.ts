import express from 'express'
import os from 'os'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config();

const router:express.Router = express.Router();

router.get('/',(req:express.Request,res:express.Response)=>{
    fs.readFile(path.join(__dirname,'..','..','hello-world.js'),'utf-8',(err,data)=>{
        res.status(200).json(JSON.stringify({data:data,path:os.homedir(),secretKey:process.env.SECRET_KEY}));
    })
})

export default router;