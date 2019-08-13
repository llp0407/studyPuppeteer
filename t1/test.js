const puppeteer = require('puppeteer');
const mysql  = require('mysql'); 
const download = require('download')

var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '831015',       
  port: '3306',                   
  database: 'kidsabc' 
}); 

connection.connect();


// var  addSql = 'INSERT INTO books(id,title,img,content) VALUES(0,?,?,?)';
// var  addSqlParams = ['实打实', '权威','傻狗'];
// //增
// connection.query(addSql,addSqlParams,function (err, result) {
//         if(err){
//             console.log('[INSERT ERROR] - ',err.message);
//             return;
//         }         
// });

(async () => {
    const browser = await (puppeteer.launch({
        // executablePath: '/Users/huqiyang/Documents/project/z/chromium/Chromium.app/Contents/MacOS/Chromium',
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    await page.goto('http://bookdash.github.io/bookdash-books/');

    const links = await page.$eval('.catalogue', e => {
        var data = [];
        var dataHref = e.getElementsByClassName('catalogue-thumbnail');
        for (let i = 0; i < dataHref.length; i++) {
            const element = dataHref[i].getElementsByTagName('a')[0].href;
            data.push(element);
        }
        return data;
    })

    console.log(links)
    const result = []
    for (let i = 0; i < links.length; i++) {
        await page.goto(links[i])
        await page.waitForSelector('#wrapper'); //等待元素加载之后，否则获取不异步加载的元素

        const data = await page.$eval('#wrapper', e => {
            var data = {};
            data.title = e.getElementsByTagName('h1')[0].innerText;
            data.img = e.getElementsByTagName('img')[0].src;
            data.href = e.getElementsByTagName('a')[0].href;
            data.content = e.getElementsByClassName('caption')[0].innerText;
            return data;
        });
        
        result.push(data);
        
    }
    return add(result)

    // 写入文件
    // let writerStream = fs.createWriteStream('content.txt');
    // writerStream.write(result.toString(), 'UTF8');
    // writerStream.end();

})();

async function add(result){
    for(let i=0;i<result.length;i++){
        let data = result[i]
        // await page.goto(data.img)
        // await page.waitForSelector('img');
        await download(data.img.replace('http','https'), 'E:\\pic', { filename: i + '.jpg' });

        var  addSql = 'INSERT INTO books(id,title,img,content) VALUES(0,?,?,?)';
        var  addSqlParams = [data.title, data.img,data.content];
        //增
        connection.query(addSql,addSqlParams,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log('INSERT ID:',result);         
        });
    }
    connection.end()
}
async function xz(filename,img){
    await download(img, 'E:\\pic', { filename: filename + '.jpg' });
}

