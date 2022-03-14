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
export default function NavigationMenu({Router, toggleIsLoading}) {
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
                title="Reward Point"
                items={[
                    {
                        //url: "/qb",
                        label: 'Reward Point Settings',
                        icon: ListMajor,
                        onClick: () => toggleIsLoading("/reward-point-settings")
                    },
                    {
                        // url: "/qb/install",
                        label: 'Customers',
                        icon: InstallMinor,
                        onClick: () => toggleIsLoading("/customers")
                    }
                ]}
            />
        </Navigation>
    )
}
