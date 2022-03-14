const { Cluster, clusterApiUrl, Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { encodeURL, createQR } = require('@solana/pay');
const BigNumber = require('bignumber.js');
const shop = "dev-dawn-theme-ta-nghi.myshopify.com";
const MERCHANT_WALLET = process.env.MERCHANT_WALLET;
const getQRUrl = async (ctx) => {

    // Check if name, logo or description is provided
    const { variantId, name, totalPrice, orderId, quantity} = ctx.request.body;
    let result = {
        success: false
    }
    try {
        console.log('1. ✅ Establish connection to the network');
        const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');

        /**
         * Simulate a checkout experience
         *
         * Recommendation:
         * `amount` and `reference` should be created in a trusted environment (server).
         * The `reference` should be unique to a single customer session,
         * and will be used to find and validate the payment in the future.
         *
         */
        console.log('2. 🛍 Simulate a customer checkout \n');
        const recipient = new PublicKey(MERCHANT_WALLET);
        const amount = new BigNumber(parseFloat(totalPrice));
        const reference = new Keypair().publicKey;
        const label = `Order of ${shop}`;
        const message = `${name} - quantity ${quantity}`;
        const memo = `ord#${orderId}`;

        /**
         * Create a payment request link
         *
         * Solana Pay uses a standard URL scheme across wallets for native SOL and SPL Token payments.
         * Several parameters are encoded within the link representing an intent to collect payment from a customer.
         */
        console.log('3. 💰 Create a payment request link \n');
        const url = encodeURL({ recipient, amount, reference, label, message, memo });
        // const qrCode = createQR(url);
        // console.log(qrCode);
        result = {
            url: url,
            reference: reference
        }
        return result
    } catch (e) {
        console.log(e);
        return result
    }
    return result;
};

module.exports =  getQRUrl;