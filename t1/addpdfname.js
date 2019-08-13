const fs = require('fs')
const mysql = require('mysql')

var connection = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'root',              
    password : '831015',       
    port: '3306',                   
    database: 'kidsabc' 
}); 

connection.connect();

fs.readdir('../谷歌下载/pdf4',(err,data)=>{
    console.log(data)
    data.forEach(item=>{
        var  addSql = 'INSERT INTO pdf4(name) VALUES(?)';
        var  addSqlParams = [item];
        connection.query(addSql,addSqlParams,function (err, result) {
            if(err){
             console.log('[INSERT ERROR] - ',err.message);
             return;
            }        
           console.log('--------------------------INSERT----------------------------');
           //console.log('INSERT ID:',result.insertId);        
           console.log('INSERT ID:',result);
           console.log('-----------------------------------------------------------------\n\n');  
        });
    })
    connection.end()
})