const connectDB = require('../../middleware/mongodb');
const {
    Rule,
    Shop
} = require("../../models");
const {
    draftOrderCreate,
    draftOrderComplete
} = require("../../graphql/mutations");
const placeOrder = async (ctx) => {
        let result = {
            success: false
        }
        const { variantId, quantity, shippingAddress, billingAddress, isTheSameBillingShippingAddress, customerId, appliedPoints, domain } = ctx.request.body
        try {
            let shop = await Shop.findOne({
                domain: domain
            });
            let token = shop.access_token;
            let rule = await Rule.findOne({
                domain: domain
            });
            let discountAmount = 0;
            if (rule && appliedPoints && rule.point_to_usd) {
                discountAmount = parseFloat( (rule.point_to_usd * parseFloat(appliedPoints)).toFixed(2) );
            }
            let draftOrderData = {
                lineItems: [
                    {variantId: `gid://shopify/ProductVariant/${variantId}`, quantity: quantity}
                ],
                shippingAddress: shippingAddress,
                billingAddress: isTheSameBillingShippingAddress ? shippingAddress : billingAddress,
                note: "Purchase with SolPay",
                customerId: `gid://shopify/Customer/${customerId}`
            };

            if (discountAmount) {
                draftOrderData = {
                    ...draftOrderData,
                    appliedDiscount: {
                        title: `Applied Reward Points: ${appliedPoints} point(s)`,
                        value: discountAmount,
                        valueType: "FIXED_AMOUNT"
                    }
                }
            }
            console.log("================================")
            console.log("Draft Order Data:", draftOrderData);
            console.log("================================")
            let draftOrderCreateRes = await draftOrderCreate(
                domain,
                token,
                draftOrderData
            )

            let draftOrderId = draftOrderCreateRes.data.draftOrderCreate.draftOrder.id;
            let draftOrderCompleteRes = await draftOrderComplete(
                domain,
                token,
                draftOrderId
            )
            let orderId = draftOrderCompleteRes.data.draftOrderComplete.draftOrder.order.id;
            let totalPriceSet = draftOrderCompleteRes.data.draftOrderComplete.draftOrder.order.totalPriceSet;
            result = {
                success: true,
                orderId: orderId,
                totalPriceSet: totalPriceSet
            }
            return result;
        } catch (e) {
            console.log(e);
            return  result
        }

        return result;

};

module.exports = connectDB(placeOrder);
