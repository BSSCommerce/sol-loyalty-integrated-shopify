import { createQR } from '@solana/pay';

function insertPopup() {
    let body = document.getElementsByTagName("body")[0];
    body.insertAdjacentHTML("beforeend", `<div id="bss-loyalty-popup">
        <div>Click Hear to pay with sol</div>
</div>`)
}

async function getQrCode() {
    let getQrCodeReq = await fetch("https://sol-loyalty.com/api/solpay/get-qr");
    let getQrCodeRes = await getQrCodeReq.json();
    console.log(getQrCodeRes);
}

function main() {
    insertPopup();
    getQrCode();
}

main();