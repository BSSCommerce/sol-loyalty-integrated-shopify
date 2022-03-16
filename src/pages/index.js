import {
    Page,
    Layout,
    Banner,
    Icon,
    Button,
    TextStyle
} from "@shopify/polaris";
import {
    AddMajor,
    GiftCardMinor
} from '@shopify/polaris-icons';
import { useRouter } from "next/router";
export default function Index() {
    const Router = useRouter();
    return (
        <Page title={"Choose a rewards program"} subtitle={"Pick from one our templates"}>
            <Layout>
                <Layout.Section>
                    <div className={"loyalty-templates"}>
                        <div className={"loyalty-template"} >
                            <div className={"loyalty-template-icon"} onClick={() => Router.push("/reward-point-settings")}>
                                <Icon
                                    source={AddMajor}
                                    color="white" />
                            </div>
                            <div onClick={() => Router.push("/reward-point-settings")}>
                                <br />
                                <TextStyle variation={"strong"}>Points Program</TextStyle>
                                <br />
                                <br />
                                <TextStyle variation="subdued"><span style={{color: "#d1c9c9"}}>Reward loyal customers with points for each purchase you can add more price over time, and based on the level of loyalty</span></TextStyle>
                                <br />
                                <br />
                            </div>

                            <Button plain={true} onClick={() => Router.push("/customers")}><span style={{color: "whitesmoke"}}>View Customers & Reward Points</span></Button>
                        </div>
                        <div className={"loyalty-template"}>
                            <div className={"loyalty-template-icon"}>
                                <Icon
                                    source={GiftCardMinor}
                                    color="white" />
                            </div>
                            <br />
                            <TextStyle variation={"strong"}>Buy Many, get one free (upcoming...)</TextStyle>
                            <br />
                            <br />
                            <TextStyle variation="subdued"><span style={{color: "#d1c9c9"}}>The classic coffee stand reward. Treat your repeat customers with a gift.</span></TextStyle>
                        </div>

                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    )
}