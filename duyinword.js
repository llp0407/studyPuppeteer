const fs = require('fs');
const puppeteer = require('puppeteer');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '831015',
    port: '3306',
    database: 'kidsabc'
});
let sqldy1 = `SELECT word FROM duyin`
let sqldy2 = `SELECT word FROM duyin2`
let sqlAll = `SELECT word FROM duyin_all`
let has_word = []
// sql_word(sqldy1).then(res=>{
//     // console.log(res)
//     return sql_word(sqldy2)
// })
//     .then(res=>{
//         console.log(res)
//     })
async function need_word(){
    has_word = has_word.concat(await sql_word(sqldy1))
    has_word = has_word.concat(await sql_word(sqldy2))
    console.log(has_word)
    let all_word = await sql_word(sqlAll)
    console.log(all_word)
    let wordArr = all_word.filter(key => !has_word.includes(key))
    console.log(wordArr)
    wordArr = wordArr.map((item)=>{
        return item.replace(/'/g, "\\'");
    })
    for(let i=0;i<wordArr.length;i++){
        try{
            let sql = `INSERT INTO duyin3 (word) VALUES ('${wordArr[i]}')`
            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                console.log('results',results);
            });
        }
        catch(e){
            console.log(`${wordArr[i]}错误`)
        }
    }
}
need_word()
function sql_word(sql){
    return new Promise((res,rej)=>{
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            // console.log('results',results);
            let word = []
            results.forEach((item)=>{
                word.push(item.word)
            })
            // links = word.map(item => {
            //     // console.log(item)
            //     return `https://dictionary.cambridge.org/dictionary/english/${item}`
            // });
            res(word)
        });
    })
}










function ConvertToTable(data, name) {
    return new Promise((res, rej) => {
        data = data.toString();
        var table = [];
        var rows = [];
        rows = data.split("\r\n");

        var column = rows[0].split(`,`);
        for (var i = 1; i < rows.length; i++) {
            if (rows[i] != '') {
                var columnText = rows[i].substring(1, rows[i].length - 1).split(`","`);
                var csv = {};
                try {
                    for (let j = 0; j < column.length; j++) {
                        if (columnText[j] != undefined) {
                            var a = columnText[j].replace(new RegExp(`""`, "gm"), `'`);
                            a = a.replace(`['`, `["`);
                            a = a.replace(`']`, `"]`);
                            a = a.replace(new RegExp(`', '`, "gm"), '", "');
                            a = a.replace(new RegExp(`", '`, "gm"), '", "');
                            a = a.replace(new RegExp(`', "`, "gm"), '", "');
                            a = a.replace(new RegExp(`, '`, "gm"), ', "');
                            a = a.replace(new RegExp(`', `, "gm"), '", ');

                            csv[column[j]] = JSON.parse(a);

                            // csv[column[j]] = columnText[j].substring(1, columnText[j].length - 1).replace(new RegExp("'", "gm"), '').split(`, `);
                        }
                    }
                } catch (error) {
                    console.log("有问题的csv\t" + name);
                    break;
                }
                table.push(csv);
            }
        }
        // return table
        res(table)
    })

}