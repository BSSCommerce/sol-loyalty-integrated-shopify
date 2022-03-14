//https://api.diadata.org/v1/foreignQuotation/CoinMarketCap/SOL
var apiHost = "https://sol-loyalty.com/api"
var variantPriceMap = {

};
var solPrice = 0;
var rewardPointRule = null;
var customerPoint = null;
async function getSolPrice() {
    let solPriceReq = await fetch("https://api.diadata.org/v1/foreignQuotation/CoinMarketCap/SOL");
    let solPriceRes = await solPriceReq.json();
    solPrice = solPriceRes["Price"];
}
async function getRule() {
    let getRuleReq = await fetch(`${apiHost}/rule/get-rule`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            domain: Shopify.shop
        })
    });
    let getRuleRes = await getRuleReq.json();
    if (getRuleRes.success && getRuleRes.rule) {
        rewardPointRule = getRuleRes.rule;
    }
}
async function getCustomerPoint() {
    let getCustomerPointReq = await fetch(`${apiHost}/customer/get-customer-point`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            domain: Shopify.shop,
            customerId: loyaltyCustomerId
        })
    });
    let getCustomerPointRes = await getCustomerPointReq.json();
    if (getCustomerPointRes.success && getCustomerPointRes.customer) {
        customerPoint = getCustomerPointRes.customer;
    }
}
function getVariants() {
    let variants = meta.product.variants;
    let select = "<select id='loyalty-variant-select'>"
    for (let i=0; i < variants.length; i++) {
        select += `<option value="${variants[i].id}">${variants[i].name}</option>`;
        variantPriceMap[variants[i].id] = variants[i];
    }
    select += "</select>"
    return select;
}
function insertPopup() {
    let body = document.getElementsByTagName("body")[0];
    let countryElement = document.getElementById("loyalty-countries-options");
    let countryForShipping = "";
    let countryForBilling = "";
    if (countryElement) {
        countryForShipping = countryElement.cloneNode(true);
        countryForShipping.id = "loyalty-countries-options-shipping";
        countryForBilling = countryElement.cloneNode(true);
        countryForBilling.id = "loyalty-countries-options-billing";
    }
    let firstSolPrice = parseFloat(meta.product.variants[0].price)/(100 * parseFloat(solPrice));
    let firstSolPriceString = firstSolPrice.toFixed(4)
    let firstVariantPriceString = (parseFloat(meta.product.variants[0].price)/100).toFixed(2);
    if (!loyaltyCustomerId) {
        body.insertAdjacentHTML("beforeend", `<div id="bss-loyalty-popup">
            <div id="loyalty-sol-pay-btn">Purchase & Get Rewards</div>
        </div>
        <div id="loyalty-product-form" style="display: none">
            <div id="loyalty-product-form-header">
                <h5>Please <a href="/account/login">login</a> to get Reward Point</h5>
            </div>
        </div>`);
    } else {
        let pointElement = '<div></div>';
        if (customerPoint) {
            pointElement = `
                <div id="loyalty-customer-point">
                    <p class="loyalty-form-group-title">Available Points (${customerPoint.points}) - 1 point is equal to ${rewardPointRule.point_to_usd} USD</p>
                    <input type="number" max="${customerPoint.points}" placeholder="Points" name="loyalty-point-usage" id="loyalty-point-usage" />
                </div>
            `
        }
        body.insertAdjacentHTML("beforeend", `<div id="bss-loyalty-popup">
            <div id="loyalty-sol-pay-btn">Purchase & Get Rewards</div>
        </div>
        <div id="loyalty-product-form" style="display: none">
            <div id="loyalty-product-form-header">
                <p>Purchase with Solana Pay and Get Reward Points</p>
            </div>
            <div id="loyalty-product-form-body">
                <div id="loyalty-select-variant">
                    <p class="loyalty-form-group-title">Select variant</p>
                    ${getVariants()} 
                    <div class="selected-price-currency"><span id="selected-price-usd">${firstVariantPriceString}</span><span> USD | </span><span id="selected-price-sol">${firstSolPriceString}</span> <span>SOL</span></div>
                    <p class="loyalty-form-group-title">Quantity</p>
                    <input type="number" name="loyalty-variant-quantity" id="loyalty-variant-quantity" placeholder="Quantity"/>
                </div>
                <div id="loyalty-address-form">
                    
                    <div id="loyalty-shipping-address">
                        <p class="loyalty-form-group-title">Shipping Address</p>
                        <div id="loyalty-shipping-address-country"></div>
                        <input type="text" placeholder="Line address" class="text-field-md-6" name="loyalty-shipping-line-address" id="loyalty-shipping-line-address" />
                        <input type="text" placeholder="Phone number" class="text-field-md-6" name="loyalty-shipping-phone-number" id="loyalty-shipping-phone-number" />
                    </div>
                    <div id="loyalty-address-form-option">
                        <input type="checkbox" id="address-is-the-same" checked/> Billing address is the same
                    </div>
                    <div id="loyalty-billing-address">
                      <p class="loyalty-form-group-title">Billing Address</p>
                      <div id="loyalty-billing-address-country"></div>
                      <input type="text" placeholder="Line address" class="text-field-md-6" name="loyalty-billing-line-address" id="loyalty-billing-line-address" />
                      <input type="text" placeholder="Phone number" class="text-field-md-6" name="loyalty-billing-phone-number" id="loyalty-billing-phone-number" />
                    </div>
                    ${pointElement}
                </div>
            </div>
            <div id="loyalty-product-form-footer">
                <div id="loyalty-product-form-closebtn" class="loyalty-btn">Cancel</div>
                <div id="loyalty-product-form-submitbtn" class="loyalty-btn">Place Order</div>
            </div>
            <div id="loyalty-popup-qr-form" style="display:none;">
                <div class="loyalty-qr-message" id="loyalty-reward-point"></div>
                <div class="loyalty-qr-message">Please use mobile wallet FTX to pay based on this QR code</div>
                <div class="loyalty-qr-message">After that please click on "Paid Order Confirmation" to complete purchase!</div>
                <div id="loyalty-payment-confirm-msg"></div>
                <div id="loyalty-popup-qr-code"></div>
                <div id="loyalty-popup-qr-confirmbtn" class="loyalty-btn">Paid Order Confirmation</div>
            </div>
        </div>`);
        document.getElementById("loyalty-shipping-address-country").appendChild(countryForShipping);
        document.getElementById("loyalty-billing-address-country").appendChild(countryForBilling);
    }

}

