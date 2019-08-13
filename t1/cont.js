const puppeteer = require('puppeteer');
// const mysql  = require('mysql'); 
// const download = require('download')

// var connection = mysql.createConnection({     
//   host     : 'localhost',       
//   user     : 'root',              
//   password : '831015',       
//   port: '3306',                   
//   database: 'kidsabc' 
// }); 

// connection.connect();


(async () => {
    const browser = await (puppeteer.launch({
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    await page.goto('http://bookdash.github.io/bookdash-books/a-beautiful-day/en/');
    await page.waitForSelector('#wrapper');
    const links = await page.$eval('#wrapper', e => {
        var data = [];
        var item = {};
        item.title = e.getElementsByTagName('h1')[0].innerText;
        item.text = []
        item.img = []
        var p = e.getElementsByTagName('p')
        var img = e.getElementsByTagName('img')
        for (let i = 0; i < p.length; i++) {
            item.text.push(p[i].innerText);
        }
        for (let i = 0; i < img.length; i++) {
            item.img.push(img[i].src);
        }
        data.push(item)
        return data;
    })

    console.log(links)
    // const result = []
    // for (let i = 0; i < links.length; i++) {
    //     await page.goto(links[i])
    //     await page.waitForSelector('#wrapper'); //等待元素加载之后，否则获取不异步加载的元素

    //     const data = await page.$eval('#wrapper', e => {
    //         var data = {};
    //         data.title = e.getElementsByTagName('h1')[0].innerText;
    //         data.img = e.getElementsByTagName('img')[0].src;
    //         data.href = e.getElementsByTagName('a')[0].href;
    //         data.content = e.getElementsByClassName('caption')[0].innerText;
    //         return data;
    //     });
        
    //     result.push(data);
        
    // }
    // return add(result)

})();


