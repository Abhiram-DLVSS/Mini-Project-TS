import express from 'express'
import http,{IncomingMessage, OutgoingMessage, Server, ServerResponse} from 'http'
import os from 'os'
import fs from 'fs'
import path from 'path'
const router:express.Router = express.Router();

router.get('/',(req:express.Request,res:express.Response)=>{
    fs.readFile(path.join(__dirname,'..','..','hello-world.js'),'utf-8',(err,data)=>{
        res.status(200).json(JSON.stringify({data:data,path:os.homedir()}));
    })
})

export default router;