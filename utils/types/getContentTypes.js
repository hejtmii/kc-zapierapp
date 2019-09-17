const handleErrors = require('../handleErrors');

async function getContentTypes(z, bundle) {
    const options = {
        url: `https://preview-deliver.kontent.ai/${bundle.authData.projectId}/types`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.previewApiKey}`
        },
        params: {
            'order': 'system.name[asc]'
        }
    };

    const response = await z.request(options);
    handleErrors(response);

    const contentTypes = z.JSON.parse(response.content).types;
    return contentTypes;
}

module.exports = getContentTypes;
