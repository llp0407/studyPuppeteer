
var mysql = require('mysql');

var ip = 'http://127.0.0.1:3000';
var host = 'localhost';
var pool = mysql.createPool({
    host     : 'localhost',       
    user     : 'root',              
    password : '831015',       
    port: '3306',                   
    database: 'kidsabc' 
});

module.exports = {
    ip    : ip,
    pool  : pool,
    host  : host,
}
// var  addSql = 'INSERT INTO books(id,title,img,content) VALUES(0,?,?,?)';
// var  addSqlParams = [data.title, data.img,data.content];
// //增

  
//   connection.connect();
// connection.query(addSql,addSqlParams,function (err, result) {
//         if(err){
//             console.log('[INSERT ERROR] - ',err.message);
//             return;
//         }         
// })