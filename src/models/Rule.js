const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let rule = new Schema({
    domain: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    point_to_usd: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

});
mongoose.models = {};
let Rule = mongoose.model('Rule', rule);

module.exports = Rule;