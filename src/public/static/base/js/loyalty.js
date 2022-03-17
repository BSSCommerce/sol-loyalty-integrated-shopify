//https://api.diadata.org/v1/foreignQuotation/CoinMarketCap/SOL
var host ="https://app.sol-loyalty.com";
var apiHost = "https://app.sol-loyalty.com/api";
var merchantWalletAddress = "DrobTjE6Jv4dGi2nnQ3YM54zGkixbZcV9i4GmoqUhDkE";
var variantPriceMap = {

};
var solPrice = 0;
var rewardPointRule = null;
var customerPoint = null;
var selectedPaymentMethod = null;
var walletAddress = null;
var totalPriceToSolString = null;
var totalPriceInUSD = null;
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
            <div><img src="${host}/images/favicon.ico" width="30px"></div>
            <div id="loyalty-sol-pay-btn">Purchase & Get Rewards</div>
        </div>
        <div id="loyalty-product-form" style="display: none">
            <div id="loyalty-product-form-header">
                <h5>Please <a href="/account/login">login</a> to Purchase & get Reward Points</h5>
            </div>
        </div>`);
    } else {
        let pointElement = '<div></div>';
        if (customerPoint) {
            pointElement = `
                <div id="loyalty-customer-point">
                    <p class="loyalty-form-group-title">Available Points (${parseFloat(customerPoint.points).toFixed(2)}) - 1 point is equal to ${rewardPointRule.point_to_usd} USD</p>
                    <input type="number" max="${customerPoint.points}" placeholder="Points" name="loyalty-point-usage" id="loyalty-point-usage" />
                </div>
            `
        }
        let paymentMethodElm = `<div id="product-form-payment-method">
                <p class="loyalty-form-group-title">Payment Methods</p>
                <div id="loyalty-form-wallet">
                    <div id="loyalty-phantom-wallet"><img title="Phantom Wallet" src="${host}/images/phantom.png" width="30px"/></div>
                    <div id="loyalty-using-qr-code"><img title="QR Code" src="${host}/images/qr.png" width="30px"/></div> 
                </div>
                <div id="loyalty-form-payment-note"></div>
         
        </div>`
        body.insertAdjacentHTML("beforeend", `<div id="bss-loyalty-popup">
            <div><img src="${host}/images/favicon.ico" width="30px"></div>
            <div id="loyalty-sol-pay-btn">Purchase & Get Rewards</div>
        </div>
        <div id="loyalty-product-form" style="display: none">
            <div id="loyalty-product-form-header">
                <p>Purchase with Solana Pay and Get Reward Points</p>
            </div>
            <div id="loyalty-product-form-body">
                <p id="loyalty-form-err"></p>
                <div id="loyalty-select-variant">
                    <p class="loyalty-form-group-title">Select variant</p>
                    ${getVariants()} 
                    <div class="selected-price-currency"><span id="selected-price-usd">${firstVariantPriceString}</span><span> USD | </span><span id="selected-price-sol">${firstSolPriceString}</span> <span>SOL</span></div>
                    <p class="loyalty-form-group-title">Quantity</p>
                    <input type="number" min="0" name="loyalty-variant-quantity" id="loyalty-variant-quantity" placeholder="Quantity"/>
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
                </div>
                 ${pointElement}
                 ${paymentMethodElm}
            </div>
            <div id="loyalty-product-form-footer">
                <div id="loyalty-product-form-closebtn" class="loyalty-btn">Cancel</div>
                <div id="loyalty-product-form-submitbtn" class="loyalty-btn">Place Order</div>
            </div>
            <div id="loyalty-popup-qr-form" style="display:none;">
                <div class="loyalty-qr-message" id="loyalty-reward-point"></div>
                <div class="loyalty-qr-message">Please use mobile wallet <a href="https://pocketpay.finance/" target="_blank">Pocket Pay</a> to pay with this QR code</div>
                <div class="loyalty-qr-message">After that please click on "Paid Order Confirmation" to complete purchase!</div>
                <div class="loyalty-qr-message" id="loyalty-payment-confirm-msg"></div>
                <div id="loyalty-popup-qr-code"></div>
                <div id="loyalty-popup-qr-confirmbtn" class="loyalty-btn">Paid Order Confirmation</div>
            </div>
            <div id="loyalty-popup-connect-phantom" style="display:none;">
                <div id="loyalty-popup-connecting">
                    <div class="loyalty-popup-connecting-images">
                        <img title="Phantom Wallet" src="${host}/images/solpay.png" width="40px" height="40px"/><img src="${host}/images/loading.gif" width="70px"><img title="Phantom Wallet" src="${host}/images/phantom.png" width="40px" height="40px"/>
                    </div>
                    <p>Opening Phantom...</p>
                </div>
                <div id="loyalty-popup-payment-message">
                    <div id="payment-message-text"></div>
                    <div id="payment-message-price"></div>
                </div>
                <div id="loyalty-wallet-address"></div>
                <div class="loyalty-qr-message"  id="loyalty-wallet-phantom-status"></div>
                <div id="loyalty-popup-phantom-confirmbtn" style="display: none" class="loyalty-btn">Paid Order Confirmation</div>
            </div>
        </div>`);
        document.getElementById("loyalty-shipping-address-country").appendChild(countryForShipping);
        document.getElementById("loyalty-billing-address-country").appendChild(countryForBilling);
    }

}

function handleClose() {
    let form = document.getElementById("loyalty-product-form");
    form.style.display = "none";
    let closeButton = document.getElementById("loyalty-close-button");
    closeButton.remove();
    // Clean UI
    let loyalQRForm = document.getElementById("loyalty-popup-qr-form");
    loyalQRForm.style.display = "none";
    let phantomConnect = document.getElementById("loyalty-popup-connect-phantom");
    phantomConnect.style.display = "none";
    let formBody = document.getElementById("loyalty-product-form-body");
    let footer = document.getElementById("loyalty-product-form-footer");
    if (formBody) {
        formBody.style.display = "block";
        footer.style.display = "flex";
    }
    let formSumitButton = document.getElementById("loyalty-product-form-submitbtn");
    formSumitButton.classList.remove("loading")
    formSumitButton.innerText = "Place Order";
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
    let solPayBtn = document.getElementById("bss-loyalty-popup");
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
function closeBtnNode() {
    let closeButton = document.createElement(`div`);
    closeButton.innerText = "Close";
    closeButton.onclick = handleClose;
    closeButton.id = "loyalty-close-button";
    closeButton.classList.add("loyalty-btn");
    return closeButton;
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

function handleSelectedPaymentMethod() {
    let phantomWallet = document.getElementById("loyalty-phantom-wallet");
    let useQrCode = document.getElementById("loyalty-using-qr-code");
    if (phantomWallet) {
        phantomWallet.addEventListener("click", function () {
            phantomWallet.classList.add("selected-method");
            useQrCode.classList.remove("selected-method");
            selectedPaymentMethod = 1;
        })
    }
    if (useQrCode) {
        useQrCode.addEventListener("click", function () {
            useQrCode.classList.add("selected-method");
            phantomWallet.classList.remove("selected-method");
            selectedPaymentMethod = 2;
        })
    }
}



async function getWalletProvider() {
    if ("solana" in window) {

        await window.solana.connect(); // opens wallet to connect to

        const provider = window.solana;
        if (provider.isPhantom) {
            let connecting = document.getElementById("loyalty-popup-connecting");
            connecting.style.display = "none";
            let priceElement = document.getElementById("loyalty-popup-payment-message");
            let introMessage = document.getElementById("payment-message-text");
            introMessage.innerText = "How would you like to pay?";
            let priceInSolAndUsdElm = document.getElementById("payment-message-price");
            priceInSolAndUsdElm.innerText = `${totalPriceToSolString} SOL | ${totalPriceInUSD} USD`;
            let paidOrderConfirmation = document.getElementById("loyalty-popup-phantom-confirmbtn");
            paidOrderConfirmation.style.display = "block";
            let addressElm = document.getElementById("loyalty-wallet-address");
            walletAddress = provider.publicKey;
            addressElm.innerHTML = `<strong>Address:</strong> ${walletAddress.toString()}`;
            return provider;
        }
    } else {
        let connectPhantom = document.getElementById("loyalty-popup-connect-phantom");
        connectPhantom.style.display = "none";
        let paymentMessage = document.getElementById("loyalty-popup-payment-message");
        paymentMessage.innerHTML = '<p style="text-align: center">Please install <a href="https://www.phantom.app/">https://www.phantom.app/</a></p>';
    }
}


async function handleConnectPhantomWallet(variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints) {
    let formBody = document.getElementById("loyalty-product-form-body");
    let footer = document.getElementById("loyalty-product-form-footer");
    if (formBody) {
        formBody.style.display = "none";
        footer.style.display = "none";
    }
    let connectPhantom = document.getElementById("loyalty-popup-connect-phantom");
    connectPhantom.style.display = "block";
    await getWalletProvider();
    handlePhantomPaymentConfirmation(
        variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints
    )
}


async function phantomTransaction(variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints) {
    if (walletAddress) {
        try {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
            let recentBlockHash = await connection.getRecentBlockhash('finalized');
            let blockhash = recentBlockHash.blockhash;

            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: walletAddress,
                    toPubkey: new solanaWeb3.PublicKey(merchantWalletAddress),
                    lamports: solanaWeb3.LAMPORTS_PER_SOL * parseFloat(totalPriceToSolString)
                }),
            );
            transaction.feePayer = walletAddress;
            transaction.recentBlockhash = blockhash;
            const { signature } = await window.solana.signAndSendTransaction(transaction);
            await connection.confirmTransaction(signature);
            let rewardPoints = calculatePoints(rewardPointRule, usdPrice);
            let updateOrderRes = await fetch(`${apiHost}/order/update-order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    signature: signature,
                    rewardPoints: rewardPoints.points,
                    customerId: loyaltyCustomerId,
                    domain: Shopify.shop,
                    appliedPoints: appliedPoints
                })
            });
            // Order Success Here
            let confirmationMessageElm = document.getElementById("loyalty-wallet-phantom-status");
            confirmationMessageElm.innerText = "Payment Confirmation Success";
            let confirmationBtn = document.getElementById("loyalty-popup-phantom-confirmbtn");
            confirmationBtn.style.display = "none";
            let phantomConnectElement = document.getElementById("loyalty-popup-connect-phantom");
            phantomConnectElement.appendChild(closeBtnNode());
        } catch (e) {
            console.log(e);
        }

    }

}
function handlePhantomPaymentConfirmation(variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints) {
    let phantomPaymentButton = document.getElementById("loyalty-popup-phantom-confirmbtn");
    if (phantomPaymentButton) {
        phantomPaymentButton.addEventListener("click", async function() {
            await phantomTransaction(variantId, name, totalPrice, usdPrice, orderId, quantity, appliedPoints);
        })
    }
}
function validateForm(
    quantity,
    shippingAddressCountry,
    billingAddressCountry,
    shippingAddressLineAddress,
    billingAddressLineAddress,
    shippingAddressPhone,
    billingAddressPhone,
    isTheSameBillingShippingAddress
) {
    let errorElm = document.getElementById("loyalty-form-err");
    if (!quantity || parseInt(quantity) < 0) {
        errorElm.innerText = "Quantity must be a number and greater than zero";
        return false;
    }

    if (shippingAddressCountry == "---") {
        errorElm.innerText = "Please select shipping address country";
        return false;
    }

    if (!shippingAddressLineAddress) {
        errorElm.innerText = "Shipping line address must be not empty";
        return false;
    }

    if (!shippingAddressPhone) {
        errorElm.innerText = "Phone number must be not empty";
        return false;
    }

    if (!isTheSameBillingShippingAddress) {
        if (!billingAddressCountry) {
            errorElm.innerText ="Please select billing address country";
            return false;
        }

        if (!billingAddressLineAddress) {
            errorElm.innerText = "Billing line address must be not empty";
            return false;
        }

        if (!billingAddressPhone) {
            errorElm.innerText = "Phone number must be not empty";
            return false;
        }
    }

    if (!selectedPaymentMethod) {
        errorElm.innerText = "Please select a payment method";
        return false;
    }


    return true;
}
async function handleLoyaltySubmitBtn() {
    let submitButton = document.getElementById("loyalty-product-form-submitbtn");
    if (submitButton) {
        submitButton.addEventListener("click", async function () {
            // if (selectedPaymentMethod == 1) {
            //     await handleConnectPhantomWallet();
            //     return ;
            // }


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

            // Form validation here
            let validateResult = validateForm(
                quantity,
                shippingAddressCountry,
                billingAddressCountry,
                shippingAddressLineAddress,
                billingAddressLineAddress,
                shippingAddressPhone,
                billingAddressPhone,
                isTheSameBillingShippingAddress
            )
            if (!validateResult) {
                submitButton.classList.remove("loading");
                submitButton.innerHTML = "";
                submitButton.innerText = "Place Order";
                return;
            }

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
                let totalPriceToSol = parseFloat(orderDataComplete.totalPriceSet.shopMoney.amount)/parseFloat(solPrice);
                totalPriceInUSD = parseFloat(orderDataComplete.totalPriceSet.shopMoney.amount).toFixed(2)
                totalPriceToSolString = totalPriceToSol.toFixed(4);
                if (selectedPaymentMethod == 1) {
                    await handleConnectPhantomWallet(
                        variantId,
                        variantPriceMap[variantId].name,
                        totalPriceToSolString,
                        totalPriceInUSD,
                        orderDataComplete.orderId,
                        quantity,
                        appliedPoints
                    );
                    return ;
                } else {
                    await getQrCode(
                        variantId,
                        variantPriceMap[variantId].name,
                        totalPriceToSolString,
                        totalPriceInUSD,
                        orderDataComplete.orderId,
                        quantity,
                        appliedPoints
                    )
                    submitButton.classList.remove("loading");
                }

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
                confirmBtn.style.display = "none";
                let qrFormElement = document.getElementById("loyalty-popup-qr-form");
                qrFormElement.appendChild(closeBtnNode());
            } else {
                msgElm.innerText = "Fail to confirm payment! Please try again";
            }
        })
    }
}
function checkIsProductPage() {
    if (meta && meta.page.pageType === "product") {
        return true
    } else if(window.location.pathname.includes("/products/")) {
        return true
    }
    return false;
}
async function main() {
    if (!checkIsProductPage()) {
        return ;
    }
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
        handleSelectedPaymentMethod();
        handleLoyaltyCloseBtn();
        handleLoyaltySubmitBtn();
    }
    //getQrCode();
}

main();