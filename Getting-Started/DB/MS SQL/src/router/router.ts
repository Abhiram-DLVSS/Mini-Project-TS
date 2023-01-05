import express from 'express';
import { SqlClient } from 'msnodesqlv8';

const sql:SqlClient = require("msnodesqlv8");
const connectionString = process.env.connectionString||"";

const router: express.Router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/',(req:express.Request,res:express.Response)=>{
    sql.query(connectionString,"SELECT * FROM master.dbo.names",(err,rows) => {
        console.log(rows);
        console.log(err);
    })
    res.status(200).json({"name":"test"});
})

router.post('/',(req:express.Request,res:express.Response)=>{
    const {name} =req.body;
    console.log(`INSERT INTO names (name) VALUES ("${name}");`);
    // sql.query(connectionString,`INSERT INTO names (name) VALUES ("${name}");`,(err,rows) => {
    //     console.log(rows);
    // })
    res.status(200).json({"name":"test"});
})

router.put('/',(req:express.Request,res:express.Response)=>{
    const {name,to} =req.body;
    console.log(`UPDATE names SET name = ${to} WHERE name="${name}"`);
    // sql.query(connectionString,`UPDATE names SET name = ${to} WHERE name="${name}"`,(err,rows) => {
    //     console.log(rows);
    // })
    res.status(200).json({"name":"test"});
})

router.delete('/',(req:express.Request,res:express.Response)=>{
    const {name} =req.body;
    console.log(`delete from names where name="${name}"`);
    sql.query(connectionString,`delete from names where name="${name}"`,(err,rows) => {
        console.log(rows);
    })
    res.status(200).json({"name":"test"});
})

export default router;