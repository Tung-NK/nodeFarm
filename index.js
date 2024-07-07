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
const replaceTemplate = (temp, product) => {
    // Nhận vào temp: 1 chuỗi HTML thay thế thông tin sản phẩm
            //product: một object để chứa thông tin sản phẩm
            
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
        // replace(): 
        //temp: lấy chuỗi temp và thay thế tất cả các ký hiệu {%PRODUCTNAME%} 
        //      trong đó bằng giá trị product.productName.
        // Biểu thức chính quy /g được sử dụng để tìm và thay thế tất cả 
        // các lần xuất hiện của ký hiệu, không chỉ một lần
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Chuỗi JSON được chuyển thành 1 Oject trong JS

const server = http.createServer((req, res) => {
    const pathName = req.url
    // Overview Page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' }); // thiết lập header HTTP để chỉ định rằng nội dung trả về là HTML.
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        // dataObj.map: duyệt qua dữ liệu trong file api
        // lấy ra các phần tử trả về hàm  replaceTemplate
        // lúc này temp = tempCard, product = phần tử đã duyệt 
        //join('') gom thành 1 chuoix HTML hoàn chỉnh vì map trả về mảng
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardHtml);
        // console.log(cardHtml);

        res.end(output);

        // Product page    
    } else if (pathName === '/product') {
        res.end('This is PRODUCT');
        //API
    } else if (pathName === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(data);

        //Not found
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