function handleRewardPointChange() {
    let rewardPointElm = document.getElementById("loyalty-point-usage");
    if (rewardPointElm) {
        rewardPointElm.addEventListener("change", function() {
            let value = rewardPointElm.value;
            if (value) {
                value = parseFloat(value);
                if (value > customerPoint.points) {
                    rewardPointElm.value = customerPoint.points;
                } else {
                    if (value < 0) {
                        rewardPointElm.value = 0;
                    }
                }
            }
        })
    }
}

function handleSolPayBtn() {
    let solPayBtn = document.getElementById("loyalty-sol-pay-btn");
    if (solPayBtn) {
        solPayBtn.addEventListener("click", function () {
            let loyaltyProductForm = document.getElementById("loyalty-product-form");
            if (loyaltyProductForm) {
                loyaltyProductForm.style.display = "block";
            }
        })
    }
}

function handleVariantSelectorChange() {
    let variantSelectElm = document.getElementById("loyalty-variant-select");
    if (variantSelectElm) {
        variantSelectElm.addEventListener("change", function () {
            let selectedVariantId = variantSelectElm.value;
            let selectedVariant = variantPriceMap[selectedVariantId];
            let priceInUsdElm = document.getElementById("selected-price-usd");
            let priceInSolElm = document.getElementById("selected-price-sol");
            let priceInSol = selectedVariant.price/(100 * parseFloat(solPrice));
            let priceInSolString = priceInSol.toFixed(4)
            let variantPriceString = (selectedVariant.price/100).toFixed(2);
            priceInUsdElm.innerText = variantPriceString;
            priceInSolElm.innerText = priceInSolString;
        })
    }
}

function handleLoyaltyCloseBtn() {
    let loyaltyProductForm = document.getElementById("loyalty-product-form");
    let loyaltyProductFormCloseBtn = document.getElementById("loyalty-product-form-closebtn");
    if (loyaltyProductFormCloseBtn) {
        loyaltyProductFormCloseBtn.addEventListener("click", function () {
            loyaltyProductForm.style.display = "none";
        })

    }
}

