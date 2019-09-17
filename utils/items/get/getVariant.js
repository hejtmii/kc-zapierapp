const handleErrors = require('../../handleErrors');

async function getVariant(z, bundle, itemId, languageId) {
    const options = {
        url: `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/items/${itemId}/variants/${languageId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        },
        params: {},
    };

    const response = await z.request(options);
    if (response.status === 404) {
        return null;
    }

    handleErrors(response);

    const variant = z.JSON.parse(response.content);
    return variant;
}

module.exports = getVariant;
