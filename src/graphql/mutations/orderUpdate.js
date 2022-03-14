const orderUpdate = async (shop, accessToken, orderInput) => {
    const mutation = `mutation orderUpdate($input: OrderInput!) {
                              orderUpdate(input: $input) {
                                userErrors {
                                  field
                                  message
                                }
                              }
                            }
                           `;

    let query = JSON.stringify({
        query: mutation,
        variables: {input: orderInput}
    });
    const response = await fetch(`https://${shop}/admin/api/${process.env.API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
            "Accept": 'application/json',
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
        },
        body: query
    })
    const responseJson = await response.json();
    return responseJson;
};

module.exports = orderUpdate;
