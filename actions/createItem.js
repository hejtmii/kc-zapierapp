const handleErrors = require('../utils/handleErrors');

async function createItem(z, bundle, name, contentType, externalId) {
    const itemRequest = {
        url: `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/items`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        },
        params: {},
        body: {
            name,
            type: {
                codename: contentType
            },
            externalId: externalId || undefined
        }
    };

    const itemResponse = await z.request(itemRequest);
    handleErrors(itemResponse);

    const item = z.JSON.parse(itemResponse.content);

    return item;
}

module.exports = createItem;
