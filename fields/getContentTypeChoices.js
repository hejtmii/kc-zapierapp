const handleErrors = require('../utils/handleErrors');

async function execute(z, bundle) {
    const options = {
        url: `https://preview-deliver.kenticocloud.com/${bundle.authData.project_id}/types`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.preview_api_key}`
        },
        params: {
            'order': 'system.name[asc]'
        }
    }

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content).types;

    // You can do any parsing you need for results here before returning them
    const resultsWithId = results.map(
        (item) => Object.assign(
            item,
            {
                id: item.system.id
            }
        )
    );

    return resultsWithId;
}

module.exports = {
    key: 'get_content_type_choices',
    noun: 'Content type choice',
    display: {
        label: 'Get Content type choices',
        description: 'Gets content types for the input dropdown ordered by name.',
        hidden: true,
    },
    operation: {
        type: 'polling',
        perform: execute,
        sample: {
            "elements": {},
            "system": {
                "codename": "about_us",
                "last_modified": "2018-02-27T18:50:42.3012044Z",
                "id": "b2c14f2c-6467-460b-a70b-bca17972a33a",
                "name": "About us"
            },
            "id": "b2c14f2c-6467-460b-a70b-bca17972a33a"
        },
        outputFields: [
            {
                key: 'system__codename',
                label: 'Content type codename',
                type: 'string',
            },
            {
                key: 'system__last_modified',
                label: 'Last modified',
                type: 'datetime',
            },
            {
                key: 'system__id',
                label: 'Content type ID',
                type: 'string',
            },
            {
                key: 'system__name',
                label: 'Content type name',
                type: 'string',
            },
        ]
    }
};
