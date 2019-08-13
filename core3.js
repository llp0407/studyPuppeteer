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

var data = fs.readFileSync('./corehref.txt');
var href = data.toString().split(',');
var all_results= [];
const idx = 1;
(async () => {

    const browser = await (puppeteer.launch({
        headless: false,
        timeout: 1000000
    }));
    const page = await browser.newPage();

    // 进入页面
    for(let i1=0;i1<href.length;i1++){
    // for(let i1=0;i1<1;i1++){
        
        // await page.goto(href[idx]);
        await page.goto(href[i1]);
        // await page.goto('https://www.ixl.com/standards/common-core/ela/kindergarten');
        const href2 = await page.$$eval('.lk-standards>a',e=>{
            const data = []
            for(let i =0;i<e.length;i++){
                const obj = {}
                obj.standard = (e[i].innerText).replace(/(^\s*)|(\s*$)/g, "")
                obj.href = e[i].href
                data.push(obj)
            }
            return data
        })
        console.log('href2',href2)

        for(let i =0;i<href2.length;i++){
            // let result = {}
            await page.goto(href2[i].href);
            const std_abbr = await page.$$eval("#dv-listing-standards-alignment>h3", e => {
                return e[0].innerText
            })
            // console.log('std_abbr',std_abbr)    //正确
            // result.standard = href2[i].standard
            // result.std_abbr = std_abbr
            const results = await page.$$eval(".listing-category>.each-category", e => {
                let data = []
                // try{
                    for(let i_2=0;i_2<e.length;i_2++){
                        // std_cat
                        // let result = {}
                        // result.std_cat = e[i_2].querySelector('h4').innerText
                        let std_cat = e[i_2].querySelector('h4').innerText
                        //std_code  std_text
                        let level2_li = e[i_2].querySelectorAll('.listing-level2>.each-category')
                        for(let i_3=0;i_3<level2_li.length;i_3++){
                            let level2_h4 = level2_li[i_3].querySelector('h4').innerText
                            //验证的是level2_li 下的h4
                            const reg = /[0-9]/;
                            if(reg.test(level2_h4)){
                                //说明有数字  则level2_h4为std_code和std_text
                                let star = level2_h4.indexOf(' ')
                                // result.std_code = level2_h4.substr(0,star)
                                // result.std_text = level2_h4.substr(star+1)
                                let std_code = level2_h4.substr(0,star)
                                let std_text = level2_h4.substr(star+1)
    
                                if(level2_li[i_3].querySelectorAll('.listing-level3.listing-alignment').length==0){
                                    if(level2_li[i_3].querySelectorAll('ul').length==0){
                                        //没有ul说明结束了
                                        let std_sub_code = ''
                                        let std_sub_text = ''
                                        let ref_code = ''
                                        let ref_text = ''
                                        let result = {
                                            std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                        }
                                        data.push(result)
                                    }
                                    else{
                                        //std_sub_code  std_sub_text
                                        let level3_li = level2_li[i_3].querySelectorAll('.listing-level3>.each-category')
                                        for(let i_4=0;i_4<level3_li.length;i_4++){
                                            let level3_h4 = level3_li[i_4].querySelector('h4').innerText
                                            let star2 = level3_h4.indexOf(' ')
                                            // result.std_sub_code = level3_h4.substr(0,star2)
                                            // result.std_sub_text = level3_h4.substr(star2+1)
                                            let std_sub_code = level3_h4.substr(0,star2)
                                            let std_sub_text = level3_h4.substr(star2+1)
        
                                            let level4_li = level3_li[i_4].querySelectorAll('.listing-level4>.each-alignment')
                                            if(level4_li.length == 0){
                                                let ref_code = ''
                                                let ref_text = ''
                                                let result = {
                                                    std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                                }
                                                data.push(result)
                                            }else{
                                                for(let i_5=0;i_5<level4_li.length;i_5++){
                                                    //ref_code   ref_text
                                                    let level4_a_text = level4_li[i_5].querySelector('a').innerText
                                                    let star3 = level4_a_text.indexOf('(')
                                                    // result.ref_code = level4_a_text.substr(star3)
                                                    // result.ref_text = level4_a_text.substr(0,star3-1)
                                                    let ref_code = level4_a_text.substr(star3)
                                                    let ref_text = level4_a_text.substr(0,star3-1)
                                                    let result = {
                                                        std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                                    }
                                                    data.push(result)
                                                }
                                            }
                                            
                                        }
                                    }
                                    

                                }
                                else{
                                    // let level3_li = level2_li[i_3].querySelectorAll('.listing-level3>.each-category')
                                    // 2019-5-10
                                    let std_sub_code = ''
                                    let std_sub_text = ''
                                    let level3_a = level2_li[i_3].querySelectorAll('.listing-level3.listing-alignment>.each-alignment>a')
                                    for(let i_4=0;i_4<level3_a.length;i_4++){
                                        let level3_a_text = level3_a[i_4].innerText
                                        let star3 = level3_a_text.indexOf('(')
                                        let ref_code = level3_a_text.substr(star3)
                                        let ref_text = level3_a_text.substr(0,star3-1)
                                        let result = {
                                            std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                        }
                                        data.push(result)
                                    }
                                    if(level2_li[i_3].querySelectorAll('.listing-level3.listing-alignment>.each-category').length>0){
                                        let l3_each_category = level2_li[i_3].querySelectorAll('.listing-level3.listing-alignment>.each-category')
                                        for(let i_4_4=0;i_4_4<l3_each_category.length;i_4_4++){

                                            let level4_li = l3_each_category[i_4_4].querySelectorAll('.listing-level4>li')
                                            let level4_h4 = l3_each_category[i_4_4].querySelector('h4').innerText
                                            let star2 = level4_h4.indexOf(' ')
                                            std_sub_code = level4_h4.substr(0,star2)
                                            std_sub_text = level4_h4.substr(star2+1)
                                            for(let i_5=0;i_5<level4_li.length;i_5++){
                                                let level4_a_text = level4_li[i_5].querySelector('a').innerText
                                                let star3 = level4_a_text.indexOf('(')
                                                // result.ref_code = level4_a_text.substr(star3)
                                                // result.ref_text = level4_a_text.substr(0,star3-1)
                                                let ref_code = level4_a_text.substr(star3)
                                                let ref_text = level4_a_text.substr(0,star3-1)
                                                let result = {
                                                    std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                                }
                                                data.push(result)
                                            }

                                        }
                                        
                                    }

                                }
                                

                            }
                            else{
                                let level3_li = level2_li[i_3].querySelectorAll('.listing-level3>.each-category')
    
                                // if(level3_li[i_3].querySelectorAll('.listing-level4.listing-alignment').length==0){
                                for(let i_4=0;i_4<level3_li.length;i_4++){
                                    let level3_h4 = level3_li[i_4].querySelector('h4').innerText
                                    let star = level3_h4.indexOf(' ')
                                    // result.std_code = level3_h4.substr(0,star)
                                    // result.std_text = level3_h4.substr(star+1)
                                    let std_code = level3_h4.substr(0,star)
                                    let std_text = level3_h4.substr(star+1)
                                    if(level3_li[i_4].querySelectorAll('.listing-level4.listing-alignment').length!=0){
                                        let level4_li = level3_li[i_4].querySelectorAll('.listing-level4.listing-alignment>.each-alignment')
                                        for(let i_5=0;i_5<level4_li.length;i_5++){
                                            let level4_a_text = level4_li[i_5].querySelector('a').innerText
                                            let star3 = level4_a_text.indexOf('(')
                                            let ref_code = level4_a_text.substr(star3)
                                            let ref_text = level4_a_text.substr(0,star3-1)
                                            let std_sub_code = ''
                                            let std_sub_text = ''
                                            let result = {
                                                std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                            }
                                            data.push(result)
                                        }
                                    }
                                    else{
                                        
                                        let level4_li = level3_li[i_4].querySelectorAll('.listing-level4>.each-category')
                                        for(let i_5=0;i_5<level4_li.length;i_5++){
                                            let level4_h4 = level4_li[i_5].querySelector('h4').innerText
                                            let star2 = level4_h4.indexOf(' ')
                                            // result.std_sub_code = level4_h4.substr(0,star2)
                                            // result.std_sub_text = level4_h4.substr(star2+1)
                                            let std_sub_code = level4_h4.substr(0,star2)
                                            let std_sub_text = level4_h4.substr(star2+1)

                                            // let level4_li = level3_li[i_4].querySelectorAll('.listing-level4>.each-alignment')
                                            if(level4_li[i_5].querySelectorAll('ul').length != 0){
                                                let level5_li = level4_li[i_5].querySelectorAll('.listing-level5.listing-alignment>.each-alignment')
                                                for(let i_6=0;i_6<level5_li.length;i_6++){
                                                    //ref_code   ref_text
                                                    let level5_a_text = level5_li[i_6].querySelector('a').innerText
                                                    let star3 = level5_a_text.indexOf('(')
                                                    // result.ref_code = level5_a_text.substr(star3)
                                                    // result.ref_text = level5_a_text.substr(0,star3-1)
                                                    let ref_code = level5_a_text.substr(star3)
                                                    let ref_text = level5_a_text.substr(0,star3-1)
                                                    let result = {
                                                        std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                                    }
                                                    data.push(result)
                                                }
                                                
                                            }
                                            else{
                                                // 第五级没有说明没有了
                                                let ref_code = ''
                                                let ref_text = ''
                                                let result = {
                                                    std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text
                                                }
                                                data.push(result) 
                                            }
                                            
                                        }
                                    }
                                    

                                }
                                // }  
                                
                            }
                        }
    
                    }
                // }  //try end
                // catch(e){
                //     data.push({std_cat:'',std_code:'',std_text:'',std_sub_code:'',std_sub_text:'',ref_code:'',ref_text:''})
                // }
                return data
            })
            let afterRes = results.map((item)=>{
                item.standard = href2[i].standard
                item.std_abbr = std_abbr
                return item
            })
            console.log('afterRes',afterRes)
            all_results = all_results.concat(afterRes)
        }
        
        
    } //zuidac

    console.log('all_results',all_results)
    for(let j=0;j<all_results.length;j++){

        for (let key in all_results[j]) {
            all_results[j][key] = all_results[j][key].replace(/'/g, "\\'");
        }

        // let sql = `INSERT INTO core_${idx} (standard,std_abbr,std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text) VALUES('${all_results[j].standard}','${all_results[j].std_abbr}','${all_results[j].std_cat}','${all_results[j].std_code}','${all_results[j].std_text}','${all_results[j].std_sub_code}','${all_results[j].std_sub_text}','${all_results[j].ref_code}','${all_results[j].ref_text}')`;
        let sql = `INSERT INTO core_all (standard,std_abbr,std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text) VALUES('${all_results[j].standard}','${all_results[j].std_abbr}','${all_results[j].std_cat}','${all_results[j].std_code}','${all_results[j].std_text}','${all_results[j].std_sub_code}','${all_results[j].std_sub_text}','${all_results[j].ref_code}','${all_results[j].ref_text}')`;
        
        try{
            await connection.query(sql, function (error, results, fields) {
                console.log('results',results);
                console.log('这条数据',all_results[j])
                if (error) throw error;
                
            });
        }
        catch(e){
            console.log(e)
            // let sql2 = `INSERT INTO core_${idx} (standard) VALUES('err')`;
            let sql2 = `INSERT INTO core_all (standard) VALUES('err')`;
            connection.query(sql2, function (error, results, fields) {
                // if (error) throw error;
                console.log('results',results);
            });
            // continue;
        }
    }
    // all_results.forEach((item)=>{
    //     let sql = `INSERT INTO core (standard,std_abbr,std_cat,std_code,std_text,std_sub_code,std_sub_text,ref_code,ref_text) VALUES('${item.standard}','${item.std_abbr}','${item.std_cat}','${item.std_code}','${item.std_text}','${item.std_sub_code}','${item.std_sub_text}','${item.ref_code}','${item.ref_text}')`;
    //     // var addSqlParams = [item.standard,item.std_abbr,item.std_cat,item.std_code,item.std_text,item.std_sub_code,item.std_sub_text,item.ref_code,item.ref_text];
    //     connection.query(sql, function (error, results, fields) {
    //         if (error) throw error;
    //         // console.log('results',results);
    //     });
    // });
    connection.end();

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