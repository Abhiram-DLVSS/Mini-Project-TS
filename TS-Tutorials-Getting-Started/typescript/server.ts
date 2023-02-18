import http,{IncomingMessage, OutgoingMessage, Server, ServerResponse} from 'http'
import os from 'os'
import fs from 'fs'
import path from 'path'
import { CustomModule } from './CustomModule'
const port = 9000

const server:Server = http.createServer((req:IncomingMessage,res:ServerResponse)=>{
    res.setHeader('Content-Type','text/json');
    res.statusCode=200;
    fs.readFile(path.join(__dirname,'..','hello-world.js'),'utf-8',(err,data)=>{
        res.end(JSON.stringify({data:data,dataLength:CustomModule.printLength(data),path:os.homedir()}));
    })
    // res.end(os.homedir());
}).listen(port,()=>{console.log(`Running at localhost:${port}`)})