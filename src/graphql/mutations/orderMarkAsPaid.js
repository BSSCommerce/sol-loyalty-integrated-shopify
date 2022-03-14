const orderMarkAsPaid = async (shop, accessToken, orderMarkAsPaidInput) => {
    const mutation = `mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
                              orderMarkAsPaid(input: $input) {
                                userErrors {
                                  field
                                  message
                                }
                              }
                            }
                           `;

    let query = JSON.stringify({
        query: mutation,
        variables: {input: orderMarkAsPaidInput}
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

module.exports = orderMarkAsPaid;
