import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
    AppProvider,
    Avatar,
    ActionList,
    Card, TextField,
    TextContainer,
    ContextualSaveBar,
    FormLayout,
    Modal,
    Frame,
    Layout,
    Loading,
    Navigation,
    Page,
    SkeletonBodyText,
    SkeletonDisplayText,
    SkeletonPage,
    Toast,
    TopBar,
    Link
} from '@shopify/polaris';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import NavaigationMenu from "src/components/layout/NavigationMenu";
import '../public/static/admin/css/style.css';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Cookies from "js-cookie";
import store from "store-js";
export default function App({ Component, pageProps }) {
    const Router = useRouter();
    const defaultState = useRef({
        emailFieldValue: 'dharma@jadedpixel.com',
        nameFieldValue: 'Jaded Pixel',
    });
    const skipToContentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userMenuActive, setUserMenuActive] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [nameFieldValue, setNameFieldValue] = useState(
        defaultState.current.nameFieldValue,
    );
    const [emailFieldValue, setEmailFieldValue] = useState(
        defaultState.current.emailFieldValue,
    );
    const [storeName, setStoreName] = useState(
        defaultState.current.nameFieldValue,
    );
    const [supportSubject, setSupportSubject] = useState('');
    const [supportMessage, setSupportMessage] = useState('');

    const handleSubjectChange = useCallback(
        (value) => setSupportSubject(value),
        [],
    );
    const handleMessageChange = useCallback(
        (value) => setSupportMessage(value),
        [],
    );

    const handleNameFieldChange = useCallback((value) => {
        setNameFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleEmailFieldChange = useCallback((value) => {
        setEmailFieldValue(value);
        value && setIsDirty(true);
    }, []);
    const handleSearchResultsDismiss = useCallback(() => {
        setSearchActive(false);
        setSearchValue('');
    }, []);
    const handleSearchFieldChange = useCallback((value) => {
        setSearchValue(value);
        setSearchActive(value.length > 0);
    }, []);

    const toggleUserMenuActive = useCallback(
        () => setUserMenuActive((userMenuActive) => !userMenuActive),
        [],
    );
    const toggleMobileNavigationActive = useCallback(
        () =>
            setMobileNavigationActive(
                (mobileNavigationActive) => !mobileNavigationActive,
            ),
        [],
    );
    const toggleIsLoading = useCallback((path) => {
        setIsLoading((isLoading) => !isLoading)
        if (path == "/cp/add") {
            Router.push("/cp/[id]", path);
        } else if (path == "/act/add") {
            Router.push("/act/[id]", path);
        } else if (path == "/form/add") {
            Router.push("/form/[id]", path);
        } else if (path == "/qb/add") {
            Router.push("/qb/[id]", path);
        } else if (path == "/wholesaler/add") {
            Router.push("/wholesaler/[id]", path);
        } else if (path == "/tax/display/rules/edit/add") {
            Router.push("/tax/display/rules/edit/[id]", path);
        } else if (path == "/cp/price-list/add") {
            Router.push("/cp/price-list/[id]", path);
        } else {
            Router.push(path);
        }

    }, []);

    const toggleModalActive = useCallback(
        () => setModalActive((modalActive) => !modalActive),
        [],
    );


    const openNewTab = useCallback(() => {
        window.open(`https://${Cookies.get('shopOrigin')}/admin`, '_blank' );
    }, [])

    const userMenuActions = [
        {
            items: [{content: (<Link onClick={() => openNewTab()} external={true}>Open Admin Panel</Link>)}],
        },
    ];


    const [storeOwnerName, setStoreOwnerName]= useState('')
    const [storeOwnerEmail, setStoreOwnerEmail]= useState('')
    useEffect(() => {
        if (pageProps.storeOwner){
            store.set("storeOwnerName", pageProps.storeOwner.shop.name);
            store.set("storeOwnerEmail", pageProps.storeOwner.shop.email);
        }

        setStoreOwnerName(store.get("storeOwnerName"))
        setStoreOwnerEmail(store.get("storeOwnerEmail"))
    }, [storeName, storeOwnerEmail])
    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuActions}
            name={storeOwnerName}
            detail={storeOwnerEmail}
            initials={storeOwnerName.charAt(0)}
            open={userMenuActive}
            onToggle={toggleUserMenuActive}
        />
    );

    const searchResultsMarkup = (
        <Card>
            <ActionList
                items={[
                    {content: 'Shopify help center'},
                    {content: 'Community forums'},
                ]}
            />
        </Card>
    );

    const searchFieldMarkup = (
        <TopBar.SearchField
            onChange={handleSearchFieldChange}
            value={searchValue}
            placeholder="Search"
        />
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );
    useEffect(() => {
        Router.events.on('routeChangeStart', () => setIsLoading(true))
        Router.events.on('routeChangeComplete', () => setIsLoading(false))
    }, [Router])

    const navigationMarkup = (
        <NavaigationMenu Router={Router} toggleIsLoading={toggleIsLoading} />
    );

    const loadingMarkup = isLoading ? <Loading /> : null;

    const skipToContentTarget = (
        <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
    );

    const actualPageMarkup = (
        <>
            {skipToContentTarget}
            <Component {...pageProps} />
        </>
    );

    const loadingPageMarkup = (
        <SkeletonPage>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText lines={9} />
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    const modalMarkup = (
        <Modal
            open={modalActive}
            onClose={toggleModalActive}
            title="Contact support"
            primaryAction={{
                content: 'Send',
                onAction: toggleModalActive,
            }}
        >
            <Modal.Section>
                <FormLayout>
                    <TextField
                        label="Subject"
                        value={supportSubject}
                        onChange={handleSubjectChange}
                    />
                    <TextField
                        label="Message"
                        value={supportMessage}
                        onChange={handleMessageChange}
                        multiline
                    />
                </FormLayout>
            </Modal.Section>
        </Modal>
    );

    const theme = {
        colors: {
            topBar: {
                background: '#357997',
            },
        },
        logo: {
            width: 124,
            topBarSource: `https://${APP_DOMAIN}/static/admin/images/logo.svg`,
            contextualSaveBarSource:
                `https://${APP_DOMAIN}/static/admin/images/logo_hover.svg`,
            accessibilityLabel: 'B2B Solution',
        },
    };

    // const config = {
    //     apiKey: SHOPIFY_API_KEY,
    //     shopOrigin: Cookies.get('shopOrigin'),
    //     forceRedirect: false
    // };
    // const baseUrl = `https://${APP_DOMAIN}`;
    // const chatUrl = `${baseUrl}/static/admin/js/chat.js`;
    //
    // const gtm = `${baseUrl}/static/admin/js/gtm.js`;
    // const gtmBody = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMHT2P2" height="0" width="0" style="display:none;visibility:hidden"></iframe>`

    return (
        <React.Fragment>
            <Head>
                <title>B2B/Wholesale Solution</title>
                <meta charSet="utf-8" />
                {/*<script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
                <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
                <script type="text/javascript" src={ configUrl }></script>*/}

                {/*<script type="text/javascript" src={ chatUrl }></script>*/}
                {/*<script type="text/javascript" src={ gtm }></script>*/}
                {/*<link rel="icon" type="image/png" href="/static/admin/images/favicon.ico"/>*/}
                {/*<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500&display=swap" rel="stylesheet"></link>*/}
                {/*<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet"></link>*/}
            </Head>
            <AppProvider
                theme={theme}
                i18n={ translations }
            >
                <Frame
                    topBar={topBarMarkup}
                    navigation={navigationMarkup}
                    showMobileNavigation={mobileNavigationActive}
                    onNavigationDismiss={toggleMobileNavigationActive}
                    skipToContentTarget={skipToContentRef.current}
                >
                    {loadingMarkup}
                    {pageMarkup}
                    {modalMarkup}
                </Frame>
            </AppProvider>
            {/*<div dangerouslySetInnerHTML={{__html: gtmBody}} />*/}
        </React.Fragment>

    );
}
