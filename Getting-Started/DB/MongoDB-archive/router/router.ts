import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Game from "../models/game";

const router:express.Router = express.Router();
router.use(express.json());

router.put('/',(req:express.Request,res:express.Response)=>{
    
})
router.get('/', async (req:express.Request,res:express.Response)=>{
    try {
        const games = (await collections.games.find({}).toArray()) as Game[];
 
         res.status(200).send(games);
     } catch (error) {
         res.status(500).send(error);
     }
})
router.post('/',(req:express.Request,res:express.Response)=>{
    
})
router.delete('/',(req:express.Request,res:express.Response)=>{
    
})

export default router;