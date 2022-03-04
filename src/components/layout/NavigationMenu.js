import React, {useCallback, useState} from 'react';
import {Navigation, Link} from '@shopify/polaris';
import {
    HomeMajorMonotone,
    OrdersMajorTwotone,
    ConversationMinor,
    ArrowLeftMinor,
    InstallMinor,
    AddMajor,
    ListMajor,
    VocabularyMajor,
    ChannelsMajor,
    CashDollarMajor,
    AutomationMajor,
    DnsSettingsMajor,
    HashtagMajorMonotone,
    ProductsMajor,
    WholesaleMajor,
    CapitalMajor,
    CustomerPlusMajor,
    FormsMajor,
    FraudProtectMajor,
    SettingsMajor,
    UnknownDeviceMajor,
    HomeMajor,
    DraftOrdersMajor,
    GrammarMajor,
    CurrencyConvertMinor,
    ToolsMajor,
    FirstOrderMajor,
    NoteMinor,
    TaxMajor,
    EmailMajor,
    TextMajor,
    ImportMinor,
    ChevronDownMinor,
    ChevronUpMinor,
    CaretDownMinor,
    CaretUpMinor,
    ThumbsUpMajor,
    MinusMinor,
    LandingPageMajor,
    ChecklistAlternateMajor
} from '@shopify/polaris-icons';
export default function MenuNavigation({Router, toggleIsLoading}) {
    return (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        label: (<Link onClick={() => Router.push('/', "/", {
                            shallow: true
                        })}>Dashboard</Link>),
                        icon: HomeMajor,
                        onClick: () => toggleIsLoading('/')

                    },
                ]}
            />
            <Navigation.Section
                separator
                title="Quantity/Amount Break (QB/AB)"
                items={[
                    {
                        //url: "/qb",
                        label: 'QB/AB Rules',
                        icon: ListMajor,
                        onClick: () => toggleIsLoading("/qb")
                    },
                    {
                        // url: "/qb/install",
                        label: 'QB/AB Installation',
                        icon: InstallMinor,
                        onClick: () => toggleIsLoading("/install/qb")
                    },
                    {
                        //url: "/settings/quantity-break",
                        label: 'Settings',
                        icon: SettingsMajor,
                        onClick: () => toggleIsLoading("/settings/quantity-break")
                    },
                    {
                        //url: "/translation/qb-translation",
                        label: 'Translation',
                        icon: TextMajor,
                        onClick: () => toggleIsLoading("/translation/qb-translation")
                    }
                ]}
            />
        </Navigation>
    )
}
