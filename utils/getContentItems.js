const handleErrors = require('./handleErrors');

function getFilter(filterField, filterValue) {
    if (!filterField) {
        return {};
    }

    const filter = {};
    filter[filterField] = filterValue;

    return filter;
}

async function getContentItems(z, bundle, endpoint, languageCode, contentType, filterField, filterValue) {
    const options = {
        url: `https://${endpoint}/${bundle.authData.project_id}/items`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.preview_api_key}`
        },
        params: Object.assign(
            { 'order': 'system.last_modified[desc]' },
            contentType && { 'system.type': contentType },
            languageCode && { 'language': languageCode },
            // No language fallbacks
            languageCode && { 'system.language': languageCode },
            getFilter(filterField, filterValue)
        )
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content).items;

    return results;
}

module.exports = getContentItems;
