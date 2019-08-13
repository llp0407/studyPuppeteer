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

var pdfarr=[]

connection.query("SELECT name FROM pdf", function (error, results, fields) {
  if (error) throw error;
  // console.log('results',results);
  for(let i=0;i<results.length;i++){
    pdfarr.push(results[i].name)
  }
  console.log(pdfarr)
});
