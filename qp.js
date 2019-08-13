const puppeteer = require('puppeteer');
const mysql = require('mysql');
const fs =require('fs');

var all_results= [];
const idx = 1;
(async () => {

    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 1000000
    }));
    const page = await browser.newPage();
    // 进入页面

    await page.goto('https://detail.damai.cn/item.htm?spm=a2oeg.search_category.0.0.7e141ffaM8CLWq&id=593256656719&clicktitle=%E6%9D%8E%E8%8D%A3%E6%B5%A9%E2%80%9C%E5%B9%B4%E5%B0%91%E6%9C%89%E4%B8%BA%E2%80%9D%E4%B8%96%E7%95%8C%E5%B7%A1%E5%9B%9E%E6%BC%94%E5%94%B1%E4%BC%9A%E6%B7%B1%E5%9C%B3%E7%AB%99');
    const click1 = await page.$$eval('.select_right_list_item.sku_item',e=>{
        let isqh = e[2].querySelectorAll('.notticket')
        if(isqh.length == 0){
            //等于0 说明有
            return 
        }
        return e[2].innerText
        // return a.length
    })
    console.log(click1)
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