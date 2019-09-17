const handleErrors = require('../../handleErrors');

async function createItem(z, bundle, name, contentTypeId, externalId) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/items`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {},
        body: {
            name,
            type: {
                id: contentTypeId
            },
            externalId: externalId || undefined
        }
    };

    const itemResponse = await z.request(options);
    handleErrors(itemResponse);

    const item = z.JSON.parse(itemResponse.content);

    return item;
}

module.exports = createItem;
