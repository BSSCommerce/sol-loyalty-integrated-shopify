const { Cluster, clusterApiUrl, Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { encodeURL, createQR, findTransactionSignature, validateTransactionSignature } = require('@solana/pay');
const BigNumber = require('bignumber.js');
const shop = "dev-dawn-theme-ta-nghi.myshopify.com";
const MERCHANT_WALLET = process.env.MERCHANT_WALLET;
const confirmTransaction = async (ctx) => {

    // Check if name, logo or description is provided
    const { totalPrice, orderId, reference } = ctx.request.body;
    let result = {
        success: false
    }
    try {
        let referenceToKey = new PublicKey(reference);
        const amount = new BigNumber(parseFloat(totalPrice));
        console.log('1. ✅ Establish connection to the network');
        const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
        console.log("Reference:", reference);
        console.log('\n2. Find the transaction');
        let signatureInfo = await findTransactionSignature(connection, referenceToKey, undefined, 'confirmed');
        console.log('\n 🖌  Signature found: ', signatureInfo.signature);

        console.log('\n3. 🔗Validate transaction \n');
        let signature = signatureInfo.signature;
        let validateTransaction = await validateTransactionSignature(
            connection,
            signature,
            new PublicKey(MERCHANT_WALLET),
            amount,
            undefined,
            referenceToKey
        );
        result = {
            success: true,
            signature: signature
        }
        return result
    } catch (e) {
        console.log(e);
        return result
    }
    return result;
};

module.exports =  confirmTransaction;