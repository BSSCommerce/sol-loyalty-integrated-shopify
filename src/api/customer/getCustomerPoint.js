const connectDB = require('../../middleware/mongodb');
const {
    Customer
} = require("../../models");
const getCustomerPoint = async (ctx) => {
    let result = {
        success: false
    }
    const { domain, customerId } = ctx.request.body;
    try {
        let customer = await Customer.findOne({
            domain: domain,
            customer_id: customerId
        });

        result = {
            success: true,
            customer: customer
        }

        return result;
    } catch (e) {
        console.log(e);
        return  result
    }

    return result;

};

module.exports = connectDB(getCustomerPoint);
