const path = require('path');
// console.log(path.resolve(__dirname, 'public'));

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    }
};


