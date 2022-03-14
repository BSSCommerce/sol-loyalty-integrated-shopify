const connectDB = require('../../middleware/mongodb');
const {
    Customer
} = require("../../models");
const getAllCustomer = async (ctx) => {
    let result = {
        success: false
    }
    const { domain } = ctx.request.body;
    try {

        let customers = await Customer.find({
            domain: domain
        });
        result = {
            success: true,
            customers: customers
        }

        return result;
    } catch (e) {
        console.log(e);
        return  result
    }

    return result;

};

module.exports = connectDB(getAllCustomer);
