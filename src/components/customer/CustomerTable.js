import {
    Page,
    Layout,
    Card,
    ResourceList,
    ResourceItem
} from "@shopify/polaris";
export default function CustomerTable({customers, domain}) {
    const rowItems = customers.map(customer => {
        return {
            id: customer.id,
            customerId: customer.customer_id,
            points: customer.points.toString(),
        }
    });
    function renderItem(item) {
        const {id, customerId, points} = item;

        return (
            <ResourceItem id={id}>
                <div className={"bss-rule-name"}><a href={`https://${domain}/admin/customers/${customerId}`} target={"_blank"}>{customerId}</a></div>
                <div className={"bss-rule-setting"}>{points}</div>
            </ResourceItem>
        );
    }
    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    let itemHeader =
        <div className="Polaris-ResourceList__ItemWrapper custom-header">
            <div className="Polaris-ResourceItem Polaris-ResourceItem--selectable">
                <div className="Polaris-ResourceItem__Container">
                    <div className="Polaris-ResourceItem__Content">
                        <div className="bss-rule-name header-title">
                            <span>Customer ID</span>
                        </div>
                        <div className="bss-rule-setting">Points</div>
                    </div>
                </div>
            </div>
        </div>
    return (

        <div className={"bss-custom-table"}>
            {itemHeader}
            <ResourceList
                resourceName={resourceName}
                items={rowItems}
                renderItem={renderItem}
                // selectedItems={selectedItems}
                // onSelectionChange={(items) => handleSelectItem(items)}
                // bulkActions={bulkActions}
            />
        </div>

    )
}