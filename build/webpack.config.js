const path = require('path');
module.exports = {
    mode:'development', // dev or pro
    watch: true,
    entry: path.resolve(__dirname,'../src/main.js'),    // File nhập
    output: {
        filename: 'bundle.js',      // file xuất
        path: path.resolve(__dirname,'../public/js')  // thư mục xuất file
    }
}