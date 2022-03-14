const connectDB = require('../../middleware/mongodb');
const {
    orderMarkAsPaid,
    orderUpdate
} = require("../../graphql/mutations");
const {
    Customer,
    Shop
} = require("../../models");
const updateOrder = async (ctx) => {
    let result = {
        success: false
    }
    const { orderId, signature, rewardPoints, customerId, domain, appliedPoints } = ctx.request.body
    try {
        let shop = await Shop.findOne({
            domain: domain
        });
        let token = shop.access_token;
        console.log("1. Order Update")
        let orderUpdateRes = await orderUpdate(
            domain,
            token,
            {
                id: orderId,
                customAttributes: [
                    {key: "sol-pay-transaction", value: signature}
                ]
            }
        );
        console.log("\n2. Order Mark as Paid")
        let orderMarkAsPaidRes = await orderMarkAsPaid(
            domain,
            token,
            {
                id: orderId
            }
        )

        // add points to customer here
        let currentPoints = 0;
        let customer = await Customer.findOne({
            customer_id: customerId
        })

        if (customer) {
            currentPoints = customer.points;
        }
        let updatedPoints = currentPoints + parseFloat(rewardPoints) - parseFloat(appliedPoints);
        console.log("Updated Points:", updatedPoints);
        let checkedRule = await Customer.findOneAndUpdate({
            customer_id: customerId
        }, {
            domain: domain,
            customer_id: customerId,
            points: updatedPoints
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

module.exports = connectDB(updateOrder);
