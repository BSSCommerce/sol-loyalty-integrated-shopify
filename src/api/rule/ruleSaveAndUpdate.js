const connectDB = require('../../middleware/mongodb');
const {
    Rule
} = require("../../models");
const ruleSaveAndUpdate = async (ctx) => {
    let result = {
        success: false
    }
    const { domain, percentage, point_to_usd, status } = ctx.request.body;
    try {
        let checkedRule = await Rule.findOneAndUpdate({
            domain: domain
        }, {
            domain: domain,
            percentage: percentage,
            point_to_usd: point_to_usd,
            status: status
        }, {upsert: true});

        result = {
            success: true
        }

        return result;
    } catch (e) {
        console.log(e);
        return  result
    }

    return result;

};

module.exports = connectDB(ruleSaveAndUpdate);
