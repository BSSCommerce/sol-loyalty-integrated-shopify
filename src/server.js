require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth, verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
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
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    server.use(session({ sameSite: 'none', secure: true }, server));
    server.keys = [SHOPIFY_API_SECRET_KEY];
    server.use(serve('./public/static/frontend'));
    server.use(serve('./public/static/base'));
    server.use(serve('./public/static/admin'));
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

                /*let getShop = await fetch(`${API_URL}/shop/get`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: shop, token: accessToken })
                });
                let shopData = await getShop.json();
                let isNeedAddScriptTag = true;
                if (shopData && shopData.success) {
                    if (shopData.shop.status == 1) {
                        isNeedAddScriptTag = false
                    }
                    let updateData = { domain: shop, token: accessToken };

                    const updateShop =  await fetch(`${API_URL}/shop/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateData)
                    });
                    shopData = await updateShop.json();

                } else {
                    const addShop = await fetch(`${API_URL}/shop/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ domain: shop, token: accessToken})
                    });
                    shopData = await addShop.json();
                }*/

                // if (shopData && shopData.success) {
                //     ctx.redirect("/");
                //
                // } else {
                //     console.log("Could not authenticate app")
                // }
                ctx.redirect("/");

            }
        })
    );

    router.get("*", verifyRequest({
        fallbackRoute: '/login.html'
    }), async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
        return;
    });
    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
