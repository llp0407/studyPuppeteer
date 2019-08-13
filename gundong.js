const fs = require('fs');
const puppeteer = require('puppeteer');
const mysql = require('mysql');

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
    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 100000
    }));
    const page = await browser.newPage();

    await page.goto('https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9479065475966026190%22%7D&n_type=0&p_from=1')
    const body = await page.$$eval("body", e => {
        console.log(e)
        window.scrollTo(0,300)
        return e
    })
    console.log(body)
    
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