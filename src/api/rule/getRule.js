const connectDB = require('../../middleware/mongodb');
const {
    Rule
} = require("../../models");
const getRule = async (ctx) => {
    let result = {
        success: false
    }
    const { domain } = ctx.request.body;
    try {
        let rule = await Rule.findOne({
            domain: domain
        });

        result = {
            success: true,
            rule: rule
        }

        return result;
    } catch (e) {
        console.log(e);
        return  result
    }

    return result;

};

module.exports = connectDB(getRule);
