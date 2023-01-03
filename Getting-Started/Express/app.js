const express = require('express');

const app = express();
const port=9000;

app.get('/',function(req,res){
    res.send("Home Page")
});

app.get('/book',function(req,res){
    res.send("Books Title Page")
});

app.get('/book/:id',function(req,res){
    console.log(req.params.id);
    res.send("Books Title Page")
});

app.listen(port,function(req,res){
    console.log('Server is up and running at localhost:%d',port)
});