require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { registerWebhook } = require('@shopify/koa-shopify-webhooks');
const koaBody = require('koa-body');
const session = require('koa-session');
const Router = require('koa-router');
const serve = require('koa-static');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY,
    SHOPIFY_SCOPES,
    PORT,
    API_VERSION
} = process.env;
const port = parseInt(PORT, 10) || 3000;
const placeOrder = require("./api/order/place");
const getQrUrl = require("./api/solpay/getQrUrl");
const confirmTransaction = require("./api/solpay/confirmTransaction");
const updateOrder = require("./api/order/update");
const shopSaveAndUpdate = require("./api/shop/shopSaveAndUpdate");
const ruleSaveAndUpdate = require("./api/rule/ruleSaveAndUpdate");
const getRule = require("./api/rule/getRule");
const getCustomerPoint = require("./api/customer/getCustomerPoint");
const getAllCustomer = require("./api/customer/getAllCustomer");
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    server.use(session({ sameSite: 'none', secure: true }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
    server.use(serve('./src/public/static/frontend'));
    server.use(serve('./src/public/static/base'));
    server.use(serve('./src/public/static/admin'));
    server.proxy = true;
    server.use(async (ctx, next) => {
        if (ctx.path === '/graphql') {
            return await next();
        }
        await koaBody({includeUnparsed: true})(ctx, next);
    });

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: [SHOPIFY_SCOPES],
            accessMode: 'offline',
            async afterAuth(ctx) {
                const { shop, accessToken } = ctx.session;
                ctx.cookies.set('shopOrigin', shop, { httpOnly: false, secure: true, sameSite: 'none' });
                ctx.cookies.set('accessToken', accessToken, { httpOnly: false, secure: true, sameSite: 'none' });
                await shopSaveAndUpdate(ctx);
                ctx.redirect("/");

            }
        })
    );
    router.post("/api/order/place-order", async (ctx) => {
        let result = await placeOrder(ctx);
        ctx.body = result;
    });
    router.post("/api/order/update-order", async (ctx) => {
        let result = await updateOrder(ctx);
        ctx.body = result;
    });
    router.post("/api/solpay/get-qr", async (ctx) => {
        let result = await getQrUrl(ctx);
        ctx.body = result;
    });
    router.post("/api/solpay/confirm-transaction", async (ctx) => {
        let result = await confirmTransaction(ctx);
        ctx.body = result;
    });

    router.post("/api/rule/save-update", async (ctx) => {
        let result = await ruleSaveAndUpdate(ctx);
        ctx.body = result;
    });
    router.post("/api/rule/get-rule", async (ctx) => {
        let result = await getRule(ctx);
        ctx.body = result;
    });
    router.post("/api/customer/get-customer-point", async (ctx) => {
        let result = await getCustomerPoint(ctx);
        ctx.body = result;
    });
    router.post("/api/customer/get-customers", async (ctx) => {
        let result = await getAllCustomer(ctx);
        ctx.body = result;
    });
    router.get("/(.*)", verifyRequest({
        fallbackRoute: '/login.html'
    }), async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    });
    server.use(router.allowedMethods({throw: true}));
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
