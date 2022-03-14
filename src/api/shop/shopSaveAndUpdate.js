const connectDB = require('../../middleware/mongodb');
const {
    Shop
} = require("../../models");
const shopSaveAndUpdate = async (ctx) => {
    let result = {
        success: false
    }
    const { shop, accessToken } = ctx.session;
    try {
        let checkedShop = await Shop.findOneAndUpdate({
            domain: shop
        }, {
            domain: shop,
            access_token: accessToken,
            status: true
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

module.exports = connectDB(shopSaveAndUpdate);
