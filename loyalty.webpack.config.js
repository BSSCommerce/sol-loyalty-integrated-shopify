const path = require('path');

module.exports = {
    optimization: {
        minimize: false
    },
    target: "web",
    entry: './src/js/index.js',
    output: {
        filename: 'solana-loyalty.js',
        path: path.resolve(__dirname, './src/public/static/js'),
    },


};
