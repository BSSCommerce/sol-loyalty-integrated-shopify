const draftOrderCreate = require("./draftOrderCreate");
const draftOrderComplete = require("./draftOrderComplete");
const orderMarkAsPaid = require("./orderMarkAsPaid");
const orderUpdate = require("./orderUpdate");

module.exports = {
    draftOrderCreate,
    draftOrderComplete,
    orderUpdate,
    orderMarkAsPaid
}