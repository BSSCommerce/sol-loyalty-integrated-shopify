require('isomorphic-fetch');
import cookies from 'next-cookies';
import { useCallback, useState} from "react";
import {
    Page,
    Layout,
    Card,
    TextField,
    FormLayout,
    ContextualSaveBar,
    Banner
} from "@shopify/polaris"
import {useRouter} from "next/router";
function RewardPointSettings({rule, domain}) {
    const Router = useRouter();
    const [loading, setLoading] = useState(false)
    const [percentage, setPercentage] = useState(rule.percentage.toString());
    const [pointToUsd, setPointToUsd] = useState(rule.point_to_usd.toString());
    const [saveMessage, setSaveMessage] = useState("");
    const handleSave = useCallback(async () => {
        try {
            setLoading(true);
            let saveRuleReq = await fetch(`/api/rule/save-update`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    domain: domain,
                    percentage: parseFloat(percentage),
                    point_to_usd: parseFloat(pointToUsd),
                    status: true
                })
            });
            let saveRuleRes = await saveRuleReq.json();
            if (saveRuleRes.success) {
                setSaveMessage("Save settings successfully");
            } else {
                setSaveMessage("Fail to save settings");
            }
            setLoading(false);
        } catch (e) {
            console.log(e)
        }
    }, [percentage, pointToUsd, loading, saveMessage]);
    return (
        <Page  breadcrumbs={[{content: 'All Programs', onAction: () => Router.push("/") }]}>
            <ContextualSaveBar
                message={""}
                saveAction={{
                    onAction: handleSave,
                    content: "Save & Apply",
                    loading: loading
                }}
            />
            <Layout>

                <Layout.Section>
                    <Card sectioned title="Reward Point Settings">
                        {
                            saveMessage && <Banner status={"info"} onDismiss={() => setSaveMessage("")}>
                                <p>{saveMessage}</p>
                            </Banner>
                        }
                        <FormLayout>
                            <TextField label={"Reward points based on Total Order Amount"}
                                       suffix={"%"}
                                       type={"number"}
                                       helpText={"Number of Points will be percentage * Total Order Amount"}
                                       value={percentage}
                                       onChange={setPercentage}/>
                            <TextField label={"Point to USD"}
                                       suffix={"USD"}
                                       type={"number"}
                                       helpText={"Define exchange rate between a Reward Point and USD"}
                                       value={pointToUsd}
                                       onChange={setPointToUsd}/>
                        </FormLayout>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export async function getServerSideProps(ctx) {
    // const { req, res, query } = ctx
    let allCookies = cookies(ctx);
    let domain = allCookies.shopOrigin;
    let token = allCookies.accessToken;
    let rule = {
        percentage: "",
        point_to_usd: ""
    };
    let getRuleReq = await fetch(`https://${process.env.APP_DOMAIN}/api/rule/get-rule`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            domain: domain
        })
    });
    let getRuleRes = await getRuleReq.json();
    if (getRuleRes.success && getRuleRes.rule) {
        rule = getRuleRes.rule;
    }
    return {
        props: {
            rule: rule,
            domain: domain,
            appDomain: process.env.APP_DOMAIN
        }
    }
}
export default RewardPointSettings;