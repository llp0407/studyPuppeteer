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

let links = [];
// let data = fs.readFileSync('./allwords.csv');
// let data = fs.readFileSync('./wordlist_ceess-k2.csv')
// let dataArr = data.toString().split('\r\n');
connection.connect();
// console.log(dataArr)
// for(let i=0;i<dataArr.length;i++){
// // for(let i = 0; i<2;i++){
//     let word_item = dataArr[i].replace(/'/g, "\\'");
//     let sql = `INSERT INTO duyin_all (word) VALUES ('${word_item}')`
//     connection.query(sql, function (error, results, fields) {
//         if (error) throw error;
//         console.log('results',results);
//     });
// }
let word =[]
// let sqlNull = `SELECT * FROM duyin_all WHERE uk IS NULL OR us IS NULL`
let sqlNull = `SELECT * FROM duyin_all WHERE uk='失败' OR us='失败'`

function q(){
    return new Promise((res,rej)=>{
        connection.query(sqlNull, function (error, results, fields) {
            if (error) throw error;
            console.log('results',results);
            word = results.map(item => {
                // console.log(item)
                return item.word
            });
            links = word.map(item => {
                // console.log(item)
                return `https://dictionary.cambridge.org/dictionary/english/${item}`
            });
            word = word.map((item)=>{
                let wd = item.replace(/'/g, "\\'");
                return wd
            })
            res(1)
        });
    })
}
var result = [];
(async () => {
    await q()
    console.log(links);
    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 100000
    }));
    const page = await browser.newPage();
    
    // 进入页面
    // let arr = []
    for(let i = 0; i<links.length;i++){
    // for(let i = 0; i<2;i++){
        try{
            await page.goto(links[i])
            await page.waitForSelector(".pos-header");
            const item = await page.$$eval(".pos-header", e => {
                let obj ={}
                if(e[0].querySelectorAll('.uk>.pron').length == 0){
                    obj.uk = ''
                }else{
                    obj.uk = e[0].querySelector(".uk>.pron").innerText
                }
                if(e[0].querySelectorAll('.us>.pron').length == 0){
                    obj.us = ''
                }
                else{
                    obj.us = e[0].querySelector(".us>.pron").innerText
                }
                return obj
            })
            let sql = `UPDATE duyin_all SET uk='${item.uk}',us='${item.us}' WHERE word='${word[i]}'`
            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                console.log('results',results);
            });
            // result.push(item)
            console.log(item)
        }
        catch(e){
            console.log('错误序号,',i,word[i])
            let item= {
                uk:'失败',
                us:'失败'
            }
            let sql = `UPDATE duyin_all SET uk='${item.uk}',us='${item.us}' WHERE word='${word[i]}'`
            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                console.log('results',results);
            });
            // result.push(obj)
            continue;
        }
        
    }
    console.log('结束',result)

    // for(let i=0;i<result.length;i++){
    // // for(let i = 0; i<2;i++){
    //     let sql = `INSERT INTO duyin3 (word, uk,us) VALUES ('${dataArr[i]}', '${result[i].uk}','${result[i].us}')`
    //     connection.query(sql, function (error, results, fields) {
    //         if (error) throw error;
    //         console.log('results',results);
    //     });
    // }

})();


let timeout = function (delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay);
    })
};