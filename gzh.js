const puppeteer = require('puppeteer');
const mysql  = require('mysql'); 
// const download = require('download');
const fs = require('fs');

var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '831015',       
  port: '3306',                   
  database: 'kidsabc',
  charset:'utf8mb4'
}); 

connection.connect();
// let d = fs.readFileSync('./need_html.txt').toString();
// console.log(d.length);
(async () => {
    const browser = await (puppeteer.launch({
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    // 视频 https://mp.weixin.qq.com/s/6qRhNR8NSfw0YhZtCz_wjg
    // 炉石 https://mp.weixin.qq.com/s/y11wJ5oHaqL8bEm6vXCTtg
    // await page.goto('https://mp.weixin.qq.com/s/42Na0FmtzdG9LBHdDaAbqg'); 
    // 音频   https://mp.weixin.qq.com/s/aOcpChobBnLEZ17Ax8ssyw
    await page.goto('https://mp.weixin.qq.com/s/2iKBWjE2X8xEaD-tksRhNQ');
    await page.waitForSelector('#js_content');
    // await page.waitForSelector('.icon_share_audio_switch');
    // await page.click(".icon_share_audio_switch")
    // const audio = await page.$$eval('body',e=>{
    //     const data=[]
    //     let audioArr = e[0].getElementsByTagName("audio")
    //     for(let i=0;i<audioArr.length;i++){
    //         data.push(audioArr[i].src)
    //     }
    //     return data
    // })
    // console.log(audio)
    const title = await page.$$eval('#activity-name',e=>{
        return e[0].innerText
    })
    console.log(title)
    const author = await page.$$eval('#meta_content',e=>{
        return e[0].innerText
    })
    console.log(author)
    const childrens = await page.$$eval('#js_content',e=>{
        function find_child(node){
            let data = []
            if(node.children.length>0){
                
                for(let i=0;i<node.children.length;i++){
                    let obj = {}
                    obj.tagName = node.children[i].localName
                    if(node.children[i].localName == "img"){
                        obj.imgUrl = node.children[i].dataset.src
                        
                    }
                    obj.sub = find_child(node.children[i])
                    
                    data.push(obj)
                }
            }
            return data
        }
        const first_child = []
        let cont = e[0].children
        for(let i=0;i<cont.length;i++){
            let obj = {}
            obj.tagName = cont[i].localName
            obj.text = cont[i].innerText
            obj.html = cont[i].innerHTML
            obj.sub = find_child(cont[i])

            first_child.push(obj)
        }

        return first_child
    })
    console.log(childrens)
    let has_video = find_video(childrens)
    console.log(has_video)
    fs.writeFile('./test2.txt', JSON.stringify(childrens) , function(err) {
        if (err) {
            throw err;
        }
    });
    let all_html = await page.$$eval('#js_content',e=>{
        return e[0].innerHTML
    })
    let need_html = all_html.replace(/data-src/g,"wait-sss")
    let c = need_html.replace(/src/g,"data-src")
    need_html = c.replace(/wait-sss/g,"src")
    need_html = need_html.replace(/'/g, "\\'");
    fs.writeFile('./need_html.txt', need_html, function(err) {
        if (err) {
            throw err;
        }
    });
    
    let sql = `INSERT INTO rich_text (title,author,has_video,cont) VALUES('${title}','${author}','${has_video}','${need_html}')`;
    connection.query(sql, function (error, results, fields) {
        console.log('results',results);
        if (error) throw error;
        browser.close()
        console.log('结束')
    });
})();

function find_video(arr){
    for(let i=0;i<arr.length;i++){
        if(arr[i].tagName == "iframe"){
            console.log('有视频')
            return true
        }
        else if(arr[i].sub.length>0){
            if(find_video(arr[i].sub)){
                return true
            }
        }
        else{
            continue;
        }
    }
}
