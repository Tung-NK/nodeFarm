const { log } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////
///FILE
// // Đồng bộ
// // Đọc 1 tệp 
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// // Ghi vào một tệp khác
// const testOut = `Đây là những gì chúng ta biết về quả bơ: ${textIn}.\n Tạo ngày: ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', testOut);
// console.log('Đã ghi xong');
// // Đồng bộ: 
// // +Xử lí lần lượt theo từng dòng, Dòng sau chờ kqua của dòng trc
// // -> Thao tác chậm




// Bất đồng bộ
// fs.readFile('./txt/startttt.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR! 💥');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File của bạn đã được viết vào');
//             })
//         });
//     });
// });
// console.log('Sẽ đọc file!');


////////////////////////////
/// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Chuỗi JSON được chuyển thành 1 Oject trong JS

const server = http.createServer((req, res) => {
    const pathName = req.url

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is OVERVIEW');
    } else if (pathName === '/product') {
        res.end('This is PRODUCT');
    } else if (pathName === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(data);
    } else {
        res.writeHead(404, { // thiết lập các header của phẩn hồi http
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('Page not fond!')
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log('Đang gửi yêu cầu tới cổng 8000');
});



