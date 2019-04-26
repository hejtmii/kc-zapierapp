const handleErrors = require('./handleErrors');

async function getContentType(z, bundle, contentType) {
    var options = {
        'method': 'GET',
        'url': `https://manage.kenticocloud.com/v2/projects/${bundle.authData.project_id}/types/codename/${contentType}`,
        'params': {},
        'headers': {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.cm_api_key}`
        }
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content);
    return results;
}

module.exports = getContentType;
