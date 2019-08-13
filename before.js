const puppeteer = require('puppeteer');
const mysql = require('mysql');
const fs =require('fs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '831015',
    port: '3306',
    database: 'kidsabc'
});
connection.connect();
let sql = `SELECT * FROM prev_code WHERE Grade='Twelfth grade"'`;
let hasData = []
connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    console.log(results)
    hasData = results
});

// var all_results= [];
(async () => {
        
    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 1000000
    }));
    const page = await browser.newPage();
    
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    // 进入页面
    await page.goto('https://www.ixl.com/ela/pre-k');
    await page.waitForSelector('.skill-tree-grade-bubbles.skill-tree-grade-bubbles-us');
    const links = await page.$$eval('.skill-tree-grade-bubbles.skill-tree-grade-bubbles-us>div>a',e=>{
        const data = []
        for(let i=0;i<e.length;i++){
            data.push(e[i].href)
        }
        return data
    })
    console.log(links);
    const gradeArr = await page.$$eval('.skill-tree-grade-bubbles.skill-tree-grade-bubbles-us>div>a',e=>{
        const data = []
        for(let i=0;i<e.length;i++){
            data.push(e[i].querySelectorAll('span')[1].innerText)
        }
        return data
    });
    console.log(gradeArr);
    let results = [];
    // for(let i=0;i<links.length;i++){
    for(let i=13;i<14;i++){
        await page.goto(links[i]);
        await page.waitForSelector('.skill-tree-supercategory');
        const href = await page.$$eval('.skill-tree-skill-link',e=>{
            const data = []
            for(let i2=0;i2<e.length;i2++){
                const obj = {}
                obj.code = e[i2].querySelectorAll('.skill-tree-skill-number')[0].innerText
                obj.href = e[i2].href
                data.push(obj)
            }
            return data
        })
        console.log('href',href)
        //循环当前页所有的小标签
        for(let i2=0;i2<href.length;i2++){
        // for(let i2=0;i2<10;i2++){
            // try{
                if(i2<hasData.length){
                    if(hasData[i2].code==href[i2].code){
                        continue;
                    }
                }
                await page.goto(href[i2].href);
                href[i2].grade = gradeArr[i]
                // await page.waitForSelector('.hover-header');
                await timeout(1500);
                const prev_code = await page.$$eval('.hover-header',e=>{
                    const data = []
                    for(let i3=0;i3<e.length;i3++){
                        let code = e[i3].querySelectorAll('.skill-code')[0].innerText
                        let bq = e[i3].querySelectorAll('.grade-name.unbreakable')[0].innerText
                        data.push(`${bq}-${code}`)
                    }
                    return data
                })
                console.log(i2,prev_code)
                href[i2].prev_code = prev_code
                let sql = `INSERT INTO prev_code (Grade,code,prev_code) VALUES ('${href[i2].grade}','${href[i2].code}','${href[i2].prev_code}')`;
                connection.query(sql, function (error, results, fields) {
                    if (error) throw error;
                    console.log(i2,results)
                });
            // }
            // catch(e){
                // href[i2].prev_code = '超时'
                
                // for(let i3=0;i3<=i2;i3++){
                    // let sql = `INSERT INTO prev_code (Grade,code,prev_code) VALUES ('${href[i3].grade}','${href[i3].code}','${href[i3].prev_code}')`;
                    // connection.query(sql, function (error, results, fields) {
                    //     if (error) throw error;
                    //     console.log(i3,results)
                    // });
                // }
                // console.log(e,i2)
                // browser.close();
                // break;
                // continue;
            // }
            // console.log('prev_code',prev_code)
            
        }
        console.log(href)
        results = results.concat(href)
    }
    console.log(results)
    
    // connection.connect();
    // for(let j=0;j<results.length;j++){
    //     let sql = `INSERT INTO prev_code (Grade,code,prev_code) VALUES ('${results[j].grade}','${results[j].code}','${results[j].prev_code}')`;
    //     connection.query(sql, function (error, results, fields) {
    //         if (error) throw error;
    //         console.log(j,results)
    //     });
    // }
    
    // browser.close()
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