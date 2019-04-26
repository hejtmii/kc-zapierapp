const handleErrors = require('./handleErrors');
const getFilterParams = require('./getFilterParams');
const standardizeDeliveryItem = require('./standardized/standardizeDeliveryItem');

async function getContentItems(z, bundle, endpoint, languageCode, contentType, filterField, filterPattern, filterValue) {
    const filterParams = getFilterParams(filterField, filterPattern, filterValue);

    const options = {
        url: `https://${endpoint}/${bundle.authData.project_id}/items`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${bundle.authData.preview_api_key}`
        },
        params: Object.assign(
            {
                'order': 'system.last_modified[desc]',
                'depth': 0,
            },
            contentType && { 'system.type': contentType },
            languageCode && { 'language': languageCode },
            // No language fallbacks
            languageCode && { 'system.language': languageCode },
            filterParams,
        )
    };

    const response = await z.request(options);
    handleErrors(response);

    const results = z.JSON.parse(response.content).items;
    const standardizedResults = results.map(item => standardizeDeliveryItem(bundle, item));

    return standardizedResults;
}

module.exports = getContentItems;
