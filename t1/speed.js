const puppeteer = require('puppeteer');
const download = require('download');

(async () => {
    const browser = await (puppeteer.launch({
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    await page.goto('https://notevibes.com/?');
    await page.type('#subject', 'hello world')
    await page.$eval('.container', e => {
        e.getElementsByTagName('select')[1].value = 0.8
    });
    await page.click('input[type=submit]')

    // await page.waitForSelector('.container-fluid');
    await timeout(4000)
    // const href = await page.$$eval('.container-fluid > .container > a', e => {
        
    //     return e.innerHTML
    // });
    const href = await page.evaluate(()=>{
        let c = document.getElementsByClassName('btn btn-primary btn-lg')[0].children[0].href
        return c
    })

    console.log(href)
    // downFile(href)
    await page.goto(href);
})();

function downFile(href){
    download(href, 'E:\\pic', { filename: 'hello'+'.mp3' });
}

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