async function handleLoyaltySubmitBtn() {
    let submitButton = document.getElementById("loyalty-product-form-submitbtn");
    if (submitButton) {
        submitButton.addEventListener("click", async function () {
            // Form validation here
            // Submit Order Here;
            if (submitButton.classList.contains("loading")) {
                return ;
            }
            submitButton.classList.add("loading");
            submitButton.innerText = "";
            submitButton.innerHTML = `<img src="https://sol-loyalty.com/images/loading.jpg" height="30px" />`
            let appliedPoints = 0;
            let variantId = document.getElementById("loyalty-variant-select").value;
            let quantity = document.getElementById("loyalty-variant-quantity").value;
            let shippingAddressCountry = document.getElementById("loyalty-countries-options-shipping").value;
            let billingAddressCountry = document.getElementById("loyalty-countries-options-billing").value;
            let shippingAddressLineAddress = document.getElementById("loyalty-shipping-line-address").value;
            let billingAddressLineAddress = document.getElementById("loyalty-billing-line-address").value;
            let shippingAddressPhone = document.getElementById("loyalty-shipping-phone-number").value;
            let billingAddressPhone = document.getElementById("loyalty-billing-phone-number").value;
            let isTheSameBillingShippingAddress = document.getElementById("address-is-the-same").checked;
            let pointElement = document.getElementById("loyalty-point-usage");
            if (pointElement) {
                appliedPoints = pointElement.value ? parseFloat(pointElement.value) : 0;
            }
            let orderData = {
                variantId: variantId,
                quantity: parseInt(quantity),
                shippingAddress: {
                    country: shippingAddressCountry,
                    address1: shippingAddressLineAddress,
                    phone: shippingAddressPhone
                },
                billingAddress: {
                    country: billingAddressCountry,
                    address1: billingAddressCountry,
                    phone: billingAddressPhone
                },
                isTheSameBillingShippingAddress: isTheSameBillingShippingAddress,
                appliedPoints: parseFloat(appliedPoints),
                customerId: loyaltyCustomerId,
                domain: Shopify.shop
            }

            let draftOrderCompleteRes = await fetch(`${apiHost}/order/place-order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            let orderDataComplete = await draftOrderCompleteRes.json();
            if (orderDataComplete.success) {
                let totalPriceToSol = parseFloat(orderDataComplete.totalPriceSet.shopMoney.amount)/(100 * parseFloat(solPrice));
                let totalPriceToSolString = totalPriceToSol.toFixed(4)
                await getQrCode(
                    variantId,
                    variantPriceMap[variantId].name,
                    totalPriceToSolString,
                    (parseFloat(orderDataComplete.totalPriceSet.shopMoney.amount)/100).toFixed(2),
                    orderDataComplete.orderId,
                    quantity,
                    appliedPoints
                )
                submitButton.classList.remove("loading");
            }

        })
    }

}

function calculatePoints(rule, usdPrice) {
    let points = parseFloat(rule.percentage) * usdPrice/100;
    return {
        points: points.toFixed(2),
        pointsToUSD: points * rule.point_to_usd
    }
}

async function getQrCode(variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints) {
    let formBody = document.getElementById("loyalty-product-form-body");
    let footer = document.getElementById("loyalty-product-form-footer");
    if (formBody) {
        formBody.style.display = "none";
        footer.style.display = "none";
    }
    let qrForm = document.getElementById("loyalty-popup-qr-form");
    qrForm.style.display = "block";
    let getQrCodeReq = await fetch(`${apiHost}/solpay/get-qr`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            variantId: variantId,
            name: name,
            totalPrice: totalPrice,
            orderId: orderId,
            quantity: quantity
        })
    });
    let getQrCodeRes = await getQrCodeReq.json();
    let qrc = new QRCode(document.getElementById("loyalty-popup-qr-code"), getQrCodeRes.url);
    let rewardPoints = calculatePoints(rewardPointRule, usdPrice);
    let rewardPointsElement = document.getElementById("loyalty-reward-point");
    rewardPointsElement.innerText = `After you complete purchasing, you will be received ${rewardPoints.points} point(s) ~ ${rewardPoints.pointsToUSD} USD `;
    await handlePaymentConfirmation(totalPrice, orderId, getQrCodeRes.reference, rewardPoints.points, appliedPoints);
}

async function handlePaymentConfirmation(totalPrice, orderId, reference, points, appliedPoints) {
    let confirmBtn = document.getElementById("loyalty-popup-qr-confirmbtn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async function () {
            let confirmationReq = await fetch(`${apiHost}/solpay/confirm-transaction`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalPrice: totalPrice,
                    orderId: orderId,
                    reference: reference
                })
            });
            let confirmationRes = await confirmationReq.json();
            let msgElm = document.getElementById("loyalty-payment-confirm-msg");
            if (confirmationRes.success) {
                msgElm.innerText = "Payment Confirmation Success";
                // Do update order here
                let updateOrderRes = await fetch(`${apiHost}/order/update-order`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        signature: confirmationRes.signature,
                        rewardPoints: points,
                        customerId: loyaltyCustomerId,
                        domain: Shopify.shop,
                        appliedPoints: appliedPoints
                    })
                });
            } else {
                msgElm.innerText = "Fail to confirm payment! Please try again";
            }
        })
    }
}

async function main() {
    if (loyaltyCustomerId) {
        await Promise.all(
            [
                getSolPrice(),
                getCustomerPoint(),
                getRule()
            ]
        )
    }
    insertPopup();
    handleSolPayBtn();
    if (loyaltyCustomerId) {
        handleVariantSelectorChange();
        handleRewardPointChange();
        handleLoyaltyCloseBtn();
        handleLoyaltySubmitBtn();
    }
   //getQrCode();
}

main();