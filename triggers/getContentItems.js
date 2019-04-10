const handleErrors = require('../utils/handleErrors');

async function execute(z, bundle) {
    const options = {
        url: `https://preview-deliver.kenticocloud.com/${bundle.authData.project_id}/items`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.preview_api_key}`
        },
        params: {
            'order': 'system.name[asc]',
            'limit': 10,
            'skip': 10 * bundle.meta.page,
            'elements': '_' // Elements do not support empty value as "no elements" so we hack it like this
        }
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content).items;

    // You can do any parsing you need for results here before returning them
    const resultsWithId = results.map(
        (item) => Object.assign(
            item,
            {
                id: `${item.system.id}/${item.system.language}`
            }
        )
    );

    return resultsWithId;
}

const getContentItems = {
    noun: "Content item",
    display: {
        hidden: true,
        important: false,
        description: "Gets content items for the input dropdown ordered by name.",
        label: "Get Content Items"
    },
    key: "get_content_items",
    operation: {
        perform: execute,
        sample: {
            elements: {},
            system: {
                name: "A Chemex Method",
                    language: "en-US",
                    sitemap_locations: [],
                    last_modified: "2017-06-27T12:56:41.1882715Z",
                    codename: "a_chemex_method",
                    type: "hosted_video",
                    id: "e9b81664-cbca-4f0e-b1c8-e7d862f4fd89"
            },
            id: "e9b81664-cbca-4f0e-b1c8-e7d862f4fd89;en-US"
        },
        canPaginate: true,
            outputFields: [
            {
                key: "system__name",
                label: "Item name"
            },
            {
                key: "system__language",
                label: "Language codename"
            },
            {
                type: "datetime",
                key: "system__last_modified",
                label: "Last modified"
            },
            {
                key: "system__codename",
                label: "Item codename"
            },
            {
                key: "system__type",
                label: "Content type codename"
            },
            {
                key: "system__id",
                label: "Item ID"
            },
            {
                type: "string",
                key: "id",
                label: "Compound item ID"
            }
        ]
    },
};

module.exports = getContentItems;
