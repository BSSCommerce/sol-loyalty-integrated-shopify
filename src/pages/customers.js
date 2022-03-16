require('isomorphic-fetch');
import cookies from 'next-cookies';
import {
    Page,
    Layout,
    Card
} from "@shopify/polaris";
import CustomerTable from "src/components/customer/CustomerTable";
import {useRouter} from "next/router";
function Customers({customers, domain}) {
    const Router = useRouter();
    return (<Page breadcrumbs={[{content: 'All Programs', onAction: () => Router.push("/") }]}>
        <Layout>
            <Layout.Section>
                <Card>
                    <CustomerTable customers={customers} domain={domain} />
                </Card>
            </Layout.Section>
        </Layout>
    </Page>)
}
export async function getServerSideProps(ctx) {
    // const { req, res, query } = ctx
    let allCookies = cookies(ctx);
    let domain = allCookies.shopOrigin;
    let customers = [];
    let getCustomerReq = await fetch(`https://${process.env.APP_DOMAIN}/api/customer/get-customers`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            domain: domain
        })
    });
    let getCustomerRes = await getCustomerReq.json();
    if (getCustomerRes.success && getCustomerRes.customers) {
        customers = getCustomerRes.customers;
    }
    return  {
        props: {
            customers: customers,
            domain: domain
        }
    }
}
export default Customers;