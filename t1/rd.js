const fs = require('fs')

fs.readFile('./links.txt','utf-8',(err,data)=>{
    console.log(data.split(','))
    
})