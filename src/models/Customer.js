const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let customer = new Schema({
    domain: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: false
    }

});
mongoose.models = {};
let Customer = mongoose.model('Customer', customer);

module.exports = Customer;