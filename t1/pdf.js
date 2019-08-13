const puppeteer = require('puppeteer');
const mysql = require('mysql')
const fs =require('fs')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '831015',
    port: '3306',
    database: 'kidsabc'
});

connection.connect();
const pdfarr = []

connection.query("SELECT name FROM pdf4", function (error, results, fields) {
    if (error) throw error;
    // console.log('results',results);
    for (let i = 0; i < results.length; i++) {
        pdfarr.push(results[i].name)
    }
    console.log(pdfarr)
});

(async () => {
    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 1000000
    }));
    const page = await browser.newPage();
    // 进入页面
    // await page.goto('https://storyweaver.org.in/stories?language=English&level=1&query=&sort=Relevance');
    await page.goto('https://storyweaver.org.in/stories?language=English&level=4&query=&sort=Relevance')
    await timeout(4000)
    //登录
    await page.waitForSelector(".pb-link.pb-link--default.pb-site-nav-link.pb-site-nav-link--default.pb-site-nav-link--respond-font-size");
    const login = await page.$$eval(".pb-link.pb-link--default.pb-site-nav-link.pb-site-nav-link--default.pb-site-nav-link--respond-font-size", e => {
        return e[1].href
    })
    console.log(login)
    await page.goto(login);
    await page.type('#user_email', 'helery@yahoo.com');
    await page.type('#user_password', 'xtabc1901');
    await page.click('#user_remember_me');
    await page.click('input[type=submit]');

    await page.waitForSelector('.pb-link.pb-link--default.pb-book-card__link');
    // grid__container   pb-grid__item   pb-link pb-link--default pb-book-card__link
    //点击加载更多的次数  1级43  2级37  3级17  4级6
    for (let i = 0; i < 6; i++) {
        await page.click(".pb-svg-icon.pb-svg-icon--type-refresh.pb-button__icon-left")
        await timeout(2000)
    }
    const links = await page.$$eval('.pb-link.pb-link--default.pb-book-card__link', e => {
        const data = []
        for (let i = 0; i < e.length; i++) {
            data.push(e[i].href)
        }
        return data
    })
    console.log('links', links)
    fs.writeFile('./links4.txt', links, function(err) {
        if (err) {
            throw err;
        }
    });
    // var links =[];
    // fs.readFile('./links4.txt','utf-8',(err,data)=>{
    //     links = data.split(',')
    // })
    // await timeout(4000)
    const downUrl = [];
    for (let i = 0; i < links.length; i++) {
        let obj = {};
        let index = links[i].lastIndexOf("\/");
        obj.name = links[i].substring(index + 1, links[i].length) + ".pdf";
        obj.url = "http://storyweaver.org.in/v0/stories/download-story/" + obj.name;
        downUrl.push(obj)

    }
    console.log('downUrl', downUrl)
    const failUrl=[]
    for (let i = 0; i < downUrl.length; i++) {
        // 数据库没有该名字则下载
        if(pdfarr.indexOf(downUrl[i].name)==-1){
            try{
                console.log('下载',i)
                await page.goto(downUrl[i].url)
                // await timeout(2000)
            }
            catch(e){
                console.log('下载失败',downUrl[i].url)
                failUrl.push(downUrl[i].url)
                continue;
            }
        }
        else{
            console.log('跳过',i)
            continue;
        }
    }
    console.log('over')
    // console.log(failUrl)
    //点击下载
    // for (let i = 0; i < links.length; i++) {
    //     try{
    //         await page.goto(links[i]);
    //         // await timeout(1000)
    //         await page.waitForSelector(".pb-svg-icon.pb-svg-icon--type-download.pb-svg-icon--push-right");
    //         await page.click(".pb-svg-icon.pb-svg-icon--type-download.pb-svg-icon--push-right")
    //         // await page.waitForSelector(".pb-link.pb-link--default.pb-link--full-width")
    //         // await timeout(1000)
    //         await page.waitForSelector(".pb-link.pb-link--default.pb-link--full-width");
    //         await page.click(".pb-link.pb-link--default.pb-link--full-width")
    //         await timeout(10000)
    //     }
    //     catch(e){
    //         await page.goto(links[i]);
    //         // await timeout(1000)
    //         await page.waitForSelector(".pb-svg-icon.pb-svg-icon--type-download.pb-svg-icon--push-right");
    //         await page.click(".pb-svg-icon.pb-svg-icon--type-download.pb-svg-icon--push-right")
    //         // await page.waitForSelector(".pb-link.pb-link--default.pb-link--full-width")
    //         // await timeout(1000)
    //         await page.waitForSelector(".pb-link.pb-link--default.pb-link--full-width");
    //         await page.click(".pb-link.pb-link--default.pb-link--full-width")
    //         await timeout(10000)
    //     }
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
}