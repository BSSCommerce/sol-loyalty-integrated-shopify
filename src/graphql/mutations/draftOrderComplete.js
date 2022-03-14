const draftOrderComplete = async (shop, accessToken, id) => {
    const mutation = `mutation draftOrderComplete($id: ID!) {
                              draftOrderComplete(id: $id, paymentPending: true) {
                                draftOrder {
                                  order {
                                    id
                                    totalPriceSet {
                                      shopMoney {
                                        amount
                                      }
                                      presentmentMoney {
                                        amount
                                        currencyCode
                                      }
                                    }
                                  }
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
        variables: {id: id}
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
    console.log(responseJson);
    return responseJson;
};

module.exports = draftOrderComplete;
