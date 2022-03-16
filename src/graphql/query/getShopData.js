const getShopData = async (domain, accessToken, apiVersion) => {
    const getShopQuery =`query {
              shop {
                name
                email
                currencyFormats {
                  moneyFormat
                }
              }
            }`;

    let query = JSON.stringify({
        query: getShopQuery
    });

    const response = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
        },
        body: query
    })



    const responseJson = await response.json();
    return responseJson;
}
module.exports = getShopData;