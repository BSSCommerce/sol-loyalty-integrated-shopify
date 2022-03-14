const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let shop = new Schema({
    domain: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

});
mongoose.models = {};
let Shop = mongoose.model('Shop', shop);

module.exports = Shop;