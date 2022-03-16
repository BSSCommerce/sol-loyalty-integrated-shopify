
# WARNING

This repository contains source code for a Public Shopify Application using Solana Pay. Customers can use [Phatom Wallet](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=en), [Pocket Pay](https://pocketpay.finance/) to purchase products and get reward points. It is running on DevNet and need improvements for production (MainNet).

# Loyalty Program Reference Implementation

- [Ideas](https://solana.com/riptide/ideas)
- [Merchant Integration](https://docs.solanapay.com/core/merchant-integration)
- [Send Transaction with Fantom](https://docs.phantom.app/integrating/sending-a-transaction)
- [Shopify App - getting started](https://shopify.dev/apps/getting-started)

# Changelog

[Changelog](changelog.md)

## Progress:
- [x] Basic features of Reward Points
- [x] Phantom Wallet integration
- [x] Payment with QR code
- [x] Basic checkout process on Shopify Frontend
- [ ] Automatic installation shopify scripts
- [ ] FTX Wallet integration
- [ ] Trust Wallet Integration
- [ ] Advanced features for reward points
- [ ] Buy Many, get one free
- [ ] Fully checkout process with shipping methods & discount code integration
- [ ] Reward points on chain
- [ ] Advanced UX optimization

## Tech Stack
- [NextJS 11](https://nextjs.org/)
- [Mongo Atlas](https://www.mongodb.com/atlas/database)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Solana Web3](https://docs.solana.com/developing/clients/javascript-api)
- [QR Code][https://www.npmjs.com/package/qrcode]

## Preparation
1. Create a mongo db atlas collection.
2. Create a Solana Wallet and copy address
3. Purchase a domain or use [NGROK](https://ngrok.com/) to have a public address with https.
4. You need create a [Shopify Public App](https://shopify.dev/apps/getting-started/create)
5. Create .env file in source code
6. Go to next steps

## Set up .env

- `SHOPIFY_API_KEY`: your shopify api key
- `SHOPIFY_API_SECRET_KEY`: your secrete key
- `SHOPIFY_SCOPES`: app access scopes
- `PORT`: port which this app runs on.
- `API_VERSION`: shopify api version
- `APP_DOMAIN`: your app domain
- `MERCHANT_WALLET`: your merchant wallet address
- `MONGO_DB_URL`: mongo atlas db url


## Mongo Atlas Config

Open file `next.config.js` change mongoDB url.

## Working
**Install library**:

- `npm install`

**Run Dev Mode for frontend**

- `npm run dev`

**Run Production Mode for frontend**
- `npm run build`
- `npm run start`

**App can be started by [PM2](https://pm2.keymetrics.io/)**
- `pm2 start npm --name "Your app name" -- run start`

## Shopify scripts - manual installation
- Go to your shopify theme
- Select edit code
- Go to snippets folder
- Create new file named `sol-loyalty.liquid`
- Copy this code block to `sol-loyalty.liquid`
```
<select name="country" id="loyalty-countries-options" style="dipsplay:none">
    	{{ country_option_tags }}
    </select>
    <script id="loyalty-shop-data">
      var loyaltyCustomerId = "{{ customer.id }}";
    </script>
    <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" integrity="sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://app.sol-loyalty.com/js/loyalty.js" defer="defer"></script>
    <link rel="stylesheet" href="https://app.sol-loyalty.com/css/style.css" onload="this.media='all'">
```
- Open file: `layout/theme.liquid`
- Insert this line of code before `</body>` tag
```
{% render "sol-loyalty" %}
```




