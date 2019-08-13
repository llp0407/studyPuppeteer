const download = require('download')
const fs = require('fs')

// download('https://avatar.csdn.net/C/A/2/3_weichuang_1.jpg', 'E:\\pic', { filename: '99' + '.jpg' });

fs.readFile('./pl.txt','utf-8',(err,data)=>{
    console.log(data)
})


console.log('http://baidu.com'.replace('http','https'))
// fs.writeFile('./test2.txt', 'test test', function(err) {
//     if (err) {
//         throw err;
//     }

//     console.log('Saved.');

//     // 写入成功后读取测试
//     fs.readFile('./test2.txt', 'utf-8', function(err, data) {
//         if (err) {
//             throw err;
//         }
//         console.log(data);
//     });
// });