// var pdfParser = require('pdf-parser');
const fs =  require('fs');
const path = require('path');
const util = require('util');
var PDF_PATH = path.resolve(__dirname, '../public/easysync-notes.pdf');

// 只能乱序读取到对应的每页的对应texts数组，按照属性不同进行一个文本的划分。
// 比如字体，比如x, 空格
// async function parsePdf(pdfpath){
//     pdfParser.pdf2json(pdfpath, function(error, pdf) {
//         if (error != null) {
//             console.log(error);
//         } else {
            
//             for (let i = 0; i < 10; i++) {
//                 console.log(pdf.pages[0].texts[i]);
//             }
//             console.log(pdf);
//             // console.log(util.inspect(pdf, {depth: null}));
//         }
//     });
// }

// parsePdf(PDF_PATH);


// 这个没有保留属性
// const pdf = require('pdf-parse');
 
// let dataBuffer = fs.readFileSync(PDF_PATH);
 
// pdf(dataBuffer).then(function(data) {
//     console.log(data);
//     // number of pages
//     console.log(data.numpages);
//     // number of rendered pages
//     console.log(data.numrender);
//     // PDF info
//     console.log(data.info);
//     // PDF metadata
//     console.log(data.metadata); 
//     // PDF.js version
//     // check https://mozilla.github.io/pdf.js/getting_started/
//     console.log(data.version);
//     // PDF text
//     console.log(data.text); 
        
// });


// 这个读不到所有的数据
// var pdfreader = require('pdfreader');
// async function reader(callback) {
//     var ri = 0;
// 	new pdfreader.PdfReader()
// 		.parseFileItems(PDF_PATH, function(err, item) {
// 			if (err)
// 				callback(err);
// 			else if (!item)
// 				callback();
// 			else if (item.text) {
// 				// if (ri > 100) {
// 				// 	callback();
//                 // }
//                 // ri++;
// 				// console.log(item.text);
//             }
//             console.log(item.text);
// 		});
// }
// reader(function(){
//     console.log(done);
// });

