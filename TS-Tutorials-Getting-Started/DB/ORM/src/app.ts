import express from 'express';

const app = express();
app.use(express.json());
const port = 9000;

app.get('/',function(req,res){
    res.send('test');
})

app.listen(port,()=>{
    console.log('Up and Running...')
})