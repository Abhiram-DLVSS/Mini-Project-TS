var fs = require('fs')


fs.writeFile('temp.js', 'console.log("written")', function (err) {
    console.log('File Generated');
})
// fs.appendFile

fs.readFile('temp.js', 'utf-8', function (err, data) {
    console.log(data)
});

setTimeout(

    function fsdelete() {
        fs.unlink('temp.js', function (err) {
            console.log('File Deleted')
        })
    }, 10000
)
