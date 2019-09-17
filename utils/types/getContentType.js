const handleErrors = require('../handleErrors');

async function getContentType(z, bundle, contentTypeId) {
    var options = {
        'method': 'GET',
        'url': `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/types/${contentTypeId}`,
        'params': {},
        'headers': {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cmApiKey}`
        }
    };

    const response = await z.request(options);
    handleErrors(response);

    const contentType = z.JSON.parse(response.content);
    return contentType;
}

module.exports = getContentType;
