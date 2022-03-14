const path = require('path');

module.exports = {
    optimization: {
        minimize: false
    },
    entry: './src/js/index.js',
    output: {
        filename: 'loyalty.js',
        path: path.resolve(__dirname, './src/public/static/frontend/js'),
    },


};
