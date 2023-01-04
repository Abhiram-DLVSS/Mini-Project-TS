var http = require('http')

http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'})
    res.write("Hello World!") // The response
    res.end() //Marks the end of responses
}).listen(8080) //  Port of the server