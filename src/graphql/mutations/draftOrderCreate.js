const createDraftOrder = async (shop, accessToken, draftOrderInput) => {
    const mutation = `mutation draftOrderCreate($input: DraftOrderInput!) {
                              draftOrderCreate(input: $input) {
                                draftOrder {
                                  id
                                  invoiceUrl
                                }
                                userErrors {
                                  field
                                  message
                                }
                              }
                            }
                           `;

    let query = JSON.stringify({
        query: mutation,
        variables: {input: draftOrderInput}
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
    console.log(responseJson.data.draftOrderCreate.userErrors);
    return responseJson;
};

module.exports = createDraftOrder;
