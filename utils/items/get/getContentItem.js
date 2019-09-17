const getVariant = require('./getVariant');
const getItem = require('./getItem');
const getItemResult = require('./getItemResult');

async function getContentItem(z, bundle, itemId, languageId) {
    const url = `https://manage.kontent.ai/v2/projects/${bundle.authData.projectId}/items/${itemId}`;

    const item = await getItem(z, bundle, url);
    if (!item) {
        return null;
    }

    const variant = await getVariant(z, bundle, itemId, languageId);
    if (!variant) {
        return null;
    }

    const contentItem = await getItemResult(z, bundle, item, variant);
    return contentItem;
}

module.exports = getContentItem;
